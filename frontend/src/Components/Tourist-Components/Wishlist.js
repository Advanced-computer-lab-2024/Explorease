import React, { useEffect, useState , useContext } from 'react';
import {
    Box,
    Typography,
    Card,
    CardMedia,
    Button,
    Alert,
    CircularProgress,
    Grid,
    IconButton,
    Tooltip,
} from '@mui/material';
import axios from 'axios';
import { CurrencyContext } from './CurrencyContext';
import DeleteIcon from '@mui/icons-material/Delete';

const Wishlist = ({incrementCartCount , updateWishlistCount}) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistMessage, setWishlistMessage] = useState('');
    const [loading, setLoading] = useState(true);  // Add loading state
    const { selectedCurrency, exchangeRates } = useContext(CurrencyContext); // Use CurrencyContext

    // Fetch Wishlist Items
    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/wishlist', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWishlistItems(response.data.wishlist.products || []);
        } catch (error) {
            setWishlistMessage('Error fetching wishlist items');
        }
        finally {
            setLoading(false); // End loading after all fetches are done
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const removeFromWishlist = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/tourists/wishlist/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWishlistMessage('Product removed from wishlist!');
            fetchWishlist(); // Refresh wishlist
            updateWishlistCount(wishlistItems.length-1)
        } catch (error) {
            setWishlistMessage('Error removing product from wishlist');
        }
    };

    const convertPrice = (price) => {
        return (price * (exchangeRates[selectedCurrency] || 1)).toFixed(2);
    };

    const addToCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                '/tourists/cart/add',
                { productId, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setWishlistMessage('Product added to cart!');
            incrementCartCount();
        } catch (error) {
            setWishlistMessage('Error adding product to cart');
        }
    };

   return(  
   <Box sx={{ p: 3 }}>
    <Typography
      variant="h4"
      sx={{
        mb: 3,
        fontWeight: 'bold',
        color: '#111E56',
        position: 'relative', // Ensures the pseudo-element is positioned relative to the Typography
      }}
    >
      My Wishlist
    </Typography>

    {wishlistMessage && <Alert severity="info" sx={{ mb: 2 }}>{wishlistMessage}</Alert>}

    {/* Loading state with CircularProgress */}
    {loading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress sx={{ color: '#111E56' }} />
      </Box>
    ) : (
      wishlistItems.length === 0 ? (
        <Typography>No items in wishlist</Typography>
      ) : (
        <Grid
            container
            spacing={3} // Spacing between grid items
            sx={{ padding: 2 }}
          >
            {wishlistItems.map((product) => (
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
                      onClick={() => removeFromWishlist(product._id)}
                      sx={{
                        transition: "color 0.3s ease-in-out",
                        "&:hover": {
                          color: "#ff4081",
                        },
                      }}
                    >
                        <Tooltip title="Remove from Wishlist" arrow>
    <DeleteIcon sx={{ color: '#FF0000' }} />
  </Tooltip>
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
      )
    )}
  </Box>
);
};

export default Wishlist;
