// src/Components/Tourist-Components/BookFlight.js

import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box } from '@mui/material';

const BookFlight = () => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [flights, setFlights] = useState([]);
    const [error, setError] = useState('');

    const handleSearchFlights = async () => {
        // Check that both origin and destination are 3-letter IATA codes
        if (origin.length !== 3 || destination.length !== 3) {
            setError('Origin and destination must be valid 3-letter IATA codes.');
            return;
        }
    
        try {
            const response = await axios.get('http://localhost:5000/api/flights/search', {
                params: {
                    origin: origin.toUpperCase(),
                    destination: destination.toUpperCase(),
                    departureDate: departureDate,
                },
            });
            setFlights(response.data); // Set the response data to display flights
            setError(''); // Clear any previous error messages
        } catch (err) {
            setError('Error fetching flights. Please try again.');
            console.error('API Error:', err);
        }
    };
    

    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Book a Flight</Typography>

            {/* Search Form */}
            <TextField
                label="Origin (e.g., LAX)"
                value={origin}
                onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Destination (e.g., JFK)"
                value={destination}
                onChange={(e) => setDestination(e.target.value.toUpperCase())}
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
            <Button
                variant="contained"
                color="primary"
                onClick={handleSearchFlights}
                sx={{ mt: 2 }}
            >
                Search Flights
            </Button>

            {/* Display Search Results */}
            {error && <Typography color="error">{error}</Typography>}
            {flights.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6">Available Flights</Typography>
                    {flights.map((flight, index) => (
                        <Box key={index} sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
                            <Typography><strong>Departure:</strong> {flight.itineraries[0].segments[0].departure.at}</Typography>
                            <Typography><strong>Arrival:</strong> {flight.itineraries[0].segments[0].arrival.at}</Typography>
                            <Typography><strong>Price:</strong> ${flight.price.total}</Typography>
                            <Typography><strong>Carrier:</strong> {flight.validatingAirlineCodes.join(', ')}</Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default BookFlight;
