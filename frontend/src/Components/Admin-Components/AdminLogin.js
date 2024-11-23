import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To redirect after login

import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    TextField,
    IconButton,
    InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // For redirecting after login

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/admins/login', { email, password });
            const { token } = response.data; // Assuming the JWT token is in the response
            localStorage.setItem('token', token); // Store JWT in localStorage
            setMessage('Login successful! Redirecting to dashboard...');
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 2000); // 2-second delay for user to see the message
        } catch (error) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card sx={{ maxWidth: 400, p: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        Admin Login
                    </Typography>
                    {error && (
                        <Typography color="error" align="center" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            required
                            sx={{ mb: 2 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                backgroundColor: '#111E56',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'white',
                                    color: '#111E56',
                                    border: '1px solid #111E56', // Optional: adds a border to match the dark blue on hover
                                },
                                mb: 2,
                            }}
                        >
                            Login
                        </Button>
                    </form>
                    {message && (
                        <Typography align="center" sx={{ mt: 2, color: 'green' }}>
                            {message}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default AdminLogin;
