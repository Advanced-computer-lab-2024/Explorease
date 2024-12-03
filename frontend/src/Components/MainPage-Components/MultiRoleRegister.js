import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import {
    TextField,
    Button,
    Box,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Link,
    Stack,
    Container,

} from '@mui/material';

import backgroundImage from '../../Misc/bg.jpg'; // Adjust the path based on your project structure
import GuestNavBarforGuest from '../MainPage-Components/GuestNavBarforGuest';
import logo2 from '../../Misc/image.png';

const MultiRoleRegister = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        userType: '',
        mobileNumber: '',
        nationality: '',
        dob: '',
        jobOrStudent: '',
    });

    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Import useNavigate from react-router-dom

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/register`, formData); // Adjust the API endpoint if necessary
            setMessage('Registration successful! Redirecting to login page...');
            setTimeout(() => {
                navigate('/login'); // Redirect to the login page
            }, 2000);
        } catch (error) {
            setMessage('Error during registration. Please try again.');
            console.error(error);
        }
    };

    return (
        <>
        <GuestNavBarforGuest />
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '97vh', // Ensures it covers the entire height of the viewport
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'rgba(255, 255, 255, 0)', // Fallback color
            backgroundBlendMode: 'overlay',
        }}>
            <Box
                sx={{
                    marginTop:'40px',
                    marginBottom:'50px',
                    maxWidth: 400,
                    p: 3,
                    boxShadow: 4, // Default shadow intensity
                    transition: 'all 0.3s ease', // Smooth transition for hover effects
                    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent white background
                    borderRadius: 2, // Optional: Rounded corners for a sleek look
                    '&:hover': {
                        boxShadow: 10, // Dramatically increase shadow on hover
                        transform: 'scale(1.05)', // Slightly scale up the card
                        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Slightly less transparent on hover
                    },
                }}
            >
                <Typography
                    variant="h4"
                    component="h2"
                    textAlign="center"
                    marginBottom={3}
                    fontWeight="bold"
                    color='#111E56'
                >
                    User Registration
                </Typography>
                {message && (
                    <Typography
                        sx={{
                            color: message.includes('Error') ? 'red' : 'green',
                            textAlign: 'center',
                            marginBottom: 2,
                        }}
                    >
                        {message}
                    </Typography>
                )}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                        inputProps={{ minLength: 6 }}
                    />
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel>User Type</InputLabel>
                        <Select
                            name="userType"
                            value={formData.userType}
                            onChange={handleChange}
                        >
                            <MenuItem value="">Select User Type</MenuItem>
                            <MenuItem value="tourist">Tourist</MenuItem>
                            <MenuItem value="tourGuide">Tour Guide</MenuItem>
                            <MenuItem value="seller">Seller</MenuItem>
                            <MenuItem value="advertiser">Advertiser</MenuItem>
                        </Select>
                    </FormControl>

                    {formData.userType === 'tourist' && (
                        <>
                            <TextField
                                fullWidth
                                label="Mobile Number"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Nationality"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                            <FormControl fullWidth margin="normal" required>
                                <InputLabel>Job or Student</InputLabel>
                                <Select
                                    name="jobOrStudent"
                                    value={formData.jobOrStudent}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="Job">Job</MenuItem>
                                    <MenuItem value="Student">Student</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    )}

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundColor: '#111E56',
                            color: 'white',
                            border: '2px solid #111E56',
                            '&:hover': {
                                backgroundColor: 'transparent',
                                color: '#111E56',
                                border: '2px solid #111E56',
                            },
                            mb: 2,
                        }}
                    >
                        Register
                    </Button>
                </form>
            </Box>

        </Box>
                    {/* Footer */}
                    <footer style={{ backgroundColor: '#111E56', color: 'white', padding: '30px 0' }}>
                <Container>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                        sx={{ textAlign: { xs: 'center', sm: 'left' } }}
                    >
                        <img
                            src={logo2}
                            alt="Explorease"
                            style={{ height: '3em', marginLeft: '5px' }}
                        />
                        <Typography variant="body2">© 2024. All rights reserved.</Typography>
                        <Stack direction="row" spacing={3}>
                            <Link
                                to="/admin/login"
                                style={{
                                    color: 'white',
                                    textDecoration: 'none',
                                    fontSize: '16px',
                                }}
                            >
                                Admin Login
                            </Link>
                            <Link
                                to="/uploadDocuments"
                                style={{
                                    color: 'white',
                                    textDecoration: 'none',
                                    fontSize: '16px',
                                }}
                            >
                                Upload Documents
                            </Link>
                        </Stack>
                    </Stack>
                </Container>
            </footer>
        </>
    );
};

export default MultiRoleRegister;
