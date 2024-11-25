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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, Close } from '@mui/icons-material';

const Login = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Login loading state
    const [showPassword, setShowPassword] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [openForgotPassword, setOpenForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [otpMessage, setOtpMessage] = useState('');
    const [isSendingOtp, setIsSendingOtp] = useState(false); // OTP loading state
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('/login', { emailOrUsername, password });
            const { token, user } = response.data;

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

            navigateToDashboard(user.role);
        } catch (err) {
            setError('Invalid email/username or password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOTP = async () => {
        setIsSendingOtp(true); // Start OTP loading
        try {
            const response = await axios.post('/send-otp', { email: forgotPasswordEmail });
            setOtpMessage('OTP sent successfully! Please check your email for the code.');
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setOtpMessage('No user found with this email. Please try again.');
            } else {
                setOtpMessage('Error sending OTP. Please try again later.');
            }
        } finally {
            setIsSendingOtp(false); // Stop OTP loading
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
                    <form onSubmit={handleLogin}>
                        <TextField
                            label="Email or Username"
                            type="text"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
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
                            disabled={isLoading} // Disable during login loading
                            sx={{
                                backgroundColor: isLoading ? 'grey' : '#111E56',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'white',
                                    color: '#111E56',
                                    border: '1px solid #111E56',
                                },
                                mb: 2,
                            }}
                        >
                            {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Login'}
                        </Button>
                    </form>
                    <Typography
                        variant="body2"
                        color="primary"
                        align="center"
                        onClick={() => setOpenForgotPassword(true)}
                        sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Forgot Password?
                    </Typography>
                </CardContent>
            </Card>

            {/* Forgot Password Dialog */}
            <Dialog
                open={openForgotPassword}
                onClose={() => setOpenForgotPassword(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: { p: 2, position: 'relative', borderRadius: 2, boxShadow: 5 },
                }}
            >
                <IconButton
                    aria-label="close"
                    onClick={() => setOpenForgotPassword(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Close />
                </IconButton>
                <DialogTitle>Forgot Password</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Enter your email"
                        type="email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    {otpMessage && (
                        <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
                            {otpMessage}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleSendOTP}
                        variant="contained"
                        color="primary"
                        disabled={isSendingOtp}
                        sx={{
                            backgroundColor: isSendingOtp ? 'grey' : '#111E56',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'white',
                                color: '#111E56',
                                border: '1px solid #111E56',
                            },
                        }}
                    >
                        {isSendingOtp ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send OTP'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Login;
