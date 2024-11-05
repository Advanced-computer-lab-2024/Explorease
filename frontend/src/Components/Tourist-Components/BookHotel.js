import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const BookHotel = () => {
    const [location, setLocation] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [currency, setCurrency] = useState('USD'); // Set default currency to 'USD'
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearchHotels = async () => {
        if (!location || !checkIn || !checkOut) {
            setError("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        setHotels([]);
        setError('');

        try {
            const response = await axios.get('/api/hotels/search', {
                params: {
                    location,
                    checkIn,
                    checkOut,
                    currency // Include currency in API request
                },
            });
            setHotels(response.data);
        } catch (err) {
            setError('Error fetching hotels. Please try again.');
            console.error('API Error:', err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    };

    // Placeholder function for booking
    const handleBookNow = (hotel) => {
        alert(`Booking hotel: ${hotel.hotelName}`);
    };

    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Search Hotels</Typography>
            <TextField
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Check-in Date"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                label="Check-out Date"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
            />

            {/* Currency Dropdown */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Currency</InputLabel>
                <Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                    <MenuItem value="JPY">JPY</MenuItem>
                    {/* Add more currencies as needed */}
                </Select>
            </FormControl>

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

            {/* Loading Spinner */}
            {loading && (
                <Box sx={{ display: 'block', mt: 2 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

            {hotels.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6">Available Hotels</Typography>
                    {hotels.map((hotel, index) => (
                        <Box key={index} sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
                            <Typography><strong>Hotel:</strong> {hotel.hotelName}</Typography>
                            <Typography><strong>Stars:</strong> {hotel.stars}</Typography>
                            <Typography><strong>Price from:</strong> {hotel.priceFrom} {currency}</Typography>
                            <Typography><strong>Location:</strong> {hotel.location.name}, {hotel.location.country}</Typography>
                            {/* Book Now Button */}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleBookNow(hotel)}
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
