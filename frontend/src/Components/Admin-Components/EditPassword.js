import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
    IconButton,
    InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const EditMyPassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const navigate = useNavigate();

    const handleToggleCurrentPasswordVisibility = () => setShowCurrentPassword((prev) => !prev);
    const handleToggleNewPasswordVisibility = () => setShowNewPassword((prev) => !prev);

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            await axios.put('/admins/editMyPassword', {
                currentPassword,
                newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setMessage("Password updated successfully!");
            setTimeout(() => {
                navigate('/admin/login'); // Redirect after successful password update
            }, 1500);
        } catch (error) {
            console.error("Error updating password:", error);
            setMessage("Error updating password. Please check your current password and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3, boxShadow: 2, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
                Edit My Password
            </Typography>
            {message && (
                <Typography 
                    variant="body2" 
                    sx={{ color: message.includes('successfully') ? 'green' : 'red', mb: 2 }}
                >
                    {message}
                </Typography>
            )}
            <form onSubmit={handlePasswordChange}>
                <TextField
                    label="Current Password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleToggleCurrentPasswordVisibility} edge="end">
                                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <TextField
                    label="New Password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleToggleNewPasswordVisibility} edge="end">
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
                        border: '2px solid #111E56',
                        '&:hover': { 
                            backgroundColor: 'white', 
                            color: '#111E56',
                            border: '2px solid #111E56', // Optional: adds a border to match the dark blue on hover
                        },mt: 2 }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Update Password"}
                </Button>
            </form>
        </Box>
    );
};

export default EditMyPassword;
