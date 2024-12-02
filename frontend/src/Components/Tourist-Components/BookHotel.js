import React, { useState } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Grid,
    Paper,
} from '@mui/material';

const BookHotel = () => {
    const [location, setLocation] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [currency, setCurrency] = useState('USD'); // Default currency
    const [hotels, setHotels] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTriggered, setSearchTriggered] = useState(false);

    const handleSearchHotels = async () => {
        if (!location || !checkIn || !checkOut) {
            setError('Please fill in all required fields.');
            return;
        }

        setLoading(true);
        setHotels([]);
        setError('');
        setSearchTriggered(true);

        try {
            const response = await axios.get('/api/hotels/search', {
                params: { location, checkIn, checkOut, currency },
            });
            setHotels(response.data || []);
        } catch (err) {
            setError('Error fetching hotels. Please try again.');
            console.error('API Error:', err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = (hotel) => {
        alert(`Booking hotel: ${hotel.hotelName}`);
    };

    // Helper function to render stars
    const renderStars = (rating) => {
        const maxStars = 5;
        return '★'.repeat(rating) + '☆'.repeat(maxStars - rating);
    };

    return (
        <Box
            sx={{
                px: 3,
                py: 4,
                maxWidth: 800,
                mx: 'auto',
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: 2,
                marginTop: '35px',
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 'bold',
                    color: '#111E56',
                    textAlign: 'center',
                    mb: 4,
                }}
            >
                Book a Hotel
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Check-in Date"
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Check-out Date"
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <InputLabel>Currency</InputLabel>
                        <Select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            label="Currency"
                        >
                            <MenuItem value="USD">USD</MenuItem>
                            <MenuItem value="EUR">EUR</MenuItem>
                            <MenuItem value="GBP">GBP</MenuItem>
                            <MenuItem value="JPY">JPY</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSearchHotels}
                sx={{
                    mt: 3,
                    width: '100%',
                    backgroundColor: '#111E56',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: 'white',
                        color: '#111E56',
                        border: '1px solid #111E56',
                    },
                }}
            >
                Search Hotels
            </Button>
            {error && (
                <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                    {error}
                </Typography>
            )}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                searchTriggered && hotels.length === 0 && (
                    <Typography sx={{ mt: 4, textAlign: 'center' }}>
                        No hotels found for the specified criteria.
                    </Typography>
                )
            )}
            {hotels.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 2,
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: '#111E56',
                        }}
                    >
                        Available Hotels
                    </Typography>
                    {hotels.map((hotel, index) => (
                        <Paper
                            key={index}
                            sx={{
                                px: 3,
                                py: 4,
                                marginTop: '30px',
                                maxWidth: 800,
                                mx: 'auto',
                                backgroundColor: 'white',
                                borderRadius: 2,
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                textAlign: 'center',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                                    transform: 'scale(1.02)',
                                    backgroundColor: 'white',
                                },
                            }}
                        >
                            <Typography>
                                <strong>Hotel:</strong> {hotel.hotelName}
                            </Typography>
                            
                            <Typography>
                                <strong>Price from:</strong> {currency} {hotel.priceFrom}
                            </Typography>
                            <Typography>
                                <strong>Location:</strong> {hotel.location.name}, {hotel.location.country}
                            </Typography>
                            <Typography>
                                <span style={{ color: '#FFD700', fontSize: '1.2em' }}>
                                    {renderStars(hotel.stars)}
                                </span>
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleBookNow(hotel)}
                                sx={{
                                    mt: 2,
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
                                Book Now
                            </Button>
                        </Paper>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default BookHotel;
