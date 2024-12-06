import React, { useEffect, useState, useContext  } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Button, TextField, Typography, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';
import { CurrencyContext } from './CurrencyContext';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';

const BookItinerariesPage = () => {
    const [itineraries, setItineraries] = useState([]);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minRating, setMinRating] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [order, setOrder] = useState('asc');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [language, setLanguage] = useState(''); 
    const [walletBalance, setWalletBalance] = useState(0);
    const [activeComponent, setActiveComponent] = useState('BookItinerary');
    const [selectedItinerary, setSelectedItinerary] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [promoMessage, setPromoMessage] = useState('');
    const [discount, setDiscount] = useState(0); // Store discount value
    const [finalAmount, setFinalAmount] = useState(0); // Store final amount after discount

    const YOUR_API_KEY = "1b5f2effe7b482f6a6ba499d";

    const { selectedCurrency, exchangeRates } = useContext(CurrencyContext); // Use CurrencyContext

    const [savedItineraries, setSavedItineraries] = useState([]);

    useEffect(() => {
        fetchItineraries();
        fetchWalletBalance();
        fetchSavedItineraries();
    }, []);

    const handleSaveItinerary = async (itineraryId) => {
        try {
            if (savedItineraries.includes(itineraryId)) {
                // If already saved, remove it
                const response = await axios.delete(
                    `/tourists/saved-itineraries/${itineraryId}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } } // Assuming JWT is used
                );
    
                // Remove from the saved list
                setSavedItineraries((prev) => prev.filter((id) => id !== itineraryId));
                console.log(response.data.msg); // Optional: Display success message
                // alert('Itinerary removed from saved successfully!');
            } else {
                // If not saved, add it
                const response = await axios.post(
                    `/tourists/save/${itineraryId}`,
                    {}, // Pass an empty object if no body is needed
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
    
                // Add to saved list
                setSavedItineraries((prev) => [...prev, itineraryId]);
                console.log(response.data.msg); // Optional: Display success message
                // alert('Itinerary saved successfully!');
            }
        } catch (error) {
            console.error(
                'Error saving/removing itinerary:',
                error.response?.data?.msg || error.message
            );
            alert('Failed to update saved itineraries. Please try again.');
        }
    };
    
    const fetchSavedItineraries = async () => {
        try {
            const response = await axios.get(
                `/tourists/saved-itineraries`, 
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } } // Assuming JWT is used
            );                
            const itineraries = response.data.itineraries || []; // Update this based on your API's response structure
            const bookmarkedIds = itineraries.map((itinerary) => itinerary._id); // Extract IDs if activities is an array
            //setBookmarkedActivities(bookmarkedIds);
            setSavedItineraries(bookmarkedIds);
            console.log(savedItineraries);
        } catch (err) {
            console.error('Error fetching saved itineraries:', err.message);
        }
    };

    
    const handleApplyPromo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/tourists/promocode',
                { promoCode, cartTotal: selectedItinerary.totalPrice },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { discount } = response.data;
            setDiscount(discount);
            setFinalAmount(selectedItinerary.totalPrice - discount);
            setPromoMessage(`Promo code applied successfully! You saved $${discount.toFixed(2)}`);
        } catch (error) {
            console.error('Error applying promo code:', error);
            setPromoMessage(error.response?.data?.message || 'Failed to apply promo code.');
        }
    };

    const convertToUSD = (price) => {
        return (price / (exchangeRates[selectedCurrency] || 1)).toFixed(2);
    };

    const fetchItineraries = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/itineraries', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItineraries(response.data);
        } catch (error) {
            setMessage('Error fetching itineraries');
            console.error('Error fetching itineraries:', error);
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
            } else {
                setWalletBalance(0);
            }
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        let queryString = '';
        if (searchQuery) queryString += `searchQuery=${searchQuery}&`;
        if (minPrice) queryString += `minPrice=${convertToUSD(minPrice)}&`;  
        if (maxPrice) queryString += `maxPrice=${convertToUSD(maxPrice)}&`;  
        if (startDate) queryString += `startDate=${startDate}&`;
        if (endDate) queryString += `endDate=${endDate}&`;
        if (minRating) queryString += `minRating=${minRating}&`;
        if (sortBy) queryString += `sortBy=${sortBy}&order=${order}`;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/tourists/itineraries/filter-sort-search?${queryString}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItineraries(response.data);
        } catch (error) {
            console.error('Error fetching itineraries:', error);
            setMessage('Error fetching itineraries');
        }
    };

    const convertPrice = (price) => {
        return (price * (exchangeRates[selectedCurrency] || 1)).toFixed(2);
    };

    const handleBookItinerary = (itinerary) => {
        if (walletBalance === null || isNaN(walletBalance)) {
            setErrorMessage('Error: Wallet balance is not available.');
            return;
        }
        
        setSelectedItinerary(itinerary);
        setActiveComponent('PayForItinerary');
    };

    const handleItineraryPayment = async (paymentMethod) => {
        try {
            const token = localStorage.getItem('token');
            const amountPaid = finalAmount || selectedItinerary.totalPrice; // Use discounted amount if applicable

            if (paymentMethod === 'wallet') {
                // Wallet Payment
                const response = await axios.post(
                    `/tourists/itineraries/book/${selectedItinerary._id}`,
                    { amountPaid, promoCode },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSuccessMessage('Payment successful! Itinerary booked.');
                setWalletBalance(response.data.walletBalance);
            } else if (paymentMethod === 'stripe') {
                // Stripe Payment
                const response = await axios.post(
                    `/tourists/itineraries/stripe-session`,
                    { itineraryId: selectedItinerary._id,
                        amountPaid:  convertPrice(amountPaid), 
                        promoCode,                        
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

            setTimeout(() => {
                setActiveComponent('BookItinerary');
                setSelectedItinerary(null);
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Payment error:', error);
            setErrorMessage(error.response?.data?.message || 'Payment failed');
        }
    };
    
    
    if (activeComponent === 'PayForItinerary' && selectedItinerary) {
        return (
            <Box sx={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
                <Typography variant="h4" gutterBottom>Pay for Itinerary</Typography>

                {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
                {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
                {promoMessage && <Alert severity={promoMessage.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>{promoMessage}</Alert>}

                <Card
        key={selectedItinerary._id}
        sx={{
            display: 'flex',
            flexDirection: 'column',  // Change to column for vertical alignment
            width: '100%',
            height: '400px',  // Set a fixed height to ensure uniformity
            boxShadow: 3,
            padding: 2,
            borderRadius: 2,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
            },
        }}
    >
        {/* Top Section: Image and Details */}
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            {/* Image */}
            <Box
                sx={{
                    height: '200px',  // Fixed height for consistent image size
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: 2,
                    marginBottom: 2,
                }}
            >
                {selectedItinerary.imageUrl && (
                    <img
                        src={selectedItinerary.imageUrl}
                        alt={selectedItinerary.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '8px',
                        }}
                    />
                )}
            </Box>

            {/* Details */}
            <CardContent sx={{ padding: 0, flex: '1' }}>
                <Typography
                    variant="h6"
                    sx={{
                        color: '#111E56',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        textAlign: 'center',
                    }}
                >
                    {selectedItinerary.name}
                </Typography>
                <Typography><strong>Total Price:</strong> {convertPrice(selectedItinerary.totalPrice)} {selectedCurrency}</Typography>
                <Typography><strong>Languages:</strong> {selectedItinerary.LanguageOfTour.join(', ')}</Typography>
                <Typography><strong>Date :</strong> {new Date(selectedItinerary.AvailableDates[0]).toLocaleDateString()}</Typography>
                <Typography><strong>Final Amount :</strong> {convertPrice(finalAmount.toFixed(2))} {selectedCurrency}</Typography>

            </CardContent>
        </Box>


    </Card>
                <TextField
                    label="Promo Code"
                    variant="outlined"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    sx={{ mt: 2, width: '100%' }}
                />
                <Button
                    variant="contained"
                    onClick={handleApplyPromo}
                    sx={{
                        mt: 2,
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
                    Apply Promo
                </Button>

                <Typography variant="h6" sx={{ mt: 3 }}>Select Payment Method</Typography>
                {walletBalance >= finalAmount ? (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleItineraryPayment('wallet')}
                        sx={{
                            mt: 2,
                            mr: 2,
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
                        Pay with Wallet
                    </Button>
                ) : (
                    <Typography color="error" sx={{ mt: 2 }}>Insufficient funds in wallet. Please choose another payment method.</Typography>
                )}
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleItineraryPayment('stripe')}
                    sx={{
                        mt: 2,
                        backgroundColor: '#FF5733',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'white',
                            color: '#FF5733',
                            border: '1px solid #FF5733',
                        },
                    }}
                >
                    Pay with Credit/Debit Card
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setActiveComponent('BookItinerary')}
                    sx={{
                        mt: 2,
                        ml: 2,
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
                    Back to Itineraries
                </Button>
            </Box>
        
        );
    }

    return (
        <Box sx={{ padding: '20px', maxWidth: '1600px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom sx={{fontWeight:'bold' , color:'#111E56'}}>Book an Itinerary</Typography>
            <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                <TextField
                    label="Search by Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                    label="Language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    variant="outlined"
                    sx={{ flex: '1 1 150px' }}
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

                <Button type="submit" variant="contained" color="primary" sx={{ height: '56px', alignSelf: 'center' ,backgroundColor: '#111E56', 
                            color: 'white', 
                            border: '2px solid #111E56', // Optional: adds a border to match the dark blue on hover
                            '&:hover': { 
                                backgroundColor: 'white', 
                                color: '#111E56',
                                border: '2px solid #111E56' // Optional: adds a border to match the dark blue on hover
                            }, }}>
                    Search & Filter
                </Button>
            </form>

            {message && <Typography color="error">{message}</Typography>}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {itineraries.length > 0 ? itineraries.map((itinerary) => (
                    <Card
                    key={itinerary._id}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',  // Change to column for horizontal division
                        width: '500px',
                        boxShadow: 3,
                        padding: 2,
                        borderRadius: 2,
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.03)',
                            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                        },
                    }}
                >
                    {/* Top Section: Image and Details */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {/* Image */}
                        <Box
                            sx={{
                                height: '200px',
                                width: '100%',
                                overflow: 'hidden',
                                borderRadius: 2,
                                marginBottom: 2,
                            }}
                        >
                            {itinerary.imageUrl && (
                                <img
                                    src={itinerary.imageUrl}
                                    alt={itinerary.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                    }}
                                />
                            )}
                        </Box>
                
                        {/* Details */}
                        <CardContent sx={{ padding: 0 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#111E56',
                                    fontWeight: 'bold',
                                    marginBottom: '10px',
                                    textAlign: 'center',
                                }}
                            >
                                {itinerary.name}
                            </Typography>
                            <Typography><strong>Total Price:</strong> {convertPrice(itinerary.totalPrice)} {selectedCurrency}</Typography>
                            <Typography><strong>Languages:</strong> {itinerary.LanguageOfTour.join(', ')}</Typography>
                            <Typography><strong>Date :</strong> {new Date(itinerary.AvailableDates[0]).toLocaleDateString()}</Typography>
                        </CardContent>
                    </Box>
                
                    {/* Divider */}
                    <Box sx={{ borderTop: '1px solid #ccc', my: 2 }} />
                
                    {/* Bottom Section: Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 1 }}>
                        <Tooltip title="Book Now">
                            <IconButton
                                onClick={() => handleBookItinerary(itinerary)}
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
                
                        <Tooltip title={savedItineraries.includes(itinerary._id)? 'Unbookmark' : 'Bookmark'}>
    <IconButton
        onClick={() => handleSaveItinerary(itinerary._id)}
        sx={{
            backgroundColor: savedItineraries.includes(itinerary._id)? '#FFD54F' : '#FFB800',
            color:'white',
            '&:hover': {
                backgroundColor: savedItineraries.includes(itinerary._id)? '#FF7961' : '#FFD54F',
                color: 'black',
            },
        }}
    >
        {savedItineraries[[itinerary._id]] ? <BookmarkIcon /> : <BookmarkRemoveIcon />}
    </IconButton>
</Tooltip>

                    </Box>
                </Card>
                
                
                )) : (
                    <Typography>No itineraries available</Typography>
                )}
            </Box>
        </Box>
    );
};

export default BookItinerariesPage;
