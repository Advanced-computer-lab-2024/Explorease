import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Button, TextField, Avatar } from '@mui/material';
import { Rating } from '@mui/material';

const ReviewGuides = () => {
    const [guides, setGuides] = useState([]);
    const [ratings, setRatings] = useState({});
    const [comments, setComments] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchGuides();
    }, []);

    const fetchGuides = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.get('/tourists/itineraries/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const currentDate = new Date();
            const guideIds = new Set();

            response.data.forEach(booking => {
                const itinerary = booking.Itinerary;
                if (itinerary && booking.Status !== 'Cancelled' && new Date(itinerary.AvailableDates[0]) < currentDate) {
                    guideIds.add(itinerary.createdBy);
                }
            });

            const guideDetailsPromises = Array.from(guideIds).map(async (guideId) => {
                try {
                    const guideResponse = await axios.get(`/tourists/get-my-guides/${guideId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    return guideResponse.data.tourguide;
                } catch (error) {
                    console.error(`Error fetching guide with ID ${guideId}:`, error);
                    return null;
                }
            });

            const guidesData = await Promise.all(guideDetailsPromises);
            setGuides(guidesData.filter(guide => guide !== null));
        } catch (error) {
            console.error('Error fetching guides:', error);
            setErrorMessage('Error loading guides for review.');
        }
    };

    const handleRatingChange = (guideId, value) => {
        setRatings(prev => ({ ...prev, [guideId]: value }));
    };

    const handleCommentChange = (guideId, value) => {
        setComments(prev => ({ ...prev, [guideId]: value }));
    };

    const submitReview = async (guideId) => {
        if (!ratings[guideId] || !comments[guideId]) {
            alert("Please enter both a rating and a comment.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`/tourists/guides/${guideId}/add-review`, 
                { rating: ratings[guideId], comment: comments[guideId] }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Review submitted successfully!");
            setRatings(prev => ({ ...prev, [guideId]: '' }));
            setComments(prev => ({ ...prev, [guideId]: '' }));
        } catch (error) {
            console.error('Error submitting review:', error);
            setErrorMessage('Error submitting review.');
        }
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>Review Your Guides</Typography>

            {errorMessage && <Typography color="error">{errorMessage}</Typography>}

            {guides.length > 0 ? (
                guides.map(guide => (
                    <Card key={guide._id} sx={{ mb: 2 }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                                alt={guide.username}
                                src={guide.imageUrl}
                                sx={{ width: 56, height: 56, mr: 2 }}
                            />
                            <Box>
                                <Typography variant="h6">{guide.username}</Typography>
                                
                                <Rating
                                    value={ratings[guide._id] || 0}
                                    onChange={(event, newValue) => handleRatingChange(guide._id, newValue)}
                                />

                                <TextField
                                    label="Comment"
                                    multiline
                                    rows={3}
                                    value={comments[guide._id] || ''}
                                    onChange={(e) => handleCommentChange(guide._id, e.target.value)}
                                    fullWidth
                                    sx={{ mt: 1, mb: 1 }}
                                />

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => submitReview(guide._id)}
                                >
                                    Submit Review
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography>No tour guides available for review.</Typography>
            )}
        </Box>
    );
};

export default ReviewGuides;
