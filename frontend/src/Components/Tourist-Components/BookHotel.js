import React, { useState, useContext } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
    Grid,
    Paper,
} from '@mui/material';
import { CurrencyContext } from './CurrencyContext';


const BookHotel = () => {
    const [location, setLocation] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [currency, setCurrency] = useState('USD'); // Default currency
    const [hotels, setHotels] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTriggered, setSearchTriggered] = useState(false);
    const { selectedCurrency, exchangeRates } = useContext(CurrencyContext); // Use CurrencyContext

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

    const handleBookNow = async (hotel) => {
        try {
            // Make a request to the backend to create a Stripe session
            const response = await axios.post('/tourists/hotels/stripe-session', {
                hotelId: hotel.id,
                price: hotel.priceFrom,
                name : hotel.hotelName,
                country : hotel.location.country, 
                currency: selectedCurrency,
                checkInDate : checkIn, 
                checkOutDate : checkOut,
            },  { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

            // Redirect to the Stripe Checkout session URL
            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                throw new Error('Stripe URL not received');
            }
        } catch (err) {
            console.error('Error creating Stripe session:', err);
            alert('Failed to initiate payment. Please try again.');
        }
    };


    // Helper function to render stars
    const renderStars = (rating) => {
        const maxStars = 5;
        return '★'.repeat(rating) + '☆'.repeat(maxStars - rating);
    };

    const convertPrice = (price) => {
        return (price * (exchangeRates[selectedCurrency] || 1)).toFixed(2);
    };

    return (
        <Box
        sx={{ padding: '20px', maxWidth: '2000px', margin: '0 auto' }}
        >
            <Typography
                variant="h4" gutterBottom sx={{fontWeight:'bold' , color:'#111E56'}}
            >
                Book a Hotel
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}  sm={4}>
                    <TextField
                        label="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12}  sm={4}>
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
                <Grid item xs={12}  sm={4}>
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
                                <strong>Price from:</strong> {convertPrice(hotel.priceFrom)} {selectedCurrency}
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
