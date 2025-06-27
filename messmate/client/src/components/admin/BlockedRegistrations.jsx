import React, { useEffect, useState } from 'react';
import "../common/table.css";
import "../common/common.css";
import ConfirmDialog from "../common/ConfirmDialog";

const BlockedRegistrationsList = () => {
    const [blockedStudents, setBlockedStudents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const fetchBlockedRegistrations = async () => {
        try {
            setError(null); // Clear previous errors
            const response = await fetch('http://localhost:3000/admin/blocked-registrations');
            if (!response.ok) {
                throw new Error(`Failed to fetch blocked registrations: ${response.statusText}`);
            }
            const data = await response.json();
            setBlockedStudents(data);
            console.log(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching blocked registrations:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlockedRegistrations();
    }, []);

    const unblockRegistration = async (studentId) => {
        try {
            setError(null); // Clear previous errors
            const response = await fetch(`http://localhost:3000/admin/unblock-registration/${studentId}`, {
                method: 'PATCH'
            });
            if (!response.ok) {
                throw new Error(`Failed to unblock registration: ${response.statusText}`);
            }
            await fetchBlockedRegistrations(); // Refresh the list
        } catch (err) {
            setError(err.message);
            console.error('Error unblocking registration:', err);
        }
    };

    const handleUnblockClick = (studentId, studentName) => {
        openConfirmDialog(
            `Are you sure you want to set ${studentName}'s registration back to pending?`,
            () => unblockRegistration(studentId)
        );
    };

    return (
        <div>
            <h2 className='table-heading'>Rejected Registrations</h2>
            <p className="page-desc">List of registrations have been rejected</p>
            
            {error && (
                <div className="error-state">
                    <strong>Error:</strong> {error}
                    <button 
                        onClick={fetchBlockedRegistrations}
                        style={{ 
                            marginLeft: '1rem', 
                            padding: '0.25rem 0.5rem',
                            background: 'transparent',
                            border: '1px solid currentColor',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                        }}
                    >
                        Retry
                    </button>
                </div>
            )}

            <div className="table-container">
                {loading ? (
                    <div className="loading-state">
                        Loading blocked registrations...
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Hostel</th>
                                <th>Branch</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blockedStudents.map((student, index) => (
                                <tr key={student.student_id} style={{ animationDelay: `${index * 0.1}s` }}>
                                    <td>{student.student_id}</td>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.hostel_name || 'N/A'}</td>
                                    <td>{student.branch || 'N/A'}</td>
                                    <td>
                                        <button
                                            className='btn-success'
                                            onClick={() => handleUnblockClick(student.student_id, student.name)}
                                        >
                                            Set to Pending
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {!loading && !error && blockedStudents.length === 0 && (
                <div className="no-data-state">
                    <p>🎉 No blocked registrations found!</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.7 }}>
                        All student registrations are either approved or pending.
                    </p>
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

export default BlockedRegistrationsList;