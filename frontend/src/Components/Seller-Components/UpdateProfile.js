import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const UpdateProfile = ({ profile, setProfile, role = "seller" }) => {
    const [formProfile, setFormProfile] = useState({
        username: '',
        email: '',
        name: '',
        description: '',
    });
    const [updateMessage, setUpdateMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [redirecting, setRedirecting] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormProfile({
                username: profile.username || '',
                email: profile.email || '',
                name: profile.name || '',
                description: profile.description || '',
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        setFormProfile({ ...formProfile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`/seller/updateProfile`, formProfile, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUpdateMessage('Profile updated successfully');
            setProfile(response.data.updatedSeller); // Update main profile state
            setSuccess(true);
        } catch (error) {
            setUpdateMessage('Error updating profile');
            setSuccess(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put(`/seller/editPassword`, { currentPassword, newPassword }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPasswordMessage('Password updated successfully. Redirecting to login page...');
            setCurrentPassword('');
            setNewPassword('');
            setRedirecting(true);
            setTimeout(() => {
                window.location.href = '/login';
            }, 500);
        } catch (error) {
            setPasswordMessage('Error updating password');
            setRedirecting(false);
        }
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>Update Profile</Typography>

            {updateMessage && (
                <Typography color={success ? 'green' : 'red'} sx={{ mb: 2 }}>
                    {updateMessage}
                </Typography>
            )}

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    name="username"
                    value={formProfile.username}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Email"
                    name="email"
                    value={formProfile.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Name"
                    name="name"
                    value={formProfile.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Description"
                    name="description"
                    value={formProfile.description}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Update Profile
                </Button>
            </form>

            {/* Password Update Section */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>Update Password</Typography>
                
                {passwordMessage && (
                    <Typography color={redirecting ? 'primary' : 'error'} sx={{ mb: 2 }}>
                        {passwordMessage}
                        {redirecting && <CircularProgress size={20} sx={{ ml: 1 }} />}
                    </Typography>
                )}

                <form onSubmit={handlePasswordUpdate}>
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
                        sx={{ mt: 2 }}
                    >
                        Update Password
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default UpdateProfile;
