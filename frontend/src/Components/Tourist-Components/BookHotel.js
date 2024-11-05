import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';

const BookHotel = () => {
    const [cityName, setCityName] = useState('');
    const [hotels, setHotels] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTriggered, setSearchTriggered] = useState(false);

    const handleSearchHotels = async () => {
        if (!cityName) {
            setError("Please enter a city name.");
            return;
        }

        setLoading(true);  // Start loading
        setSearchTriggered(true); // Mark that a search has been triggered
        setError('');
        setHotels([]);

        try {
            const response = await axios.get('/api/hotels/search', {
                params: { cityName },
            });
            setHotels(response.data || []);
        } catch (err) {
            setError('Error fetching hotels. Please try again.');
            console.error('API Error:', err.response ? err.response.data : err.message);
        } finally {
            setLoading(false); // Stop loading after the request completes
        }
    };

    const handleBookHotel = (hotel) => {
        alert(`Booking hotel: ${hotel.name}`);
        // Additional booking functionality would go here.
    };

    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Search Hotels by City</Typography>
            <TextField
                label="City Name"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSearchHotels}
                sx={{ backgroundColor: '#111E56', 
                    color: 'white', 
                    '&:hover': { 
                        backgroundColor: 'white', 
                        color: '#111E56',
                        border: '1px solid #111E56' // Optional: adds a border to match the dark blue on hover
                    },mt: 2 }}
            >
                Search Hotels
            </Button>

            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

            {loading ? (
                <Box sx={{ mt: 4 }}>
                    <CircularProgress />
                    <Typography>Loading hotels...</Typography>
                </Box>
            ) : (
                searchTriggered && hotels.length === 0 && (
                    <Typography sx={{ mt: 4 }}>No hotels found in the specified radius.</Typography>
                )
            )}

            {hotels.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6">Available Hotels</Typography>
                    {hotels.map((hotel, index) => (
                        <Box key={index} sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
                            <Typography><strong>Hotel:</strong> {hotel.name}</Typography>
                            <Typography><strong>Distance:</strong> {hotel.distance.value} {hotel.distance.unit}</Typography>
                            <Typography><strong>Country:</strong> {hotel.address.countryCode}</Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleBookHotel(hotel)}
                                sx={{ backgroundColor: '#111E56', 
                                    color: 'white', 
                                    '&:hover': { 
                                        backgroundColor: 'white', 
                                        color: '#111E56',
                                        border: '1px solid #111E56' // Optional: adds a border to match the dark blue on hover
                                    },mt: 2 }}
                            >
                                Book Now
                            </Button>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default BookHotel;
