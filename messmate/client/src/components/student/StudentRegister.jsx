import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../common/form.css";
import "../common/common.css";

const StudentRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        hostel_name: '',
        branch: ''
    });

    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

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
                setIsSuccess(true);
                setFormData({ name: '', email: '', password: '', hostel_name: '', branch: '' }); // Reset form
            } else {
                setMessage(data.error || 'Registration failed.');
                setIsSuccess(false);
            }
        } catch (err) {
            console.error(err);
            setMessage('Something went wrong. Please try again.');
            setIsSuccess(false);
        }
    };

    return (
        <div className="page-background">
            <div className="center-all">
                <div className='form-container'>
                    <div className="form-header">
                        <h2>Student Registration</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="formGroup">
                            <label>Name:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="formGroup">
                            <label>Email:</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>

                        <div className="formGroup">
                            <label>Password:</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </div>

                        <div className="formGroup">
                            <label>Hostel Name:</label>
                            <input type="text" name="hostel_name" value={formData.hostel_name} onChange={handleChange} required />
                        </div>

                        <div className="formGroup">
                            <label>Branch:</label>
                            <input type="text" name="branch" value={formData.branch} onChange={handleChange} required />
                        </div>

                        <button className='login-btn' type="submit">Register</button>
                    </form>

                    {message && (
                        <p className={`login-message ${isSuccess ? 'success' : 'error'}`}>
                            {message}
                        </p>
                    )}

                    <Link to="/student/login" className="form-nav-link" >
                        Already registered? Login here 
                    </Link>
                    <Link to="/" className="form-nav-link" >
                        Go back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StudentRegister;
