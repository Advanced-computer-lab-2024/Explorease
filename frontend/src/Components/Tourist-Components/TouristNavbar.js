import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, IconButton, Typography, Popover, MenuItem } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import StoreIcon from '@mui/icons-material/Store';
import logo from '../../Misc/logo.png';
import { Link } from 'react-router-dom';

const TouristNavbar = ({ setActiveComponent }) => {
    const [anchorEl, setAnchorEl] = useState(null);

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

    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#111E56', zIndex: 1000, fontFamily: 'Poppins, sans-serif' }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Clickable Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                        </Popover>
                    </Box>
                </Box>

                {/* Icon Buttons */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '20px' }}>
                    <IconButton sx={{ color: 'white' }} onClick={() => setActiveComponent('cart')} aria-label="cart">
                        <ShoppingCartIcon />
                    </IconButton>
                    <IconButton sx={{ color: 'white' }} onClick={() => setActiveComponent('wallet')} aria-label="wallet">
                        <AccountBalanceWalletIcon />
                    </IconButton>
                    <IconButton sx={{ color: 'white' }} onClick={() => setActiveComponent('viewProducts')} aria-label="market">
                        <StoreIcon />
                    </IconButton>
                </Box>
            </Toolbar>
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
