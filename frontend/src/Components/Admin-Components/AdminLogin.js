import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // To redirect after login

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();  // For redirecting after login

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/admins/login', { email, password });
            const { token } = response.data;  // Assuming the JWT token is in the response
            localStorage.setItem('token', token); // Store JWT in localStorage
            setMessage('Login successful! Redirecting to dashboard...');
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 2000);  // 2-second delay for user to see the message
        } catch (error) {
            setMessage('Error during login. Please check your credentials.');
        }
    };

    return (
        <div>
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AdminLogin;
