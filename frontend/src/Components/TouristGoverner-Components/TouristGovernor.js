import AccountCircle from '@mui/icons-material/AccountCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import ArrowBackIcon
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Link,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo2 from '../../Misc/logo.png';
import GuestNavbar from '../MainPage-Components/GuestNavbar';
import CreateHistoricalPlace from './CreateHistoricalPlace';
import UpdateTouristGovernorProfile from './UpdateTouristGovernor';

import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

import heroBackground from '../../Misc/heroBackground.jpg';

import {
  AddLocation,
  LocationOn, // For View Historical Places
} from '@mui/icons-material';

import GovernorActivity from '../MainPage-Components/CommonActivity';
import GovernorHistoricalPlaces from '../MainPage-Components/CommonHistoricalPlaces';
import GovernorItinerary from '../MainPage-Components/CommonItinerary';
  
const TouristGovernorDashboard = () => {
    const [profile, setProfile] = useState({});
    const [historicalPlaces, setHistoricalPlaces] = useState([]);
    const [message, setMessage] = useState('');
    const [activeComponent, setActiveComponent] = useState('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [editingPlaceId, setEditingPlaceId] = useState(null);
    const [navigationStack, setNavigationStack] = useState([]); // Stack to keep track of navigation history
    const [updateProfileVisible, setUpdateProfileVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingPlace, setEditingPlace] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const stringAvatar = (name) => {
        const initials = name.split(' ').map((n) => n[0]).join('');
        return { children: initials.toUpperCase() };
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
        fetchProfile();
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
     
<Box

                    sx={{
                      marginTop: '50px',
                      width: '450px',
                      borderRadius: '16px',
                      backgroundColor: 'white',
                      margin: '30px auto',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
                      },
                    }}
                  >
              
              
                    {message && (
                      <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                        {message}
                      </Alert>
                    )}

              
                    {profile && profile.username ? (
                      <>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '20px',
                            width: '100%',
                          }}
                        >
                          {profile.imageUrl ? (
                            <Avatar
                              src={profile.imageUrl}
                              alt="Profile Picture"
                              sx={{
                                width: 60,
                                height: 60,
                                marginRight: '15px',
                              }}
                            />
                          ) : (
                            <Avatar
                              {...stringAvatar(profile.username || 'User')}
                              sx={{
                                width: 60,
                                height: 60,
                                marginRight: '15px',
                                backgroundColor: '#111E56',
                                color: '#fff',
                                fontSize: '20px',
                                fontWeight: 'bold',
                              }}
                            />
                          )}
                          
                          <Box sx={{ flexGrow: 1, textAlign: 'left' }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 'bold',
                                color: '#111E56',
                              }}
                            >
                              {profile.username || 'Your Name'}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#888',
                              }}
                            >
                              {profile.email || 'yourname@gmail.com'}
                            </Typography>
                          </Box>
                          <Tooltip title="Edit Profile" arrow>
                            <IconButton
                              onClick={() => setUpdateProfileVisible(!updateProfileVisible)}
                              sx={{
                                color: '#111E56',
                                '&:hover': { color: '#111E60' },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box
                          component="div"
                          sx={{
                            fontSize: '16px',
                            lineHeight: '1.8',
                            width: '100%',
                            textAlign: 'center',
                            '& strong': {
                              color: '#111E56',
                              fontWeight: 'bold',
                            },
                          }}
                        >
                   
                        </Box>
                        <Button
                          onClick={handleDelete}
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
                        {updateProfileVisible && (
                          <Box
                            sx={{
                              marginTop: '20px',
                              width: '100%',
                              padding: '20px',
                              borderRadius: '8px',
                      
                            }}
                          >
                            <UpdateTouristGovernorProfile
                        profile={profile}
                        setProfile={setProfile}
                    />
                          </Box>
                        )}
                      </>
                    ) : (
                      <CircularProgress sx={{ color: '#111E56' }} />
                    )}
                  </Box>




    );
    

    const handleEdit = (place) => {
      setEditingPlace(place); // Directly set the full object
      setEditMode(true);
  };
  

    const handleUpdate = async (updatedPlace) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`/governor/updateHistoricalPlace/${updatedPlace._id}`, updatedPlace, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEditMode(false);
            setEditingPlace(null);
            fetchHistoricalPlaces(); // Refresh the list
        } catch (error) {
            setMessage('Error updating historical place');
        }
    };

    const handleDeletePlace = async (placeId) => {
      if (!window.confirm('Are you sure you want to delete this historical place?')) {
          return;
      }

      const token = localStorage.getItem('token');
      try {
          await axios.delete(`/governor/deleteHistoricalPlace/${placeId}`, {
              headers: { Authorization: `Bearer ${token}` },
          });
          fetchHistoricalPlaces();
          setMessage('Historical place deleted successfully');
      } catch (error) {
          setMessage('Error deleting historical place');
      }

  };
  const renderHistoricalPlaces = () => (
    <Box>
        <Typography
            variant="h5"
            color="primary"
            gutterBottom
            sx={{ fontWeight: 'bold', color: '#111E56' }}
        >
            My Historical Places
        </Typography>
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
            </Box>
        ) : historicalPlaces.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                {historicalPlaces.map((place) => (
                    <Card
                        key={place._id}
                        sx={{
                            display: 'flex',
                            width: '85%',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            '&:hover': {
                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                                transform: 'scale(1.02)',
                                transition: 'transform 0.2s ease-in-out',
                            },
                        }}
                    >
                        <CardMedia
                            component="img"
                            image={place.imageUrl}
                            alt={place.Name || 'Historical Place Image'}
                            sx={{
                                width: '40%',
                                height: 'auto',
                                objectFit: 'cover',
                                borderTopLeftRadius: '12px',
                                borderBottomLeftRadius: '12px',
                            }}
                        />
                        <Box sx={{ flex: 1, padding: '16px' }}>
                            {editMode && editingPlace?._id === place._id ? (
                                // Edit Form
                                <>
                                    <TextField
                                        size="small"
                                        label="Name"
                                        value={editingPlace.Name}
                                        onChange={(e) => setEditingPlace({ ...editingPlace, Name: e.target.value })}
                                        sx={{ mb: 1, width: '100%' }}
                                    />
                                    <TextField
                                        size="small"
                                        label="Description"
                                        multiline
                                        rows={2}
                                        value={editingPlace.Description}
                                        onChange={(e) => setEditingPlace({ ...editingPlace, Description: e.target.value })}
                                        sx={{ mb: 1, width: '100%' }}
                                    />
                                    <TextField
                                        size="small"
                                        label="Location"
                                        value={editingPlace.Location}
                                        onChange={(e) => setEditingPlace({ ...editingPlace, Location: e.target.value })}
                                        sx={{ mb: 1, width: '100%' }}
                                    />
                                    <TextField
                                        size="small"
                                        label="Period"
                                        value={editingPlace.Period}
                                        onChange={(e) => setEditingPlace({ ...editingPlace, Period: e.target.value })}
                                        sx={{ mb: 1, width: '100%' }}
                                    />
                                    <TextField
                                        size="small"
                                        label="Tags"
                                        value={editingPlace.tags?.map((tag) => tag.name).join(', ') || ''}
                                        onChange={(e) => {
                                            const tags = e.target.value.split(',').map((tag) => ({ name: tag.trim() }));
                                            setEditingPlace({ ...editingPlace, tags });
                                        }}
                                        sx={{ mb: 1, width: '100%' }}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                                        <Button 
                                            size="small" 
                                            onClick={() => setEditMode(false)}
                                            sx={{ color: 'gray' }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            size="small" 
                                            onClick={() => handleUpdate(editingPlace)} 
                                            variant="contained"
                                        >
                                            Save
                                        </Button>
                                    </Box>
                                </>
                            ) : (
                                // Display View
                                <>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: '#111E56',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        {place.Name || 'Untitled'}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Description:</strong> {place.Description}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Location:</strong> {place.Location}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Period:</strong> {place.Period}
                                    </Typography>
                                    {place.tags && (
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            <strong>Tags:</strong> {place.tags.map((tag) => tag.name).join(', ')}
                                        </Typography>
                                    )}
                                    
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 1,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginTop: '10px',
                                        }}
                                    >
                                        <Tooltip title="Edit">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEdit(place)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeletePlace(place._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </>
                            )}
                        </Box>
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
          case 'home':
            return (
              <Box
              sx={{
                height: '90vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: 2,
                boxSizing: 'border-box',
                borderRadius: '8px',
                overflow: 'hidden', // Prevent content overflow during animation
                flexDirection: 'column', // Stack the text vertically
              }}
            >
              {/* Welcome Text */}
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                  textTransform: 'uppercase',
                  lineHeight: '1.2',
                  padding: '10px 20px',
                  position: 'relative',
                  animation: 'gradientShift 12s ease infinite, slideInFromLeft 1.5s ease-out',
                  background: 'linear-gradient(90deg, white, #111E56)',
                  backgroundSize: '400% 400%', // Makes the gradient larger for the animation effect
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  textShadow: `
                    
                    3px 3px 6px rgba(0, 0, 0, 0.3)
                  `, // Subtle shadow effect outside of the text
                }}
              >
                Welcome to your dashboard
              </Typography>
            
              {/* Advertiser Name */}
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                  textTransform: 'uppercase',
                  lineHeight: '1.2',
                  padding: '10px 20px',
                  position: 'relative',
                  animation: 'gradientShift 12s ease infinite, slideInFromRight 1.5s ease-out',
                  background: 'linear-gradient(90deg, white, #111E56)',
                  backgroundSize: '400% 400%', // Makes the gradient larger for the animation effect
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  textShadow: `
                    
                    3px 3px 6px rgba(0, 0, 0, 0.3)
                  `, // Subtle shadow effect outside of the text
                }}
              >
                {profile.username || 'User'}
              </Typography>
            
              {/* Keyframe Animations */}
              <style>
                {`
                  @keyframes slideInFromLeft {
                    0% {
                      transform: translateX(-100%);
                      opacity: 0;
                    }
                    100% {
                      transform: translateX(0);
                      opacity: 1;
                    }
                  }
                  @keyframes slideInFromRight {
                    0% {
                      transform: translateX(100%);
                      opacity: 0;
                    }
                    100% {
                      transform: translateX(0);
                      opacity: 1;
                    }
                  }
                  @keyframes gradientShift {
                    0% {
                      background-position: 0% 50%;
                    }
                    50% {
                      background-position: 100% 50%;
                    }
                    100% {
                      background-position: 0% 50%;
                    }
                  }
                `}
              </style>
            </Box>
                                    
            
          );
            case 'viewHistoricalPlaces':
                return renderHistoricalPlaces();
            case 'createHistoricalPlaces':
                return <CreateHistoricalPlace />;
            // case 'updateProfile':
            //     return (
            //         <UpdateTouristGovernorProfile
            //             profile={profile}
            //             setProfile={setProfile}
            //         />
            //     );
            case 'profile':
                return renderProfile();
                case 'Activity' :
                  return <GovernorActivity />;
    
                case 'Itinerary' :
                  return <GovernorItinerary />;
    
                case 'historical-places' :
                  return <GovernorHistoricalPlaces />;
            default:
                return <Typography variant="h6">Welcome to the Dashboard</Typography>;
        }
    };

    const guestMenuItems = [
        { label: 'View Historical Places', section: 'viewHistoricalPlaces', icon: <LocationOn /> },
        { label: 'Create Historical Places', section: 'createHistoricalPlaces', icon: <AddLocation /> },
      //  { label: 'Update Profile', section: 'updateProfile', icon: <Edit /> },
      ];
      
      return (
        <Box>
      {/* Conditional Background */}
      {activeComponent === 'home' && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            minHeight: '115vh',
            background: `url(${heroBackground}) no-repeat center center`,
            backgroundSize: 'cover',
            filter: 'blur(2px)',
            boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.2)',
            zIndex: -1,
          }}
        />
      )}
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

