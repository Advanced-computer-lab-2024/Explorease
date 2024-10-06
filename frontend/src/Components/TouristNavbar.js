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
        display: 'flex',           // Flexbox layout to align items horizontally
        justifyContent: 'space-between',  // Space links across the width (left, center, right)
        alignItems: 'center',      // Center links vertically
    };

    const linkStyle = {
        color: 'white',
        textDecoration: 'none',
        fontSize: '18px',
    };

    return (
        <nav style={navStyle}>
            <Link to="/activities" style={linkStyle}>View All Activities</Link>
            <Link to="/itineraries" style={linkStyle}>View All Itineraries</Link>
            <Link to="/historical-places" style={linkStyle}>View All Historical Places</Link>
        </nav>
    );
};

export default Navbar;
