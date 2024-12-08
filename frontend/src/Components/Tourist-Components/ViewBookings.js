import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Button, TextField, Rating } from '@mui/material';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Carousel from 'react-multi-carousel'; // Carousel library
import 'react-multi-carousel/lib/styles.css'; // Carousel styles

const ViewBookings = () => {
    const [activityBookings, setActivityBookings] = useState([]);
    const [itineraryBookings, setItineraryBookings] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [ratings, setRatings] = useState({});
    const [comments, setComments] = useState({});

    useEffect(() => {
        fetchBookings();
    }, []); 

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch activity bookings
            const activityResponse = await axios.get('/tourists/activities/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const uniqueActivityBookings = [...new Map(activityResponse.data.map(item => [item._id, item])).values()];
            setActivityBookings(uniqueActivityBookings);


            // Fetch itinerary bookings
            const itineraryResponse = await axios.get('/tourists/itineraries/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const uniqueItineraryBookings = [...new Map(itineraryResponse.data.map(item => [item._id, item])).values()];
            setItineraryBookings(uniqueItineraryBookings);

        } catch (error) {
            if (error.response && error.response.status === 404) {
                //setErrorMessage('No Bookings Found');
            } else {
                console.error('Error fetching guides:', error);
                setErrorMessage('Error loading guides for review.');
            }
        }
    };

    const handleCancelActivityBooking = async (bookingId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/tourists/bookings/cancelBooking/${bookingId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setActivityBookings(activityBookings.map(booking =>
                booking._id === bookingId ? { ...booking, Status: 'Cancelled' } : booking
            ));
        } catch (error) {
            console.error('Error canceling activity booking:', error);
            setErrorMessage('Error canceling activity booking.');
        }
    };

    const handleCancelItineraryBooking = async (bookingId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/tourists/bookings/cancelBookingItinerary/${bookingId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setItineraryBookings(itineraryBookings.map(booking =>
                booking._id === bookingId ? { ...booking, Status: 'Cancelled' } : booking
            ));
        } catch (error) {
            console.error('Error canceling itinerary booking:', error);
            setErrorMessage('Error canceling itinerary booking.');
        }
    };

    // const handleRatingChange = (booking, value) => {
    //     setRatings(prev => ({ ...prev, [booking._id]: value }));
    // };

    const handleCommentChange = (booking, value) => {
        setComments(prev => ({ ...prev, [booking._id]: value }));
    };

    const handleRatingChange = (booking, value) => {
        // Directly update the state
        setRatings((prevRatings) => ({
            ...prevRatings,
            [booking._id]: value,
        }));

        // Determine the type based on the booking object, e.g., by checking if it's an itinerary or activity
    const type = booking.Itinerary ? 'itinerary' : 'activity';
    
        // Submit the rating after the state has been updated
        submitRating(booking, type, value);
    };
    
    const submitRating = async (booking, type, ratingValue) => {
        // Use the passed rating value directly instead of reading from state
        if (!ratingValue) {
            console.log('No rating selected.');
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            const endpoint =
                type === 'activity'
                    ? `/tourists/activity-bookings/add-rating/${booking._id}`
                    : `/tourists/itinerary-bookings/add-rating/${booking._id}`;
    
            console.log('Sending rating:', ratingValue);
            console.log('Endpoint:', endpoint);
    
            const response = await axios.post(endpoint, { rating: ratingValue }, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log('Rating API response:', response.data);
            alert('Rating submitted successfully!');
            fetchBookings(); // Refresh bookings to reflect the new rating
        } catch (error) {
            console.error('Error submitting rating:', error.response || error.message);
            setErrorMessage('Error submitting rating.');
        }
    };    
    

    const submitComment = async (booking, type) => {
        if (!comments[booking._id]) {
            alert("Please enter a comment.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const endpoint = type === 'activity'
                ? `/tourists/activity-bookings/add-comment/${booking._id}`
                : `/tourists/itinerary-bookings/add-comment/${booking._id}`;

            await axios.post(endpoint, { comment: comments[booking._id] }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Comment submitted successfully!");
            setComments(prev => ({ ...prev, [booking._id]: '' }));
            fetchBookings();  // Refresh bookings to reflect new comment
        } catch (error) {
            console.error('Error submitting comment:', error);
            setErrorMessage('Error submitting comment.');
        }
    };

    const getFilteredBookings = (bookings, type) => {
        return bookings.filter((booking) => {
            const date = type === 'activity' ? booking.Activity?.date : booking.Itinerary?.AvailableDates[0];
            return isPastDate(date);
        });
    };

    const getUpcomingBookings = (bookings, type) => {
        return bookings.filter((booking) => {
            const date = type === 'activity' ? booking.Activity?.date : booking.Itinerary?.AvailableDates[0];
            return isUpcomingDate(date);
        });
    };

    const isPastDate = (date) => new Date(date) < new Date();
    const isUpcomingDate = (date) => new Date(date) >= new Date();

    const isCancellationAllowed = (cancellationDeadline) => new Date() < new Date(cancellationDeadline);
    const pastActivityBookings = getFilteredBookings(activityBookings, 'activity');
    const upcomingActivityBookings = getUpcomingBookings(activityBookings, 'activity');
    const pastItineraryBookings = getFilteredBookings(itineraryBookings, 'itinerary');
    const upcomingItineraryBookings = getUpcomingBookings(itineraryBookings, 'itinerary');
    const placeholderImage =
    'https://worldwildschooling.com/wp-content/uploads/2024/01/Matterhorn_Mumemories_Adobe-Stock-Photo_682931585.jpg';

    const renderActivityCard = (booking) => (
        <Card
            key={booking._id}
            sx={{
                m: 2,
                mb: 10,
                borderRadius: '12px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                    backgroundColor: 'white',
                },
               height: '560px'
            }}
            className="carousel-card"
        >
            {/* Upper Section: Image */}
            {booking.Activity?.imageUrl && (
                    <img
                        src={placeholderImage}
                        alt={booking.Activity?.name}
                        style={{
                            width: '100%',
                            height: '60%',
                           
                            marginBottom: '16px',
                            objectFit: 'cover',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px',
                        }}
                    />
                )}
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                
    
                {/* Main Content Section (Details + Rating/Comment Side by Side) */}
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexGrow: 1 }}>
                    {/* Left Section: Details */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <Typography variant="h5" noWrap style={{fontWeight:'bold' , color:'#111E56'}}>
                            {booking.Activity?.name || 'Activity has been removed by the Advertiser.'}
                        </Typography>
                        {booking.Activity?.date && (
                            <Typography variant="body2">
                                <strong style={{fontWeight:'bold' , color:'#111E56'}}>Date:</strong>{' '}
                                {new Date(booking.Activity?.date).toLocaleDateString()}
                            </Typography>
                        )}
                        <Typography variant="body2">
                            <strong style={{fontWeight:'bold' , color:'#111E56'}}>Booked At:</strong> {new Date(booking.BookedAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                            <strong style={{fontWeight:'bold' , color:'#111E56'}}> Cancellation Deadline:</strong>{' '}
                            {new Date(booking.CancellationDeadline).toLocaleDateString()}
                        </Typography>
                    </Box>
    
                    {/* Right Section: Rating and Comment */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', ml: 2, width: '40%', alignItems: 'center', }}>
                        {isPastDate(booking.Activity?.date) ? (
                            <>
                                {/* If there's a rating, display it */}
                                {booking.rating !== undefined ? (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2">
                                            <strong>Your Rating:</strong>
                                        </Typography>
                                        <Rating
                                            name={`rating-${booking._id}`}
                                            value={booking.rating}
                                            readOnly
                                            precision={1}
                                            max={5}
                                        />
                                    </Box>
                                ) : (
                                     
<Box
        sx={{
            mb: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Center the content horizontally
        }}
    >
        <Typography variant="body2" sx={{ textAlign: 'center', mb: 1 }}>
            <strong>{booking.rating !== undefined ? 'Your Rating:' : 'Rate this Activity:'}</strong>
        </Typography>
        <Rating
            name={`rating-${booking._id}`}
            value={ratings[booking._id] || booking.rating || 0} // Fallback to 0 if no rating exists
            onChange={(event, newValue) => {
                if (newValue !== null) {
                    handleRatingChange(booking, newValue); // Update state and submit immediately
                }
            }}
            precision={1}
            max={5}
            sx={{
                '& .MuiRating-iconFilled': { color: '#FFDE21' }, // Customize filled star color
                '& .MuiRating-iconHover': { color: '#3f51b5' }, // Customize hover color
            }}
        />
    </Box>
                                
                                )}
                                {/* Comment Section */}
                                {booking.comment ? (
                                    <Typography variant="body2">
                                        <strong>Your Comment:</strong> {booking.comment}
                                    </Typography>
                                ) : (
                                    <Box >
                                        <TextField
                                            label="Comment"
                                            
                                            rows={1}
                                            value={comments[booking._id] || ''}
                                            onChange={(e) => handleCommentChange(booking, e.target.value)}
                                            sx={{ mb: 1, mt : -1 }}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                marginTop: '10px',
                                                backgroundColor: '#111E56',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'white',
                                                    color: '#111E56',
                                                    border: '1px solid #111E56',
                                                    
                                                },
                                                mb: 2,
                                            }}
                                            onClick={() => submitComment(booking, 'activity')} 
                                        >
                                            Submit Comment
                                        </Button>
                                    </Box>
                                )}
                            </>
                        ) : (
                            // If the date is not past, show cancel option
                            isCancellationAllowed(booking.CancellationDeadline) && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleCancelActivityBooking(booking._id)}
                                    sx={{ mt: 2, mb: 2 }}
                                    disabled={booking.Status === 'Cancelled'}
                                >
                                    {booking.Status === 'Cancelled' ? 'Booking Canceled' : 'Cancel Booking'}
                                </Button>
                            )
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
    
    const renderItineraryCard = (booking) => (
        <Card
            key={booking._id}
            sx={{
                m: 2,
                mb: 10,
                marginTop: '5px',
                borderRadius: '12px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                },
                height: '620px'

            }}
            className="carousel-card"
        >
            {booking.Itinerary?.imageUrl && (
                    <img
                        src={booking.Itinerary?.imageUrl}
                        alt={booking.Itinerary?.name}
                        style={{
                            width: '100%',
                            height: '60%',
                            marginBottom: '16px',
                            objectFit: 'cover',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px',
                        }}
                    />
                )}
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Upper Section: Image */}
                
    
                {/* Main Content Section (Details + Rating/Comment Side by Side) */}
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexGrow: 1 }}>
                    {/* Left Section: Details */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <Typography variant="h5" noWrap>
                            {booking.Itinerary?.name || 'Itinerary has been removed by the Advertiser.'}
                        </Typography>
                        {booking.Itinerary?.AvailableDates && (
                            <Typography variant="body2">
                                <strong>Date:</strong>{' '}
                                {new Date(booking.Itinerary?.AvailableDates[0]).toLocaleDateString()}
                            </Typography>
                        )}
                        <Typography variant="body2">
                            <strong>Status:</strong> {booking.Status}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Booked At:</strong> {new Date(booking.BookedAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Cancellation Deadline:</strong>{' '}
                            {new Date(booking.CancellationDeadline).toLocaleDateString()}
                        </Typography>
                    </Box>
    
                    {/* Right Section: Rating and Comment */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ml: 2, width: '40%' }}>
                        {isPastDate(booking.Itinerary.AvailableDates[0]) ? (
                            <>
                                {/* If there's a rating, display it */}
                                {booking.rating !== undefined ? (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2">
                                            <strong>Your Rating:</strong>
                                        </Typography>
                                        <Rating
                                            name={`rating-${booking._id}`}
                                            value={booking.rating}
                                            readOnly
                                            precision={1}
                                            max={5}
                                        />
                                    </Box>
                                ) : (
                                    // If no rating yet, show the rating field
                                    <Box
                                    sx={{
                                        mb: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center', // Center the content horizontally
                                    }}
                                >
                                    <Typography variant="body2" sx={{ textAlign: 'center', mb: 1 }}>
                                        <strong>{booking.rating !== undefined ? 'Your Rating:' : 'Rate this Itinerary:'}</strong>
                                    </Typography>
                                    <Rating
                                        name={`rating-${booking._id}`}
                                        value={ratings[booking._id] || booking.rating || 0} // Fallback to 0 if no rating exists
                                        onChange={(event, newValue) => {
                                            if (newValue !== null) {
                                                handleRatingChange(booking, newValue); // Update state and submit immediately
                                            }
                                        }}
                                        precision={1}
                                        max={5}
                                        sx={{
                                            '& .MuiRating-iconFilled': { color: '#FFDE21' }, // Customize filled star color
                                            '& .MuiRating-iconHover': { color: '#3f51b5' }, // Customize hover color
                                        }}
                                    />
                                </Box>
                                )}
    
                                {/* Comment Section */}
                                {booking.comment ? (
                                    <Typography variant="body2">
                                        <strong>Your Comment:</strong> {booking.comment}
                                    </Typography>
                                ) : (
                                    <Box sx={{ mt: 2 }}>
                                        <TextField
                                            label="Comment"
                                            multiline
                                            rows={1}
                                            value={comments[booking._id] || ''}
                                            onChange={(e) => handleCommentChange(booking, e.target.value)}
                                            fullWidth
                                            sx={{ mb: 1 }}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                marginTop: '10px',
                                                backgroundColor: '#111E56',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'white',
                                                    color: '#111E56',
                                                    border: '1px solid #111E56',
                                                },
                                                mb: 2,
                                            }}
                                            onClick={() => submitComment(booking, 'itinerary')}
                                        >
                                            Submit Comment
                                        </Button>
                                    </Box>
                                )}
                            </>
                        ) : (
                            // If the date is not past, show cancel option
                            isCancellationAllowed(booking.CancellationDeadline) && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleCancelItineraryBooking(booking._id)}
                                    sx={{ mt: 2, mb: 2 }}
                                    disabled={booking.Status === 'Cancelled'}
                                >
                                    {booking.Status === 'Cancelled' ? 'Booking Canceled' : 'Cancel Booking'}
                                </Button>
                            )
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
    
    const carouselResponsiveSettings = {
        superLargeDesktop: {
            // For very large screens (e.g., 1600px+ width)
            breakpoint: { max: 4000, min: 1200 },
            items: 1
        },
        desktop: {
            // For regular desktop screens
            breakpoint: { max: 1200, min: 768 },
            items: 1
        },
        tablet: {
            // For tablets
            breakpoint: { max: 768, min: 464 },
            items: 1
        },
        mobile: {
            // For mobile screens
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };
    return (
        <Box>
            {/* Past Activity Carousel */}
            <Typography variant="h5" sx={{ mb: 2 , mt: 5 , fontWeight:'bold' , color:'#111E56'}}>Past Activity Bookings</Typography>
            {pastActivityBookings.length > 0 && (
                pastActivityBookings.length === 1 ? (
                    // Render only the single booking without carousel
                    <div style={{height:'80%', width: '600px'}} key={pastActivityBookings[0]._id}>{renderActivityCard(pastActivityBookings[0])}</div>
                ) : (
                    <Carousel
                        responsive={carouselResponsiveSettings}
                        infinite={true}
                        showDots={true}
                        arrows={true}
                        swipeable={true}
                        draggable={true}
                        autoPlay={true}
                        autoPlaySpeed={3000}
                        centerMode={true}
                        containerClass="carousel-container"
                    >
                        {pastActivityBookings.map((booking) => (
                            <div key={booking._id}>{renderActivityCard(booking)}</div>
                        ))}
                    </Carousel>
                )
            )}
            {pastActivityBookings.length === 0 && <Typography>No past activity bookings available.</Typography>}
    
            {/* Upcoming Activity Carousel */}
            <Typography variant="h5" sx={{ mb: 2, mt: 4 ,fontWeight:'bold' , color:'#111E56'}}>Upcoming Activity Bookings</Typography>
            {upcomingActivityBookings.length > 0 && (
                upcomingActivityBookings.length === 1 ? (
                    // Render only the single booking without carousel
                    <div style={{height:'80%', width: '600px'}}key={upcomingActivityBookings[0]._id}>{renderActivityCard(upcomingActivityBookings[0])}</div>
                ) : (
                    <Carousel
                        responsive={carouselResponsiveSettings}
                        infinite={true}
                        showDots={true}
                        arrows={true}
                        swipeable={true}
                        draggable={true}
                        autoPlay={true}
                        autoPlaySpeed={3000}
                        centerMode={true}
                        containerClass="carousel-container"
                    >
                        {upcomingActivityBookings.map((booking) => (
                            <div key={booking._id}>{renderActivityCard(booking)}</div>
                        ))}
                    </Carousel>
                )
            )}
            {upcomingActivityBookings.length === 0 && <Typography>No upcoming activity bookings available.</Typography>}
    
            {/* Past Itinerary Carousel */}
            <Typography variant="h5" sx={{ mb: 2 ,fontWeight:'bold' , color:'#111E56'}}>Past Itinerary Bookings</Typography>
            {pastItineraryBookings.length > 0 && (
                pastItineraryBookings.length === 1 ? (
                    // Render only the single booking without carousel
                    <div style={{height:'80%', width: '600px'}} key={pastItineraryBookings[0]._id}>{renderItineraryCard(pastItineraryBookings[0])}</div>
                ) : (
                    <Carousel
                        responsive={carouselResponsiveSettings}
                        infinite={true}
                        showDots={true}
                        arrows={true}
                        swipeable={true}
                        draggable={true}
                        autoPlay={true}
                        autoPlaySpeed={3000}
                        centerMode={true}
                        containerClass="carousel-container"
                    >
                        {pastItineraryBookings.map((booking) => (
                            <div key={booking._id}>{renderItineraryCard(booking)}</div>
                        ))}
                    </Carousel>
                )
            )}
            {pastItineraryBookings.length === 0 && <Typography>No past itinerary bookings available.</Typography>}
    
            {/* Upcoming Itinerary Carousel */}
            <Typography variant="h5" sx={{ mb: 2, mt: 4 , fontWeight:'bold' , color:'#111E56'}}>Upcoming Itinerary Bookings</Typography>
            {upcomingItineraryBookings.length > 0 && (
                upcomingItineraryBookings.length === 1 ? (
                    // Render only the single booking without carousel
                    <div style={{height:'80%', width: '600px'}} key={upcomingItineraryBookings[0]._id}>{renderItineraryCard(upcomingItineraryBookings[0])}</div>
                ) : (
                    <Carousel
                        responsive={carouselResponsiveSettings}
                        infinite={true}
                        showDots={true}
                        arrows={true}
                        swipeable={true}
                        draggable={true}
                        autoPlay={true}
                        autoPlaySpeed={3000}
                        centerMode={true}
                        containerClass="carousel-container"
                    >
                        {upcomingItineraryBookings.map((booking) => (
                            <div key={booking._id}>{renderItineraryCard(booking)}</div>
                        ))}
                    </Carousel>
                )
            )}
            {upcomingItineraryBookings.length === 0 && <Typography>No upcoming itinerary bookings available.</Typography>}
        </Box>
    );
    
    
};

export default ViewBookings;
