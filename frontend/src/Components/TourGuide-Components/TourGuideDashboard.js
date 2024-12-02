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
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TouristNavbar from '../MainPage-Components/GuestNavbar';
import UpdateProfile from './UpdateProfile';
import AddPhoto from './AddPhoto';
import SalesReport from './TourGuideSalesReport';
import ViewMyItineraries from './ViewMyItineraries';
import CreateItineraryForm from './CreateItineraryForm';
import ItinerarySummary from './ItinerarySummary';

const TourGuideDashboard = () => {
    const [profile, setProfile] = useState({});
    const [message, setMessage] = useState('');
    const [activeComponent, setActiveComponent] = useState('profile');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar visibility state

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('/tourguide/myProfile', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data && response.data.tourguide) {
                    setProfile(response.data.tourguide);
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
                    '/tourguide/deleteTourGuideRequest',
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
                            Tour Guide Profile
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
                                        alt="Profile Picture"
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: '50%',
                                            margin: '0 auto 16px',
                                        }}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{fontWeight:'bold' , color:'#111E56'}}>
                                        Username:
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {profile.username}
                                    </Typography>

                                    <Typography variant="h6" gutterBottom sx={{fontWeight:'bold' , color:'#111E56'}}>
                                        Email:
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {profile.email}
                                    </Typography>

                                    <Typography variant="h6" gutterBottom sx={{fontWeight:'bold' , color:'#111E56'}}>
                                        Years of Experience:
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {profile.yearsOfExperience}
                                    </Typography>

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
                                </CardContent>
                            </Card>
                        ) : (
                            <Typography align="center" variant="body1">
                                Loading profile...
                            </Typography>
                        )}
                    </>
                );
            case 'viewActivities':
                return <ViewMyItineraries />;
            case 'createActivity':
                return <CreateItineraryForm />;
            case 'updateProfile':
                return <UpdateProfile profile={profile} setProfile={setProfile} />;
            case 'uploadProfilePicture':
                return <AddPhoto setProfile={setProfile} />;
            case 'salesReport':
                return <SalesReport />;
            case 'ItinerarySummary':
                return <ItinerarySummary />;
            default:
                return <Typography variant="h6">Welcome to the Dashboard</Typography>;
        }
    };

    return (
        <Box>
    <TouristNavbar toggleSidebar={toggleSidebar} />
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
                height: 'calc(100vh - 64px)',
                position: 'fixed',
                top: '64px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
                <List>
                    {[
                        { label: 'View Profile', section: 'profile' },
                        { label: 'View Itineraries', section: 'viewActivities' },
                        { label: 'Create Itinerary', section: 'createActivity' },
                        { label: 'Update Profile', section: 'updateProfile' },
                        { label: 'Upload Profile Picture', section: 'uploadProfilePicture' },
                        { label: 'Sales Report', section: 'salesReport' },
                        { label : 'Itinerary Summary', section : 'ItinerarySummary'}
                    ].map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    setActiveComponent(item.section);
                                }}
                                sx={{
                                    color: 'white',
                                    textAlign: 'left',
                                    justifyContent: 'flex-start',
                                    borderRadius: '8px',
                                    width: '100%',
                                    padding: '10px',
                                    marginTop: '10px',
                                    height: '70%',
                                    backgroundColor: activeComponent === item.section ? '#7BAFD0' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: '#7BAFD0',
                                        transform: 'scale(1.01)',
                                    },
                                }}
                            >
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        )}

        {/* Main Content Area */}
        <Box
            sx={{
                padding: '20px',
                marginLeft: isSidebarOpen ? '250px' : '0', // Adjust content margin when sidebar is open
                width: '100%',
                transition: 'margin-left 0.3s ease-in-out',
                marginTop: '64px', // Space for navbar
            }}
        >
            {renderContent()}
        </Box>
    </Box>
</Box>

    );
};

export default TourGuideDashboard;
