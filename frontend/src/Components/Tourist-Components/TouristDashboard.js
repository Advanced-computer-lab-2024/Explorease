// TouristDashboard.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Products from '../Seller-Components/Products';
import FileComplaint from './fileComplaint';
import TouristNavbar from './TouristNavbar';
import UpdateProfile from './UpdateProfile';
import ViewComplaints from './ViewComplaints';
import BookFlight from './BookFlight';
import BookHotel from './BookHotel';
import BookTransport from './BookTransportation';
import Cart from './Cart';
import Wallet from './Wallet';
import BookActivity from './BookActivity';
import BookItinerary from './BookItinerary';
import ViewBookings from './ViewBookings';
import ReviewGuides from './ReviewGuides';
import PurchasedProduct from './PurchasedProduct';
import { Box, Typography } from '@mui/material';

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
        marginLeft: '260px',
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
            case 'fileComplaint':
                return < FileComplaint />;
            case 'ViewComplaints':
                return <ViewComplaints />
            case 'cart':
                return <h2> Still Implementing Cart!</h2>;
            case 'wallet':
                return <h2> Still Implementing Wallet!</h2>;
            case 'bookFlight':
                return <BookFlight />;
            case 'bookHotel':
                return <BookHotel />;
            case 'bookActivity':
                return <BookActivity />
            case 'bookItinerary':
                return <BookItinerary />
            case 'ViewBookings':
                    return <ViewBookings />
            case 'reviewGuides':
                    return <ReviewGuides />
            
            case 'PurchasedProduct':
                    return <PurchasedProduct />   
            default:
                return <Typography variant="h4" align="center">Welcome to the Dashboard</Typography>;
        }
    };

    return (
        <div>
            <TouristNavbar setActiveComponent={setActiveComponent} />

            <Box sx={sidebarStyle}>
                <Typography variant="h6">Dashboard</Typography>
                <ul style={{ listStyleType: 'none', padding: '0' }}>
                    <li onClick={() => setActiveComponent('profile')} style={{ cursor: 'pointer', marginBottom: '10px' }}>View Profile</li>
                    <li onClick={() => setActiveComponent('updateProfile')} style={{ cursor: 'pointer', marginBottom: '10px' }}>Update Profile</li>
                    <li onClick={() => setActiveComponent('fileComplaint')} style={{ cursor: 'pointer', marginBottom: '10px' }}>File Complaint</li>
                    <li onClick={() => setActiveComponent('ViewComplaints')} style={{ cursor: 'pointer', marginBottom: '10px' }}>View Complaints</li>
                    <li onClick={() => setActiveComponent('ViewBookings')} style={{ cursor: 'pointer', marginBottom: '10px' }}>View Bookings</li>
                    <li onClick={() => setActiveComponent('reviewGuides')} style={{ cursor: 'pointer', marginBottom: '10px' }}>Review Tour Guides</li>
                    <li onClick={() => setActiveComponent('PurchasedProduct')} style={{ cursor: 'pointer', marginBottom: '10px' }}>Review Purchased Product</li>
                </ul>
            </Box>

            <Box sx={contentStyle}>
                {renderContent()}
            </Box>
        </div>
    );
};

export default TouristDashboard;
