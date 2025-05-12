import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import "../common/table.css";
import "../common/common.css";

const BlockedStudentsList = () => {
            const [blockedStudents, setBlockedStudents] = useState([]);
            const [error, setError] = useState(null);

            const fetchBlocked = async () => {
                try {
                    const res = await fetch('http://localhost:3000/admin/students/blocked-accounts');
                    const data = await res.json();
                    setBlockedStudents(data);
                } catch (err) {
                    setError('Failed to fetch blocked accounts');
                }
            };

            const unblockStudent = async (studentId) => {
                try {
                    const res = await fetch(`http://localhost:3000/admin/student/unblock/${studentId}`, {
                        method: 'PATCH',
                    });
                    if (res.ok) {
                        fetchBlocked(); // Refresh list
                    }
                } catch (err) {
                    setError('Unblock failed');
                }
            };

            useEffect(() => {
                fetchBlocked();
            }, []);

            return (
                <div className="p-4">
                    <h2 className='table-heading'>Blocked Student Accounts</h2>
                    {error && <p className="text-red-600">{error}</p>}
                    {blockedStudents.length === 0 ? (
                        <p>No blocked accounts found.</p>
                    ) : (
                        <div className="table-container">

                        
                        <table className="w-full border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2">Student Name</th>
                                    <th className="p-2">Email</th>
                                    <th className="p-2">Reason</th>
                                    <th className="p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blockedStudents.map((student) => (
                                    <tr key={student.student_id} className="border-b">
                                        <td className="p-2">{student.name}</td>
                                        <td className="p-2">{student.email}</td>
                                        <td className="p-2 text-sm text-gray-700">{student.blocked_reason || '—'}</td>
                                        <td className="p-2">
                                            <button
                                                onClick={() => unblockStudent(student.student_id)}
                                                className="bg-green-600 text-white px-3 py-1 rounded"
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
                </div>
            )
        }

        export default BlockedStudentsList
