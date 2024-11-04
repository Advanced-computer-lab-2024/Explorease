import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection

const MultiRoleRegister = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        userType: '',  // Default is empty until selected
        mobileNumber: '',
        nationality: '',
        dob: '',
        jobOrStudent: '',
    });

    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Import useNavigate from react-router-dom

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/register`, formData);  // Adjust the API endpoint if necessary
            setMessage('Registration successful! Redirecting to login page...');
            // Redirect to login page after successful registration
            setTimeout(() => {
                navigate('/login');  // Redirect to the login page
            }, 2000);
        } catch (error) {
            setMessage('Error during registration. Please try again.');
            console.error(error);
        }
    };

    // Styling
    const formStyle = {
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    };

    const inputStyle = {
        width: '95%',
        padding: '10px',
        marginBottom: '15px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '16px',
    };

    const buttonStyle = {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    };

    const errorStyle = {
        color: 'red',
        textAlign: 'center',
        marginBottom: '15px',
    };

    const titleStyle = {
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
    };

    return (
        <div style={{ padding: '40px' }}>
            <div style={formStyle}>
                <h2 style={titleStyle}>User Registration</h2>
                {message && <p style={errorStyle}>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input 
                            type="text" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleChange} 
                            required 
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            minLength="6" 
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label>User Type:</label>
                        <select 
                            name="userType" 
                            value={formData.userType} 
                            onChange={handleChange} 
                            required 
                            style={inputStyle}
                        >
                            <option value="">Select User Type</option>
                            <option value="tourist">Tourist</option>
                            <option value="tourGuide">Tour Guide</option>
                            <option value="seller">Seller</option>
                            <option value="advertiser">Advertiser</option>
                        </select>
                    </div>

                    {/* Additional fields for tourist role */}
                    {formData.userType === 'tourist' && (
                        <>
                            <div>
                                <label>Mobile Number:</label>
                                <input 
                                    type="text" 
                                    name="mobileNumber" 
                                    value={formData.mobileNumber} 
                                    onChange={handleChange} 
                                    style={inputStyle} 
                                    required
                                />
                            </div>
                            <div>
                                <label>Nationality:</label>
                                <input 
                                    type="text" 
                                    name="nationality" 
                                    value={formData.nationality} 
                                    onChange={handleChange} 
                                    style={inputStyle} 
                                    required
                                />
                            </div>
                            <div>
                                <label>Date of Birth:</label>
                                <input 
                                    type="date" 
                                    name="dob" 
                                    value={formData.dob} 
                                    onChange={handleChange} 
                                    style={inputStyle} 
                                    required
                                />
                            </div>
                            <div>
                                <label>Job or Student:</label>
                                <select 
                                    name="jobOrStudent" 
                                    value={formData.jobOrStudent} 
                                    onChange={handleChange} 
                                    style={inputStyle} 
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Job">Job</option>
                                    <option value="Student">Student</option>
                                </select>
                            </div>
                        </>
                    )}

                    <button type="submit" style={buttonStyle}>Register</button>
                </form>
            </div>
        </div>
    );
};

export default MultiRoleRegister;