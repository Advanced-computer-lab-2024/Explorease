import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, Box, Grid, Tooltip } from '@mui/material';
import { EmojiNature, MonetizationOn, Stars } from '@mui/icons-material';

const MyPoints = () => {
    const [points, setPoints] = useState(0);
    const [redeemAmount, setRedeemAmount] = useState('');
    const [message, setMessage] = useState('');
    const [badgeLevel, setBadgeLevel] = useState(null); // For icon representation

    // Map badge levels to icons and names
    const badgeIcons = {
        explorer: {
            icon: <EmojiNature fontSize="large" sx={{ color: '#4caf50' }} />,
            name: 'Explorer',
        },
        "money fellow": {
            icon: <MonetizationOn fontSize="large" sx={{ color: '#ff9800' }} />,
            name: 'Money Fellow',
        },
        "money talks": {
            icon: <Stars fontSize="large" sx={{ color: '#3f51b5' }} />,
            name: 'Money Talks',
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                // Fetch current points
                const pointsResponse = await axios.get('/tourists/myPoints', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPoints(pointsResponse.data.points);

                // Fetch badge level
                const badgeResponse = await axios.get('/tourists/myBadge', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBadgeLevel(badgeResponse.data.badge.toLowerCase());
            } catch (error) {
                console.error('Error fetching points or badge:', error);
            }
        };
        fetchData();
    }, []);

    const handleRedeem = async () => {
        if (!redeemAmount) {
            setMessage('Please select an amount to redeem.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/tourists/convertPointsToRedeemableAmount',
                { money: redeemAmount },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPoints(response.data.remainingPoints);
            setMessage(
                `Successfully redeemed ${redeemAmount} EGP. Wallet balance is now ${response.data.wallet} EGP.`
            );
            setRedeemAmount(''); // Reset selected amount after redemption
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error redeeming points');
            console.error(error);
        }
    };

    const buttonOptions = [
        { pointsRequired: 10000, label: '100 EGP' },
        { pointsRequired: 20000, label: '200 EGP' },
        { pointsRequired: 50000, label: '500 EGP' },
    ];

    return (
        <Box sx={{ position: 'relative', padding: '20px' }}>
            {/* Badge Icon in Top Right with Tooltip */}
            {badgeLevel && badgeIcons[badgeLevel] && (
    <Tooltip title={badgeIcons[badgeLevel].name}>
        <Box
            sx={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                display: 'flex',
                alignItems: 'center',
                transform: 'scale(1.5)', // Scale the whole icon box
            }}
        >
            {React.cloneElement(badgeIcons[badgeLevel].icon, {
                fontSize: 'inherit', // Inherit font size from Box scaling
                style: { fontSize: '3rem' }, // Directly set larger size for icon
            })}
        </Box>
    </Tooltip>
)}


            <Typography variant="h4" gutterBottom  sx={{fontWeight:'bold', color:'#111E56'}}>
                My Points
            </Typography>

            <Box
    sx={{
        position: 'center',
        display: 'flex',
        marginLeft: '500px',
        justifyContent: 'center',
        alignItems: 'center',
        
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        backgroundColor: 'transparent', // Light purple background
        
    }}
>
    <Typography
        sx={{
            fontSize: '5rem', // Huge font size
            fontWeight: 'bold',
            color: '#6a1b9a', // Purple color
            position: 'center',
        }}
    >
        {points}
    </Typography>
</Box>


            <Box mt={2} display="flex" justifyContent="center" gap={2} sx={{marginTop:'30px'}}>
                {buttonOptions.map((option) => (
                    <Button
                        key={option.pointsRequired}
                        variant="contained"
                        color={redeemAmount === option.pointsRequired / 100 ? 'secondary' : 'primary'}
                        onClick={() => setRedeemAmount(option.pointsRequired / 100)}
                        sx={{
                            borderRadius: '20px',
                            padding: '10px 20px',
                            textTransform: 'none',
                            boxShadow:
                                redeemAmount === option.pointsRequired / 100
                                    ? '0 0 10px rgba(0, 0, 0, 0.2)'
                                    : 'none',
                            backgroundColor:
                                redeemAmount === option.pointsRequired / 100 ? '#e0e0e0' : '#3f51b5',
                            '&:hover': {
                                backgroundColor: '#d4d4d4',
                                color: '#000',
                            },
                        }}
                    >
                        {`${option.pointsRequired} points = ${option.label}`}
                    </Button>
                ))}
            </Box>

            <Box mt={3} textAlign="center">
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleRedeem}
                    disabled={!redeemAmount}
                    sx={{
                        borderRadius: '20px',
                        padding: '10px 30px',
                        textTransform: 'none',
                        marginTop: '20px',
                        opacity: redeemAmount ? 1 : 0.5,
                        backgroundColor: '#111E56',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'white',
                            color: '#111E56',
                            border: '1px solid #111E56',
                        },
                    }}
                >
                    Convert
                </Button>
            </Box>

            {message && (
                <Typography color="success" mt={2} textAlign="center">
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default MyPoints;
