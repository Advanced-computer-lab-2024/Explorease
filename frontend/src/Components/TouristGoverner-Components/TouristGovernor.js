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
    Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import GuestNavbar from '../MainPage-Components/GuestNavbar';
import CreateHistoricalPlace from './CreateHistoricalPlace';
import UpdateTouristGovernorProfile from './UpdateTouristGovernor';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import ArrowBackIcon
import updateProfile from './UpdateTouristGovernor';
import logo2 from '../../Misc/logo.png';
import { Container, Stack , Link} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';


import {
    AccountCircle,     // For Profile
    LocationOn,        // For View Historical Places
    AddLocation,       // For Create Historical Places
    Edit,              // For Update Profile // For Back Navigation
  } from '@mui/icons-material';
  
const TouristGovernorDashboard = () => {
    const [profile, setProfile] = useState({});
    const [historicalPlaces, setHistoricalPlaces] = useState([]);
    const [message, setMessage] = useState('');
    const [activeComponent, setActiveComponent] = useState('profile');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [editingPlaceId, setEditingPlaceId] = useState(null);
    const [navigationStack, setNavigationStack] = useState([]); // Stack to keep track of navigation history
    
    const navigate = useNavigate();
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

    const handleSectionChange = (section) => {
        setNavigationStack((prevStack) => [...prevStack, activeComponent]); // Push current section to stack
        setActiveComponent(section); // Set new section
    };
    
        // Function to handle Back button
        const handleBack = () => {
            if (navigationStack.length > 0) {
                const lastSection = navigationStack.pop(); // Get the last section
                setNavigationStack([...navigationStack]); // Update the stack
                setActiveComponent(lastSection); // Navigate to the last section
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
                My Profile
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
            case 'profile':
                return renderProfile();
            default:
                return <Typography variant="h6">Welcome to the Dashboard</Typography>;
        }
    };

    const guestMenuItems = [
        { label: 'View Historical Places', section: 'viewHistoricalPlaces', icon: <LocationOn /> },
        { label: 'Create Historical Places', section: 'createHistoricalPlaces', icon: <AddLocation /> },
        { label: 'Update Profile', section: 'updateProfile', icon: <Edit /> },
      ];
      
      return (
        <Box>
          {/* Navbar */}
          <GuestNavbar toggleSidebar={toggleSidebar} setActiveComponent={setActiveComponent} />
      
          <Box
            sx={{
              display: 'flex',
              minHeight: '100vh',
            }}
          >
            {/* Sidebar */}
            <Box
  sx={{
    width: isSidebarOpen ? '250px' : '70px', // Sidebar width
    backgroundColor: '#111E40',
    color: 'white',
    height: 'calc(100vh - 64px)', // Sidebar height less than navbar
    position: 'fixed',
    top: '64px', // Sidebar starts below navbar
    left: 0,
    padding: '10px',
    transition: 'width 0.3s ease', // Smooth transition for width
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    overflow: 'hidden', // Prevent overflow when collapsed
  }}
>
  {/* Menu Items */}
  {guestMenuItems.map((item, index) => (
    <Tooltip
      key={index}
      title={!isSidebarOpen ? item.label : ''} // Show tooltip only when sidebar is collapsed
      arrow
      placement="right"
    >
      <Button
        startIcon={item.icon} // Icon always displayed
        sx={{
          color: 'white',
          justifyContent: 'flex-start', // Align icons and text to the left
          alignItems: 'center', // Ensure vertical centering
          width: '100%', // Ensure the button width matches sidebar width
          padding: isSidebarOpen ? '10px 20px 10px 15px' : '10px 0 10px 10px', // Adjust padding for open/collapsed states
          marginTop: '10px',
          display: 'flex',
          gap: isSidebarOpen ? 2 : 0, // Add gap between icon and label only when open
          textAlign: 'left', // Align text properly
          backgroundColor: activeComponent === item.section ? '#7BAFD0' : 'transparent', // Highlight active item
          borderLeft: activeComponent === item.section ? '6px solid #FFFFFF' : '6px solid transparent', // Border for active state
          transition: 'background-color 0.3s ease, border 0.3s ease', // Smooth transitions
          '&:hover': {
            backgroundColor: '#7BAFD0', // Change color on hover
          },
        }}
        onClick={() => handleSectionChange(item.section)}
      >
        {isSidebarOpen ? item.label : null} {/* Show label only when sidebar is open */}
      </Button>
    </Tooltip>
  ))}

  {/* Bottom Buttons */}
  <Box sx={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
    {/* Settings Button */}
    <Tooltip title="Settings" arrow placement="right">
      <Button
        startIcon={<SettingsIcon />} // Settings icon
        sx={{
          color: 'white',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          padding: isSidebarOpen ? '10px 20px 10px 15px' : '10px 0 10px 10px',
          textAlign: 'left',
          '&:hover': { backgroundColor: '#7BAFD0' },
        }}
        onClick={() => handleSectionChange('settings')} // Set to navigate to the settings section
      >
        {isSidebarOpen ? 'Settings' : null}
      </Button>
    </Tooltip>

    {/* Logout Button */}
    <Tooltip title="Logout" arrow placement="right">
      <Button
        startIcon={<LogoutIcon />} // Logout icon
        sx={{
          color: 'white',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          padding: isSidebarOpen ? '10px 20px 10px 15px' : '10px 0 10px 10px',
          textAlign: 'left',
          '&:hover': { backgroundColor: '#7BAFD0' },
        }}
        onClick={() => {
          // Perform logout functionality
          localStorage.removeItem('token'); // Clear token
          navigate('/login'); // Navigate to login
        }}
      >
        {isSidebarOpen ? 'Logout' : null}
      </Button>
    </Tooltip>
  </Box>
</Box>
            {/* Main Content */}
            <Box
              sx={{
                ml: isSidebarOpen ? '250px' : '80px', // Adjust main content margin based on sidebar width
                p: 3,
                transition: 'margin-left 0.3s ease', // Smooth transition for content shifting
                width: '100%',
                flexGrow: 1 // Grow to fill available space
              }}
            >
      
    {navigationStack.length > 0 && (
        <Button
        onClick={handleBack}
        sx={{
            position: 'fixed',
            top: '80px',
            left: isSidebarOpen ? '270px' : '80px',
            backgroundColor: 'transparent',
            color: '#111E56',
            fontSize: '1rem',
            width:'45px',
            padding: '10px 20px',
            borderRadius: '35px',
            transition: 'left 0.3s ease, background-color 0.3s ease',
            '&:hover': {
                backgroundColor: '#e0e0e0',
                color: '#111E56',
            },
            zIndex: 1000,
        }}
    >
        <ArrowBackIcon
            sx={{
                fontSize: '2rem', // Explicitly setting the icon size
            }}
        />
    </Button>
    )}
                    {renderContent()}
                    
                </Box>
            </Box>
            <footer style={{
        backgroundColor: '#111E56',
        color: 'white',
        padding: '30px 0',
        marginLeft: isSidebarOpen ? '250px' : '70px', // Adjust margin-left with sidebar
        transition: 'margin-left 0.3s ease', // Smooth transition for margin-left
    }}>
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
                            <Link href="#" underline="hover" sx={{
            fontWeight: 'bold',
            position: 'relative',
            display: 'inline-block',
            '&::after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '2px',
            backgroundColor: '#111E56',
            bottom: '-2px',
            left: '0',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.3s ease-in-out',
        },
        '&:hover::after': {
            transform: 'scaleX(1)',
        },
    }}>
                                Terms & Conditions
                            </Link>
                            <Link href="#" underline="hover" sx={{
            fontWeight: 'bold',
            position: 'relative',
            display: 'inline-block',
            '&::after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '2px',
            backgroundColor: '#111E56',
            bottom: '-2px',
            left: '0',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.3s ease-in-out',
        },
        '&:hover::after': {
            transform: 'scaleX(1)',
        },
    }}>
                                Privacy Policy
                            </Link>
                            <Link href="#" underline="hover" sx={{
            fontWeight: 'bold',
            position: 'relative',
            display: 'inline-block',
            '&::after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '2px',
            backgroundColor: '#111E56',
            bottom: '-2px',
            left: '0',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.3s ease-in-out',
        },
        '&:hover::after': {
            transform: 'scaleX(1)',
        },
    }}>
                                Contact Us
                            </Link>
                        </Stack>
                    </Stack>
                </Container>
            </footer>
        </Box>
    );
};

export default TouristGovernorDashboard;
