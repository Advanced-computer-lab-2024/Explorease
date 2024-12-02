import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const UpdateTouristGovernorProfile = ({ profile, setProfile }) => {
    const [formProfile, setFormProfile] = useState({
        email: '',
        mobileNumber: '',
        yearsOfExperience: '',
        previousWork: '',
    });
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [redirecting, setRedirecting] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormProfile({
                email: profile.email || '',
                
            });
        }
    }, [profile]);
    
    useEffect(() => {
        if (profile) {
            setFormProfile(profile);
        }
    }, [profile]);

    const handleChange = (e) => {
        setFormProfile({ ...formProfile, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put('/governor/updateProfile', formProfile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUpdateMessage('Profile updated successfully');
            setProfile(response.data.updatedGovernor);
            setSuccess(true);
        } catch (error) {
            setUpdateMessage('Error updating profile');
            setSuccess(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put('/governor/editPassword', { currentPassword, newPassword }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPasswordMessage('Password updated successfully. Redirecting to login page...');
            setRedirecting(true);
            setTimeout(() => (window.location.href = '/login'), 500);
        } catch (error) {
            setPasswordMessage('Error updating password');
            setRedirecting(false);
        }
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>Update Tourist Governor Profile</Typography>

            {updateMessage && (
                <Typography color={success ? 'green' : 'red'} sx={{ mb: 2 }}>
                    {updateMessage}
                </Typography>
            )}

            <form onSubmit={handleProfileSubmit}>
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formProfile.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Username"
                    name="username"
                    value={formProfile.username}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ backgroundColor: '#111E56', 
                        color: 'white', 
                        border: '2px solid #111E56',
                        '&:hover': { 
                            backgroundColor: 'white', 
                            color: '#111E56',
                            border: '2px solid #111E56', // Optional: adds a border to match the dark blue on hover
                        },mt: 2 }}
                >
                    Update Profile
                </Button>
            </form>

            
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>Update Password</Typography>

                {passwordMessage && (
                    <Typography color={redirecting ? 'primary' : 'error'} sx={{ mb: 2 }}>
                        {passwordMessage}
                        {redirecting && <CircularProgress size={20} sx={{ ml: 1 }} />}
                    </Typography>
                )}

                <form onSubmit={handlePasswordSubmit}>
                    <TextField
                        label="Current Password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        label="New Password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ backgroundColor: '#111E56', 
                            color: 'white', 
                            '&:hover': { 
                                backgroundColor: 'white', 
                                color: '#111E56',
                                border: '1px solid #111E56' // Optional: adds a border to match the dark blue on hover
                            },mt: 2 }}
                    >
                        Update Password
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default UpdateTouristGovernorProfile;
