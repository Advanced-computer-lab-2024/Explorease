import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    Alert,
    Tooltip,
} from '@mui/material';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import BookIcon from '@mui/icons-material/Book';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const mapContainerStyle = {
    width: '100%',
    height: '150px',
};

const SavedEvents = () => {
    const [savedActivities, setSavedActivities] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0);
    const [message, setMessage] = useState('');
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your Google Maps API key
    });

    const fetchSavedActivities = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/saved-activity', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSavedActivities(response.data.activities || []);
        } catch (error) {
            setMessage('Error fetching saved activities');
            console.error('Error fetching saved activities:', error);
        }
    };

    const fetchWalletBalance = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/myProfile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWalletBalance(response.data.wallet || 0);
        } catch (error) {
            setMessage('Error fetching wallet balance');
            console.error('Error fetching wallet balance:', error);
        }
    };

    const handleUnbookmark = async (activityId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/tourists/saved-activity/${activityId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage('Activity removed from saved activities!');
            setSavedActivities(savedActivities.filter((activity) => activity._id !== activityId));
        } catch (error) {
            setMessage('Error removing activity from saved activities');
            console.error('Error removing activity:', error);
        }
    };

    const handleBookActivity = async (activity) => {
        if (walletBalance < activity.price) {
            setMessage('Insufficient wallet balance!');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`/tourists/activities/book/${activity._id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWalletBalance(response.data.walletBalance);
            setMessage('Activity booked successfully!');
        } catch (error) {
            setMessage('Error booking activity');
            console.error('Error booking activity:', error);
        }
    };

    useEffect(() => {
        fetchSavedActivities();
        fetchWalletBalance();
    }, []);

    return (
        <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom sx={{fontWeight:'bold', color:'#111E56', marginBottom:'50px'}}>
                Saved Activities
            </Typography>

            {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {savedActivities.length > 0 ? (
                    savedActivities.map((activity) => (
                        <Card
                            key={activity._id}
                            sx={{
                                width: '300px',
                                boxShadow: 3,
                                padding: 2,
                                textAlign: 'center',
                                position: 'relative',
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.03)',
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                                },
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: '#111E56',
                                        fontWeight: 'bold',
                                        marginBottom: '10px',
                                    }}
                                >
                                    {activity.name}
                                </Typography>
                                <Typography>
                                    <strong>Date:</strong>{' '}
                                    {new Date(activity.date).toLocaleDateString()}
                                </Typography>
                                {/* <Typography>
                                    <strong>Location:</strong> {activity.location}
                                </Typography> */}
                                <Typography>
                                    <strong>Price:</strong> ${activity.price}
                                </Typography>
                                {/* Right Section */}
                                <Box
                                    sx={{
                                        flex: 1,
                                        marginTop: '5px',
                                        minWidth: '240px',
                                        height: '200px',
                                        border: '1px solid #ccc',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        style={{ border: 0 }}
                                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDUP5fw3jw8bvJ7yj9OskV5wdm5sNUbII4&q=${encodeURIComponent(
                                            activity.location
                                          )}`}
                                        allowFullScreen
                                    ></iframe>
                                </Box>
                            </CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    padding: 1,
                                    
                                }}
                            >
                                <Tooltip title="Book Now">
                                    <IconButton
                                        onClick={() => handleBookActivity(activity)}
                                        sx={{
                                            backgroundColor: '#111E56',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'white',
                                                color: '#111E56',
                                                border: '1px solid #111E56',
                                            },
                                        }}
                                    >
                                        <BookIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Unbookmark">
                                    <IconButton
                                        onClick={() => handleUnbookmark(activity._id)}
                                        sx={{
                                            backgroundColor: '#FF5733',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#FF7961',
                                                color: 'black',
                                            },
                                        }}
                                    >
                                        <BookmarkRemoveIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Card>
                    ))
                ) : (
                    <Typography>No saved activities available</Typography>
                )}
            </Box>
        </Box>
    );
};

export default SavedEvents;
