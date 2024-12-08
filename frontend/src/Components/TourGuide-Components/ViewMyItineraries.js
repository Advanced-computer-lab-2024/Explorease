import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Alert,
    IconButton,
    Tooltip,
    TextField,
    Button,
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
    const [editingItinerary, setEditingItinerary] = useState(null);
    const [updatedItinerary, setUpdatedItinerary] = useState({});

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

                setItineraries(response.data || []);
            } catch (err) {
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
            await axios.delete(`/tourguide/deleteItinerary/${itineraryId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setItineraries((prev) => prev.filter((itinerary) => itinerary._id !== itineraryId));
            setMessage('Itinerary deleted successfully.');
        } catch (err) {
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
                    itinerary._id === itineraryId ? { ...itinerary, isActivated: true } : itinerary
                )
            );
            setMessage('Itinerary activated successfully.');
        } catch (err) {
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
                    itinerary._id === itineraryId ? { ...itinerary, isActivated: false } : itinerary
                )
            );
            setMessage('Itinerary deactivated successfully.');
        } catch (err) {
            setError('Failed to deactivate itinerary. Please try again.');
        }
    };

    // Handle start editing itinerary
    const handleEditItinerary = (itinerary) => {
        setEditingItinerary(itinerary._id);
        setUpdatedItinerary(itinerary);
    };

    // Handle update itinerary
    const handleUpdateItinerary = async (itineraryId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`/tourguide/updateItinerary/${itineraryId}`, updatedItinerary, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Update itinerary in state
            setItineraries((prev) =>
                prev.map((itinerary) =>
                    itinerary._id === itineraryId ? { ...itinerary, ...updatedItinerary } : itinerary
                )
            );
            setMessage('Itinerary updated successfully.');
            setEditingItinerary(null); // Stop editing
        } catch (err) {
            setError('Failed to update itinerary. Please try again.');
        }
    };

    // Handle input change for updating itinerary
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedItinerary((prev) => ({ ...prev, [name]: value }));
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
                                display: 'flex',
                                flexDirection: 'column',
                                width: 'calc(33.33% - 20px)', // Adjust card width to 1/3rd of the container width
                                boxShadow: 3,
                                marginBottom: '20px',
                                borderRadius: '12px',
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.03)',
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                                },
                               
                            }}
                        >
                            {/* Image */}
                            {itinerary.imageUrl && (
                                <img
                                    src={itinerary.imageUrl}
                                    alt={itinerary.name}
                                    style={{
                                        width: '100%',
                                        height: '60%',
                                        objectFit: 'cover',
                                        marginBottom: '10px',
                                        borderTopLeftRadius: '12px',
                                        borderTopRightRadius: '12px',
                                    }}
                                />
                            )}

                            {/* Top Section: Image and Details */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <CardContent sx={{ padding: 0 }}>
                                    {editingItinerary === itinerary._id ? (
                                        <>
                                            <TextField
                                                label="Name"
                                                value={updatedItinerary.name}
                                                name="name"
                                                fullWidth
                                                onChange={handleInputChange}
                                                sx={{ marginBottom: '10px', padding: '5px' }} // Added padding
                                            />
                                            <TextField
                                                label="Description"
                                                value={updatedItinerary.description}
                                                name="description"
                                                fullWidth
                                                onChange={handleInputChange}
                                                sx={{ marginBottom: '10px', padding: '5px' }} // Added padding
                                            />
                                            <TextField
                                                label="Available Dates"
                                                value={updatedItinerary.AvailableDates.join(', ')}
                                                name="AvailableDates"
                                                fullWidth
                                                onChange={handleInputChange}
                                                sx={{ marginBottom: '10px', padding: '5px' }} // Added padding
                                            />
                                            <TextField
                                                label="Price"
                                                value={updatedItinerary.totalPrice}
                                                name="totalPrice"
                                                fullWidth
                                                onChange={handleInputChange}
                                                sx={{ marginBottom: '10px', padding: '5px' }} // Added padding
                                            />
                                            <TextField
                                                label="Language"
                                                value={updatedItinerary.LanguageOfTour.join(', ')}
                                                name="LanguageOfTour"
                                                fullWidth
                                                onChange={handleInputChange}
                                                sx={{ marginBottom: '10px', padding: '5px' }} // Added padding
                                            />
                                            <TextField
                                                label="Pickup Location"
                                                value={updatedItinerary.PickUpLocation}
                                                name="PickUpLocation"
                                                fullWidth
                                                onChange={handleInputChange}
                                                sx={{ marginBottom: '10px', padding: '5px' }} // Added padding
                                            />
                                            <TextField
                                                label="Dropoff Location"
                                                value={updatedItinerary.DropOffLocation}
                                                name="DropOffLocation"
                                                fullWidth
                                                onChange={handleInputChange}
                                                sx={{ marginBottom: '10px', padding: '5px' }} // Added padding
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    color: '#111E56',
                                                    fontWeight: 'bold',
                                                    marginBottom: '10px',
                                                    textAlign: 'center',
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
                                        </>
                                    )}
                                </CardContent>
                            </Box>

                            {/* Bottom Section: Action Buttons */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                                {editingItinerary === itinerary._id ? (
                                    <Tooltip title="Save">
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleUpdateItinerary(itinerary._id)}
                                        >
                                            <CheckCircleIcon />
                                        </IconButton>
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Edit">
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEditItinerary(itinerary)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
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
