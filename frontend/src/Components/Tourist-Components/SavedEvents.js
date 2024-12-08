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
    CircularProgress, 
} from '@mui/material';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
// import BookIcon from '@mui/icons-material/Book';
// import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

// const mapContainerStyle = {
//     width: '100%',
//     height: '150px',
// };

const SavedEvents = () => {
    const [savedActivities, setSavedActivities] = useState([]);
    const [savedItineraries, setSavedItineraries] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);  // Add loading state
    // const { isLoaded } = useLoadScript({
    //     googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your Google Maps API key
    // });

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

    const fetchSavedItineraries = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/saved-itineraries', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSavedItineraries(response.data.itineraries || []);
        } catch (error) {
            setMessage('Error fetching saved itineraries');
            console.error('Error fetching saved itineraries:', error);
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
    const handleUnbookmark = async (type, id) => {
        try {
            const token = localStorage.getItem('token');
            const endpoint = type === 'activity' ? `/tourists/saved-activity/${id}` : `/tourists/saved-itineraries/${id}`;
            await axios.delete(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMessage(`${type === 'activity' ? 'Activity' : 'Itinerary'} removed from saved!`);

            if (type === 'activity') {
                setSavedActivities(savedActivities.filter((item) => item._id !== id));
            } else {
                setSavedItineraries(savedItineraries.filter((item) => item._id !== id));
            }
        } catch (error) {
            setMessage(`Error removing ${type}`);
            console.error(`Error removing ${type}:`, error);
        }
    };

    // const handleBookActivity = async (activity) => {
    //     if (walletBalance < activity.price) {
    //         setMessage('Insufficient wallet balance!');
    //         return;
    //     }
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await axios.post(`/tourists/activities/book/${activity._id}`, {}, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         setWalletBalance(response.data.walletBalance);
    //         setMessage('Activity booked successfully!');
    //     } catch (error) {
    //         setMessage('Error booking activity');
    //         console.error('Error booking activity:', error);
    //     }
    // };

    useEffect(() => {
        setLoading(true); // Start loading
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchSavedActivities(),
                    fetchSavedItineraries(),
                    fetchWalletBalance(),
                ]);
            } catch (error) {
                setMessage('Error fetching data');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // End loading after all fetches are done
            }
        };
    
        fetchData(); // Trigger data fetching
    }, []);
    

    return (
            <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
              
        
                {message && <Alert severity="info" sx={{ mt : 2, mb: 2 }}>{message}</Alert>}

                {/* Show loading spinner if data is still loading */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <CircularProgress sx={{color:'#111E56'}} />
                </Box>
            ) : (
                <>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#111E56', marginBottom: '50px' }}>
                    Saved Activities
                </Typography>
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
                                    <Typography>
                                        <strong>Price:</strong> ${activity.price}
                                    </Typography>
                                </CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-around', padding: 1, marginTop: '-5px' }}>
                                    
                                    <Tooltip title="Unbookmark">
                                        <IconButton
                                            onClick={() => handleUnbookmark('activity',activity._id)}
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
        
                {/* Saved Itineraries Section */}
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#111E56', marginTop: '50px' }}>
                    Saved Itineraries
                </Typography>
        
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                    {savedItineraries.length > 0 ? (
                        savedItineraries.map((itinerary) => (
                            <Card
                                key={itinerary._id}
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
                                        {itinerary.name}
                                    </Typography>
                                    <Typography>
                                        <strong>Date:</strong>{' '}
                                        {new Date(itinerary.AvailableDates[0]).toLocaleDateString()}
                                    </Typography>
                                    <Typography>
                                        <strong>Total Price:</strong> ${itinerary.totalPrice}
                                    </Typography>
                                </CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-around', padding: 1, marginTop: '-5px' }}>
                                    
                                    <Tooltip title="Unbookmark">
                                        <IconButton
                                            onClick={() => handleUnbookmark('itinerary', itinerary._id)}
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
                        <Typography>No saved itineraries available</Typography>
                    )}
                </Box>
                </>
            )}
            </Box>
        );        
};

export default SavedEvents;
