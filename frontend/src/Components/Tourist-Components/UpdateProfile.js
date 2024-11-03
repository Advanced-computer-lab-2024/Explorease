import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, CircularProgress, IconButton, InputAdornment, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Visibility, VisibilityOff } from '@mui/icons-material';

const UpdateProfile = ({ profile, setProfile }) => {
    const [formProfile, setFormProfile] = useState(profile);
    const [updateMessage, setUpdateMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [redirecting, setRedirecting] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const navigate = useNavigate(); // Initialize navigate
    const [showCurrentPassword, setShowCurrentPassword] = useState(false); 
    const [showNewPassword, setShowNewPassword] = useState(false); 

    // Handle profile updates
    const handleChange = (e) => {
        setFormProfile({ ...formProfile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put('/tourists/myProfile', formProfile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUpdateMessage('Profile updated successfully');
            setProfile(response.data.tourist);  // Update main profile state
            setSuccess(true);
        } catch (error) {
            setUpdateMessage('Error updating profile');
            setSuccess(false);
        }
    };

    // Handle password update
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put('/tourists/editPassword', {
                currentPassword,
                newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPasswordMessage('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setRedirecting(true);

            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            setPasswordMessage('Error updating password');
            setRedirecting(false);

        }
    };

    const handlePreferencesChange = (event) => {
        const {
            target: { value },
        } = event;
        setFormProfile({
            ...formProfile,
            preferences: typeof value === 'string' ? value.split(',') : value,
        });
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
                    label="Email"
                    name="email"
                    type="email"
                    value={formProfile.email || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Mobile Number"
                    name="mobileNumber"
                    value={formProfile.mobileNumber || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Job or Student"
                    name="jobOrStudent"
                    select
                    SelectProps={{ native: true }}
                    value={formProfile.jobOrStudent || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                >
                    <option value="Job">Job</option>
                    <option value="Student">Student</option>
                </TextField>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Preferences</InputLabel>
                <Select
                        label="Preferences"
                        name="preferences"
                        multiple
                        value={formProfile.preferences || []}
                        onChange={handlePreferencesChange}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                >
                    {['Bazaars', 'Concert', 'Castle', 'Palace', 'Party', 'Park', 'Exhibitions', 'Monument'].map((preference) => (
                        <MenuItem key={preference} value={preference}>
                            {preference}
                        </MenuItem>
                    ))}
                </Select>
                </FormControl>
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

            {/* Update Password Section */}
             <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>Update Password</Typography>
                
                {passwordMessage && (
                    <Typography color={redirecting ? 'primary' : 'error'} sx={{ mb: 2 }}>
                        {passwordMessage}
                        {redirecting && <CircularProgress size={20} sx={{ ml: 1 }} />} {/* Loading spinner */}
                    </Typography>
                )}

                <form onSubmit={handlePasswordUpdate}>
                    <TextField
                        label="Current Password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        edge="end"
                                    >
                                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        label="New Password"
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        edge="end"
                                    >
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
