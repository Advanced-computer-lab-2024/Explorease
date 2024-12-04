import React, { useState, useEffect, useContext} from 'react';
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
import { CurrencyContext } from './CurrencyContext';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';


const Products = ( {incrementCartCount} ) => {
    const [products, setProducts] = useState([]);
    const [productMessage, setProductMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortByRatings, setSortByRatings] = useState('');
    const [wishlist, setWishlist] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistMessage, setWishlistMessage] = useState('');

    const { selectedCurrency, exchangeRates } = useContext(CurrencyContext); // Use CurrencyContext


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

    }, []);

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
        width: 300, // Fixed width for consistency
        height: 450, // Fixed height for consistency
        m: 2,
        borderRadius: 4, // Rounded corners
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Subtle shadow
        flexGrow: 1,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Smooth hover effects
        '&:hover': {
            transform: 'scale(1.05)', // Slightly enlarge the card
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)', // Enhanced shadow on hover
        },
        display: 'flex',
        flexDirection: 'column',
    }}
>
    {/* Image Section */}
    <Box
        sx={{
            position: 'relative',
            height: 200, // Fixed height for the image container
            overflow: 'hidden', // Ensure the image does not exceed this container
            borderRadius: '12px 12px 0 0', // Rounded top corners
        }}
    >
        <CardMedia
            component="img"
            image={product.imageUrl}
            alt={product.Name}
            sx={{
                objectFit: 'cover', // Ensure the image scales properly
                width: '100%', // Full width
                height: '100%', // Full height to fit the container
            }}
        />
        {/* Price Badge */}
        <Typography
            sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                backgroundColor: '#4F46E5',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                borderRadius: 2,
                padding: '2px 8px',
            }}
        >
            ${convertPrice(product.Price)} {selectedCurrency}
        </Typography>
    </Box>

    {/* Content Section */}
    <Box
        sx={{
            flex: 1, // Ensure this section grows to fill the space between the image and buttons
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        }}
    >
        {/* Product Name */}
        <Typography
            variant="h6"
            sx={{
                fontWeight: 'bold',
                color: '#111E56',
                marginBottom: '8px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }}
        >
            {product.Name}
        </Typography>

        {/* Description */}
        <Typography
            variant="body2"
            color="text.secondary"
            sx={{
                marginBottom: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3, // Limit to 3 lines
            }}
        >
            {product.Description}
        </Typography>

        {/* Ratings */}
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center', // Center horizontally
                alignItems: 'center', // Center vertically
                marginBottom: 2,
                height: 40, // Fixed height for star section
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    color: '#FFC107', // Yellow stars
                    fontSize: '1.5rem', // Larger stars
                }}
            >
                {'★'.repeat(product.Ratings)}{'☆'.repeat(5 - product.Ratings)}
            </Typography>
        </Box>
    </Box>

    {/* Action Buttons */}
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderTop: '1px solid #E5E7EB', // Divider above buttons
        }}
    >
        <Button
            variant="contained"
            color="primary"
            sx={{
                backgroundColor: '#111E56',
                color: 'white',
                textTransform: 'none', // Remove uppercase text
                borderRadius: 2, // Rounded corners
                fontWeight: 'medium',
                '&:hover': {
                    backgroundColor: 'white',
                    color: '#111E56',
                    border: '2px solid #111E56',
                },
                flex: 1, // Ensures it takes available space
                marginRight: 1,
            }}
            onClick={() => addToCart(product._id)}
        >
            Add to Cart
        </Button>
        {/* Wishlist Button */}
        <IconButton
            onClick={() => toggleWishlist(product._id)}
            sx={{
                transition: 'color 0.3s ease-in-out', // Smooth hover effect
                '&:hover': {
                    color: '#ff4081', // Pink on hover
                },
            }}
        >
            {wishlistItems.includes(product._id) ? (
                <FavoriteIcon sx={{ color: '#ff4081' }} /> // Filled pink heart
            ) : (
                <FavoriteBorderIcon sx={{ color: '#ff4081' }} /> // Outlined pink heart
            )}
        </IconButton>
    </Box>
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
            <Button
                type="submit"
                variant="contained"
                sx={{
                    backgroundColor: '#111E56',
                    color: 'white',
                    width: '150px', // Increase the width
                    height: '55px', // Decrease the height
                    border: '2px solid #111E56',
                    '&:hover': {
                        backgroundColor: 'white',
                        color: '#111E56',
                        border: '2px solid #111E56', // Optional: adds a border to match the dark blue on hover
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
