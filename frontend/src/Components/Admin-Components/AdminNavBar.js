import React, { useState, useEffect } from 'react';
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
import MenuIcon from '@mui/icons-material/Menu';
// import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import EditNoteIcon from '@mui/icons-material/EditNote'; // New icon
import axios from 'axios';
import logo from '../../Misc/logo.png';
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';

const AdminNavBar = ({ toggleSidebar , handleSectionChange }) => {
    const [notifications, setNotifications] = useState([]);
    const [isNotificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
    const navigate = useNavigate();

    // const handleLogout = () => {
    //     localStorage.removeItem('token');
    //     navigate('/');
    // };

    const fetchNotifications = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('/admins/notifications', {
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
        <Box sx={{ width: 350, padding: 2, backgroundColor: '#f9f9f9', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 'bold',
                        color: '#0D164A', // Darker blue
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
            {notifications.length === 0 ? (
                <Typography>No notifications available</Typography>
            ) : (
                <List sx={{ padding: 0 }}>
                    {notifications.map((notification, index) => (
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
                                transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
                                marginBottom: index === notifications.length - 1 ? '500px' : '8px',
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
        <AppBar position="sticky" sx={{ backgroundColor: '#111E56', zIndex: 1000 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={toggleSidebar} sx={{ color: 'white' }}>
                    <MenuIcon />
                </IconButton>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                    onClick={() => navigate('/')}
                >
                    <img src={logo} alt="Admin Logo" style={{ height: '50px' }} />
                </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    
                <Tooltip title="Profile" arrow>
    <IconButton
        sx={{
            color: 'white',
        }}
        onClick={() => handleSectionChange('home')} // Navigate or trigger profile component
    >
        <AccountCircle />
    </IconButton>
</Tooltip>
                    <Tooltip title="Notifications">
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
                    </Tooltip>
                    {/* <Tooltip title="Logout">
                        <IconButton
                            onClick={handleLogout}
                            sx={{
                                color: 'white',
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.2) translateY(2.5px)',
                                },
                            }}
                        >
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip> */}
                </Box>
            </Toolbar>
            <Drawer anchor="right" open={isNotificationDrawerOpen} onClose={() => toggleNotificationDrawer(false)}>
                {renderNotifications()}
            </Drawer>
        </AppBar>
    );
};

export default AdminNavBar;
