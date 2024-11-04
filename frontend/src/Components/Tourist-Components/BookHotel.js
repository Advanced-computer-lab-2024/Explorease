// src/Components/Tourist-Components/BookHotel.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const BookHotel = () => {
    const [location, setLocation] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [hotels, setHotels] = useState([]);
    const [error, setError] = useState('');
    const [displayedCurrency, setDisplayedCurrency] = useState('USD');

    // Function to get IATA code from backend
    const getIATACode = async (city) => {
        try {
            const response = await axios.get(`/api/hotels/iata-code`, { params: { city } });
            return response.data.iataCode;
        } catch (err) {
            console.error(`Error fetching IATA code for ${city}:`, err);
            return null;
        }
    };

    const handleSearchHotels = async () => {
        // Clear previous results and errors
        setHotels([]);
        setError('');

        try {
            // Fetch the IATA code for location
            const locationCode = await getIATACode(location);

            if (!locationCode) {
                setError('Could not find location code for the specified city.');
                return;
            }

            // Fetch hotel data
            const response = await axios.get('/api/hotels/search', {
                params: {
                    location: locationCode,
                    checkInDate,
                    checkOutDate,
                    currency,
                },
            });

            // Set new hotel data and update the displayed currency
            setHotels(response.data);
            setDisplayedCurrency(currency); // Update displayed currency on search
        } catch (err) {
            setError('Error fetching hotels. Please try again.');
            console.error('API Error:', err);
        }
    };

    const handleBookHotel = (hotel) => {
        // Add booking functionality here, such as redirecting or sending data to an API.
        console.log("Hotel booked:", hotel.name);
    };

    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Book a Hotel</Typography>

            {/* Location Input */}
            <TextField
                label="City"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                fullWidth
                margin="normal"
            />

            {/* Check-in and Check-out Dates */}
            <TextField
                label="Check-In Date"
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                label="Check-Out Date"
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
            />

            {/* Currency Dropdown */}
            <FormControl fullWidth margin="normal">
                <InputLabel shrink>Currency</InputLabel>
                <Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                </Select>
            </FormControl>

            {/* Search Button */}
            <Button
                variant="contained"
                color="primary"
                onClick={handleSearchHotels}
                sx={{ backgroundColor: '#111E56', color: 'white', '&:hover': { backgroundColor: 'white', color: '#111E56', border: '1px solid #111E56' }, mt: 2 }}
            >
                Search Hotels
            </Button>

            {error && <Typography color="error">{error}</Typography>}

            {/* Display Hotel Results */}
            {hotels.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6">Available Hotels</Typography>
                    {hotels.map((hotel, index) => (
                        <Box key={index} sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
                            {/* Hotel Information */}
                            <Typography variant="h6">{hotel.name}</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                                <Typography><strong>Check-In:</strong> {checkInDate}</Typography>
                                <Typography><strong>Check-Out:</strong> {checkOutDate}</Typography>
                            </Box>
                            <Typography sx={{ mt: 2 }}><strong>Price:</strong> {displayedCurrency} {hotel.price.total}</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleBookHotel(hotel)}
                                sx={{ backgroundColor: '#111E56', color: 'white', mt: 2 }}
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
