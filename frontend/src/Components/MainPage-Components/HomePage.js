import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Container } from '@mui/material';
import TouristNavbar from './TouristNavbar'; // Reuse the TouristNavbar component
import logo from '../../Misc/logo2.png'; // Replace with the actual path to your logo file
import { Link } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div>
            <TouristNavbar /> {/* Reuse the Tourist Navbar for consistency */}
            
            {/* Main Content */}
            <Container  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', minWidth : '100vw', textAlign: 'center', bgcolor: 'white' }}>
                <Typography variant="h2" gutterBottom>
                    Welcome to 
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', position: 'relative', top: '30px', ml: 1 }}>
                        <img src={logo} alt="Explorease" style={{ height: '1.5em', verticalAlign: 'middle' }} />
                    </Box>
                </Typography>
                
                <Typography variant="body1" paragraph sx={{ maxWidth: '600px', mb: 4 }}>
                    Discover your next adventure, explore historical places, and plan your perfect trip with ease.
                </Typography>
                
                <Box>
                <Button 
                        onClick={handleLogin} 
                        variant="contained" 
                        sx={{ 
                            backgroundColor: '#111E56', 
                            color: 'white', 
                            '&:hover': { 
                                backgroundColor: 'white', 
                                color: '#111E56',
                                border: '1px solid #111E56' // Optional: adds a border to match the dark blue on hover
                            }, 
                            mx: 1, 
                            px: 4 
                        }}
                    >
                        Login
                    </Button>


                    <Button 
                        onClick={handleRegister} 
                        variant="outlined" 
                        color="primary" 
                        sx={{ backgroundColor: 'white', 
                            color: '#111E56', 
                            border: '1px solid #111E56',
                            '&:hover': { 
                                backgroundColor: '#111E56', 
                                color: 'white',
                                
                            }, 
                            mx: 1, 
                            px: 4 }}
                    >
                        Register
                    </Button>
                </Box>
            </Container>
            <footer>
            <Link to="/uploadDocuments">
                    Upload Documents!
            </Link>
            </footer>
        </div>
    );
};

export default HomePage;
