// BookFlight.js
import React from 'react';
import { Button, Typography, Box } from '@mui/material';

const BookFlight = () => {
    const handleBookFlight = () => {
        // Open a 3rd-party flight booking site in a new tab
        window.open('https://www.skyscanner.net', '_blank');
    };

    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Book a Flight</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Click the button below to book a flight through our trusted partner.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleBookFlight}
                sx={{backgroundColor: '#111E56', 
                    color: 'white', 
                    '&:hover': { 
                        backgroundColor: 'white', 
                        color: '#111E56',
                        border: '1px solid #111E56' // Optional: adds a border to match the dark blue on hover
                    }, }}
            >
                Book a Flight
            </Button>
        </Box>
    );
};

export default BookFlight;
