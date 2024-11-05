import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';

const BookFlight = () => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [currency, setCurrency] = useState('USD'); // Default currency to 'USD'
    const [flights, setFlights] = useState([]);
    const [error, setError] = useState('');
    const [displayedCurrency, setDisplayedCurrency] = useState('USD'); // State to store display currency
    const [loading, setLoading] = useState(false); // Loading state
    const [searchTriggered, setSearchTriggered] = useState(false); // Search triggered state

    // Function to get IATA code from the backend
    const getIATACode = async (city) => {
        try {
            const response = await axios.get(`/api/flights/iata-code`, { params: { city } });
            return response.data.iataCode;
        } catch (err) {
            console.error(`Error fetching IATA code for ${city}:`, err);
            return null;
        }
    };

    // Function to handle booking logic
    const handleBookNow = (flight) => {
        alert(`Booking flight with ID: ${flight.id}`);
    };

    const handleSearchFlights = async () => {
        setFlights([]);
        setError('');
        setLoading(true);
        setSearchTriggered(true);

        try {
            // Fetch the IATA codes for origin and destination
            const originCode = await getIATACode(origin);
            const destinationCode = await getIATACode(destination);

            if (!originCode || !destinationCode) {
                setError('Could not find airport codes for the specified cities.');
                setLoading(false);
                return;
            }

            // Fetch flight data
            const response = await axios.get('/api/flights/search', {
                params: {
                    origin: originCode,
                    destination: destinationCode,
                    departureDate,
                    currency,
                },
            });
            
            // Set new flight data and update the displayed currency
            setFlights(response.data || []);
            setDisplayedCurrency(currency);
        } catch (err) {
            setError('Error fetching flights. Please try again.');
            console.error('API Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Book a Flight</Typography>
            <TextField
                label="Origin City"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Destination City"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Departure Date"
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel shrink>Currency</InputLabel>
                <Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    label="Currency"
                >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                </Select>
            </FormControl>

            <Button
                variant="contained"
                color="primary"
                onClick={handleSearchFlights}
                sx={{ backgroundColor: '#111E56', 
                    color: 'white', 
                    '&:hover': { 
                        backgroundColor: 'white', 
                        color: '#111E56',
                        border: '1px solid #111E56'
                    }, mt: 2 }}
            >
                Search Flights
            </Button>

            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

            {loading ? (
                <Box sx={{ mt: 4 }}>
                    <CircularProgress />
                    <Typography>Loading flights...</Typography>
                </Box>
            ) : (
                searchTriggered && flights.length === 0 && (
                    <Typography sx={{ mt: 4 }}>No flights found for the specified criteria.</Typography>
                )
            )}

            {flights.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6">Available Flights</Typography>
                    {flights.map((flight, index) => (
                        <Box key={index} sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                                <Typography><strong>Departure Date:</strong> {flight.itineraries[0].segments[0].departure.at.split('T')[0]}</Typography>
                                <Typography><strong>Time:</strong> {flight.itineraries[0].segments[0].departure.at.split('T')[1]}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                                <Typography><strong>Arrival Date:</strong> {flight.itineraries[0].segments[0].arrival.at.split('T')[0]}</Typography>
                                <Typography><strong>Time:</strong> {flight.itineraries[0].segments[0].arrival.at.split('T')[1]}</Typography>
                            </Box>
                            <Typography sx={{ mt: 2 }}>
                                <strong>Price:</strong> {displayedCurrency} {flight.price.total}
                            </Typography>
                            <Typography><strong>Carrier:</strong> {flight.validatingAirlineCodes.join(', ')}</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleBookNow(flight)}
                                sx={{ backgroundColor: '#111E56', 
                                    color: 'white', 
                                    '&:hover': { 
                                        backgroundColor: 'white', 
                                        color: '#111E56',
                                        border: '1px solid #111E56'
                                    }, mt: 2 }}
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

export default BookFlight;
