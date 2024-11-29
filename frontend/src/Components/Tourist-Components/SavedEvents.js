import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Alert,
} from '@mui/material';

const SavedEvents = () => {
    const [savedActivities, setSavedActivities] = useState([]); // Directly store activities as an array
    const [walletBalance, setWalletBalance] = useState(0); // User wallet balance
    const [message, setMessage] = useState(''); // Error or success message

    // Fetch saved activities from the backend
    const fetchSavedActivities = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/saved-activity', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSavedActivities(response.data.activities || []); // Directly set activities array
        } catch (error) {
            setMessage('Error fetching saved activities');
            console.error('Error fetching saved activities:', error);
        }
    };

    // Fetch user wallet balance
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

    // Remove an activity from saved activities
    const handleUnbookmark = async (activityId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/tourists/saved-activity/${activityId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage('Activity removed from saved activities!');
            setSavedActivities(savedActivities.filter((activity) => activity._id !== activityId)); // Update state locally
        } catch (error) {
            setMessage('Error removing activity from saved activities');
            console.error('Error removing activity:', error);
        }
    };

    // Book an activity
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

    // Fetch data when component mounts
    useEffect(() => {
        fetchSavedActivities();
        fetchWalletBalance();
    }, []);

    return (
        <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>
                Saved Activities
            </Typography>

            {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {savedActivities.length > 0 ? (
                    savedActivities.map((activity) => (
                        <Card key={activity._id} sx={{ width: '300px', boxShadow: 3, padding: 2, textAlign: 'center' }}>
                            <CardContent>
                                <Typography variant="h6">{activity.name}</Typography>
                                <Typography><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</Typography>
                                <Typography><strong>Location:</strong> {activity.location}</Typography>
                                <Typography><strong>Price:</strong> ${activity.price}</Typography>
                            </CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 1 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
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
                                    Book Now
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
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
                                    Unbookmark
                                </Button>
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
