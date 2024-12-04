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
    Grid
    
} from '@mui/material';
import { CurrencyContext } from './CurrencyContext';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';


const Products = ( { updateWishlistCount , incrementCartCount}) => {
    const [products, setProducts] = useState([]);
    const [productMessage, setProductMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortByRatings, setSortByRatings] = useState('');
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistMessage, setWishlistMessage] = useState('');
    const { selectedCurrency, exchangeRates } = useContext(CurrencyContext); // Use CurrencyContext

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
            updateWishlistCount(productIds.length); // Update the count in the parent component
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
                updateWishlistCount(wishlistItems.length - 1); // Update count in parent component
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
                updateWishlistCount(wishlistItems.length + 1); // Update count in parent component
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

        return (
        <Grid
            container
            spacing={3} // Spacing between grid items
            sx={{ padding: 2 }}
          >
            {products.map((product) => (
              <Grid
                item
                key={product._id}
                xs={12} // For small screens (mobile): full width
                sm={6} // For medium screens: 2 cards per row
                md={3} // For large screens: 4 cards per row
              >
                <Card
                  sx={{
                    width: "100%", // Full width of the grid item
                    height: 450, // Fixed height for all cards
                    borderRadius: 4,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // Subtle shadow
                    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out", // Hover effects
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
                    },
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Image Section */}
<Box
    sx={{
        position: "relative",
        height: 250, // Increased height for the image container
        overflow: "hidden", // Ensure the image does not exceed this container
        borderRadius: "12px 12px 0 0", // Rounded top corners
        display: "flex", // Flexbox for centering the image
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5", // Optional placeholder background
    }}
>
    <CardMedia
        component="img"
        image={product.imageUrl}
        alt={product.Name}
        sx={{
            objectFit: "cover", // Ensures the image covers the full container width
            width: "100%", // Full width of the card
            height: "100%", // Full height to ensure proper coverage
        }}
    />
    {/* Price Badge */}
    <Typography
        sx={{
            position: "absolute",
            top: 10,
            left: 10,
            backgroundColor: "#4F46E5",
            color: "white",
            fontSize: "0.875rem",
            fontWeight: "bold",
            borderRadius: 2,
            padding: "2px 8px",
        }}
    >
        ${convertPrice(product.Price)} {selectedCurrency}
    </Typography>
</Box>

      
                  {/* Content Section */}
                  <Box
                    sx={{
                      flex: 1,
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Product Name */}
                    <Box
                      sx={{
                        height: 35,
                        overflow: "hidden",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          color: "#111E56",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {product.Name}
                      </Typography>
                    </Box>
      
                    {/* Description */}
                    <Box
                      sx={{
                        height: 50,
                        overflow: "hidden",
                        marginTop: 1,
                        textAlign: "left",
                      }}
                    >
                      <Typography
            variant="body2"
            color="text.secondary"
            sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2, // Limit to 2 lines instead of 3
            }}
        >
            {product.Description}
        </Typography>
                    </Box>
      
                    {/* Ratings */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 2,
                        height: 25,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#FFC107",
                          fontSize: "1.5rem",
                        }}
                      >
                        {"★".repeat(product.Ratings)}{"☆".repeat(5 - product.Ratings)}
                      </Typography>
                    </Box>
                  </Box>
      
                  {/* Action Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px",
                      borderTop: "1px solid #E5E7EB",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        backgroundColor: "#111E56",
                        color: "white",
                        textTransform: "none",
                        borderRadius: 2,
                        fontWeight: "medium",
                        "&:hover": {
                          backgroundColor: "white",
                          color: "#111E56",
                          border: "2px solid #111E56",
                        },
                        flex: 1,
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
                        transition: "color 0.3s ease-in-out",
                        "&:hover": {
                          color: "#ff4081",
                        },
                      }}
                    >
                      {wishlistItems.includes(product._id) ? (
                        <FavoriteIcon sx={{ color: "#ff4081" }} />
                      ) : (
                        <FavoriteBorderIcon sx={{ color: "#ff4081" }} />
                      )}
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
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
