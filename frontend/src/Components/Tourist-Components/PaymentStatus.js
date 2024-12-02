import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PaymentStatus = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/tourist'); // Redirect to tourist dashboard after 10 seconds
        }, 10000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
            }}
        >
            <CircularProgress />
            <Typography variant="h4" sx={{ mt: 3 }}>
                Payment Confirmed
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                Redirecting to your dashboard...
            </Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 4 }}
                onClick={() => navigate('/tourist')}
            >
                Go to Dashboard
            </Button>
        </Box>
    );
};

export default PaymentStatus;
