import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Grid,
    Button,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const ItinerarySummary = () => {
    const [itineraries, setItineraries] = useState([]);
    const [filteredItineraries, setFilteredItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState(null); // Use date format

    useEffect(() => {
        fetchItinerarySummary();
    }, []);

    const fetchItinerarySummary = async () => {
        try {
            const token = localStorage.getItem('token'); // Get the token for authentication
            const response = await axios.get('/tourguide/itinerary-summary', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setItineraries(response.data.summary); // Set the fetched summary data
            setFilteredItineraries(response.data.summary); // Initially show all itineraries
        } catch (err) {
            console.error('Error fetching itinerary summary:', err);
            setError('Failed to fetch itinerary summary.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        if (!selectedDate) {
            setFilteredItineraries(itineraries); // Reset to all itineraries if no date is selected
            return;
        }
        const selectedYear = selectedDate.getFullYear();
        const selectedMonth = selectedDate.getMonth(); 
        const filtered = itineraries.filter(itinerary => {
            const itineraryDate = new Date(itinerary.date);
            return (
                itineraryDate.getFullYear() === selectedYear &&
                itineraryDate.getMonth() === selectedMonth
            );
        });
        setFilteredItineraries(filtered);
    };

    return (
        <Box sx={{ px: 3, py: 4, maxWidth: 800, mx: 'auto', marginTop: '20px' }}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 'bold',
                    color: '#111E56',
                    textAlign: 'center',
                    mb: 4,
                }}
            >
                Itinerary Summary
            </Typography>

            {/* Filter Section */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        views={['year', 'month']}
                        label="Filter by Month"
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        renderInput={(params) => <Button {...params} />}
                    />
                </LocalizationProvider>
                <Button
                    variant="contained"
                    onClick={handleFilter}
                    sx={{
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
                    Apply Filter
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            ) : filteredItineraries.length > 0 ? (
                <Grid container spacing={2}>
                    {filteredItineraries.map((itinerary, index) => (
                        <Grid item xs={12} key={index}>
                            <Card
                                sx={{
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    borderRadius: '8px',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.03)',
                                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                                    },
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {itinerary.itineraryName}
                                    </Typography>
                                    <Typography sx={{ mt: 1 }}>
                                        <strong>Date:</strong>{' '}
                                        {new Date(itinerary.date).toLocaleDateString()}
                                    </Typography>
                                    <Typography sx={{ mt: 1 }}>
                                        <strong>Uncancelled Bookings:</strong>{' '}
                                        {itinerary.uncancelledBookings}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography
                    variant="body1"
                    sx={{ textAlign: 'center', color: '#555', mt: 4 }}
                >
                    No itineraries found for the selected month.
                </Typography>
            )}
        </Box>
    );
};

export default ItinerarySummary;
