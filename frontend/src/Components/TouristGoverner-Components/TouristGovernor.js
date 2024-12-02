import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    Card,
    CardContent,
    IconButton,
    Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import MenuIcon from '@mui/icons-material/Menu';
import GuestNavbar from '../MainPage-Components/GuestNavbar';
import CreateHistoricalPlace from './CreateHistoricalPlace';
import UpdateTouristGovernorProfile from './UpdateTouristGovernor';


const TouristGovernorDashboard = () => {
    const [profile, setProfile] = useState({});
    const [historicalPlaces, setHistoricalPlaces] = useState([]);
    const [message, setMessage] = useState('');
    const [activeComponent, setActiveComponent] = useState('profile');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [editingPlaceId, setEditingPlaceId] = useState(null);
    

    // Fetch profile
    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.get('/governor/myProfile', {
                headers: { Authorization: `Bearer ${token}` },
            });

            setProfile(response.data || {});
            setMessage('');
        } catch (error) {
            setMessage('Error fetching profile');
        }
    };

    // Fetch historical places
    const fetchHistoricalPlaces = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.get('/governor/getMyHistoricalPlaces', {
                headers: { Authorization: `Bearer ${token}` },
            });

            setHistoricalPlaces(response.data || []);
            setMessage('');
        } catch (error) {
            setMessage('Error fetching historical places');
        }
    };

    useEffect(() => {
        if (activeComponent === 'profile') fetchProfile();
        if (activeComponent === 'viewHistoricalPlaces') fetchHistoricalPlaces();
    }, [activeComponent]);

    // Delete account
    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete('/governor/deleteAccount', {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Account deleted successfully!');
            localStorage.clear();
            window.location.href = '/';
        } catch (error) {
            setMessage('Error deleting account');
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen((prevState) => !prevState);
    };

    const renderProfile = () => (
        <>
        <Typography variant="h5" color="#111E56" gutterBottom sx={{fontWeight:'bold', fontSize:'30px'}}>
                Tourist Governor Profile
            </Typography>
            <Card
                                sx={{
                                    maxWidth: 400,
                                    margin: '0 auto',
                                    marginTop: '50px',
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
            <Typography variant="h5" color="#111E56" gutterBottom sx={{fontWeight:'bold' }}>
                Profile Details
            </Typography>
            {message && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )}
            {profile && (
                <Box>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong sx={{fontWeight:'bold' , color:'#111E56'}}>Username:</strong> {profile.username}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong sx={{fontWeight:'bold' , color:'#111E56'}}>Email:</strong> {profile.email}
                    </Typography>
                    <Button
                                        onClick={handleDelete}
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
                </Box>
            )}
        </Card>
        </>
    );
    

    const renderHistoricalPlaces = () => (
        <Box>
            <Typography variant="h5" color="primary" gutterBottom sx={{fontWeight:'bold' , color:'#111E56'}}>
                My Historical Places
            </Typography>
            {historicalPlaces.length > 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                        justifyContent: 'center',
                    }}
                >
                    {historicalPlaces.map((place) => (
                        <Card
                            key={place._id}
                            sx={{
                                p: 2,
                                width: '300px',
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                                borderRadius: '12px',
                                marginTop: '20px',
                                '&:hover': {
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                                    transform: 'scale(1.02)',
                                    transition: 'transform 0.2s ease-in-out',
                                },
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6">{place.Name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {place.Description}
                                </Typography>
                                
                                    <Box sx={{ display: 'flex', gap: 1 , alignItems:'center',marginTop:'15px' , marginBottom:'-15px'}}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => setEditingPlaceId(place._id)}
                                            sx={{
                                                backgroundColor: '#111E56',
                                                color: 'white',
                                                borderRadius: '50%',
                                                marginLeft: '90px',
                                                border: '2px solid #111E56',
                                                '&:hover': {
                                                    backgroundColor: 'white',
                                                    color: '#111E56',
                                                    border: '2px solid #111E56',
                                                },
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(place._id)}
                                            sx={{
                                                backgroundColor: '#FF5A5A',
                                                color: 'white',
                                                borderRadius: '50%',
                                                '&:hover': {
                                                    backgroundColor: 'white',
                                                    color: '#FF5A5A',
                                                    border: '1px solid #FF5A5A',
                                                },
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            ) : (
                <Typography>No historical places found</Typography>
            )}
        </Box>
    );

    const renderContent = () => {
        switch (activeComponent) {
            case 'profile':
                return renderProfile();
            case 'viewHistoricalPlaces':
                return renderHistoricalPlaces();
            case 'createHistoricalPlaces':
                return <CreateHistoricalPlace />;
            case 'updateProfile':
                return (
                    <UpdateTouristGovernorProfile
                        profile={profile}
                        setProfile={setProfile}
                    />
                );
            default:
                return <Typography variant="h6">Welcome to the Dashboard</Typography>;
        }
    };

    return (
        <Box>
            <GuestNavbar toggleSidebar={toggleSidebar} />
            <Box
                sx={{
                    display: 'flex',
                    minHeight: '100vh',
                }}
            >
                {/* Sidebar */}
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
                        { label: 'View Historical Places', section: 'viewHistoricalPlaces' },
                        { label: 'Create Historical Places', section: 'createHistoricalPlaces' },
                        { label: 'Update Profile', section: 'updateProfile' },
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

                {/* Main Content */}
                <Box
                    sx={{
                        ml: isSidebarOpen ? '260px' : '0',
                        p: 3,
                        width: isSidebarOpen ? 'calc(100% - 260px)' : '100%',
                        transition: 'margin-left 0.3s ease',
                    }}
                >
                    {renderContent()}
                </Box>
            </Box>
        </Box>
    );
};

export default TouristGovernorDashboard;
