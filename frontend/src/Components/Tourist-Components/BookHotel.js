import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box } from '@mui/material';

const BookHotel = () => {
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [adults, setAdults] = useState(1);
    const [hotels, setHotels] = useState([]);
    const [error, setError] = useState('');

    const handleSearchHotels = async () => {
        if (!checkInDate || !checkOutDate || !adults) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            const response = await axios.get('/api/hotels/search', {
                params: {
                    hotelIds: ['MCLONGHM'],
                    checkInDate,
                    checkOutDate,
                    adults: Number(adults),
                },
            });
            setHotels(response.data || []); // Ensure response is set correctly
            setError('');
        } catch (err) {
            setError('Error fetching hotels. Please try again.');
            console.error('API Error:', err.response ? err.response.data : err.message);
        }
    };

    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Book a Hotel</Typography>
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
            <TextField
                label="Number of Adults"
                type="number"
                value={adults}
                onChange={(e) => setAdults(e.target.value)}
                fullWidth
                margin="normal"
                InputProps={{ inputProps: { min: 1, max: 9 } }}
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
                        border: '1px solid #111E56'
                    }, mt: 2 }}
            >
                Search Hotels
            </Button>

            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

            {hotels.length > 0 ? (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6">Available Hotels</Typography>
                    {hotels.map((hotelData, index) => (
                        <Box key={index} sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
                            <Typography><strong>Hotel:</strong> {hotelData.hotel.name}</Typography>
                            {hotelData.offers && hotelData.offers.map((offer, offerIndex) => (
                                <Box key={offerIndex} sx={{ mt: 1 }}>
                                    <Typography><strong>Check-in Date:</strong> {offer.checkInDate}</Typography>
                                    <Typography><strong>Check-out Date:</strong> {offer.checkOutDate}</Typography>
                                    <Typography><strong>Price:</strong> {offer.price.currency} {offer.price.total}</Typography>
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box>
            ) : (
                <Typography sx={{ mt: 4 }}>No hotels found for the selected dates.</Typography>
            )}
        </Box>
    );
};

export default BookHotel;
