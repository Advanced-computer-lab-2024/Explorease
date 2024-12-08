import React, { useEffect, useState, useCallback} from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';


const ItinerarySuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Memoize the verifyStripePayment function to avoid unnecessary re-creations
    const verifyStripePayment = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                '/tourists/itineraries/stripe-success',
                { sessionId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Payment successful! Your itinerary has been booked.');
        } catch (error) {
            console.error('Error verifying Stripe payment:', error);
            setMessage('Failed to verify payment. Please contact support.');
        } finally {
            setLoading(false);
        }
    }, [sessionId]); // Add sessionId as dependency if needed

    useEffect(() => {
        if (sessionId) {
            verifyStripePayment();
        } else {
            setMessage('Invalid session. Please try again.');
            setLoading(false);
        }
    }, [sessionId, verifyStripePayment]);

    
    // const verifyStripePayment = async () => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         await axios.post(
    //             '/tourists/itineraries/stripe-success',
    //             { sessionId },
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );
    //         setMessage( 'Payment successful! Your itinerary has been booked.');
    //     } catch (error) {
    //         console.error('Error verifying Stripe payment:', error);
    //         setMessage('Failed to verify payment. Please contact support.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
            {loading ? (
                <>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ mt: 2 }}>Verifying payment...</Typography>
                </>
            ) : (
                <>
                    <Alert severity={message.includes('failed') ? 'error' : 'success'} sx={{ mb: 2 }}>
                        {message}
                    </Alert>
                    <Button variant="contained" color="primary" href="/tourist/">
                        Go to Home
                    </Button>
                </>
            )}
        </Box>
    );
};

export default ItinerarySuccess;
