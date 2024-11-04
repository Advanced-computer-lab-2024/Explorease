import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/login', { email, password });
            const { token, user } = response.data;

            // Save token and user role in local storage
            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);
            if (user.role === 'tourist' || user.role === 'touristGovernor') {
                navigateToDashboard(user.role);
                return;
            }
    
            if (!user.isAccepted) {
                setError('Your account is not yet approved. Please upload the required documents.');
                setTimeout(() => navigate('/uploadDocuments'), 3000);
                return;
            }

            if (!user.canLogin) {
                setShowTerms(true);
                return;
            }

            // If user is accepted and can log in, navigate to dashboard
            navigateToDashboard(user.role);
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    const handleAcceptTerms = async () => {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        try {
            const response = await axios.post(
                '/accept-terms',
                { email },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send token in headers
                    },
                }
            );

            if (response.data.canLogin) {
                navigateToDashboard(localStorage.getItem('role'));
            } else {
                setError('Failed to accept terms. Please try again.');
            }
        } catch (error) {
            setError('Error accepting terms. Please try again.');
        }
    };

    const navigateToDashboard = (role) => {
        switch (role) {
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
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card sx={{ maxWidth: 400, p: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        Login
                    </Typography>
                    {error && (
                        <Typography color="error" align="center" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    {showTerms ? (
                        <>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Please read and accept the terms and conditions to proceed.
                            </Typography>
                            <Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleAcceptTerms}
                                >
                                    Accept Terms and Continue
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    fullWidth
                                    sx={{ mt: 1 }}
                                    onClick={() => navigate('/')}
                                >
                                    Decline and Go Back
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <form onSubmit={handleLogin}>
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
                            <Button  type="submit" variant="contained" color="primary" fullWidth sx={{ backgroundColor: '#111E56', 
                            color: 'white', 
                            '&:hover': { 
                                backgroundColor: 'white', 
                                color: '#111E56',
                                border: '1px solid #111E56' // Optional: adds a border to match the dark blue on hover
                            },mb: 2 }}>
                                Login
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;
