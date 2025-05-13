import React, { useEffect, useState } from 'react';
import "../common/table.css";
import "../common/common.css";

const BlockedRegistrationsList = () => {
    const [blockedStudents, setBlockedStudents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchBlockedRegistrations = async () => {
        console.log("Executing fetchBlockedRegistrations");
        try {
            // Use the new dedicated endpoint
            const response = await fetch('http://localhost:3000/admin/blocked-registrations');
            if (!response.ok) {
                throw new Error('Failed to fetch blocked registrations');
            }
            const data = await response.json();
            setBlockedStudents(data);
            console.log(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        console.log("Completed fetchBlockedRegistrations");
    }

    useEffect(() => {
        fetchBlockedRegistrations();
    }, []);

    const unblockRegistration = async (studentId) => {
        try {
            // Use the new dedicated endpoint to set status back to pending
            const response = await fetch(`http://localhost:3000/admin/unblock-registration/${studentId}`, {
                method: 'PATCH'
            });
            if (!response.ok) {
                throw new Error('Failed to unblock registration');
            }
            // After successful unblocking, refresh the list
            fetchBlockedRegistrations();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2 className='table-heading'>Rejected Registrations</h2>
            <div className="table-container">
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
                    {error && <div>Error: {error}</div>}
                    {loading && <div>Loading...</div>}
                    <tbody>
                        {blockedStudents.map((student) => (
                            <tr key={student.student_id}>
                                <td>{student.student_id}</td>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{student.hostel_name}</td>
                                <td>{student.branch}</td>
                                <td>
                                    <button className='btn-success' onClick={() => {
                                        unblockRegistration(student.student_id);
                                    }}>
                                        Set to Pending
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {!loading && blockedStudents.length === 0 && <div>No blocked registrations found</div>}
        </div>
    )
}

export default BlockedRegistrationsList;