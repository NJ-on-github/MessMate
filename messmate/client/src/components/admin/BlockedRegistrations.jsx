import React from 'react'
import { useEffect, useState } from 'react';


const BLockedRegistrations = () => {
        const [receivedData, setreceivedData] = useState([]);
        const [error, setError] = useState(null);
        const [loading, setLoading] = useState(true);
        const [isEmpty, setIsEmpty] = useState(false);
    
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
    
    
        const approveRegistration = async (studentId) => {
            try {
                const response = await fetch(`http://localhost:3000/admin/approve-registration/${studentId}`, {
                    method: 'PATCH'
                });
                if (!response.ok) {
                    throw new Error('Failed to approve registration');
                }
                fetchPendingApprovals(); // Refresh the list after approval
            } catch (err) {
                setError(err.message);
            }
        };
        const rejectRegistration = async (studentId) => {
            try {
                const response = await fetch(`http://localhost:3000/admin/reject-registration/${studentId}`, {
                    method: 'PATCH'
                });
                if (!response.ok) {
                    throw new Error('Failed to approve registration');
                }
                fetchPendingApprovals(); // Refresh the list after approval
            } catch (err) {
                setError(err.message);
            }
        };
  return (
    <div>
        <h2>Pending Approvals</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
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
                        <td><button onClick={() => {
                            rejectRegistration(student.student_id)
                            fetchPendingApprovals()
                        }}>
                            Reject
                        </button>
                        </td>
                        <td><button onClick={() => {
                            approveRegistration(student.student_id);
                            fetchPendingApprovals()
                        }}>
                            Approve
                        </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {receivedData.length === 0 && <div>No pending approvals found</div>}
    </div>
)
}

export default BLockedRegistrations
