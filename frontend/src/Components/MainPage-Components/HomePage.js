import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Container, TextField, Stack } from '@mui/material';
import TouristNavbar from './GuestNavBarforGuest'; // Ensure this file exists
import { Fade } from 'react-awesome-reveal';
import { Link } from 'react-router-dom';
import logo from '../../Misc/logo3.png'; 
import logo2 from '../../Misc/image.png';
import logo3 from '../../Misc/logo2.png';
import waveGif from '../../Misc/wave_main.gif';
import ActivitiesIcon from '@mui/icons-material/DirectionsWalk';
import FlightsIcon from '@mui/icons-material/Flight';
import HotelsIcon from '@mui/icons-material/Hotel';
import ItinerariesIcon from '@mui/icons-material/Event';
import HistoricalPlacesIcon from '@mui/icons-material/Place';

// Import the background image
import heroBackground from '../../Misc/bg.jpg';

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
            {/* Navbar */}
            <TouristNavbar />

            {/* Hero Section */}
            <section
                style={{
                    backgroundImage: `url(${heroBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    padding: '300px 0', // Reduced padding to decrease height
                    position: 'relative',
                    overflow: 'hidden',
                    color: 'white', // Ensure text is visible on the background
                }}
            >
                <Container>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
                        <Fade direction="left">
                            <Box>
                            <Typography
    variant="h2"
    gutterBottom
    sx={{
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Add shadow to the text
    }}
>
    Welcome to{' '}
    <Box
        component="span"
        sx={{
            display: 'inline-flex',
            alignItems: 'center',
            verticalAlign: 'middle',
        }}
    >
        <img
            src={logo}
            alt="Explorease"
            style={{ height: '1.5em', marginLeft: '0.5em' }}
        />
    </Box>
</Typography>

                                <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                    Discover your next adventure, explore historical places, and plan your perfect trip
                                    with ease.
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={handleLogin} // Correct navigation
                                    sx={{
                                        backgroundColor: '#111E56',
                                        color: 'white',
                                        marginRight: '10px',
                                        border: '2px solid transparent', // Default border to maintain dimensions
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            color: '#111E56',
                                            border: '2px solid #111E56',
                                        },
                                    }}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleRegister} // Correct navigation
                                    sx={{
                                        backgroundColor: '#111E56',
                                        color: 'white',
                                        marginRight: '10px',
                                        border: '2px solid transparent', // Default border to maintain dimensions
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            color: '#111E56',
                                            border: '2px solid #111E56',
                                        },
                                    }}
                                >
                                    Register
                                </Button>
                            </Box>
                        </Fade>
                        <Fade direction="right">
                            <Box
                                sx={{
                                    width: '100%',
                                    maxWidth: '400px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                {/* Animated GIF */}
                                <img
                                    src={waveGif}
                                    alt="Wave Animation"
                                    style={{
                                        width: '100%',
                                        maxWidth: '400px',
                                        borderRadius: '8px',
                                        height: '160px',
                                    }}
                                />
                            </Box>
                        </Fade>
                    </Stack>
                </Container>
            </section>

            {/* Services Section */}
            <section style={{ backgroundColor: '#111E56', color: 'white', padding: '200px 0' }}>
                <Container>
                    <Fade direction="up">
                        <Typography variant="h3" align="center" gutterBottom>
                            Our Services
                        </Typography>
                        <Typography variant="body1" align="center" style={{ marginBottom: '40px' }}>
                            Explore a variety of services to make your journey unforgettable.
                        </Typography>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            justifyContent="center"
                            alignItems="center"
                            spacing={5}
                            flexWrap="wrap"
                            sx={{
                                rowGap: '30px',
                            }}
                        >
                            {[
                                { icon: <ActivitiesIcon fontSize="large" />, title: 'Activities', description: 'Explore fun activities.' },
                                { icon: <FlightsIcon fontSize="large" />, title: 'Flights', description: 'Book convenient flights.' },
                                { icon: <HotelsIcon fontSize="large" />, title: 'Hotels', description: 'Find cozy accommodations.' },
                                { icon: <ItinerariesIcon fontSize="large" />, title: 'Itineraries', description: 'Plan your trip perfectly.' },
                                { icon: <HistoricalPlacesIcon fontSize="large" />, title: 'Historical Places', description: 'Discover iconic landmarks.' },
                            ].map((service, index) => (
                                <Box key={index} textAlign="center" sx={{ width: '250px' }}>
                                    {service.icon}
                                    <Typography variant="h6" style={{ margin: '20px 0 10px', color: 'white' }}>
                                        {service.title}
                                    </Typography>
                                    <Typography variant="body2">{service.description}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Fade>
                </Container>
            </section>

            {/* Contact Us Section */}
            <section style={{ backgroundColor: 'white', padding: '200px 0' }}>
                <Container>
                    <Fade direction="up">
                        <Typography variant="h3" align="center" gutterBottom sx={{color:'#111E56'}}>
                            Contact Us
                        </Typography>
                        <Typography variant="body1" align="center" style={{ marginBottom: '40px',color:'#111E56' }}>
                            Have questions? Reach out to us!
                        </Typography>
                        <Box component="form" noValidate autoComplete="off">
                            <Stack spacing={3} sx={{ maxWidth: '600px', margin: '0 auto' }}>
                                <TextField fullWidth label="Name" variant="outlined" />
                                <TextField fullWidth label="Email" variant="outlined" />
                                <TextField
                                    fullWidth
                                    label="Message"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        backgroundColor: '#111E56',
                                        color: 'white',
                                        border: '2px solid #111E56',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            color: '#111E56',
                                            border: '2px solid #111E56',
                                        },
                                    }}
                                >
                                    Send Message
                                </Button>
                            </Stack>
                        </Box>
                    </Fade>
                </Container>
            </section>

            {/* Footer */}
            <footer style={{ backgroundColor: '#111E56', color: 'white', padding: '30px 0' }}>
                <Container>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                        sx={{ textAlign: { xs: 'center', sm: 'left' } }}
                    >
                        <img
                            src={logo2}
                            alt="Explorease"
                            style={{ height: '3em', marginLeft: '5px' }}
                        />
                        <Typography variant="body2">© 2024. All rights reserved.</Typography>
                        <Stack direction="row" spacing={3}>
                            <Link
                                to="/admin/login"
                                style={{
                                    color: 'white',
                                    textDecoration: 'none',
                                    fontSize: '16px',
                                }}
                            >
                                Admin Login
                            </Link>
                            <Link
                                to="/uploadDocuments"
                                style={{
                                    color: 'white',
                                    textDecoration: 'none',
                                    fontSize: '16px',
                                }}
                            >
                                Upload Documents
                            </Link>
                        </Stack>
                    </Stack>
                </Container>
            </footer>
        </div>
    );
};

export default HomePage;
