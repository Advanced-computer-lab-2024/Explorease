import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Alert,
    IconButton,
    Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

const ViewMyItineraries = () => {
    const [itineraries, setItineraries] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch itineraries
    useEffect(() => {
        const fetchItineraries = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You need to log in to view your itineraries.');
                return;
            }

            try {
                const response = await axios.get('/tourguide/myItineraries', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Directly set itineraries from response.data
                setItineraries(response.data || []);
            } catch (err) {
                console.error('Error fetching itineraries:', err);
                setError('Failed to load itineraries. Please try again.');
            }
        };

        fetchItineraries();
    }, []);

    // Delete itinerary
    const handleDeleteItinerary = async (itineraryId) => {
        if (!window.confirm('Are you sure you want to delete this itinerary?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/tourguide/itineraries/${itineraryId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setItineraries((prev) =>
                prev.filter((itinerary) => itinerary._id !== itineraryId)
            );
            setMessage('Itinerary deleted successfully.');
        } catch (err) {
            console.error('Error deleting itinerary:', err);
            setError('Failed to delete itinerary. Please try again.');
        }
    };

    // Activate itinerary
    const handleActivateItinerary = async (itineraryId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/tourguide/activateItinerary/${itineraryId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setItineraries((prev) =>
                prev.map((itinerary) =>
                    itinerary._id === itineraryId
                        ? { ...itinerary, isActivated: true }
                        : itinerary
                )
            );
            setMessage('Itinerary activated successfully.');
        } catch (err) {
            console.error('Error activating itinerary:', err);
            setError('Failed to activate itinerary. Please try again.');
        }
    };

    // Deactivate itinerary
    const handleDeactivateItinerary = async (itineraryId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/tourguide/deactivateItinerary/${itineraryId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setItineraries((prev) =>
                prev.map((itinerary) =>
                    itinerary._id === itineraryId
                        ? { ...itinerary, isActivated: false }
                        : itinerary
                )
            );
            setMessage('Itinerary deactivated successfully.');
        } catch (err) {
            console.error('Error deactivating itinerary:', err);
            setError('Failed to deactivate itinerary. Please try again.');
        }
    };

    return (
        <Box
            sx={{
                padding: '20px',
                maxWidth: '1200px',
                margin: '0 auto',
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    color: '#111E56',
                    marginBottom: '20px',
                    textAlign: 'center',
                }}
            >
                My Itineraries
            </Typography>
            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {itineraries.length > 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '20px',
                        justifyContent: 'center',
                    }}
                >
                    {itineraries.map((itinerary) => (
                        <Card
                        key={itinerary._id}
                        sx={{
                            width: '300px',
                            boxShadow: 3,
                            padding: 2,
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.03)',
                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                            },
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#111E56',
                                    fontWeight: 'bold',
                                    marginBottom: '10px',
                                }}
                            >
                                {itinerary.name}
                            </Typography>
                            <Typography>
                                <strong>Description:</strong> {itinerary.description || 'No description available.'}
                            </Typography>
                            <Typography>
                                <strong>Available Dates:</strong> {itinerary.AvailableDates.join(', ')}
                            </Typography>
                            <Typography>
                                <strong>Price:</strong> ${itinerary.totalPrice}
                            </Typography>
                            <Typography>
                                <strong>Language:</strong> {itinerary.LanguageOfTour.join(', ')}
                            </Typography>
                            <Typography>
                                <strong>Pickup Location:</strong> {itinerary.PickUpLocation}
                            </Typography>
                            <Typography>
                                <strong>Dropoff Location:</strong> {itinerary.DropOffLocation}
                            </Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                            <Tooltip title="Edit">
                                <IconButton color="primary">
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={itinerary.isActivated ? "Deactivate" : "Activate"}>
                                <IconButton
                                    color={itinerary.isActivated ? "error" : "success"}
                                    onClick={() =>
                                        itinerary.isActivated
                                            ? handleDeactivateItinerary(itinerary._id)
                                            : handleActivateItinerary(itinerary._id)
                                    }
                                >
                                    {itinerary.isActivated ? <CancelIcon /> : <CheckCircleIcon />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton
                                    color="error"
                                    onClick={() => handleDeleteItinerary(itinerary._id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Card>
                    ))}
                </Box>
            ) : (
                <Typography variant="body1" textAlign="center">
                    No itineraries found. Create one to get started!
                </Typography>
            )}
        </Box>
    );

};

export default ViewMyItineraries;
