import React, { useState } from 'react';

const StudentRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        hostel_name: '',
        branch: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:3000/student/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('Registration successful! Please wait for admin approval.');
                setFormData({ name: '', email: '', password: '', hostel_name: '', branch: '' }); // Reset form
            } else {
                setMessage(data.error || 'Registration failed.');
            }
        } catch (err) {
            console.error(err);
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div>
            <div className="center-all">

                <div className='form-container'>


                    <div className="form-header">

                        <h2>Student Registration</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={formGroup}>
                            <label>Name:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div style={formGroup}>
                            <label>Email:</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>

                        <div style={formGroup}>
                            <label>Password:</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </div>

                        <div style={formGroup}>
                            <label>Hostel Name:</label>
                            <input type="text" name="hostel_name" value={formData.hostel_name} onChange={handleChange} required />
                        </div>

                        <div style={formGroup}>
                            <label>Branch:</label>
                            <input type="text" name="branch" value={formData.branch} onChange={handleChange} required />
                        </div>

                        <button className='login-btn' type="submit" >Register</button>
                    </form>
                </div>
                {message && <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>}
            </div>
        </div>
    );
};

const formGroup = {
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
};

const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    marginTop: '10px',
    cursor: 'pointer',
};

export default StudentRegister;
