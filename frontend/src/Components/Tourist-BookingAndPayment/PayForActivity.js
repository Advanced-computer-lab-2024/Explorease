import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Alert } from '@mui/material';

const PayForActivity = () => {
    const { activityId } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState(null);
    const [wallet, setWallet] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchActivityAndWallet = async () => {
            try {
                const token = localStorage.getItem('token');
                const [activityRes, walletRes] = await Promise.all([
                    axios.get(`/activities/${activityId}`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/tourists/myProfile', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setActivity(activityRes.data);
                setWallet(walletRes.data.wallet);
            } catch (error) {
                console.error('Error fetching activity or wallet:', error);
                setErrorMessage('Error loading data');
            }
        };

        fetchActivityAndWallet();
    }, [activityId]);

    const handlePayment = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`/activities/${activityId}/book`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccessMessage('Payment successful! Booking created.');
            setWallet(response.data.walletBalance); // Update wallet balance

            // Redirect to tourist dashboard after 3 seconds
            setTimeout(() => navigate('/tourist'), 3000);
        } catch (error) {
            console.error('Payment error:', error);
            setErrorMessage(error.response?.data?.message || 'Payment failed');
        }
    };

    if (!activity) {
        return <div>Loading activity details...</div>;
    }

    return (
        <Box sx={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Pay for Activity</Typography>
            
            {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

            <Typography variant="h6" gutterBottom>Activity Details</Typography>
            <Typography><strong>Activity:</strong> {activity.name}</Typography>
            <Typography><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</Typography>
            <Typography><strong>Price:</strong> ${activity.price}</Typography>
            <Typography><strong>Current Wallet Balance:</strong> ${wallet}</Typography>
            <Typography><strong>Balance After Payment:</strong> ${wallet - activity.price}</Typography>

            {wallet >= activity.price ? (
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handlePayment}
                    sx={{ mt: 2 }}
                >
                    Pay and Book
                </Button>
            ) : (
                <Typography color="error" sx={{ mt: 2 }}>Insufficient funds in wallet. Please add more funds.</Typography>
            )}
        </Box>
    );
};

export default PayForActivity;
