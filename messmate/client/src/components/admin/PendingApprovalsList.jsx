import React, { useEffect, useState } from 'react';
import "../common/table.css";
import "../common/common.css";
import ConfirmDialog from "../common/ConfirmDialog"
const PendingApprovalsList = () => {
    const [receivedData, setreceivedData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const [dialog, setDialog] = useState({
        isOpen: false,
        message: '',
        onConfirm: () => {}
    });
     const openConfirmDialog = (message, onConfirmAction) => {
        setDialog({
            isOpen: true,
            message,
            onConfirm: () => {
                onConfirmAction();
                setDialog({ ...dialog, isOpen: false });
            }
        });
    };


    const fetchPendingApprovals = async () => {
        console.log("Executing fetchPendingApprovals");
        try {
            const response = await fetch('http://localhost:3000/admin/pending-approvals');
            if (!response.ok) {
                throw new Error('Failed to fetch pending approvals');
            }
            const data = await response.json();
            setreceivedData(data);
            console.log(data)
        } catch (err) {
            setError(err.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
        console.log("Completed fetchPendingApprovals");
    }

    useEffect(() => {
        fetchPendingApprovals();
    }, [])

    const approveRegistration = (studentId, studentName) => {
        openConfirmDialog(`Are you sure you want to approve ${studentName}'s registration?`, async () => {
            try {
                const response = await fetch(`http://localhost:3000/admin/approve-registration/${studentId}`, {
                    method: 'PATCH'
                });
                if (!response.ok) throw new Error('Failed to approve registration');
                fetchPendingApprovals();
            } catch (err) {
                setError(err.message);
            }
        });
    };

        const rejectRegistration = (studentId, studentName) => {
        openConfirmDialog(`Are you sure you want to reject ${studentName}'s registration?`, async () => {
            try {
                const response = await fetch(`http://localhost:3000/admin/reject-registration/${studentId}`, {
                    method: 'PATCH'
                });
                if (!response.ok) throw new Error('Failed to reject registration');
                fetchPendingApprovals();
            } catch (err) {
                setError(err.message);
            }
        });
    };

    return (
        <div>
            <h2 className='table-heading'>Pending Approvals</h2>
            <p className="page-desc">List of registrations that are yet to be approved</p>
            <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Hostel</th>
                        <th>Branch</th>
                        <th>Reject</th>
                        <th>Approve</th>
                    </tr>
                </thead>
                {isEmpty && <div>No students found</div>}
                {error && <div>Error: {error}</div>}
                {loading && <div>Loading...</div>}
                <tbody>
                {receivedData.map((student) => (
                    <tr key={student.student_id}>
                        <td>{student.student_id}</td>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.hostel_name}</td>
                        <td>{student.branch}</td>
                        <td>
                            <button 
                                className='btn-warning' 
                                onClick={() => rejectRegistration(student.student_id, student.name)}
                            >
                                Reject
                            </button>
                        </td>
                        <td>
                            <button 
                                className='btn-success' 
                                onClick={() => approveRegistration(student.student_id, student.name)}
                            >
                                Approve
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
            </div>
            {receivedData.length === 0 && <div>No pending approvals found</div>}
            <div>
            {/* your existing table code */}
            <ConfirmDialog
                isOpen={dialog.isOpen}
                message={dialog.message}
                onConfirm={dialog.onConfirm}
                onCancel={() => setDialog({ ...dialog, isOpen: false })}
            />
        </div>
        </div>
        
    )
}

export default PendingApprovalsList
