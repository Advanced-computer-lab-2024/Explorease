import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Box,
    IconButton,
    Badge,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Typography,
    Tooltip,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import EditNoteIcon from '@mui/icons-material/EditNote';
import axios from 'axios';
import logo from '../../Misc/logo.png';
import PersonIcon from '@mui/icons-material/Person'; // Import Person icon for profile
import HomeIcon from '@mui/icons-material/Home';
import {useNavigate} from 'react-router-dom'

const Navbar = ({ toggleSidebar , setActiveComponent }) => {
    const [notifications, setNotifications] = useState([]);
    const [isNotificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
    const navigate = useNavigate(); // Hook for navigation

    const linkContainerStyle = {
        display: 'flex',
        gap: '20px',
        marginLeft: 'auto',
    };


    const logoStyle = {
        height: '50px',
        marginLeft: '-10px',
    };

    const roleEndpoints = {
        seller: '/seller/notifications',
        advertiser: '/advertiser/notifications',
        tourGuide: '/tourguide/notifications',
        touristGovernor: '/governor/notifications',
    };

    const fetchNotifications = async () => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const endpoint = roleEndpoints[role];

        if (!endpoint) {
            console.error('No endpoint found for this role');
            return;
        }

        try {
            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const toggleNotificationDrawer = (open) => {
        setNotificationDrawerOpen(open);
    };

    const linkStyle = {
        color: 'white',
        textDecoration: 'none',
        fontSize: '18px',
        fontWeight: 'bold',
        position: 'relative',
        display: 'inline-block',
        '&::after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '2px',
            backgroundColor: 'white',
            bottom: '-2px',
            left: '0',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.3s ease-in-out',
        },
        '&:hover::after': {
            transform: 'scaleX(1)',
        },
    };
    // const linkContainerStyle = {
    //     display: 'flex',          // Flexbox layout to line items horizontally
    //     gap: '20px',              // Space between each button
    //     alignItems: 'center',     // Vertically align the items (optional, if needed)
    //     marginLeft: 'auto',       // This ensures the links are aligned to the right side (optional)
    // };
    
    const markNotificationAsRead = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`/notifications/${id}`, { isRead: true }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications((prevNotifications) =>
                prevNotifications.map((notif) =>
                    notif._id === id ? { ...notif, isRead: true } : notif
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const renderNotifications = () => (
        <Box sx={{ width: 350, padding: 2, backgroundColor: '#f9f9f9' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 'bold',
                        color: '#0D164A',
                        fontSize: '20px',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -2,
                            left: 0,
                            width: '100%',
                            height: '2px',
                            backgroundColor: '#0D164A',
                            transform: 'scaleX(0)',
                            transformOrigin: 'left',
                            transition: 'transform 0.3s ease-in-out',
                        },
                        '&:hover::after': {
                            transform: 'scaleX(1)',
                        },
                    }}
                >
                    Notifications
                </Typography>
                <IconButton onClick={() => toggleNotificationDrawer(false)} sx={{ color: '#111E56' }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            {/* Notifications List */}
            {notifications.length === 0 ? (
                <Typography>No notifications available</Typography>
            ) : (
                <List sx={{ padding: 0 }}>
                    {notifications.map((notification) => (
                        <ListItem
                            key={notification._id}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: notification.isRead ? '#f0f0f0' : '#e8f4ff',
                                borderRadius: '8px',
                                padding: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                marginBottom: '8px',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    backgroundColor: '#edf7ff',
                                },
                            }}
                        >
                            <Tooltip title="Mark as Read" arrow>
                                <IconButton
                                    onClick={() => markNotificationAsRead(notification._id)}
                                    sx={{
                                        backgroundColor: '#d3d3d3',
                                        color: 'black',
                                        '&:hover': {
                                            backgroundColor: '#b0b0b0',
                                        },
                                    }}
                                >
                                    <EditNoteIcon />
                                </IconButton>
                            </Tooltip>
                            <ListItemText
                                primary={notification.message}
                                secondary={new Date(notification.createdAt).toLocaleString()}
                                sx={{ marginLeft: 2 }}
                            />
                        </ListItem>
                        
                    ))}
                </List>
            )}
        </Box>
    );

    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#111E56', zIndex: 1000, fontFamily: 'Poppins, sans-serif' }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box
    sx={{
        display: 'flex',       // Set the parent container as a flex container
        alignItems: 'center',  // Vertically center-align items
        gap: 2,                // Add spacing between items (you can adjust the value)
    }}
>
    
    {/* Sidebar Toggle Icon */}
    <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ marginRight: '16px' }}
        onClick={toggleSidebar} // Call the toggleSidebar function passed as a prop
    >
        <MenuIcon />
    </IconButton>
    

    {/* Clickable Logo */}
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/">
            <img src={logo} alt="Logo" style={{ height: '50px', marginLeft: '-10px' }} />
        </Link>
    </Box>
    <Box sx={linkContainerStyle}> {/* Ensure this Box wraps all the links */}
    <Typography
        sx={linkStyle}
        onClick={() => setActiveComponent('Activity')}
    >
        Activities
    </Typography>                        
    <Typography
        sx={linkStyle}
        onClick={() => setActiveComponent('Itinerary')}
    >
        Itineraries
    </Typography>

    <Typography
        sx={linkStyle}
        onClick={() => setActiveComponent('historical-places')}
    >
        Historical Places
    </Typography>
</Box>

    
</Box>


                
                

                {/* Notification Icon */}
                <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                <Tooltip title="Profile" arrow>
    <IconButton
        sx={{
            color: 'white',
        }}
        onClick={() => setActiveComponent('home')} // Navigate or trigger profile component
    >
        <HomeIcon />
    </IconButton>
    
</Tooltip>

                    <IconButton sx={{ color: 'white' }} onClick={() => toggleNotificationDrawer(true)}>
                        <Badge
                            badgeContent={notifications.filter((notif) => !notif.isRead).length}
                            color="error"
                            sx={{
                                '& .MuiBadge-badge': {
                                    backgroundColor: '#FF0000',
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                },
                            }}
                        >
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    
                </Box>
            </Toolbar>
            

            {/* Notification Drawer */}
            <Drawer anchor="right" open={isNotificationDrawerOpen} onClose={() => toggleNotificationDrawer(false)}>
                {renderNotifications()}
            </Drawer>
        </AppBar>
    );
};



export default Navbar;
