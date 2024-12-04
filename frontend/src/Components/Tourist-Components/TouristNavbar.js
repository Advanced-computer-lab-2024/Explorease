import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Toolbar, Box, IconButton, Typography, Popover, MenuItem, Badge, Drawer, List, ListItem, ListItemText, FormControl, InputLabel, Select} from '@mui/material';
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
import CloseIcon from '@mui/icons-material/Close';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { CurrencyContext } from './CurrencyContext'; // Import the Currency Context
import { useNavigate } from 'react-router-dom'; // Ensure useNavigate is imported
import AccountCircle from '@mui/icons-material/AccountCircle';



const TouristNavbar = ({ handleSectionChange, toggleSidebar, cartCount, wishlistCount }) => {
    // const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]); // Store notifications
    const [isNotificationDrawerOpen, setNotificationDrawerOpen] = useState(false); // Manage drawer state
    const { selectedCurrency, setSelectedCurrency, availableCurrencies } = useContext(CurrencyContext);

    const navigate = useNavigate(); // Hook for navigation


    const handleCurrencyChange = (e) => {
        setSelectedCurrency(e.target.value);
    };

    // const handleMouseEnter = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };

    // const handlePopoverClose = () => {
    //     setAnchorEl(null);
    // };

    // const open = Boolean(anchorEl);

    // const linkContainerStyle = {
    //     display: 'flex',
    //     gap: '20px',
    //     marginLeft: 'auto',
    // };

    // const logoStyle = {
    //     height: '50px',
    //     marginLeft: '-10px',
    // };

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

//     const renderNotifications = () => (
//         <Box sx={{ width: 350, padding: 2, backgroundColor: '#f9f9f9' }}>
//             {/* Header */}
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
//             <Typography
//     variant="h6"
//     sx={{
//         color: 'white',
//         fontWeight: 'bold',
//         position: 'relative',
//         display: 'inline-block',
//         '&::after': {
//             content: '""',
//             position: 'absolute',
//             width: '100%',
//             height: '2px',
//             backgroundColor: 'white',
//             bottom: '-2px',
//             left: '0',
//             transform: 'scaleX(0)',
//             transformOrigin: 'left',
//             transition: 'transform 0.3s ease-in-out',
//         },
//         '&:hover::after': {
//             transform: 'scaleX(1)',
//         },
//     }}
// >
//     Notifications
// </Typography>
//                 <IconButton onClick={() => toggleNotificationDrawer(false)} sx={{ color: '#111E56' }}>
//                     <CloseIcon />
//                 </IconButton>
//             </Box>
//             {/* Notifications List */}
//             {notifications.length === 0 ? (
//                 <Typography>No notifications available</Typography>
//             ) : (
//                 <List sx={{ padding: 0 }}>
//                     {notifications.map((notification) => (
//                         <ListItem
//                             key={notification._id}
//                             sx={{
//                                 display: 'flex',
//                                 flexDirection: 'row',
//                                 alignItems: 'center',
//                                 justifyContent: 'space-between',
//                                 backgroundColor: notification.isRead ? '#f0f0f0' : '#e8f4ff',
//                                 borderRadius: '8px',
//                                 padding: 2,
//                                 boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//                                 marginBottom: '8px',
//                                 '&:hover': {
//                                     transform: 'scale(1.02)',
//                                     backgroundColor: '#edf7ff',
//                                 },
//                             }}
//                         >
//                             <Tooltip title="Mark as Read" arrow>
//                                 <IconButton
//                                     onClick={() => markNotificationAsRead(notification._id)}
//                                     sx={{
//                                         backgroundColor: '#d3d3d3',
//                                         color: 'black',
//                                         '&:hover': {
//                                             backgroundColor: '#b0b0b0',
//                                         },
//                                     }}
//                                 >
//                                     <EditNoteIcon />
//                                 </IconButton>
//                             </Tooltip>
//                             <ListItemText
//                                 primary={notification.message}
//                                 secondary={new Date(notification.createdAt).toLocaleString()}
//                                 sx={{ marginLeft: 2 }}
//                             />
//                         </ListItem>
                        
//                     ))}
//                 </List>
//             )}
//         </Box>
//     );

    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#111E56', fontFamily: 'Poppins, sans-serif' }}>
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingX: '20px',
                }}
            >
                {/* Logo and Links */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar}>
                        <MenuIcon />
                    </IconButton>
                    <Link to="/">
                        <img src={logo} alt="Logo" style={{ height: '50px' }} />
                    </Link>
                    <Box sx={{ display: 'flex', gap: '25px' }}>
                    <Typography
                        sx={{
                            ...linkStyle,
                            cursor: 'pointer',
                        }}
                        onClick={() => handleSectionChange('bookActivity')}>
                        Activities
                    </Typography>                        
                    <Typography
                        sx={{
                        ...linkStyle,
                        cursor: 'pointer',
                        }}
                    onClick={() => handleSectionChange('bookItinerary')}>
                    Itineraries
                    </Typography>

                    <Typography
    sx={{
        ...linkStyle,
        cursor: 'pointer',
    }}
    onClick={() => navigate('/historical-places')} // Use useNavigate for navigation
