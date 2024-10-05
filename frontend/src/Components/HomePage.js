import React from 'react';
import { useNavigate } from 'react-router-dom';
import TouristNavbar from './TouristNavbar'; // Reuse the TouristNavbar component

const HomePage = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const homePageStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
        textAlign: 'center',
    };

    const buttonStyle = {
        margin: '10px',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    return (
        <div>
            <TouristNavbar /> {/* Reuse the Tourist Navbar for consistency */}
            <div style={homePageStyle}>
                <h1>Welcome to the Virtual Trip Planner</h1>
                <p>Discover your next adventure, explore historical places, and plan your perfect trip.</p>
                <div>
                    <button onClick={handleLogin} style={buttonStyle}>
                        Login
                    </button>
                    <button onClick={handleRegister} style={buttonStyle}>
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
