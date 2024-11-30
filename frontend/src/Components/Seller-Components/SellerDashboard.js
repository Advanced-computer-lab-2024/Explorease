import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Button,
    Alert,
    List,
    ListItem,
} from '@mui/material';
import SellerNavbar from '../MainPage-Components/GuestNavbar';
import Products from './Products';
import MyProducts from './MyProducts';
import AddProduct from './AddProduct';
import UpdateProfile from './UpdateProfile';
import UploadLogo from './UploadLogo';
import SalesReport from './SellerSalesReport';

const SellerDashboard = () => {
    const [profile, setProfile] = useState({});
    const [message, setMessage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar visibility state

    const [activeComponent, setActiveComponent] = useState('profile');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('/seller/myProfile', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data && response.data.seller) {
                    setProfile(response.data.seller);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setMessage('Error fetching profile');
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleDeleteAccountRequest = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.put(
                    '/seller/deleteSellerRequest',
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setMessage('Account deletion request sent successfully.');
            } catch (error) {
                console.error('Error requesting account deletion:', error);
                setMessage('Failed to request account deletion. Please try again.');
            }
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen((prevState) => !prevState);
    };
    

    const renderContent = () => {
        switch (activeComponent) {
            case 'profile':
                return (
                    <>
                        <Typography
                            variant="h4"
                            align="center"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                color: '#111E56',
                                position: 'relative',
                                mb: 3,
                                
                            }}
                        >
                            Seller Profile
                        </Typography>
                        {message && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {message}
                            </Alert>
                        )}
                        {profile && profile.username ? (
                            <Card
                                sx={{
                                    maxWidth: 400,
                                    margin: '0 auto',
                                    p: 3,
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    backgroundColor: 'white',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.03)',
                                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                                    },
                                    textAlign: 'center',
                                }}
                            >
                                {profile.imageUrl && (
                                    <CardMedia
                                        component="img"
                                        image={profile.imageUrl}
                                        alt="Profile Logo"
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: '50%',
                                            margin: '0 auto 16px',
                                        }}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Username:
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {profile.username}
                                    </Typography>

                                    <Typography variant="h6" gutterBottom>
                                        Email:
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {profile.email}
                                    </Typography>

                                    <Typography variant="h6" gutterBottom>
                                        Name:
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {profile.name}
                                    </Typography>

                                    <Typography variant="h6" gutterBottom>
                                        Description:
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {profile.description}
                                    </Typography>

                                    <Button
                                        onClick={handleDeleteAccountRequest}
                                        sx={{
                                            mt: 2,
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            border: '1px solid #f44336',
                                            '&:hover': {
                                                backgroundColor: 'white',
                                                color: '#f44336',
                                                border: '1px solid #f44336',
                                            },
                                        }}
                                    >
                                        Delete Account
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <Typography align="center" variant="body1">
                                Loading profile...
                            </Typography>
                        )}
                    </>
                );
            case 'viewProducts':
                return <Products />;
            case 'updateProfile':
                return <UpdateProfile profile={profile} setProfile={setProfile} />;
            case 'myProducts':
                return <MyProducts />;
            case 'addProduct':
                return <AddProduct />;
            case 'addLogo':
                return <UploadLogo setProfile={setProfile} />;
            case 'salesReport':
                return <SalesReport />;
            default:
                return <Typography variant="h6">Welcome to the Dashboard</Typography>;
        }
    };

    return (
        <Box>
            <SellerNavbar toggleSidebar={toggleSidebar} />
            <Box
                sx={{
                    display: 'flex',
                    minHeight: '100vh',
                }}
            >
                {isSidebarOpen && (
                    <Box
                        sx={{
                            width: '250px',
                            backgroundColor: '#111E40',
                            color: 'white',
                            height: 'calc(100vh - 64px)', // Sidebar height excluding navbar
                            position: 'fixed',
                            top: '64px', // Start below the navbar
                            padding: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.3s ease-in-out',
                        }}
                    >
                        {[
                            { label: 'View Profile', section: 'profile' },
                            { label: 'View All Products', section: 'viewProducts' },
                            { label: 'Update Profile', section: 'updateProfile' },
                            { label: 'View My Products', section: 'myProducts' },
                            { label: 'Add A Product', section: 'addProduct' },
                            { label: 'Add A Logo', section: 'addLogo' },
                            { label: 'Sales Report', section: 'salesReport' },
                        ].map((item, index) => (
                            <Button
                                key={index}
                                onClick={() => setActiveComponent(item.section)}
                                sx={{
                                    color: 'white',
                                    textAlign: 'left',
                                    justifyContent: 'flex-start',
                                    width: '100%',
                                    padding: '10px',
                                    marginTop: '10px',
                                    backgroundColor: activeComponent === item.section ? '#7BAFD0' : 'transparent',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: '#7BAFD0',
                                        transform: 'scale(1.01)',
                                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                    },
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                )}

<Box
    sx={{
        marginLeft: isSidebarOpen ? '260px' : '0px',
        padding: '20px',
        width: '100%',
        transition: 'margin-left 0.3s ease',
    }}
>
    {renderContent()}
</Box>

            </Box>
        </Box>
    );
};

export default SellerDashboard;
