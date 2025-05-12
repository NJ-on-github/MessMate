import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import "../common/table.css";
import "../common/common.css";

const AllStudentList = () => {

    const [receivedData, setreceivedData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            console.log("Executing fetchStudents");
            try {
                const response = await fetch('http://localhost:3000/admin/students/all-students');
                if (!response.ok) {
                    throw new Error('Failed to fetch students');
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
            console.log("Completed fetchStudents");
        };
        fetchStudents();
    }, [])


    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Hostel</th>
                        <th>Branch</th>
                        <th>Status</th>
                        <th>Blocked</th>
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
                            <td>{student.registration_status}</td>
                            <td>{student.is_blocked ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

}

export default AllStudentList
