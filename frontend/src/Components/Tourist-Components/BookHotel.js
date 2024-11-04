// src/Components/Tourist-Components/BookHotel.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const BookHotel = () => {
    const [cityCode, setCityCode] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [hotels, setHotels] = useState([]);
    const [error, setError] = useState('');

    const handleSearchHotels = async () => {
        setHotels([]);
        setError('');

        try {
            const response = await axios.get('/api/hotels/search', {
                params: {
                    cityCode,
                    checkInDate,
                    checkOutDate,
                    currency,
                },
            });
            setHotels(response.data);
        } catch (err) {
            setError('Error fetching hotels. Please try again.');
            console.error('API Error:', err);
        }
    };

    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Book a Hotel</Typography>
            <TextField
                label="City Code (e.g., NYC)"
                value={cityCode}
                onChange={(e) => setCityCode(e.target.value.toUpperCase())}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Check-in Date"
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                label="Check-out Date"
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Currency</InputLabel>
                <Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                </Select>
            </FormControl>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSearchHotels}
                sx={{ mt: 2 }}
            >
                Search Hotels
            </Button>

            {error && <Typography color="error">{error}</Typography>}
            {hotels.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6">Available Hotels</Typography>
                    {hotels.map((hotel, index) => (
                        <Box key={index} sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
                            <Typography><strong>Hotel Name:</strong> {hotel.hotel.name}</Typography>
                            <Typography><strong>Check-in:</strong> {hotel.offers[0].checkInDate}</Typography>
                            <Typography><strong>Check-out:</strong> {hotel.offers[0].checkOutDate}</Typography>
                            <Typography><strong>Price:</strong> {currency} {hotel.offers[0].price.total}</Typography>
                            <Button variant="contained" color="primary" sx={{ mt: 1 }}>Book Now</Button>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default BookHotel;
