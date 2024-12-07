import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, 
    Typography, 
    Drawer, 
    IconButton ,
     Button ,
     Avatar,
      CircularProgress,
      Card,
    CardContent,  
    CardMedia, 
    Alert,
    List, 
    ListItem, 
    ListItemButton, 
    ListItemText,  } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import TouristNavbar from '../MainPage-Components/GuestNavbar';
import UpdateProfile from './UpdateProfile';
import AddPhoto from './AddPhoto';
import SalesReport from './TourGuideSalesReport';
import ViewMyItineraries from './ViewMyItineraries';
import CreateItineraryForm from './CreateItineraryForm';
import ItinerarySummary from './ItinerarySummary';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import ArrowBackIcon

import logo2 from '../../Misc/logo.png';
import { Container, Stack , Link} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import {
    AccountCircle,
    AddLocation,
    Edit,
    Description,
    PictureAsPdf,
    InsertChart,
  } from '@mui/icons-material';

import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Divider from '@mui/material/Divider';

import GuideActivity from '../MainPage-Components/CommonActivity';
import GuideItinerary from '../MainPage-Components/CommonItinerary';
import GuideHistoricalPlaces from '../MainPage-Components/CommonHistoricalPlaces';

const TourGuideDashboard = () => {
    const [profile, setProfile] = useState({});
    const [message, setMessage] = useState('');
    const [activeComponent, setActiveComponent] = useState('profile');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [navigationStack, setNavigationStack] = useState([]); // Stack to keep track of navigation history
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar visibility state
    const [updateProfileVisible, setUpdateProfileVisible] = useState(false);


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

    const stringAvatar = (name) => {
        const initials = name.split(' ').map((n) => n[0]).join('');
        return { children: initials.toUpperCase() };
    };


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


    const renderContent = () => {
        switch (activeComponent) {
            case 'profile':
                return (
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
                          <p>
                            <strong>Years of Experience:</strong> {profile.yearsOfExperience}
                          </p>
                          <p>
                            <strong>Mobile Number:</strong> {profile.mobileNumber}
                          </p>
                          <p>
                            <strong>Previous Work:</strong> {profile.previousWork}
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
                        {updateProfileVisible && (
                          <Box
                            sx={{
                              marginTop: '20px',
                              width: '100%',
                              padding: '20px',
                              borderRadius: '8px',
                      
                            }}
                          >
                            <UpdateProfile profile={profile} setProfile={setProfile} />
                          </Box>
                        )}
                      </>
                    ) : (
                      <CircularProgress sx={{ color: '#111E56' }} />
                    )}
                  </Box>
              
                );
            case 'viewActivities':
                return <ViewMyItineraries />;
            case 'createActivity':
                return <CreateItineraryForm />;
            // case 'updateProfile':
            //     return <UpdateProfile profile={profile} setProfile={setProfile} />;
            case 'uploadProfilePicture':
                return <AddPhoto setProfile={setProfile} />;
            case 'salesReport':
                return <SalesReport />;
            case 'ItinerarySummary':
                return <ItinerarySummary />;
                case 'Activity' :
                  return <GuideActivity />;
    
                case 'Itinerary' :
                  return <GuideItinerary />;
    
                case 'historical-places' :
                  return <GuideHistoricalPlaces />;
            default:
                return <Typography variant="h6">Welcome to the Dashboard</Typography>;
        }
    };


    const menuItems = [
        { label: 'View Itineraries', section: 'viewActivities', icon: <Description /> },
        { label: 'Create Itinerary', section: 'createActivity', icon: <AddLocation /> },
       // { label: 'Update Profile', section: 'updateProfile', icon: <Edit /> },
        { label: 'Upload Profile Picture', section: 'uploadProfilePicture', icon: <AccountCircle /> },
        { label: 'Sales Report', section: 'salesReport', icon: <InsertChart /> },
        { label: 'Itinerary Summary', section: 'ItinerarySummary', icon: <PictureAsPdf /> },
      ];


    return (
        <Box>
    <TouristNavbar toggleSidebar={toggleSidebar} setActiveComponent={setActiveComponent} />
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
        <List>
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
      <AccountCircle />
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
          {menuItems.map((item) => (
            <Tooltip
            title={!isSidebarOpen ? item.label : ''} // Show tooltip only when collapsed
            arrow
            placement="right"
            key={item.component}
        >
              <Button
                    startIcon={item.icon} // Always display the icon
                    sx={{
                        color: 'white',
                        justifyContent: 'flex-start', // Align buttons to the left
                        alignItems: 'center', // Ensure vertical centering
                        width: '100%', // Ensure button width matches sidebar width
                        padding: isSidebarOpen ? '10px 20px 10px 15px' : '10px 0 10px 10px', // Adjust padding for collapsed state
                        marginTop: '10px',
                        display: 'flex',
                        gap: isSidebarOpen ? 2 : 0, // Space between icon and text in expanded state
                        textAlign: 'left', // Align text properly
                        backgroundColor: activeComponent === item.section ? '#7BAFD0' : 'transparent',
                        borderLeft: activeComponent === item.section ? '6px solid #FFFFFF' : '6px solid transparent', // Highlight active state
                        transition: 'background-color 0.3s ease, border 0.3s ease', // Remove scaling
                        '&:hover': {
                            backgroundColor: '#7BAFD0', // Change color on hover
                        },
                    }}
                    onClick={() => handleSectionChange(item.section)}
                >
                    {isSidebarOpen ? item.label : null} {/* Show label only when expanded */}
                </Button>
            </Tooltip>
          ))}

        </List>
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

        {/* Main Content Area */}
        <Box
            sx={{
                padding: '20px',
                marginLeft: isSidebarOpen ? '250px' : '55px', // Adjust content margin when sidebar is open
                width: '100%',
                transition: 'margin-left 0.3s ease-in-out',
                marginTop: '64px', // Space for navbar
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

export default TourGuideDashboard;
