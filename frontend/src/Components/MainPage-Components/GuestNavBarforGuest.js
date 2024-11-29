import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Box } from '@mui/material';
import logo from '../../Misc/logo.png'; // Replace with the actual path to your logo file

const NavbarGuest = () => {
    const linkContainerStyle = {
        display: 'flex',
        gap: '20px',
        marginLeft: 'auto', // Push links to the right
    };

    const linkStyle = {
        color: 'white',
        textDecoration: 'none',
        fontSize: '18px',
        fontWeight: 500,
        fontFamily: 'Poppins, sans-serif', // Set Poppins font
    };

    const logoStyle = {
        height: '50px',
        marginLeft: '-10px', // Slightly extend outside the navbar
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
                    <Link to="/activities" style={linkStyle}>View All Activities</Link>
                    <Link to="/itineraries" style={linkStyle}>View All Itineraries</Link>
                    <Link to="/historical-places" style={linkStyle}>View All Historical Places</Link>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavbarGuest;
