import React, { useState } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Typography,
    Box,
    IconButton,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const UpdateProfile = ({ profile, setProfile }) => {
    const [formProfile, setFormProfile] = useState(profile);
    const [updateMessage, setUpdateMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [redirecting, setRedirecting] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const navigate = useNavigate();
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
                headers: { Authorization: `Bearer ${token}` },
            });
            setUpdateMessage('Profile updated successfully');
            setProfile(response.data.tourist); // Update main profile state
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
            await axios.put(
                '/tourists/editPassword',
                {
                    currentPassword,
                    newPassword,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
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
        <Box
        
            sx={{
                marginTop: '20px',
                width: '100%',
                maxWidth: '500px',
                borderRadius: '16px',
                backgroundColor: 'white',
                margin: '20px auto',
               // boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                textAlign: 'center',
                fontFamily: 'Poppins, sans-serif',
                padding: '30px',
            }}
            
        >
            <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: '#111E56',
                        marginBottom: '15px',
                    }}
                >
                    Update Profile
                </Typography>

            {updateMessage && (
                <Typography
                    color={success ? 'green' : 'red'}
                    sx={{
                        mb: 2,
                        fontWeight: 'bold',
                    }}
                >
                    {updateMessage}
                </Typography>
            )}

            <form onSubmit={handleSubmit}>
                <TextField
                    label="First Name"
                    name="firstName"
                    value={formProfile.firstName || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Last Name"
                    name="lastName"
                    value={formProfile.lastName || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
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
                                    <Chip
                                        key={value}
                                        label={value}
                                        sx={{
                                            backgroundColor: '#111E56',
                                            color: 'white',
                                            fontWeight: 'bold',
                                        }}
                                    />
                                ))}
                            </Box>
                        )}
                    >
                        {[
                            'Bazaars',
                            'Concert',
                            'Castle',
                            'Palace',
                            'Party',
                            'Park',
                            'Exhibitions',
                            'Monument',
                        ].map((preference) => (
                            <MenuItem key={preference} value={preference}>
                                {preference}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                        backgroundColor: '#111E56',
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        marginTop: '20px',
                        '&:hover': {
                            backgroundColor: 'white',
                            color: '#111E56',
                            border: '2px solid #111E56',
                        },
                    }}
                >
                    Update Profile
                </Button>
            </form>

            {/* Update Password Section */}
            <Box sx={{ mt: 4 }}>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: '#111E56',
                        marginBottom: '15px',
                    }}
                >
                    Update Password
                </Typography>

                {passwordMessage && (
                    <Typography
                        color={redirecting ? 'green' : 'red'}
                        sx={{
                            mb: 2,
                            fontWeight: 'bold',
                        }}
                    >
                        {passwordMessage}
                        {redirecting && <CircularProgress size={20} sx={{ ml: 1 }} />}
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
                            ),
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
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: '#111E56',
                            color: 'white',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            marginTop: '20px',
                            '&:hover': {
                                backgroundColor: 'white',
                                color: '#111E56',
                                border: '2px solid #111E56',
                            },
                        }}
                    >
                        Update Password
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default UpdateProfile;
