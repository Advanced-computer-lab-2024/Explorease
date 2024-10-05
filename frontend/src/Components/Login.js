import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', { email, password });
            const { token, user } = response.data;

            // Save token in local storage
            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);

            // Redirect based on role
            switch (user.role) {
                case 'tourist':
                    navigate('/tourist/');
                    break;
                case 'tourGuide':
                    navigate('/tourguide/');
                    break;
                case 'seller':
                    navigate('/seller/');
                    break;
                case 'advertiser':
                    navigate('/advertiser/');
                    break;
                case 'admin':
                    navigate('/admin/');
                    break;
                case 'touristGovernor':
                    navigate('/governor/');
                    break;
                default:
                    setError('Unknown user role');
            }
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    // Basic styles for the form
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
                <h2 style={titleStyle}>Login</h2>
                {error && <p style={errorStyle}>{error}</p>}
                <form onSubmit={handleLogin}>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>
                    <button type="submit" style={buttonStyle}>Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
