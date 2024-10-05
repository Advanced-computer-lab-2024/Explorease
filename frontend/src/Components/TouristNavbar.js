import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const navStyle = {
        backgroundColor: '#333',
        padding: '10px',
        textAlign: 'center',
        display : 'sticky'
    };

    const linkStyle = {
        color: 'white',
        textDecoration: 'none',
        margin: '0 15px',
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
