import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';

const Success = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const hasCalledAPI = useRef(false);  // Ref to track if the API call has been made

    useEffect(() => {
        if (sessionId && !hasCalledAPI.current) {  // Check if sessionId exists and API hasn't been called yet
            verifyStripePayment();
        }
    }, [sessionId]);  // This effect runs whenever sessionId changes

    const verifyStripePayment = async () => {
        // Prevent calling the API more than once
        if (hasCalledAPI.current) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/tourists/cart/stripe-success',
                { sessionId },
                { headers: { Authorization: `Bearer ${token}` } }
            );            
            hasCalledAPI.current = true;  // Mark that the API has been called

            console.log(response); // This should log only once now
            setMessage('Payment successful! Your purchase has been completed.');
        } catch (error) {
            console.error('Error verifying Stripe payment:', error);
            setMessage('Failed to verify payment. Please contact support.');
        } finally {
            setLoading(false);
        }
    };

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

export default Success;
