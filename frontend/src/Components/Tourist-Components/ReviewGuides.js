import React, { useEffect, useState , useCallback} from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Button, TextField, Avatar, CircularProgress  } from '@mui/material';
import { Rating } from '@mui/material';


const ReviewGuides = () => {
    const [guides, setGuides] = useState([]);
    const [ratings, setRatings] = useState({});
    const [comments, setComments] = useState({});
    const [reviews, setReviews] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state

    const token = localStorage.getItem('token');

// Memoize fetchReviewsForGuide function
const fetchReviewsForGuide = useCallback(async (guideId) => {
    try {
        const response = await axios.get(`/tourists/getTGRev/${guideId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(`Fetched reviews for guide ${guideId}:`, response.data); // Log to check data structure
        setReviews(prev => ({ ...prev, [guideId]: response.data }));
    } catch (error) {
        console.error(`Error fetching reviews for guide ${guideId}:`, error);
    }
}, [token]); // Add token as a dependency

// Memoize fetchGuides to ensure it does not change unnecessarily
const fetchGuides = useCallback(async () => {
    try {
        const response = await axios.get('/tourists/itineraries/bookings', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const guideIds = new Set(
            response.data
                .filter(booking => booking.Status !== 'Cancelled' && new Date(booking.Itinerary.AvailableDates[0]) < new Date())
                .map(booking => booking.Itinerary.createdBy)
        );

        const guideDetailsPromises = Array.from(guideIds).map(async (guideId) => {
            try {
                const guideResponse = await axios.get(`/tourists/get-my-guides/${guideId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const guide = guideResponse.data.tourguide;
                await fetchReviewsForGuide(guideId);
                return guide;
            } catch (error) {
                console.error(`Error fetching guide with ID ${guideId}:`, error);
                return null;
            }
        });

        const guidesData = await Promise.all(guideDetailsPromises);
        setGuides(guidesData.filter(guide => guide !== null));

        if (guidesData.length === 0) {
            setErrorMessage('No tour guides available for review.');
        }
    } catch (error) {
        setErrorMessage(error.response?.status === 404 ? 'No Itinerary Bookings Found' : 'Error loading guides for review.');
        console.error('Error fetching guides:', error);
    }finally {
        setLoading(false); // Set loading to false after the fetch operation is completed
    }
}, [token, fetchReviewsForGuide]); // Add fetchReviewsForGuide as a dependency

    useEffect(() => {
        fetchGuides();
    }, [fetchGuides]); // Use memoized fetchGuides as a dependency


    // const fetchGuides = async () => {
    //     try {
    //         const response = await axios.get('/tourists/itineraries/bookings', {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });

    //         const guideIds = new Set(
    //             response.data
    //                 .filter(booking => booking.Status !== 'Cancelled' && new Date(booking.Itinerary.AvailableDates[0]) < new Date())
    //                 .map(booking => booking.Itinerary.createdBy)
    //         );

    //         const guideDetailsPromises = Array.from(guideIds).map(async (guideId) => {
    //             try {
    //                 const guideResponse = await axios.get(`/tourists/get-my-guides/${guideId}`, {
    //                     headers: { Authorization: `Bearer ${token}` }
    //                 });
                    
    //                 const guide = guideResponse.data.tourguide;
    //                 await fetchReviewsForGuide(guideId);
    //                 return guide;
    //             } catch (error) {
    //                 console.error(`Error fetching guide with ID ${guideId}:`, error);
    //                 return null;
    //             }
    //         });

    //         const guidesData = await Promise.all(guideDetailsPromises);
    //         setGuides(guidesData.filter(guide => guide !== null));

    //         if (guidesData.length === 0) {
    //             setErrorMessage('No tour guides available for review.');
    //         }
    //     } catch (error) {
    //         setErrorMessage(error.response?.status === 404 ? 'No Itinerary Bookings Found' : 'Error loading guides for review.');
    //         console.error('Error fetching guides:', error);
    //     }
    // };

    // const fetchReviewsForGuide = async (guideId) => {
    //     try {
    //         const response = await axios.get(`/tourists/getTGRev/${guideId}`, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });
            
    //         console.log(`Fetched reviews for guide ${guideId}:`, response.data); // Log to check data structure
    //         setReviews(prev => ({ ...prev, [guideId]: response.data }));
    //     } catch (error) {
    //         console.error(`Error fetching reviews for guide ${guideId}:`, error);
    //     }
    // };

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
            const response = await axios.post(`/tourists/tourguideRev/add`, 
                { tourGuideId: guideId, rating: ratings[guideId], review: comments[guideId] }, 
                { headers: { Authorization: `Bearer ${token}` }
            });

            const newReview = response.data.review;
            alert("Review submitted successfully!");

            setReviews(prev => ({
                ...prev,
                [guideId]: [...(prev[guideId] || []), newReview]
            }));

            setRatings(prev => ({ ...prev, [guideId]: '' }));
            setComments(prev => ({ ...prev, [guideId]: '' }));
            fetchReviewsForGuide();
        } catch (error) {
            console.error('Error submitting review:', error);
            setErrorMessage('Error submitting review.');
        }
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom sx={{fontWeight:'bold' , color:'#111E56'}}>Review Your Guides</Typography>

            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <CircularProgress sx={{color:'#111E56'}}/>
                </Box>
            ) : (
            guides.length > 0 ? (
                guides.map(guide => {
                    const guideReviews = reviews[guide._id] || [];
                    console.log(`Reviews for guide ${guide._id}:`, guideReviews); // Log to check if reviews are loaded correctly

                    // Check if there is an existing review by this tourist for this guide
                    const hasReviews = guideReviews.length === 0 ? false : true;
                    const currentReview = guideReviews;
                    return (
                        <Card key={guide._id} sx={{ mb: 2 ,
                            transition: "transform 0.3s, box-shadow 0.3s", 
                            boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
                            "&:hover": {
                              transform: "scale(1.05)",
                              boxShadow: "0 10px 15px rgba(0, 0, 0, 0.2)"
                            }}}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar
                                    alt={guide.username}
                                    src={guide.imageUrl}
                                    sx={{ width: 56, height: 56, mr: 2 }}
                                />
                                <Box>
                                    <Typography variant="h6" sx={{fontWeight:'bold', color:'#111E56'}}>{guide.username}</Typography>

                                    {hasReviews ? (
                                        <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: '4px' }}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                {currentReview.rating} Stars
                                            </Typography>
                                            <Typography variant="body2">{currentReview.review}</Typography>
                                        </Box>
                                    ) : (
                                        <>
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
                                        </>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    );
                })
            ) : (
                !errorMessage && <Typography>No tour guides available for review.</Typography>
            )
            )}
        </Box>
    );
};

export default ReviewGuides;
