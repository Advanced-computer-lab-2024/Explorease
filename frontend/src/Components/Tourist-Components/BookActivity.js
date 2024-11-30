import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Button, TextField, Typography, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';

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
    const [exchangeRates, setExchangeRates] = useState({});
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [bookmarkErrorMessage, setBookmarkErrorMessage] = useState('');
    const [bookmarkSuccessMessage, setBookmarkSuccessMessage] = useState('');
    const [bookmarkedActivities, setBookmarkedActivities] = useState([]);


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
    
    
    
    useEffect(() => {
        fetchActivities();
        fetchWalletBalance();
        fetchExchangeRates();
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
    
    const fetchExchangeRates = async () => {
        try {
            const response = await axios.get(`https://v6.exchangerate-api.com/v6/${YOUR_API_KEY}/latest/USD`);
            setExchangeRates(response.data.conversion_rates);
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
        }
    };
    

    const handleCurrencyChange = (e) => {
        setSelectedCurrency(e.target.value);
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
    

    const handlePayment = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log(selectedActivity._id);
            const response = await axios.post(`/tourists/activities/book/${selectedActivity._id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMessage('Payment successful! Booking created.');
            setWalletBalance(response.data.walletBalance);
    
            // Redirect to tourist dashboard after 3 seconds
            setTimeout(() => {
                setActiveComponent('BookActivity');
                setSelectedActivity(null);
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
                <Typography variant="h4" gutterBottom>Pay for Activity</Typography>
                
                {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
                {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

                <Typography variant="h6" gutterBottom>Activity Details</Typography>
                <Typography><strong>Activity:</strong> {selectedActivity.name}</Typography>
                <Typography><strong>Date:</strong> {new Date(selectedActivity.date).toLocaleDateString()}</Typography>
                <Typography><strong>Price:</strong> ${selectedActivity.price}</Typography>
                <Typography><strong>Current Wallet Balance:</strong> ${Number(walletBalance)}</Typography>
<Typography><strong>Balance After Payment:</strong> ${Number(walletBalance) - Number(selectedActivity.price)}</Typography>


                {walletBalance >= selectedActivity.price ? (
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
                <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={() => setActiveComponent('BookActivity')}
                    sx={{ mt: 2 }}
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

            <FormControl sx={{ marginBottom: 3, minWidth: 120 }}>
                <InputLabel>Currency</InputLabel>
                <Select value={selectedCurrency} onChange={handleCurrencyChange}>
                    {Object.keys(exchangeRates).map((currency) => (
                        <MenuItem key={currency} value={currency}>
                            {currency}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button type="submit" variant="contained" color="primary" sx={{ 
                        backgroundColor: '#111E56', 
                        color: 'white', 
                        '&:hover': { 
                            backgroundColor: 'white', 
                            color: '#111E56',
                            border: '1px solid #111E56' // Optional: adds a border to match the dark blue on hover
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
            <Card key={activity._id} sx={{ width: '300px', boxShadow: 3, padding: 2, textAlign: 'center' }}>
            <CardContent>
                <Typography variant="h6">{activity.name}</Typography>
                <Typography><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</Typography>
                <Typography><strong>Time:</strong> {activity.time}</Typography>
                <Typography><strong>Location:</strong> {activity.location}</Typography>
                <Typography><strong>Price:</strong> {convertPrice(activity.price)} {selectedCurrency}</Typography>
                <Typography><strong>Category:</strong> {activity.category?.name}</Typography>
                {activity.tags && (
                    <Typography><strong>Tags:</strong> {activity.tags.map(tag => tag.name).join(', ')}</Typography>
                )}
                <Typography><strong>Special Discounts:</strong> {activity.specialDiscounts}</Typography>
            </CardContent>
        
            {activity.bookingOpen ? (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleBookActivity(activity)}
                    sx={{ 
                        backgroundColor: '#111E56', 
                        color: 'white', 
                        '&:hover': { 
                            backgroundColor: 'white', 
                            color: '#111E56',
                            border: '1px solid #111E56',
                        }, 
                        mx: 1, 
                        px: 4,
                    }}
                >
                    Book Now
                </Button>
            ) : (
                <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => handleNotifyWhenAvailable(activity._id)}
                    sx={{ 
                        backgroundColor: '#FFD54F',
                        color: 'black',
                        '&:hover': { 
                            backgroundColor: '#FFF9C4',
                            border: '1px solid #FFD54F',
                        },
                        mx: 1,
                        px: 4,
                        mt: 1,
                    }}
                >
                    Notify When Available
                </Button>
            )}
        
            <Button
                variant="contained"
                color="secondary"
                onClick={() => handleBookmarkActivity(activity)}
                sx={{ 
                    backgroundColor: bookmarkedActivities.includes(activity._id) ? '#FF5733' : '#FFB800',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: bookmarkedActivities.includes(activity._id) ? '#FF7961' : '#FFD54F',
                        color: 'black',
                    },
                    mx: 1,
                    px: 4,
                    mt: 1,
                }}
            >
                {bookmarkedActivities.includes(activity._id) ? 'Unbookmark' : 'Bookmark'}
            </Button>
        </Card>
        
            )) : (
                <Typography>No activities available</Typography>
            )}
        </Box>
    </Box>
    );
};

export default BookActivitiesPage;
