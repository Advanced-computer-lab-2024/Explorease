import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Divider, Button, TextField, Rating } from '@mui/material';

const ViewBookings = () => {
    const [activityBookings, setActivityBookings] = useState([]);
    const [itineraryBookings, setItineraryBookings] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [ratings, setRatings] = useState({});
    const [comments, setComments] = useState({});

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch activity bookings
            const activityResponse = await axios.get('/tourists/activities/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActivityBookings(activityResponse.data);

            // Fetch itinerary bookings
            const itineraryResponse = await axios.get('/tourists/itineraries/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItineraryBookings(itineraryResponse.data);

        } catch (error) {
            if (error.response && error.response.status === 404) {
                setErrorMessage('No Bookings Found');
            } else {
                console.error('Error fetching guides:', error);
                setErrorMessage('Error loading guides for review.');
            }
        }
    };

    const handleCancelActivityBooking = async (bookingId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/tourists/bookings/cancelBooking/${bookingId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setActivityBookings(activityBookings.map(booking =>
                booking._id === bookingId ? { ...booking, Status: 'Cancelled' } : booking
            ));
        } catch (error) {
            console.error('Error canceling activity booking:', error);
            setErrorMessage('Error canceling activity booking.');
        }
    };

    const handleCancelItineraryBooking = async (bookingId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/tourists/bookings/cancelBookingItinerary/${bookingId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setItineraryBookings(itineraryBookings.map(booking =>
                booking._id === bookingId ? { ...booking, Status: 'Cancelled' } : booking
            ));
        } catch (error) {
            console.error('Error canceling itinerary booking:', error);
            setErrorMessage('Error canceling itinerary booking.');
        }
    };

    const handleRatingChange = (booking, value) => {
        setRatings(prev => ({ ...prev, [booking._id]: value }));
    };

    const handleCommentChange = (booking, value) => {
        setComments(prev => ({ ...prev, [booking._id]: value }));
    };

    const submitRating = async (booking, type) => {
        if (!ratings[booking._id]) {
            alert("Please enter a rating.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const endpoint = type === 'activity'
                ? `/tourists/activity-bookings/add-rating/${booking._id}`
                : `/tourists/itinerary-bookings/add-rating/${booking._id}`;

            await axios.post(endpoint, { rating: ratings[booking._id] }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Rating submitted successfully!");
            setRatings(prev => ({ ...prev, [booking._id]: '' }));
            fetchBookings();  // Refresh bookings to reflect new rating
        } catch (error) {
            console.error('Error submitting rating:', error);
            setErrorMessage('Error submitting rating.');
        }
    };

    const submitComment = async (booking, type) => {
        if (!comments[booking._id]) {
            alert("Please enter a comment.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const endpoint = type === 'activity'
                ? `/tourists/activity-bookings/add-comment/${booking._id}`
                : `/tourists/itinerary-bookings/add-comment/${booking._id}`;

            await axios.post(endpoint, { comment: comments[booking._id] }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Comment submitted successfully!");
            setComments(prev => ({ ...prev, [booking._id]: '' }));
            fetchBookings();  // Refresh bookings to reflect new comment
        } catch (error) {
            console.error('Error submitting comment:', error);
            setErrorMessage('Error submitting comment.');
        }
    };

    const isPastDate = (date) => new Date(date) < new Date();
    const isCancellationAllowed = (cancellationDeadline) => new Date() < new Date(cancellationDeadline);

    return (
        <Box sx={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>My Bookings</Typography>

            {errorMessage && <Typography color="error">{errorMessage}</Typography>}

            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>Activity Bookings</Typography>
                {activityBookings.length > 0 ? (
                    activityBookings.map(booking => (
                        <Card key={booking._id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{booking.Activity.name}</Typography>
                                <Typography><strong>Date:</strong> {new Date(booking.Activity.date).toLocaleDateString()}</Typography>
                                <Typography><strong>Status:</strong> {booking.Status}</Typography>
                                <Typography><strong>Booked At:</strong> {new Date(booking.BookedAt).toLocaleDateString()}</Typography>
                                <Typography><strong>Cancellation Deadline:</strong> {new Date(booking.CancellationDeadline).toLocaleDateString()}</Typography>
                                
                                {isPastDate(booking.Activity.date) ? (
                                    <Box>
                                        {booking.rating !== undefined ? (
                                            <Typography><strong>Your Rating:</strong> {booking.rating}</Typography>
                                        ) : (
                                            <Box sx={{ mt: 2 }}>
                                                <TextField
                                                    label="Rating (1-5)"
                                                    type="number"
                                                    value={ratings[booking._id] || ''}
                                                    onChange={(e) => handleRatingChange(booking, e.target.value)}
                                                    inputProps={{ min: 1, max: 5 }}
                                                    fullWidth
                                                    sx={{ mb: 1 }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => submitRating(booking, 'activity')}
                                                    sx={{ mb: 2 }}
                                                >
                                                    Submit Rating
                                                </Button>
                                            </Box>
                                        )}

                                        {booking.comment ? (
                                            <Typography><strong>Your Comment:</strong> {booking.comment}</Typography>
                                        ) : (
                                            <Box sx={{ mt: 2 }}>
                                                <TextField
                                                    label="Comment"
                                                    multiline
                                                    rows={3}
                                                    value={comments[booking._id] || ''}
                                                    onChange={(e) => handleCommentChange(booking, e.target.value)}
                                                    fullWidth
                                                    sx={{ mb: 1 }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => submitComment(booking, 'activity')}
                                                >
                                                    Submit Comment
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                ) : isCancellationAllowed(booking.CancellationDeadline) && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleCancelActivityBooking(booking._id)}
                                        sx={{ mt: 2, mb: 2 }}
                                    >
                                        {booking.Status === 'Cancelled' ? 'Booking Canceled' : 'Cancel Booking'}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography>No activity bookings available.</Typography>
                )}
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box>
                <Typography variant="h5" gutterBottom>Itinerary Bookings</Typography>
                {itineraryBookings.length > 0 ? (
                    itineraryBookings.map(booking => (
                        <Card key={booking._id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{booking.Itinerary.name}</Typography>
                                <Typography><strong>Date:</strong> {new Date(booking.Itinerary.AvailableDates[0]).toLocaleDateString()}</Typography>
                                <Typography><strong>Status:</strong> {booking.Status}</Typography>
                                <Typography><strong>Booked At:</strong> {new Date(booking.BookedAt).toLocaleDateString()}</Typography>
                                <Typography><strong>Cancellation Deadline:</strong> {new Date(booking.CancellationDeadline).toLocaleDateString()}</Typography>
                                
                                {isPastDate(booking.Itinerary.AvailableDates[0]) ? (
                                    <Box>
                                        {booking.rating !== undefined ? (
                                            <Typography><strong>Your Rating:</strong> {booking.rating}</Typography>
                                        ) : (
                                            <Box sx={{ mt: 2 }}>
                                                 <Rating
                                                    name={`rating-${booking._id}`}
                                                    value={ratings[booking._id] || 0}
                                                    onChange={(e, newValue) => handleRatingChange(booking, newValue)}
                                                    precision={1}
                                                    max={5}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => submitRating(booking, 'itinerary')}
                                                    sx={{ mb: 2 }}
                                                >
                                                    Submit Rating       
                                                </Button>
                                            </Box>
                                        )}

                                        {booking.comment ? (
                                            <Typography><strong>Your Comment:</strong> {booking.comment}</Typography>
                                        ) : (
                                            <Box sx={{ mt: 2 }}>
                                                <TextField
                                                    label="Comment"
                                                    multiline
                                                    rows={3}
                                                    value={comments[booking._id] || ''}
                                                    onChange={(e) => handleCommentChange(booking, e.target.value)}
                                                    fullWidth
                                                    sx={{ mb: 1 }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => submitComment(booking, 'itinerary')}
                                                >
                                                    Submit Comment
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                ) : isCancellationAllowed(booking.CancellationDeadline) && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleCancelItineraryBooking(booking._id)}
                                        sx={{ mt: 2, mb: 2 }}
                                    >
                                        {booking.Status === 'Cancelled' ? 'Booking Canceled' : 'Cancel Booking'}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography>No itinerary bookings available.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default ViewBookings;
