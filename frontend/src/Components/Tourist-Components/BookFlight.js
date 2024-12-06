import React, { useState, useContext } from 'react';
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
import { CurrencyContext } from './CurrencyContext';
const BookFlight = () => {
    // State variables
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [currency, setCurrency] = useState('USD'); // Default currency
    const [flights, setFlights] = useState([]);
    const [error, setError] = useState('');
    //const [displayedCurrency, setDisplayedCurrency] = useState('USD');
    const [loading, setLoading] = useState(false);
    const [searchTriggered, setSearchTriggered] = useState(false);
    const { selectedCurrency, exchangeRates } = useContext(CurrencyContext); // Use CurrencyContext

    // Helper function: Fetch IATA code
    const getIATACode = async (city) => {
        try {
            const response = await axios.get('/api/flights/iata-code', { params: { city } });
            return response.data.iataCode;
        } catch (err) {
            console.error(`Error fetching IATA code for ${city}:`, err);
            return null;
        }
    };

    // Handler: Search for flights
    const handleSearchFlights = async () => {
        setFlights([]);
        setError('');
        setLoading(true);
        setSearchTriggered(true);

        try {
            const originCode = await getIATACode(origin);
            const destinationCode = await getIATACode(destination);

            if (!originCode || !destinationCode) {
                setError('Could not find airport codes for the specified cities.');
                setLoading(false);
                return;
            }

            const response = await axios.get('/api/flights/search', {
                params: {
                    origin: originCode,
                    destination: destinationCode,
                    departureDate,
                    currency,
                },
            });

            setFlights(response.data || []);
        } catch (err) {
            setError('Error fetching flights. Please try again.');
            console.error('API Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const convertPrice = (price) => {
        return (price * (exchangeRates[selectedCurrency] || 1)).toFixed(2);
    };
    // Handler: Book a flight
//     const handleBookNow = (flight) => {
// //        handleSectionChange('flight-checkout', { flight });
//     };
const handleBookNow = async (flight) => {
    try {
        // Call the backend API to create a Stripe session

        const departure = `${flight.itineraries[0].segments[0].departure.at.split('T')[0]} at ${flight.itineraries[0].segments[0].departure.at.split('T')[1]}`;

        const arrival = `${flight.itineraries[0].segments[0].arrival.at.split('T')[0]} at ${flight.itineraries[0].segments[0].arrival.at.split('T')[1]}`;
        


        const response = await axios.post('/tourists/flights/stripe-session', {
            flightId: flight.id,
            amount: flight.price.total,
            origin, 
            destination, 
            departure,
            arrival
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

        // Redirect to the Stripe checkout URL
        if (response.data.url) {
            window.location.href = response.data.url;
        } else {
            throw new Error('Stripe URL not received');
        }
    } catch (error) {
        console.error('Error initiating Stripe checkout:', error);
        setError('Error initiating payment. Please try again.');
    }
};


    return (
        <Box sx={{ px: 3, py: 4, maxWidth: 800, mx: 'auto', backgroundColor: 'white', borderRadius: 2, boxShadow: 2, marginTop:'35px' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#111E56', textAlign: 'center', mb: 4 }}>
                Book a Flight
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Origin City"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Destination City"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Departure Date"
                        type="date"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
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
                onClick={handleSearchFlights}
                sx={{
                    mt: 3,
                    width: '100%',
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
                Search Flights
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
                searchTriggered && flights.length === 0 && (
                    <Typography sx={{ mt: 4, textAlign: 'center' }}>
                        No flights found for the specified criteria.
                    </Typography>
                )
            )}
            {flights.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold', color: '#111E56' }}>
                        Available Flights
                    </Typography>
                    {flights.map((flight, index) => (
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
                                transition: 'all 0.3s ease-in-out', // Smooth transition for all properties
                                '&:hover': {
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)', // Increased shadow for a floating effect
                                    transform: 'scale(1.02)', // Lift slightly with a small zoom-in
                                    backgroundColor: 'white', // Slightly lighter background for hover
                                },}}
                        >
                            <Typography>
                                <strong>Departure:</strong> {flight.itineraries[0].segments[0].departure.at.split('T')[0]} at{' '}
                                {flight.itineraries[0].segments[0].departure.at.split('T')[1]}
                            </Typography>
                            <Typography>
                                <strong>Arrival:</strong> {flight.itineraries[0].segments[0].arrival.at.split('T')[0]} at{' '}
                                {flight.itineraries[0].segments[0].arrival.at.split('T')[1]}
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                                <strong>Price:</strong>  {convertPrice(flight.price.total)} {selectedCurrency}
                            </Typography>
                            <Typography>
                                <strong>Carrier:</strong> {flight.validatingAirlineCodes.join(', ')}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleBookNow(flight)}
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

export default BookFlight;
