import React, { useEffect, useState } from 'react';
import "../common/table.css";
import "../common/common.css";
import ConfirmDialog from "../common/ConfirmDialog";

const BlockedStudentsList = () => {
    const [blockedStudents, setBlockedStudents] = useState([]);
    const [error, setError] = useState(null);
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
                setDialog(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const fetchBlocked = async () => {
        try {
            const res = await fetch('http://localhost:3000/admin/students/blocked-students');
            const data = await res.json();
            setBlockedStudents(data);
        } catch (err) {
            setError('Failed to fetch blocked accounts: ' + err);
        }
    };

    const unblockStudent = async (studentId) => {
        try {
            const res = await fetch(`http://localhost:3000/admin/students/unblock/${studentId}`, {
                method: 'PATCH',
            });
            if (res.ok) {
                fetchBlocked(); // Refresh list
            }
        } catch (err) {
            setError('Unblock failed :' + err);
        }
    };

    const confirmUnblock = (studentId, studentName) => {
        openConfirmDialog(
            `Are you sure you want to unblock ${studentName}?`,
            () => unblockStudent(studentId)
        );
    };

    useEffect(() => {
        fetchBlocked();
    }, []);

    return (
        <div>
            <h2 className='table-heading'>Blocked Student Accounts</h2>
            <p className="page-desc">List of all blocked students</p>
            {error && <p className='error-msg'>{error}</p>}
            {blockedStudents.length === 0 ? (
                <p>No blocked accounts found.</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Email</th>
                                <th>Reason</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blockedStudents.map((student) => (
                                <tr key={student.student_id}>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.blocked_reason || '—'}</td>
                                    <td>
                                        <button
                                            onClick={() => confirmUnblock(student.student_id, student.name)}
                                            className="btn-warning"
                                        >
                                            Unblock
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmDialog
                isOpen={dialog.isOpen}
                message={dialog.message}
                onConfirm={dialog.onConfirm}
                onCancel={() => setDialog(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
};

export default BlockedStudentsList;
