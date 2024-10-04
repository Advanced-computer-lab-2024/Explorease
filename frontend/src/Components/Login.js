// src/Components/Login.js
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

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
