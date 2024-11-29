import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, IconButton, Typography, Popover, MenuItem, Badge, Drawer, List, ListItem, ListItemText } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import StoreIcon from '@mui/icons-material/Store';
import FavoriteIcon from '@mui/icons-material/Favorite';
import logo from '../../Misc/logo.png';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';

const TouristNavbar = ({ setActiveComponent, toggleSidebar, cartCount, wishlistCount }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]); // Store notifications
    const [isNotificationDrawerOpen, setNotificationDrawerOpen] = useState(false); // Manage drawer state

    const handleMouseEnter = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const linkContainerStyle = {
        display: 'flex',
        gap: '20px',
        marginLeft: 'auto',
    };

    const logoStyle = {
        height: '50px',
        marginLeft: '-10px',
    };

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem('token'); // Retrieve JWT token
            try {
                const response = await axios.get('/tourists/notifications', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNotifications(response.data); // Assuming API returns an array of notifications
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const toggleNotificationDrawer = (open) => {
        setNotificationDrawerOpen(open);
    };

    const markNotificationAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/notifications/${id}`, { isRead: true }, {
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
        <Box sx={{ width: 300, padding: 2 }}>
            <Typography variant="h6" gutterBottom>
                Notifications
            </Typography>
            {notifications.length === 0 ? (
                <Typography>No notifications available</Typography>
            ) : (
                <List>
                    {notifications.map((notification) => (
                        <ListItem
                            key={notification._id}
                            button
                            onClick={() => markNotificationAsRead(notification._id)}
                            sx={{
                                backgroundColor: notification.isRead ? '#f0f0f0' : '#e8f4ff',
                                marginBottom: 1,
                                borderRadius: '8px',
                            }}
                        >
                            <ListItemText
                                primary={notification.message}
                                secondary={new Date(notification.createdAt).toLocaleString()}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );

    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#111E56', zIndex: 1000, fontFamily: 'Poppins, sans-serif' }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginRight: '10px' }}>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar}>
                    <MenuIcon />
                </IconButton>
                {/* Clickable Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                    <Link to="/">
                        <img src={logo} alt="Logo" style={logoStyle} />
                    </Link>
                </Box>

                {/* Navigation Links */}
                <Box style={linkContainerStyle}>
                    <Box style={linkContainerStyle}>
                        <Link to="/activities" style={linkStyle}>View All Activities</Link>
                        <Link to="/itineraries" style={linkStyle}>View All Itineraries</Link>
                        <Link to="/historical-places" style={linkStyle}>View All Historical Places</Link>
                    </Box>

                    {/* Bookings Dropdown */}
                    <Box onMouseEnter={handleMouseEnter} sx={{ position: 'relative', cursor: 'pointer' }}>
                        <Typography sx={{ color: 'white', fontSize: '18px', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>Bookings</Typography>
                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handlePopoverClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            PaperProps={{
                                onMouseLeave: handlePopoverClose,
                            }}
                        >
                            <MenuItem onClick={() => { setActiveComponent('bookFlight'); handlePopoverClose(); }}>Book A Flight</MenuItem>
                            <MenuItem onClick={() => { setActiveComponent('bookHotel'); handlePopoverClose(); }}>Book A Hotel</MenuItem>
                            <MenuItem onClick={() => { setActiveComponent('bookActivity'); handlePopoverClose(); }}>Book An Activity</MenuItem>
                            <MenuItem onClick={() => { setActiveComponent('bookItinerary'); handlePopoverClose(); }}>Book An Itinerary</MenuItem>
                            <MenuItem onClick={() => { setActiveComponent('bookTransportation'); handlePopoverClose(); }}>Book A Transportation</MenuItem>
                        </Popover>
                    </Box>
                </Box>

                {/* Icon Buttons */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '20px' }}>
                    {/* Cart Icon */}
                    <Tooltip title="View Cart" arrow>
                        <IconButton sx={{ color: 'white' }} onClick={() => setActiveComponent('cart')}>
                            <Badge
                                badgeContent={cartCount} // Display cart count
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
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    {/* Wallet Icon */}
                    <Tooltip title="Wallet" arrow>
                        <IconButton sx={{ color: 'white' }} onClick={() => setActiveComponent('wallet')} aria-label="wallet">
                            <AccountBalanceWalletIcon />
                        </IconButton>
                    </Tooltip>

                    {/* Market Icon */}
                    <Tooltip title="Marketplace" arrow>
                        <IconButton sx={{ color: 'white' }} onClick={() => setActiveComponent('viewProducts')} aria-label="market">
                            <StoreIcon />
                        </IconButton>
                    </Tooltip>

                    {/* Wishlist Icon */}
                    <Tooltip title="Wishlist" arrow>
                        <IconButton sx={{ color: 'white' }} onClick={() => setActiveComponent('wishlist')} aria-label="wishlist">
                            <Badge
                                badgeContent={wishlistCount} // Display wishlist count
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
                                <FavoriteIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    {/* Notification Icon */}
                    <Tooltip title="Notifications" arrow>
                        <IconButton sx={{ color: 'white' }} onClick={() => toggleNotificationDrawer(true)}>
                            <Badge
                                badgeContent={notifications.filter((notif) => !notif.isRead).length} // Count unread notifications
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
                </Box>
            </Toolbar>

            {/* Notification Drawer */}
            <Drawer anchor="right" open={isNotificationDrawerOpen} onClose={() => toggleNotificationDrawer(false)}>
                {renderNotifications()}
            </Drawer>
        </AppBar>
    );
};

const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: 500,
    fontFamily: 'Poppins, sans-serif', // Set Poppins font
};

export default TouristNavbar;
