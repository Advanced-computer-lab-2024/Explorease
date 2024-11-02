import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography, Box, Card, CardContent, Stack } from '@mui/material';

const UserApproval = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [message, setMessage] = useState('');

    const token = localStorage.getItem('token');

    const axiosConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    useEffect(() => {
        const fetchPendingUsers = async () => {
            try {
                const response = await axios.get('/admins/pending-users', axiosConfig);
                setPendingUsers([
                    ...response.data.sellers.map(user => ({ ...user, userType: 'Seller' })),
                    ...response.data.advertisers.map(user => ({ ...user, userType: 'Advertiser' })),
                    ...response.data.tourGuides.map(user => ({ ...user, userType: 'TourGuide' }))
                ]);
            } catch (error) {
                setMessage('Error fetching pending users');
            }
        };

        fetchPendingUsers();
    }, []);

    const handleAccept = async (userId, userType) => {
        try {
            await axios.post('/admins/accept-user', { userId, userType }, axiosConfig);
            setMessage(`${userType} accepted successfully!`);
            setPendingUsers(pendingUsers.filter(user => user._id !== userId));
        } catch (error) {
            setMessage('Error accepting user');
        }
    };

    const handleReject = async (userId, userType) => {
        try {
            await axios.post('/admins/reject-user', { userId, userType }, axiosConfig);
            setMessage(`${userType} rejected and removed from the system.`);
            setPendingUsers(pendingUsers.filter(user => user._id !== userId));
        } catch (error) {
            setMessage('Error rejecting user');
        }
    };

    const handleDownload = async (docUrl, docType) => {
        try {
            const response = await fetch(docUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${docType}.pdf`;
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading document:", error);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 6, p: 4, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                User Approval
            </Typography>
            {message && (
                <Typography sx={{ mt: 2, color: message.includes('Error') ? 'red' : 'green', textAlign: 'center' }}>
                    {message}
                </Typography>
            )}
            <Stack spacing={3} sx={{ mt: 3 }}>
                {pendingUsers.map((user) => (
                    <Card key={user._id} sx={{ boxShadow: 2, borderRadius: 1 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>{user.name || user.username}</Typography>
                            <Typography variant="body2" gutterBottom>{user.email}</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                User Type: {user.userType}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                {user.documents && Object.entries(user.documents).map(([docType, docUrl], idx) => (
                                    <Button
                                        key={idx}
                                        onClick={() => handleDownload(docUrl, docType)}
                                        sx={{ mr: 1, mb: 1 }}
                                        variant="outlined"
                                    >
                                        {`View ${docType}`}
                                    </Button>
                                ))}
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mr: 1 }}
                                    onClick={() => handleAccept(user._id, user.userType)}
                                >
                                    Accept
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleReject(user._id, user.userType)}
                                >
                                    Reject
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </Box>
    );
};

export default UserApproval;