import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdvertiserNavbar from '../MainPage-Components/GuestNavbar'; // Assuming a similar Navbar exists
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import UpdateAdvertiser from './UpdateAdvertiser';
import MyActivities from './MyActivities';
import CreateActivity from './CreateActivity';
import UploadLogo from './UploadLogo';
import SalesReport from './AdvertiserSalesReport';

const AdvertiserDashboard = () => {
    const [profile, setProfile] = useState({});
    const [message, setMessage] = useState('');
    const [activeComponent, setActiveComponent] = useState('profile');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('You need to log in.');
                return;
            }

            try {
                const response = await axios.get('/advertiser/myProfile', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data && response.data.advertiser) {
                    setProfile(response.data.advertiser);
                } else {
                    setMessage('No profile data found');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setMessage('Error fetching profile');
            }
        };

        fetchProfile();
    }, []);

    const handleDeleteAccountRequest = async () => {
        if (
            window.confirm(
                'Are you sure you want to delete your account? This action cannot be undone.'
            )
        ) {
            try {
                const token = localStorage.getItem('token');
                await axios.put(
                    '/advertiser/deleteRequest',
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setMessage('Account deletion request sent successfully.');
            } catch (error) {
                console.error('Error requesting account deletion:', error);
                setMessage('Failed to request account deletion. Please try again.');
            }
        }
    };

    const renderContent = () => {
        switch (activeComponent) {
            case 'profile':
                return (
                    <Box
                        sx={{
                            marginTop: '50px',
                            width: '400px',
                            height: '400px',
                            borderRadius: '16px',
                            backgroundColor: 'white',
                            margin: '30px auto',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                            textAlign: 'center',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
                            },
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
                            Advertiser Profile
                        </Typography>
                        {message && (
                            <Typography color="error" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>
                                {message}
                            </Typography>
                        )}
                        {profile.username ? (
                            <>
                                <Box
                                    component="div"
                                    sx={{
                                        fontSize: '16px',
                                        lineHeight: '1.8',
                                        '& strong': {
                                            color: '#111E56',
                                            fontWeight: 'bold',
                                        },
                                    }}
                                >
                                    <p>
                                        <strong>Username:</strong> {profile.username}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {profile.email}
                                    </p>
                                    <p>
                                        <strong>Company Name:</strong> {profile.companyName}
                                    </p>
                                    <p>
                                        <strong>Website Link:</strong>{' '}
                                        <a
                                            href={profile.websiteLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#111E56', textDecoration: 'underline' }}
                                        >
                                            {profile.websiteLink}
                                        </a>
                                    </p>
                                    <p>
                                        <strong>Hotline:</strong> {profile.hotline}
                                    </p>
                                    <p>
                                        <strong>Company Profile:</strong> {profile.companyProfile}
                                    </p>
                                </Box>
                                <Button
                                    onClick={handleDeleteAccountRequest}
                                    sx={{
                                        marginTop: '20px',
                                        backgroundColor: '#f44336',
                                        color: 'white',
                                        border: '2px solid #f44336',
                                        padding: '10px 20px',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        borderRadius: '8px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            color: '#f44336',
                                            border: '2px solid #f44336',
                                        },
                                    }}
                                >
                                    Delete Account
                                </Button>
                            </>
                        ) : (
                            <CircularProgress sx={{ color: '#111E56' }} />
                        )}
                    </Box>
                );
            case 'viewActivities':
                return <MyActivities />;
            case 'createActivity':
                return <CreateActivity />;
            case 'updateProfile':
                return <UpdateAdvertiser profile={profile} setProfile={setProfile} />;
            case 'uploadLogo':
                return <UploadLogo setProfile={setProfile} />;
            case 'Sales Report':
                return <SalesReport/>;
            default:
                return <Typography variant="h4" align="center">Welcome to the Dashboard</Typography>;
        }
    };

    return (
        <div>
            {/* Navbar */}
            <AdvertiserNavbar toggleSidebar={toggleSidebar} />

            {/* Sidebar */}
            {isSidebarOpen && (
                <Box
                    sx={{
                        width: '250px',
                        backgroundColor: '#111E40',
                        color: 'white',
                        height: 'calc(100vh - 64px)',
                        position: 'fixed',
                        top: '64px',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <nav>
                        {[
                            { label: 'View Profile', component: 'profile' },
                            { label: 'Edit Profile', component: 'updateProfile' },
                            { label: 'Get My Activities', component: 'viewActivities' },
                            { label: 'Create Activity', component: 'createActivity' },
                            { label: 'Upload a Logo', component: 'uploadLogo' },
                            { label: 'Sales Report', component: 'Sales Report' },
                        ].map((item) => (
                            <Button
                                key={item.component}
                                sx={{
                                    color: 'white',
                                    textAlign: 'left',
                                    justifyContent: 'flex-start',
                                    width: '100%',
                                    padding: '10px',
                                    marginTop: '10px',
                                    backgroundColor: activeComponent === item.component ? '#7BAFD0' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: '#7BAFD0',
                                        transform: 'scale(1.01)',
                                    },
                                }}
                                onClick={() => setActiveComponent(item.component)}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </nav>
                </Box>
            )}

            {/* Main Content */}
            <Box
                sx={{
                    marginLeft: isSidebarOpen ? '250px' : '0',
                    transition: 'margin-left 0.3s ease',
                    padding: '20px',
                }}
            >
                {renderContent()}
            </Box>
        </div>
    );
};

export default AdvertiserDashboard;
