// TouristDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TouristNavbar from '../MainPage-Components/TouristNavbar';
import Products from '../Seller-Components/Products';
import UpdateProfile from './UpdateProfile'; // Import the refactored UpdateProfile component
import { Typography, Box } from '@mui/material';

const TouristDashboard = () => {
    const [profile, setProfile] = useState({});
    const [message, setMessage] = useState('');
    const [activeComponent, setActiveComponent] = useState('profile');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');  
            }

            try {
                const response = await axios.get('/tourists/myProfile', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data) {
                    setProfile(response.data);
                } else {
                    setMessage('No profile data found');
                }
            } catch (error) {
                console.error('Error fetching profile:', error.response ? error.response.data : error.message);
                setMessage('Error fetching profile');
            }
        };
    
        fetchProfile();
    }, [navigate]);

    const sidebarStyle = {
        width: '250px',
        backgroundColor: '#f1f1f1',
        padding: '15px',
        position: 'fixed',
        height: '100%',
        top: '60px',
        left: '0',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1,
    };

    const contentStyle = {
        marginLeft: '260px', // Space for the sidebar
        padding: '20px',
    };

    const renderContent = () => {
        switch (activeComponent) {
            case 'profile':
                return (
                    <>
                        <Typography variant="h4" align="center" gutterBottom>Tourist Profile</Typography>
                        {message && <Typography color="error" align="center">{message}</Typography>}
                        {profile && profile.username ? (
                            <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', maxWidth: '400px', margin: '0 auto', backgroundColor: '#f9f9f9', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                                <p><strong>Username:</strong> {profile.username}</p>
                                <p><strong>Email:</strong> {profile.email}</p>
                                <p><strong>Date of Birth:</strong> {new Date(profile.dob).toLocaleDateString()}</p>
                                <p><strong>Nationality:</strong> {profile.nationality}</p>
                                <p><strong>Wallet Balance:</strong> {profile.wallet} USD</p>
                            </Box>
                        ) : (
                            <Typography align="center">Loading profile...</Typography>
                        )}
                    </>
                );
            case 'viewProducts':
                return <Products />;
            case 'updateProfile':
                return <UpdateProfile profile={profile} setProfile={setProfile} />;
            default:
                return <Typography variant="h4" align="center">Welcome to the Dashboard</Typography>;
        }
    };

    return (
        <div>
            <TouristNavbar /> 

            <Box sx={sidebarStyle}>
                <Typography variant="h6">Dashboard</Typography>
                <ul style={{ listStyleType: 'none', padding: '0'}}>
                    <li onClick={() => setActiveComponent('profile')} style={{ cursor: 'pointer', marginBottom: '10px' }}>View Profile</li>
                    <li onClick={() => setActiveComponent('viewProducts')} style={{ cursor: 'pointer', marginBottom: '10px' }}>View All Products</li>
                    <li onClick={() => setActiveComponent('updateProfile')} style={{ cursor: 'pointer', marginBottom: '10px' }}>Update Profile</li>
                </ul>
            </Box>
    
            <Box sx={contentStyle}>
                {renderContent()}
            </Box>
        </div>
    );
};

export default TouristDashboard;
