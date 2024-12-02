import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';

const ActivitySuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (sessionId) {
            verifyStripePayment();
        } else {
            setMessage('Invalid session. Please try again.');
            setLoading(false);
        }
    }, [sessionId]);

    const verifyStripePayment = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!sessionId) {
                throw new Error('Session ID is missing from the URL.');
            }
    
            const response = await axios.post(
                '/tourists/activities/stripe-success',
                { sessionId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (response.status === 200) {
                setMessage('Payment successful! Your booking has been completed.');
            } else {
                setMessage('Unexpected response from the server. Please contact support.');
            }
        } catch (error) {
            console.error('Error verifying Stripe payment:', error);
    
            const errorMsg = error.response?.data?.message || 'Failed to verify payment. Please contact support.';
            setMessage(errorMsg);
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
                        Go to Dashboard
                    </Button>
                </>
            )}
        </Box>
    );
};

export default ActivitySuccess;
