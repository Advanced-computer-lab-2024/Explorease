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

const Navbar = ({ toggleSidebar }) => {
    const [notifications, setNotifications] = useState([]);
    const [isNotificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

    const linkContainerStyle = {
        display: 'flex',
        gap: '20px',
        marginLeft: 'auto',
    };

    const linkStyle = {
        color: 'white',
        textDecoration: 'none',
        fontSize: '18px',
        fontWeight: 500,
        fontFamily: 'Poppins, sans-serif',
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
                        <img src={logo} alt="Logo" style={logoStyle} />
                    </Link>
                </Box>

                {/* Navigation Links */}
                <Box style={linkContainerStyle}>
                    <Link to="/activities" style={linkStyle}>View All Activities</Link>
                    <Link to="/itineraries" style={linkStyle}>View All Itineraries</Link>
                    <Link to="/historical-places" style={linkStyle}>View All Historical Places</Link>
                </Box>

                {/* Notification Icon */}
                <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
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
