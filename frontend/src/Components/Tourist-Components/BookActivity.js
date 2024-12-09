import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Button, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, Typography, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import BookIcon from '@mui/icons-material/Book';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { CurrencyContext } from './CurrencyContext';
import HistoryIcon from '@mui/icons-material/History';
import StarIcon from '@mui/icons-material/Star';
import FilterListIcon from '@mui/icons-material/FilterList';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';

const BookActivitiesPage = () => {
    const [activities, setActivities] = useState([]);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');
    const [tag, setTag] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minRating, setMinRating] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [order, setOrder] = useState('asc');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [walletBalance, setWalletBalance] = useState(0);
    const [activeComponent, setActiveComponent] = useState('BookActivity');
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [bookmarkErrorMessage, setBookmarkErrorMessage] = useState('');
    const [bookmarkSuccessMessage, setBookmarkSuccessMessage] = useState('');
    const [bookmarkedActivities, setBookmarkedActivities] = useState([]);
    const [promoCode, setPromoCode] = useState('');
    const [discountedAmount, setDiscountedAmount] = useState(0);
    const [showPastActivities, setShowPastActivities] = useState(false);
    const [originalActivities, setOriginalActivities] = useState([]);
    const [bookedActivities, setBookedActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [activityId, setActivityId] = useState(null);

    const { selectedCurrency, exchangeRates } = useContext(CurrencyContext);

    useEffect(() => {

        fetchActivities();
        fetchWalletBalance();
        fetchBookmarkedActivities();

    }, [showPastActivities]);

    const fetchActivities = async () => {
        try {

            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/activities', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setOriginalActivities(response.data);

            const now = new Date();
            const filteredActivities = showPastActivities 
                ? response.data 
                : response.data.filter(activity => new Date(activity.date) >= now);
            setActivities(filteredActivities);
        } 
        catch (error) {

            setMessage('Error fetching activities');
            console.error('Error fetching activities:', error);

        }
    };

    const fetchWalletBalance = async () => {

        try {

            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/myProfile', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const wallet = response.data.wallet;
            if (!isNaN(wallet)) { 
                setWalletBalance(wallet);
            } 
            else {
                console.error('Wallet balance is not a number:', wallet);
                setWalletBalance(0);
            }
        } 
        catch (error) {
            console.error('Error fetching wallet balance:', error);
        }
    };

    const fetchBookmarkedActivities = async () => {
        try {

            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/saved-activity/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const activities = response.data.activities || [];
            const bookmarkedIds = activities.map((activity) => activity._id);
            setBookmarkedActivities(bookmarkedIds);
        } 
        catch (error) {
            console.error('Error fetching bookmarked activities:', error);
        }
    };

    const handleSearch = async (e) => {

        e.preventDefault();

        let queryString = '';
        if (searchQuery) queryString += `searchQuery=${searchQuery}&`;
        if (category) queryString += `category=${category}&`;
        if (tag) queryString += `tag=${tag}&`;
        if (minPrice) queryString += `minPrice=${convertToUSD(minPrice)}&`;
        if (maxPrice) queryString += `maxPrice=${convertToUSD(maxPrice)}&`;
        if (startDate) queryString += `startDate=${startDate}&`;
        if (endDate) queryString += `endDate=${endDate}&`;
        if (minRating) queryString += `minRating=${minRating}&`;
        if (sortBy) queryString += `sortBy=${sortBy}&order=${order}`;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/tourists/activities/filter-sort-search?${queryString}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOriginalActivities(response.data);
            const now = new Date();
            const filteredActivities = showPastActivities 
                ? response.data 
                : response.data.filter(activity => new Date(activity.date) >= now);
            setActivities(filteredActivities);

        } 
        catch (error) {
            console.error('Error fetching activities:', error);
            setMessage('Error fetching activities');
        }
    };

    const handleBookmarkActivity = async (activity) => {
        const isBookmarked = bookmarkedActivities.includes(activity._id);
        try {
            const token = localStorage.getItem('token');

            if (isBookmarked) {
                await axios.delete(`/tourists/saved-activity/${activity._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setBookmarkedActivities(bookmarkedActivities.filter(id => id !== activity._id));
                setBookmarkSuccessMessage('Activity removed from bookmarks.');
            }
             else {
                await axios.post(`/tourists/saved-activity/${activity._id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookmarkedActivities([...bookmarkedActivities, activity._id]);
                setBookmarkSuccessMessage('Activity bookmarked successfully!');
            }
            setTimeout(() => setBookmarkSuccessMessage(''), 3000);    
        } 
        catch (error) {
            console.error('Error toggling bookmark:', error);
            setBookmarkErrorMessage(error.response?.data?.msg || 'Error toggling bookmark');
            setTimeout(() => setBookmarkErrorMessage(''), 3000);
        }
    };

    const handleNotifyWhenAvailable = async (activityId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `/tourists/subscribeToActivity/${activityId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setBookmarkSuccessMessage('You will be notified when booking opens!');
            setTimeout(() => setBookmarkSuccessMessage(''), 3000);
        } 
        catch (error) {
            console.error('Error subscribing to activity:', error);
            setBookmarkErrorMessage(error.response?.data?.msg || 'Error subscribing to activity');
            setTimeout(() => setBookmarkErrorMessage(''), 3000);
        }
    };

    const handleBookActivity = (activity) => {
        if(bookedActivities.includes(activity._id)){
            setTimeout(() => setMessage("Activity already booked."), 2000);
            return;
        }

        if (walletBalance === null || isNaN(walletBalance)) {
            setErrorMessage('Error: Wallet balance is not available.');
            return;
        }
        
        setSelectedActivity(activity);
        setActiveComponent('PayForActivity');
    };

    const handlePayment = async (paymentMethod) => {
        try {
            const token = localStorage.getItem('token');
            const finalAmount = selectedActivity.price - discountedAmount;

            if (finalAmount <= 0) {
                setErrorMessage('The final amount cannot be zero or negative.');
                return;
            }

            if (paymentMethod === 'wallet') {
                const response = await axios.post(
                    `/tourists/activities/book/${selectedActivity._id}`,
                    { amountPaid: finalAmount },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSuccessMessage('Payment successful! Booking created.');
                setWalletBalance(response.data.walletBalance);
            } 
            else if (paymentMethod === 'stripe') {
                const response = await axios.post(
                    `/tourists/activities/stripe-session`,
                    {
                        activityId: selectedActivity._id,
                        amountPaid: convertPrice(finalAmount),
                        currency: selectedCurrency
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.data.url) {
                    window.location.href = response.data.url;
                } 
                else {
                    setErrorMessage('Failed to create Stripe session.');
                }
            }

            setTimeout(() => {
                setActiveComponent('BookActivity');
                setSelectedActivity(null);
                setDiscountedAmount(0);
                setPromoCode('');
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Payment error:', error);
            setErrorMessage(error.response?.data?.message || 'Payment failed');
        }
    };

    const applyPromoCode = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/tourists/promocode',
                { promoCode, cartTotal: selectedActivity.price },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const discount = response.data.discount;
            setDiscountedAmount(discount);
            setSuccessMessage(`Promo code applied! You saved $${discount.toFixed(2)}.`);
        } 
        catch (error) {
            console.error('Error applying promo code:', error);
            setErrorMessage(error.response?.data?.message || 'Failed to apply promo code.');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const togglePastActivities = () => {
        const now = new Date();
        
        if (showPastActivities) {
            const upcomingActivities = originalActivities.filter(activity => new Date(activity.date) >= now);
            setActivities(upcomingActivities);
        } else {
            setActivities(originalActivities);
        }
        
        setShowPastActivities(!showPastActivities);
    };

    const handleOpenReviewModal = (activityId) => {
        setActivityId(activityId);
        setOpenReviewModal(true);
        fetchReviews(activityId);
    };

    const fetchReviews = async (activityId) => {
        try {
            const response = await axios.get(`/tourists/activities/getreviews/${activityId}`);
            if (response.data) {
                const { reviews, ratings } = response.data;
                setReviews(reviews || []);
                setRatings(ratings || []);
            }
        } 
        catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    const renderReviewModal = () => {
        const combinedData = reviews.map(review => {
            const rating = ratings.find(r => r.username === review.username);
            return {
                username: review.username,
                rating: rating ? rating.rating : null,
                review: review.review,
            };
        });
    
        return (
            <Dialog open={openReviewModal} onClose={() => setOpenReviewModal(false)}>
                <DialogTitle>Activity Reviews and Ratings</DialogTitle>
                <DialogContent>
                    {combinedData.length === 0 ? (
                        <Typography>No reviews or ratings available for this activity.</Typography>
                    ) : (
                        combinedData.map((data, index) => (
                            <Box key={index} sx={{ marginBottom: 2, border: '1px solid #ccc', padding: 2, borderRadius: 2 }}>
                                <Typography variant="h6"><strong>{data.username}</strong></Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {data.rating ? (
                                        <Box sx={{ marginRight: 1 }}>
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} sx={{ color: i < data.rating ? 'gold' : 'gray' }} />
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" sx={{ color: 'gray' }}>No rating given</Typography>
                                    )}
                                </Box>
                                <Typography variant="body2" sx={{ marginTop: 1 }}>
                                    <strong>Review:</strong> {data.review || 'No review provided'}
                                </Typography>
                            </Box>
                        ))
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenReviewModal(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    const convertToUSD = (price) => {
        return (price / (exchangeRates[selectedCurrency] || 1)).toFixed(2);
    };

    const convertPrice = (price) => {
        return (price * (exchangeRates[selectedCurrency] || 1)).toFixed(2);
    };

    const handleCopyLink = (activityId) => {
        const link = `${window.location.origin}/activity/${activityId}`;
        navigator.clipboard.writeText(link)
            .then(() => alert('Link copied to clipboard!'))
            .catch((err) => console.error('Error copying link:', err));
    };

    const handleShareEmail = (activity) => {
        const subject = `Check out this activity: ${activity.name}`;
        const body = `Here is an activity you might be interested in:\n\nName: ${activity.name}\nDate: ${new Date(activity.date).toLocaleDateString()}\nTime: ${activity.time}\nPrice: ${convertPrice(activity.price)} ${selectedCurrency}\nCategory: ${activity.category?.name}\nLocation: ${activity.location}\n\nCheck it out here: ${window.location.origin}/activity/${activity._id}`;
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };

    if (activeComponent === 'PayForActivity' && selectedActivity) {
        return (
            <Box sx={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
                <Typography variant="h4" gutterBottom>Book Activity</Typography>
                
                {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
                {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

                <Typography variant="h6" gutterBottom>Activity Details</Typography>
                <Typography><strong>Activity:</strong> {selectedActivity.name}</Typography>
                <Typography><strong>Date:</strong> {new Date(selectedActivity.date).toLocaleDateString()}</Typography>
                <Typography><strong>Original Price:</strong> {convertPrice(selectedActivity.price)} {selectedCurrency} </Typography>
                {discountedAmount > 0 && (
                    <Typography><strong>Discount:</strong> -{convertPrice(discountedAmount.toFixed(2))} {selectedCurrency}</Typography>
                )}
                <Typography><strong>Final Price:</strong> {convertPrice(selectedActivity.price - discountedAmount)} {selectedCurrency}</Typography>

                <TextField
                    label="Promo Code"
                    variant="outlined"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    sx={{ mt: 2, width: '100%' }}
                />
                <Button
                    variant="contained"
                    onClick={applyPromoCode}
                    sx={{
                        mt: 2,
                        backgroundColor: '#111E56',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'white',
                            color: '#111E56',
                            border: '1px solid #111E56',
                        },
                    }}
                >
                    Apply Promo
                </Button>

                <Typography variant="h6" sx={{ mt: 3 }}>Select Payment Method</Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handlePayment('wallet')}
                    sx={{ mt: 2, mr: 2 }}
                    disabled={walletBalance < (selectedActivity.price - discountedAmount)}
                >
                    Pay with Wallet

                </Button>
                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => handlePayment('stripe')}
                    sx={{ mt: 2 }}
                >
                    Pay with Stripe
                </Button>
                <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={() => setActiveComponent('BookActivity')}
                    sx={{ ml: 2, mt: 2 }}
                >
                    Back to Activities
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: '20px', maxWidth: '2000px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom sx={{fontWeight:'bold' , color:'#111E56'}}>Book an Activity</Typography>
            <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                    <TextField
                        label="Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        variant="outlined"
                        sx={{ flex: '1 1 200px' }}
                    />
                    <TextField
                        label="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        variant="outlined"
                        sx={{ flex: '1 1 200px' }}
                    />
                    <TextField
                        label="Tag"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        variant="outlined"
                        sx={{ flex: '1 1 200px' }}
                    />
                    <IconButton
                        onClick={() => setShowFilters(!showFilters)}
                        sx={{ backgroundColor: '#111E56', color: 'white', borderRadius: 1 , height:'2.2em'}}
                    >
                        <FilterListIcon />

                    </IconButton>
                </div>

                {showFilters && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        <TextField
                            label="Min Price"
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            variant="outlined"
                            sx={{ flex: '1 1 100px' }}
                        />
                        <TextField
                            label="Max Price"
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            variant="outlined"
                            sx={{ flex: '1 1 100px' }}
                        />
                        <TextField
                            label="Min Rating"
                            type="number"
                            value={minRating}
                            onChange={(e) => setMinRating(e.target.value)}
                            variant="outlined"
                            sx={{ flex: '1 1 100px' }}
                        />
                        <TextField
                            label="Start Date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            sx={{ flex: '1 1 150px' }}
                        />
                        <TextField
                            label="End Date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            sx={{ flex: '1 1 150px' }}
                        />
                        <FormControl sx={{ flex: '1 1 150px' }}>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                label="Sort By"
                            >
                                <MenuItem value="">Select</MenuItem>
                                <MenuItem value="price">Price</MenuItem>
                                <MenuItem value="ratings">Rating</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl sx={{ flex: '1 1 150px' }}>
                            <InputLabel>Order</InputLabel>
                            <Select
                                value={order}
                                onChange={(e) => setOrder(e.target.value)}
                                label="Order"
                            >
                                <MenuItem value="asc">Ascending</MenuItem>
                                <MenuItem value="desc">Descending</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                        backgroundColor: '#111E56',
                        color: 'white',
                        border: '2px solid #111E56',
                        '&:hover': {
                            backgroundColor: 'white',
                            color: '#111E56',
                            border: '2px solid #111E56',
                        },
                        mx: 1,
                        ml: -1,
                        px: 4,
                        width: '101%'
                    }}
                >
                    Search & Filter
                </Button>
            </form>
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Button
                    variant="contained"
                    onClick={togglePastActivities}
                    sx={{
                        backgroundColor: showPastActivities ? '#111E56' : '#FF5733',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: showPastActivities ? '#0D1442' : '#FF7961',
                        },
                        mb: 2
                    }}
                    startIcon={showPastActivities ? <UpcomingIcon /> : <HistoryIcon />}
                >
                    {showPastActivities ? "Upcoming Activities" : "All Activities"}

                </Button>

            </div>
            {message && <Typography color="error">{message}</Typography>}
                        
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {activities.length > 0 ? activities.map((activity) => (
                    <Card
                        key={activity._id}
                        sx={{
                            display: 'flex',
                            width: '800px',
                            maxWidth: '1200px',
                            boxShadow: 3,
                            borderRadius: 2,
                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.03)',
                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                            },
                            height: '300px',
                        }}
                    >
                        <Box 
                            sx={{ 
                                flex: '1 1 35%', 
                                marginRight: 2, 
                                display: 'flex', 
                                alignItems: 'stretch',
                                height:'100%',
                            }}
                        >
                            {activity.imageUrl && (
                                <img
                                    src={activity.imageUrl}
                                    alt={activity.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderBottomLeftRadius:'8px',
                                        borderTopLeftRadius:'8px',
                                    }}
                                    onClick={() => handleOpenReviewModal(activity._id)}
                                />
                            )}
                        </Box>
                    
                        <Box 
                            sx={{ 
                                flex: '1 1 30%', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'space-between' 
                            }}
                        >
                            <CardContent sx={{ padding: 0 }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: '#111E56',
                                        fontWeight: 'bold',
                                        marginBottom: '10px',
                                        marginTop: '10px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {activity.name}
                                </Typography>
                                <Typography sx={{marginBottom: '5px',}}><strong style={{fontWeight:'bold' , color:'#111E56'}}>Date:</strong> {new Date(activity.date).toLocaleDateString()}</Typography>
                                <Typography sx={{marginBottom: '5px',}}><strong style={{fontWeight:'bold' , color:'#111E56'}}>Time:</strong> {activity.time}</Typography>
                                <Typography sx={{marginBottom: '5px',}}><strong style={{fontWeight:'bold' , color:'#111E56'}}>Price:</strong> {convertPrice(activity.price)} {selectedCurrency}</Typography>
                                <Typography sx={{marginBottom: '5px',}}><strong style={{fontWeight:'bold' , color:'#111E56'}}>Category:</strong> {activity.category?.name}</Typography>
                                {activity.tags && (
                                    <Typography sx={{marginBottom: '5px',}}><strong style={{fontWeight:'bold' , color:'#111E56'}}>Tags:</strong> {activity.tags.map(tag => tag.name).join(', ')}</Typography>
                                )}
                                
                                <Typography sx={{marginBottom: '5px',}}><strong style={{fontWeight:'bold' , color:'#111E56'}}>Special Discounts:</strong> {activity.specialDiscounts}</Typography>
                            </CardContent>
                    
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    padding: 1,
                                    marginTop: 0,
                                    marginBottom: 1,
                                }}
                            >
                                {activity.bookingOpen ? (
                                    <Tooltip title={bookedActivities.includes(activity._id) ? "Already booked" : "Book Now"}>
                                        <IconButton
                                            onClick={() => bookedActivities.includes(activity._id) ? setMessage("Activity has already been booked.") : handleBookActivity(activity)}
                                            sx={{
                                                backgroundColor: '#111E56',
                                                color: 'white',
                                                border: '2px solid #111E56',
                                                '&:hover': {
                                                    backgroundColor: 'white',
                                                    color: '#111E56',
                                                    border: '2px solid #111E56',
                                                },
                                            }}
                                        >
                                            <BookIcon />
                                        </IconButton>
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Notify When Available">
                                        <IconButton
                                            onClick={() => handleNotifyWhenAvailable(activity._id)}
                                            sx={{
                                                backgroundColor: '#FFD54F',
                                                color: 'black',
                                                '&:hover': {
                                                    backgroundColor: '#FFF9C4',
                                                    border: '2px solid #FFD54F',
                                                },
                                            }}
                                        >
                                            <NotificationsActiveIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                    
                                <Tooltip title={bookmarkedActivities.includes(activity._id) ? "Unbookmark" : "Bookmark"}>
                                    <IconButton
                                        onClick={() => handleBookmarkActivity(activity)}
                                        sx={{
                                            backgroundColor: bookmarkedActivities.includes(activity._id) ? '#FF5733' : '#FFB800',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: bookmarkedActivities.includes(activity._id) ? '#FF7961' : '#FFD54F',
                                                color: 'black',
                                            },
                                        }}
                                    >
                                        <BookmarkRemoveIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Copy Link">
                                    <IconButton
                                        onClick={() => handleCopyLink(activity._id)}
                                        sx={{
                                            backgroundColor: 'white',
                                            color: '#5A8CFF',
                                            border: '1px solid #5A8CFF',
                                            '&:hover': {
                                                backgroundColor: '#5A8CFF',
                                                color: 'white',
                                            },
                                        }}
                                    >
                                        <LinkIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Share via Email">
                                    <IconButton
                                        onClick={() => handleShareEmail(activity)}
                                        sx={{
                                            backgroundColor: 'white',
                                            color: '#5A8CFF',
                                            border: '1px solid #5A8CFF',
                                            '&:hover': {
                                                backgroundColor: '#5A8CFF',
                                                color: 'white',
                                            },
                                        }}
                                    >
                                        <EmailIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    
                        <Box 
                            sx={{ 
                                flex: '1 1 35%', 
                                marginLeft: 2, 
                                display: 'flex', 
                                alignItems: 'stretch', 
                                overflow: 'hidden', 
                                objectFit: 'cover',
                                height: '100%',
                            }}
                        >
                            <iframe
                                title='activity-location'
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0, borderBottomRightRadius:'8px', borderTopRightRadius:'8px', height:'100%' }}
                                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDUP5fw3jw8bvJ7yj9OskV5wdm5sNUbII4&q=${encodeURIComponent(
                                    activity.location
                                )}`}
                                allowFullScreen
                            ></iframe>
                        </Box>
                    </Card>
                )) : (
                    <Typography>No activities available</Typography>
                )}
            </Box>
            {renderReviewModal()}
        </Box>
    );
};

export default BookActivitiesPage;

