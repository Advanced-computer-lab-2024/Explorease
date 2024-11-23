import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    IconButton,
    
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';


const Products = ( {incrementCartCount} ) => {
    const [products, setProducts] = useState([]);
    const [productMessage, setProductMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortByRatings, setSortByRatings] = useState('');
    const [exchangeRates, setExchangeRates] = useState({});
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [wishlist, setWishlist] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistMessage, setWishlistMessage] = useState('');

    const YOUR_API_KEY = "1b5f2effe7b482f6a6ba499d";


    const fetchAllProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/products', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProducts(response.data || []);
        } catch (error) {
            setProductMessage('Error fetching products');
            console.error('Error fetching products:', error);
        }
    };

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/wishlist', {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log('Wishlist response:', response.data); // Debugging response
    
            // Assuming `response.data.wishlist.products` is an array of product objects
            const productIds = response.data.wishlist.products.map((item) => item._id); // Extract product IDs
            setWishlistItems(productIds); // Update the state with only IDs
        } catch (error) {
            setWishlistMessage('Error fetching wishlist items');
            console.error('Error fetching wishlist items:', error);
        }
    };
    
    
    

    useEffect(() => {
        fetchAllProducts();
        fetchWishlist();
        fetchExchangeRates();

    }, []);


    const fetchExchangeRates = async () => {
        try {
            const response = await axios.get(`https://v6.exchangerate-api.com/v6/${YOUR_API_KEY}/latest/USD`);
            setExchangeRates(response.data.conversion_rates);
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
        }
    };

    const convertToUSD = (price) => {
        return (price / (exchangeRates[selectedCurrency] || 1)).toFixed(2);
    };

    const fetchFilteredProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            let queryString = '';
            if (searchQuery) queryString += `name=${searchQuery}&`;
            if (minPrice) queryString += `minPrice=${convertToUSD(minPrice)}&`;  
            if (maxPrice) queryString += `maxPrice=${convertToUSD(maxPrice)}&`;  
            if (sortByRatings) queryString += `sortByRatings=${sortByRatings}&`;

            const response = await axios.get(`/tourists/products/filter-sort-search?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProducts(response.data || []);
        } catch (error) {
            setProductMessage('Error fetching products');
            console.error('Error fetching products:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchFilteredProducts();
    };

    const handleCurrencyChange = (e) => {
        setSelectedCurrency(e.target.value);
    };

    const convertPrice = (price) => {
        return (price * (exchangeRates[selectedCurrency] || 1)).toFixed(2);
    };

    const addToCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/tourists/cart/add', { productId, quantity: 1 }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProductMessage('Product added to cart!');
            incrementCartCount();

        } catch (error) {
            setProductMessage('Error adding product to cart');
            console.error('Error adding product to cart:', error);
        }
    };

    const addToWishlist = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/tourists/wishlist/add', { productId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProductMessage('Product added to wishlist!');
        } catch (error) {
            setProductMessage('Error adding product to wishlist');
            console.error('Error adding product to wishlist:', error);
        }
    };

    const toggleWishlist = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            const isInWishlist = wishlistItems.includes(productId);
    
            if (isInWishlist) {
                // Remove from wishlist
                await axios.delete(`/tourists/wishlist/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setWishlistItems(wishlistItems.filter((id) => id !== productId)); // Update state
                setProductMessage('Product removed from wishlist!');
            } else {
                // Add to wishlist
                await axios.post('/tourists/wishlist/add', { productId }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setWishlistItems([...wishlistItems, productId]); // Update state
                setProductMessage('Product added to wishlist!');
            }
        } catch (error) {
            setProductMessage('Error updating wishlist');
            console.error('Error updating wishlist:', error);
        }
    };
    
    

    const renderProductCards = () => {
        if (!Array.isArray(products) || products.length === 0) {
            return <Typography>No products available</Typography>;
        }

        return products.map((product) => (
            <Card
    key={product._id}
    sx={{
        width: '100%',
        maxWidth: 280,
        m: 2,
        boxShadow: 3,
        flexGrow: 1,
        transition: 'transform 0.3s, box-shadow 0.3s', // Smooth transition for hover effect
        '&:hover': {
            transform: 'scale(1.05)', // Slightly enlarge the card
            boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)', // Add shadow effect
        },
    }}
>
    <CardMedia
        component="img"
        height="250"
        image={product.imageUrl}
        alt={product.Name}
        sx={{ objectFit: 'contain', padding: 1 }}
    />
    <CardContent>
        <Typography variant="h6">{product.Name}</Typography>
        <Typography variant="body2" color="text.secondary">
            <strong>Price:</strong> {convertPrice(product.Price)} {selectedCurrency}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            <strong>Description:</strong> {product.Description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            <strong>Ratings:</strong> {'★'.repeat(product.Ratings)}{'☆'.repeat(5 - product.Ratings)}
        </Typography>
        <Button
            variant="contained"
            color="primary"
            sx={{
                backgroundColor: '#111E56',
                color: 'white',
                '&:hover': {
                    backgroundColor: 'white',
                    color: '#111E56',
                    border: '1px solid #111E56', // Adds border on hover
                },
                mt: 2,
            }}
            fullWidth
            onClick={() => addToCart(product._id)}
        >
            Add to Cart
        </Button>
        <IconButton
            onClick={() => toggleWishlist(product._id)}
            sx={{
                transition: 'color 0.3s', // Smooth color transition
                '&:hover': {
                    color: '#ff4081', // Change color on hover
                },
            }}
        >
            {wishlistItems.includes(product._id) ? (
                <FavoriteIcon sx={{ color: '#ff4081' }} /> // Filled pink heart
            ) : (
                <FavoriteBorderIcon sx={{ color: '#ff4081' }} /> // Outlined pink heart
            )}
        </IconButton>
    </CardContent>
</Card>

        ));
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>All Products</Typography>
            <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
                <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
                    <TextField
                        label="Search by Name"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Min Price"
                        variant="outlined"
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Max Price"
                        variant="outlined"
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        fullWidth
                    />
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel>Sort by Ratings</InputLabel>
                        <Select
                            value={sortByRatings}
                            onChange={(e) => setSortByRatings(e.target.value)}
                            label="Sort by Ratings"
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="asc">Ascending</MenuItem>
                            <MenuItem value="desc">Descending</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ mb: 2, minWidth: 120 }}>
                <InputLabel>Currency</InputLabel>
                <Select value={selectedCurrency} onChange={handleCurrencyChange} label="Currency">
                    {Object.keys(exchangeRates).map((currency) => (
                        <MenuItem key={currency} value={currency}>
                            {currency}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button
                type="submit"
                variant="contained"
                sx={{
                    backgroundColor: '#111E56',
                    color: 'white',
                    width: '150px', // Increase the width
                    height: '55px', // Decrease the height
                    '&:hover': {
                        backgroundColor: 'white',
                        color: '#111E56',
                        border: '1px solid #111E56', // Optional: adds a border to match the dark blue on hover
                    },
                }}
            >
                Search
            </Button>

                    
                </Box>

                {productMessage && <Typography color="error">{productMessage}</Typography>}
            </form>

            <Box display="flex" flexWrap="wrap" justifyContent="center" sx={{ gap: 3 }}>
                {renderProductCards()}
            </Box>
        </Box>
    );
};

export default Products;
