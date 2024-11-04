import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Divider, Button } from '@mui/material';

const ViewBookings = () => {
    const [activityBookings, setActivityBookings] = useState([]);
    const [itineraryBookings, setItineraryBookings] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response.data);
            setActivityBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setErrorMessage('Error loading bookings.');
        }
    };

    const handleCancelBooking = async (bookingId) => {
        console.log(`Attempting to cancel booking with ID: ${bookingId}`);
        console.log(`Request URL: /tourists/bookings/cancelBooking/${bookingId}`);
    
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`/tourists/bookings/cancelBooking/${bookingId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('Response from server:', response.data);
    
            // Update local state to reflect the canceled booking
            setActivityBookings(activityBookings.map(booking => 
                booking._id === bookingId ? { ...booking, Status: 'Cancelled' } : booking
            ));
        } catch (error) {
            console.error('Error canceling booking:', error);
            console.error('Error response data:', error.response?.data);
            setErrorMessage('Error canceling booking.');
        }
    };
    
    

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
                            </CardContent>
                              
                            <Button
    variant="outlined"
    color="error"
    onClick={() => handleCancelBooking(booking._id)}
    disabled={booking.Status === 'Cancelled'}
    sx={{ mt: 2, mb: 2 }}
>
    {booking.Status === 'Cancelled' ? 'Booking Canceled' : 'Cancel Booking'}
</Button>

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
                                <Typography variant="h6">{booking.itinerary.name}</Typography>
                                <Typography><strong>Date:</strong> {new Date(booking.itinerary.date).toLocaleDateString()}</Typography>
                                <Typography><strong>Status:</strong> {booking.status}</Typography>
                                <Typography><strong>Booked At:</strong> {new Date(booking.bookedAt).toLocaleDateString()}</Typography>
                                <Typography><strong>Cancellation Deadline:</strong> {new Date(booking.cancellationDeadline).toLocaleDateString()}</Typography>
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
