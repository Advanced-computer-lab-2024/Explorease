import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Typography, Box } from '@mui/material';

const Payment = () => {
    const { bookingType, id } = useParams(); // bookingType can be 'activity' or 'itinerary'
    const [tourist, setTourist] = useState({});
    const [price, setPrice] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTourist = async () => {
            const token = localStorage.getItem('token');
            try {
                const touristResponse = await axios.get('/tourists/myProfile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTourist(touristResponse.data);

                // Fetch the price of the activity or itinerary
                const bookingResponse = await axios.get(`/${bookingType}/${id}`);
                setPrice(bookingResponse.data.price);
            } catch (error) {
                console.error('Error fetching tourist or booking details:', error);
            }
        };
        fetchTourist();
    }, [bookingType, id]);

    const handlePayment = async () => {
        if (tourist.wallet < price) {
            setError('Insufficient funds in wallet');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`/${bookingType === 'activity' ? 'bookings' : 'bookingsItineraries'}/create`, {
                Tourist: tourist._id,
                [bookingType.charAt(0).toUpperCase() + bookingType.slice(1)]: id,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Deduct the amount from the wallet
            await axios.put('/tourists/updateWallet', {
                amount: -price
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate('/confirmation');
        } catch (error) {
            console.error('Error processing payment:', error);
            setError('Payment failed. Please try again.');
        }
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>Payment</Typography>
            <Typography variant="h6">Total Price: ${price}</Typography>
            <Typography variant="body1">Wallet Balance: ${tourist.wallet}</Typography>
            {error && <Typography color="error">{error}</Typography>}
            <Button
                variant="contained"
                color="primary"
                onClick={handlePayment}
                fullWidth
                sx={{ marginTop: '20px' }}
            >
                Confirm Payment
            </Button>
        </Box>
    );
};

export default Payment;
