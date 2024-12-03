import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Button, TextField,IconButton, Tooltip,Typography, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import BookIcon from '@mui/icons-material/Book';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { CurrencyContext } from './CurrencyContext'; // Import CurrencyContext


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
    
    const { selectedCurrency, exchangeRates } = useContext(CurrencyContext); // Use CurrencyContext


    const YOUR_API_KEY = "1b5f2effe7b482f6a6ba499d";

    const fetchBookmarkedActivities = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/saved-activity/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Check the actual structure of response.data
            const activities = response.data.activities || []; // Update this based on your API's response structure
            const bookmarkedIds = activities.map((activity) => activity._id); // Extract IDs if activities is an array
            setBookmarkedActivities(bookmarkedIds);
        } catch (error) {
            console.error('Error fetching bookmarked activities:', error);
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
            // setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error applying promo code:', error);
            setErrorMessage(error.response?.data?.message || 'Failed to apply promo code.');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };
    
    
    useEffect(() => {
        fetchActivities();
        fetchWalletBalance();
        //fetchExchangeRates();
        fetchBookmarkedActivities(); // Fetch bookmarked activities on mount
    }, []);

    const convertToUSD = (price) => {
        return (price / (exchangeRates[selectedCurrency] || 1)).toFixed(2);
    };

    const handleBookmarkActivity = async (activity) => {
        const isBookmarked = bookmarkedActivities.includes(activity._id);
        try {
            const token = localStorage.getItem('token');
            if (isBookmarked) {
                // Unbookmark
                await axios.delete(`/tourists/saved-activity/${activity._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookmarkedActivities(bookmarkedActivities.filter(id => id !== activity._id));
                setBookmarkSuccessMessage('Activity removed from bookmarks.');
            } else {
                // Bookmark
                await axios.post(`/tourists/saved-activity/${activity._id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookmarkedActivities([...bookmarkedActivities, activity._id]);
                setBookmarkSuccessMessage('Activity bookmarked successfully!');
            }
            setTimeout(() => setBookmarkSuccessMessage(''), 3000);    
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            setBookmarkErrorMessage(error.response?.data?.msg || 'Error toggling bookmark');
            setTimeout(() => setBookmarkErrorMessage(''), 3000);
        }
    };
    
    const fetchActivities = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/activities', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActivities(response.data);
        } catch (error) {
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
            
            // Log the wallet balance to ensure it’s fetched
            console.log('Fetched Wallet Balance:', wallet);
            
            if (!isNaN(wallet)) { 
                setWalletBalance(wallet);
            } else {
                console.error('Wallet balance is not a number:', wallet);
                setWalletBalance(0); // Set a fallback value if NaN
            }
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
        }
    };
    
    const convertPrice = (price) => {
        return (price * (exchangeRates[selectedCurrency] || 1)).toFixed(2);
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
            setActivities(response.data);
        } catch (error) {
            console.error('Error fetching activities:', error);
            setMessage('Error fetching activities');
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
        } catch (error) {
            console.error('Error subscribing to activity:', error);
            setBookmarkErrorMessage(error.response?.data?.msg || 'Error subscribing to activity');
            setTimeout(() => setBookmarkErrorMessage(''), 3000);
        }
    };
    

    const handleBookActivity = (activity) => {
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
    
            // Calculate the final amount after applying the discount
            const finalAmount = selectedActivity.price - discountedAmount;
    
            if (finalAmount <= 0) {
                setErrorMessage('The final amount cannot be zero or negative.');
                return;
            }
    
            if (paymentMethod === 'wallet') {
                // Wallet Payment
                const response = await axios.post(
                    `/tourists/activities/book/${selectedActivity._id}`,
                    { amountPaid: finalAmount },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSuccessMessage('Payment successful! Booking created.');
                setWalletBalance(response.data.walletBalance);
            } else if (paymentMethod === 'stripe') {
                // Stripe Payment
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
                    window.location.href = response.data.url; // Redirect to Stripe checkout
                } else {
                    setErrorMessage('Failed to create Stripe session.');
                }
            }
    
            // Reset UI state after payment
            setTimeout(() => {
                setActiveComponent('BookActivity');
                setSelectedActivity(null);
                setDiscountedAmount(0); // Reset discount for next activity
                setPromoCode(''); // Clear promo code input
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Payment error:', error);
            setErrorMessage(error.response?.data?.message || 'Payment failed');
        }
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
        sx={{ ml : 2, mt: 2 }}
    >
        Back to Activities
    </Button>
</Box>

    );
}

    return (
        <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Typography variant="h4" gutterBottom>Book an Activity</Typography>
        <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <TextField
                label="Search by Name"
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

            <Button type="submit" variant="contained" color="primary" sx={{ 
                        backgroundColor: '#111E56', 
                        color: 'white', 
                        border: '2px solid #111E56',
                        '&:hover': { 
                            backgroundColor: 'white', 
                            color: '#111E56',
                            border: '2px solid #111E56' // Optional: adds a border to match the dark blue on hover
                        }, 
                        mx: 1, 
                        px: 4 
                    }}>
                Search & Filter
            </Button>
        </form>

        {message && <Typography color="error">{message}</Typography>}
                    
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
    {activities.length > 0 ? activities.map((activity) => (
        <Card
            key={activity._id}
            sx={{
                width: '300px',
                boxShadow: 3,
                padding: 2,
                textAlign: 'center',
                position: 'relative',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                },
            }}
        >
            <CardContent>
                <Typography
                    variant="h6"
                    sx={{
                        color: '#111E56',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                    }}
                >
                    {activity.name}
                </Typography>
                <Typography><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</Typography>
                <Typography><strong>Time:</strong> {activity.time}</Typography>
                <Typography><strong>Price:</strong> {convertPrice(activity.price)} {selectedCurrency}</Typography>
                <Typography><strong>Category:</strong> {activity.category?.name}</Typography>
                {activity.tags && (
                    <Typography><strong>Tags:</strong> {activity.tags.map(tag => tag.name).join(', ')}</Typography>
                )}
                <Typography><strong>Special Discounts:</strong> {activity.specialDiscounts}</Typography>

                {/* Google Maps Embed */}
                <Box
                    sx={{
                        marginTop: '15px',
                        minWidth: '250px',
                        height: '200px',
                        border: '1px solid #ccc',
                        borderRadius: 2,
                        overflow: 'hidden',
                    }}
                >
                    <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDUP5fw3jw8bvJ7yj9OskV5wdm5sNUbII4&q=${encodeURIComponent(
                            activity.location
                        )}`}
                        allowFullScreen
                    ></iframe>
                </Box>
            </CardContent>

            {/* Action Buttons */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    padding: 1,
                    marginTop: '-5px',
                }}
            >
                {activity.bookingOpen ? (
                    <Tooltip title="Book Now">
                        <IconButton
                            onClick={() => handleBookActivity(activity)}
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
            </Box>
        </Card>
    )) : (
        <Typography>No activities available</Typography>
    )}
</Box>

    </Box>
    );
};

export default BookActivitiesPage;
