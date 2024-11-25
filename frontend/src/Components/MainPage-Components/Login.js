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
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');

    const [openForgotPassword, setOpenForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [forgotPasswordError, setForgotPasswordError] = useState('');
    const [otpMessage, setOtpMessage] = useState('');
    const [isSendingOtp, setIsSendingOtp] = useState(false);

    const [otp, setOtp] = useState('');
    const [showVerifyOtp, setShowVerifyOtp] = useState(false);
    const [otpError, setOtpError] = useState('');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [resetPasswordError, setResetPasswordError] = useState('');
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('/login', { emailOrUsername, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);
            setEmail(user.email);

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
                //setError('Your account is restricted. Please contact support.');
                return;
            }

            navigateToDashboard(user.role);
        } catch (err) {
            setError('Invalid email/username or password');
        } finally {
            setIsLoading(false);
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

    const handleSendOTP = async () => {
        setIsSendingOtp(true);
        setForgotPasswordError('');
        try {
            const response = await axios.post('/send-otp', { email: forgotPasswordEmail });
            setOtpMessage('OTP sent successfully! Please check your email for the code.');
            setOpenForgotPassword(false);
            setShowVerifyOtp(true);
        } catch (error) {
            setForgotPasswordError(
                error.response && error.response.status === 404
                    ? 'No user found with this email. Please try again.'
                    : 'Error sending OTP. Please try again later.'
            );
        } finally {
            setIsSendingOtp(false);
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

    const handleVerifyOtp = async () => {
        setOtpError('');
        try {
            const response = await axios.post('/verify-otp', { email: forgotPasswordEmail, otp });
            setShowVerifyOtp(false);
            setShowResetPassword(true);
        } catch (error) {
            setOtpError('Invalid OTP. Please try again.');
        }
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError(true);
            setResetPasswordError('Passwords do not match.');
            return;
        }

        setResetPasswordError('');
        try {
            const response = await axios.post('/reset-password', {
                email: forgotPasswordEmail,
                newPassword,
                confirmPassword,
            });
            alert('Password reset successfully!');
            setShowResetPassword(false);
            navigate('/login');
        } catch (error) {
            setResetPasswordError('Failed to reset password. Please try again.');
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
                            fullWidth
                            disabled={isLoading}
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
                    )}
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
                    sx: { p: 2, position: 'relative', borderRadius: 2, minHeight: 250 },
                }}
            >
                <DialogTitle>
                    Forgot Password
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
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Enter your email"
                        type="email"
                        value={forgotPasswordEmail}
                        onChange={(e) => {
                            setForgotPasswordEmail(e.target.value);
                            setForgotPasswordError('');
                        }}
                        fullWidth
                        required
                        sx={{ marginTop: '20px', mb: 2 }}
                    />
                    {forgotPasswordError && (
                        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                            {forgotPasswordError}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleSendOTP}
                        variant="contained"
                        sx={{
                            backgroundColor: '#111E56',
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

            {/* Verify OTP Dialog */}
            <Dialog
                open={showVerifyOtp}
                onClose={() => setShowVerifyOtp(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: { p: 2, position: 'relative', borderRadius: 2, minHeight: 250 },
                }}
            >
                <DialogTitle>
                    Verify OTP
                    <IconButton
                        aria-label="close"
                        onClick={() => setShowVerifyOtp(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Enter OTP"
                        value={otp}
                        onChange={(e) => {
                            setOtp(e.target.value);
                            setOtpError('');
                        }}
                        fullWidth
                        required
                        sx={{ marginTop: '20px', mb: 2 }}
                    />
                    {otpError && (
                        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                            {otpError}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleVerifyOtp}
                        variant="contained"
                        sx={{
                            backgroundColor: '#111E56',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'white',
                                color: '#111E56',
                                border: '1px solid #111E56',
                            },
                        }}
                    >
                        Verify OTP
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Reset Password Dialog */}
            <Dialog
                open={showResetPassword}
                onClose={() => setShowResetPassword(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: { p: 2, position: 'relative', borderRadius: 2, minHeight: 250 },
                }}
            >
                <DialogTitle>
                    Reset Password
                    <IconButton
                        aria-label="close"
                        onClick={() => setShowResetPassword(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                            setPasswordError(false);
                            setResetPasswordError('');
                        }}
                        fullWidth
                        required
                        error={passwordError}
                        sx={{
                            marginTop: '10px',
                            mb: 2,
                            ...(passwordError && { border: '1px solid red', boxShadow: '0 0 5px red' }),
                        }}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPasswordError(false);
                            setResetPasswordError('');
                        }}
                        fullWidth
                        required
                        error={passwordError}
                        sx={{
                            marginTop: '10px',
                            ...(passwordError && { border: '1px solid red', boxShadow: '0 0 5px red' }),
                        }}
                    />
                    {resetPasswordError && (
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                            {resetPasswordError}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleResetPassword}
                        variant="contained"
                        sx={{
                            backgroundColor: '#111E56',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'white',
                                color: '#111E56',
                                border: '1px solid #111E56',
                            },
                        }}
                    >
                        Change Password
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Login;