>
    Historical Places
</Typography>
<Typography
                        sx={{
                            ...linkStyle,
                            cursor: 'pointer',
                        }}
                        onClick={() => handleSectionChange('bookFlight')}>
                        Flights
                    </Typography>    
                    <Typography
                        sx={{
                            ...linkStyle,
                            cursor: 'pointer',
                        }}
                        onClick={() => handleSectionChange('bookHotel')}>
                        Hotels
                    </Typography>             
                    <Typography
                        sx={{
                            ...linkStyle,
                            cursor: 'pointer',
                        }}
                        onClick={() => handleSectionChange('bookTransportation')}>
                        Transportation
                    </Typography>               
                    </Box>
                </Box>

                {/* Currency Selector */}
                <FormControl sx={{ minWidth: 120, backgroundColor: 'white', borderRadius: '4px' }}>
                    <InputLabel>Currency</InputLabel>
                    <Select
                        value={selectedCurrency}
                        onChange={handleCurrencyChange}
                        sx={{
                            height: '40px',
                            fontSize: '16px',
                            '& .MuiSvgIcon-root': { color: '#111E56' },
                        }}
                    >
                        {availableCurrencies.map((currency) => (
                            <MenuItem key={currency} value={currency}>
                                {currency}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Icons */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {/* User Profile Icon */}
<Tooltip title="Profile" arrow>
    <IconButton
        sx={{
            color: 'white',
        }}
        onClick={() => handleSectionChange('profile')} // Navigate or trigger profile component
    >
        <AccountCircle />
    </IconButton>
</Tooltip>

                    
                    <Tooltip title="Wallet" arrow>
                        <IconButton sx={{ color: 'white' }} onClick={() => handleSectionChange('wallet')}>
                            <AccountBalanceWalletIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Marketplace" arrow>
                        <IconButton sx={{ color: 'white' }} onClick={() => handleSectionChange('viewProducts')}>
                            <StoreIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="View Cart" arrow>
                        <IconButton sx={{ color: 'white' }} onClick={() => handleSectionChange('cart')}>
                            <Badge badgeContent={cartCount} color="error">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Wishlist" arrow>
                        <IconButton sx={{ color: 'white' }} onClick={() => handleSectionChange('wishlist')}>
                            <Badge badgeContent={wishlistCount} color="error">
                                <FavoriteIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Notifications" arrow>
                        <IconButton sx={{ color: 'white' }} onClick={() => toggleNotificationDrawer(true)}>
                            <Badge badgeContent={notifications.filter((notif) => !notif.isRead).length} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>

            {/* Notification Drawer */}
            <Drawer anchor="right" open={isNotificationDrawerOpen} onClose={() => toggleNotificationDrawer(false)}>
                <Box sx={{ width: 350, padding: 2 }}>
                    <Typography variant="h6" sx={{
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
                        Notifications
                    </Typography>
                    {notifications.length === 0 ? (
                        <Typography>No notifications available</Typography>
                    ) : (
                        <List>
                            {notifications.map((notification) => (
                                <ListItem
                                    key={notification._id}
                                    sx={{
                                        padding: 1,
                                        borderRadius: 2,
                                        backgroundColor: notification.isRead ? '#f0f0f0' : '#e8f4ff',
                                        mb: 1,
                                    }}
                                >
                                    <ListItemText
                                        primary={notification.message}
                                        secondary={new Date(notification.createdAt).toLocaleString()}
                                    />
                                    <IconButton onClick={() => markNotificationAsRead(notification._id)}>
                                        <EditNoteIcon />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            </Drawer>
        </AppBar>
    );
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


export default TouristNavbar;
