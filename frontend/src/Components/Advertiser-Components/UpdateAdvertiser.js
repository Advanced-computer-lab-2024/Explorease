import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const UpdateAdvertiser = ({ profile, setProfile }) => {
    const [formProfile, setFormProfile] = useState({
        username: '',
        companyName: '',
        websiteLink: '',
        hotline: '',
        companyProfile: '',
    });
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [redirecting, setRedirecting] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormProfile({
                username: profile.username || '',
                companyName: profile.companyName || '',
                websiteLink: profile.websiteLink || '',
                hotline: profile.hotline || '',
                companyProfile: profile.companyProfile || '',
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        setFormProfile({ ...formProfile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        if (formProfile.websiteLink && !/^(https?:\/\/)?([\w-]+\.)+[a-z]{2,6}(\/[^\s]*)?$/.test(formProfile.websiteLink)) {
            setUpdateMessage('Please enter a valid website URL');
            return;
        }

        try {
            const response = await axios.put('/advertiser/updateProfile', formProfile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(response.data.updatedAdvertiser);
            setUpdateMessage('Profile updated successfully');
        } catch (error) {
            setUpdateMessage('Error updating profile');
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put(`/advertiser/editPassword`, { currentPassword, newPassword }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPasswordMessage('Password updated successfully. Redirecting to login...');
            setRedirecting(true);
            setTimeout(() => {
                window.location.href = '/login';
            }, 500);
        } catch (error) {
            setPasswordMessage('Error updating password');
        }
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>Edit Profile</Typography>

            {updateMessage && (
                <Typography color="primary" sx={{ mb: 2 }}>{updateMessage}</Typography>
            )}

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    name="username"
                    value={formProfile.username || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Company Name"
                    name="companyName"
                    value={formProfile.companyName || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Website Link"
                    name="websiteLink"
                    value={formProfile.websiteLink || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Hotline"
                    name="hotline"
                    value={formProfile.hotline || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Company Profile"
                    name="companyProfile"
                    value={formProfile.companyProfile || ''}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
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
                    Update Profile
                </Button>
            </form>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>Update Password</Typography>

                {passwordMessage && (
                    <Typography color="primary" sx={{ mb: 2 }}>
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
                        sx={{ backgroundColor: '#111E56', 
                            color: 'white', 
                            '&:hover': { 
                                backgroundColor: 'white', 
                                color: '#111E56',
                                border: '1px solid #111E56' // Optional: adds a border to match the dark blue on hover
                            }, mt: 2 }}
                    >
                        Update Password
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default UpdateAdvertiser;
