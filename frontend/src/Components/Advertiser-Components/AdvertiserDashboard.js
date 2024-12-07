import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdvertiserNavbar from '../MainPage-Components/GuestNavbar'; // Assuming a similar Navbar exists
import UpdateAdvertiser from './UpdateAdvertiser';
import MyActivities from './MyActivities';
import CreateActivity from './CreateActivity';
import UploadLogo from './UploadLogo';
import SalesReport from './AdvertiserSalesReport';
import ActivitySummary from './ActivitySummary';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import ArrowBackIcon
import MenuIcon from '@mui/icons-material/Menu';
import { Edit, Event, Dashboard, Upload, BarChart, Report   } from '@mui/icons-material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Divider } from '@mui/material';
import { Box, Typography, Drawer, IconButton , Button ,Avatar,Tooltip, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import logo2 from '../../Misc/logo.png';
import { Container, Stack , Link} from '@mui/material';

import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

import { useNavigate } from 'react-router-dom';
import AdvertiserActivity from '../MainPage-Components/CommonActivity';
import AdvertiserItinerary from '../MainPage-Components/CommonItinerary';
import AdvertiserHistoricalPlaces from '../MainPage-Components/CommonHistoricalPlaces';


const AdvertiserDashboard = () => {
    const [profile, setProfile] = useState({});
    const [message, setMessage] = useState('');
    const [activeComponent, setActiveComponent] = useState('profile');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [navigationStack, setNavigationStack] = useState([]); // Stack to keep track of navigation history

    const [updateProfileVisible, setUpdateProfileVisible] = useState(false);
    const navigate = useNavigate();

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

    const stringAvatar = (name) => {
        const initials = name.split(' ').map((n) => n[0]).join('');
        return { children: initials.toUpperCase() };
    };


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
                      <Typography
                        color="error"
                        sx={{
                          marginBottom: '10px',
                          fontWeight: 'bold',
                          width: '100%',
                          textAlign: 'center',
                        }}
                      >
                        {message}
                      </Typography>
                    )}
                    {profile.username ? (
                      <>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '20px',
                            width: '100%',
                          }}
                        >
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
                        {updateProfileVisible && (
                          <Box
                            sx={{
                              marginTop: '20px',
                              width: '100%',
                              padding: '20px',
                              borderRadius: '8px',
                           
                            }}
                          >
                            <UpdateAdvertiser profile={profile} setProfile={setProfile} />
                          </Box>
                        )}
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
            // case 'updateProfile':
            //     return <UpdateAdvertiser profile={profile} setProfile={setProfile} />;
            case 'uploadLogo':
                return <UploadLogo setProfile={setProfile} />;
            case 'Sales Report':
                return <SalesReport/>;
            case 'ActivitySummary' :
                return <ActivitySummary />;
            case 'Activity' :
              return <AdvertiserActivity />;

            case 'Itinerary' :
              return <AdvertiserItinerary />;

            case 'historical-places' :
              return <AdvertiserHistoricalPlaces />;
            default:
                return <Typography variant="h4" align="center">Welcome to the Dashboard</Typography>;
        }
    };
    const menuItems = [
     //   { label: 'Edit Profile', component: 'updateProfile', icon: <Edit /> },
        { label: 'Get My Activities', component: 'viewActivities', icon: <Event /> },
        { label: 'Create Activity', component: 'createActivity', icon: <Dashboard /> },
        { label: 'Upload a Logo', component: 'uploadLogo', icon: <Upload /> },
        { label: 'Sales Report', component: 'Sales Report', icon: <BarChart /> },
        { label: 'Activity Summary', component: 'ActivitySummary', icon: <Report /> },
    ];
    return (
        <div >
            {/* Navbar */}
            <AdvertiserNavbar toggleSidebar={toggleSidebar} setActiveComponent={setActiveComponent} />
            <Box sx={{ display: 'flex' , minHeight: '100vh', }}>
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
    <nav>
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
                        backgroundColor: activeComponent === item.component ? '#7BAFD0' : 'transparent',
                        borderLeft: activeComponent === item.component ? '6px solid #FFFFFF' : '6px solid transparent', // Highlight active state
                        transition: 'background-color 0.3s ease, border 0.3s ease', // Remove scaling
                        '&:hover': {
                            backgroundColor: '#7BAFD0', // Change color on hover
                        },
                    }}
                    onClick={() => handleSectionChange(item.component)}
                >
                    {isSidebarOpen ? item.label : null} {/* Show label only when expanded */}
                </Button>
            </Tooltip>
        ))}
    </nav>
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
        marginLeft: isSidebarOpen ? '250px' : '55px',
        transition: 'margin-left 0.3s ease',
        padding: '20px',
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

        </div>
    );
};

export default AdvertiserDashboard;