<Box >
  {isSidebarOpen ? (
    <Box sx={{marginLeft:'10px'}}>
    <Avatar
      {...stringAvatar(profile.username || 'User')}
      sx={{
        width: 60,
        height: 60,
        marginRight: '15px',
        backgroundColor: 'white',
        color: '#111E56',
        fontSize: '20px',
        fontWeight: 'bold',
        marginLeft:'70px'
      }}
    />
    <Typography
  variant="h6"
  sx={{
    fontWeight: 'bold',
    color: 'white',
    marginRight: '20px',
    marginTop: '10px',
    cursor: 'pointer',  // Adds a pointer cursor to indicate it's clickable
    transition: 'transform 0.3s ease',  // Smooth transition for scaling
    '&:hover': {
      transform: 'scale(1.1)',  // Scales up the text on hover
    }, // Adds a pointer cursor to indicate it's clickable
  }}
  onClick={() => handleSectionChange('profile')}
>
  View Profile
</Typography>

    <Divider sx={{backgroundColor:'white'}}/>
    </Box>
    
  ) : (
    <Tooltip
    title={!isSidebarOpen ? 'profile' : ''} // Tooltip for collapsed sidebar
    arrow
    placement="right"
    key={'profile'}
  >
    <Button
      sx={{
        color: 'white',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        padding: isSidebarOpen ? '10px 20px' : '10px 0 10px 10px',
        marginTop: '10px',
        display: 'flex',
        gap: isSidebarOpen ? 2 : 0,
        textAlign: 'left',
        backgroundColor: activeComponent === 'profile' ? '#7BAFD0' : 'transparent',
        borderLeft: activeComponent === 'profile' ? '6px solid #FFFFFF' : '6px solid transparent',
        transition: 'background-color 0.3s ease, border 0.3s ease',
        '&:hover': {
          backgroundColor: '#7BAFD0',
        },
      }}
      onClick={() => handleSectionChange('profile')}
    >
      <AccountCircle sx={{marginLeft:'-5px'}} />
    </Button>
  </Tooltip>
    // <IconButton
    // onClick={() => handleSectionChange('profile')} 
    //   sx={{
    //     color: 'white',
    //     '&:hover': { color: '#111E60' },
    //   }}
    // >
    //   <AccountCircle />
    // </IconButton>
  )}
</Box>

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
        startIcon={<SettingsIcon sx={{marginLeft:'5px'}} />} // Settings icon
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
        startIcon={<LogoutIcon sx={{marginLeft:'5px'}} />} // Logout icon
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
              backgroundColor: 'rgba(0, 0, 0, 0.1)', // Transparent gray
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
