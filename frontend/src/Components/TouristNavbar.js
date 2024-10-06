import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const navStyle = {
        backgroundColor: '#333',
        padding: '10px',
        position: 'sticky',
        top: 0,
        width: '100%',
        zIndex: 1000,
        display: 'flex',  // Flex layout for the navbar
        justifyContent: 'center',  // Center the links in the navbar
        alignItems: 'center',
    };

    const linkContainerStyle = {
        display: 'flex', // Flex layout for link container
        gap: '20px',     // Space between each link
    };

    const linkStyle = {
        color: 'white',
        textDecoration: 'none',
        fontSize: '18px',
    };

    return (
        <nav style={navStyle}>
            <div style={linkContainerStyle}>
                <Link to="/activities" style={linkStyle}>View All Activities</Link>
                <Link to="/itineraries" style={linkStyle}>View All Itineraries</Link>
                <Link to="/historical-places" style={linkStyle}>View All Historical Places</Link>
            </div>
        </nav>
    );
};

export default Navbar;
