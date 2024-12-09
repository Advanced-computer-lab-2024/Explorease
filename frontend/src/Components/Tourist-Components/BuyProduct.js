import React, { useState, useEffect, useContext , useCallback} from 'react';
import axios from 'axios';
import {
    Box,
    Card,
    CardMedia,
    Typography,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    IconButton,
    Grid,
    CircularProgress,
    Dialog, DialogTitle, DialogActions, DialogContent
} from '@mui/material';
import { CurrencyContext } from './CurrencyContext';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star'

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
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [openReviewModal, setOpenReviewModal] = useState(false); // Control the modal visibility
    const [selectedProduct, setSelectedProduct] = useState(null); // Store the selected product
    const [ratings, setRatings] = useState([]);

    const handleProductClick = (productId) => {
      setSelectedProduct(productId); // Set the clicked product ID
      fetchReviews(productId); // Fetch reviews for the clicked product
      setOpenReviewModal(true); // Open the modal
  };

    const fetchReviews = async (productId) => {
      try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`/tourists/products/getreviews/${productId}`, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          setRatings(response.data.ratings)
          setReviews(response.data.reviews || []);
      } catch (error) {
          console.error('Error fetching reviews:', error);
      }
  };
    
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
        }finally {
          setLoading(false); // End loading after all fetches are done
      }
    };

 // Memoize the fetchWishlist function
 const fetchWishlist = useCallback(async () => {
  try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/tourists/wishlist', {
          headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Wishlist response:', response.data);

      // Extract product IDs from the wishlist
      const productIds = response.data.wishlist.products.map((item) => item._id);
      setWishlistItems(productIds); // Update the state with only IDs
      updateWishlistCount(productIds.length); // Update the count in the parent component
  } catch (error) {
      setWishlistMessage('Error fetching wishlist items');
      console.error('Error fetching wishlist items:', error);
  }
}, [updateWishlistCount]);

// Fetch all products and wishlist items on component mount
useEffect(() => {
  fetchAllProducts();
  fetchWishlist();
}, [fetchWishlist]); // Add fetchWishlist to the dependency array

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
            await axios.post('/tourists/cart/add', { productId, quantity: 1 }, {
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
                          onClick={() => handleProductClick(product._id)}
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
                    onClick={() => product.AvailableQuantity > 0 && addToCart(product._id)} // Only allow adding to cart if quantity > 0
                    disabled={product.AvailableQuantity === 0} // Disable button if productQuantity is 0
                  >
                    {product.AvailableQuantity === 0 ? "Out of stock" : "Add to Cart"} {/* Change text if quantity is 0 */}
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
 // Function to render the modal with reviews
 const renderReviewModal = () => {
  // Create a combined list of reviews and ratings based on the username
  const combinedData = reviews.map(review => {
    const rating = ratings.find(r => r.username === review.username); // Find the matching rating for the review by username
    return {
      username: review.username,
      rating: rating ? rating.rating : null, // If no rating found, use null
      review: review.review,
    };
  });

  return (
      <Dialog open={openReviewModal} onClose={() => setOpenReviewModal(false)}>
          <DialogTitle sx={{color:'#111E56' , fontWeight:'bold'}}>Product Reviews</DialogTitle>
          <DialogContent>
              {combinedData.length === 0 ? (
                  <Typography>No reviews or ratings available for this product.</Typography>
              ) : (
                  combinedData.map((data, index) => (
                      <Box key={index} sx={{ marginBottom: 2, border: '1px solid #ccc', padding: 2, borderRadius: 2 ,  }}>
                          <Typography variant="h6" sx={{color:'#111E56',fontWeight:'bold'}}><strong>{data.username}</strong></Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {data.rating ? (
                                  <Box sx={{ marginRight: 1 }}>
                                      {/* Render the rating in stars */}
                                      {[...Array(5)].map((_, i) => (
                                          <StarIcon key={i} sx={{ color: i < data.rating ? 'gold' : 'gray' }} />
                                      ))}
                                  </Box>
                              ) : (
                                  <Typography variant="body2" sx={{ color: 'gray' }}>No rating given</Typography>
                              )}
                          </Box>
                          <Typography variant="body2" sx={{ marginTop: 1 }}>
                              <strong style={{color:'#111E56' , fontWeight:'bold'}} >Review:</strong> {data.review || 'No review provided'}
                          </Typography>
                      </Box>
                  ))
              )}
          </DialogContent>
          <DialogActions>
              <Button onClick={() => setOpenReviewModal(false)} color="#111E56">
                  Close
              </Button>
          </DialogActions>
      </Dialog>
  );
};

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 , fontWeight:'bold' , color:'#111E56' }}>
              Products
            </Typography>

            <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>

                <Box display="flex" flexWrap="wrap" gap={2} mb={5}  alignItems="center" >
                    <TextField
                        label="Search by Name"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ flex: 1 }}
                        //fullWidth
                    />

                    <TextField
                        label="Min Price"
                        variant="outlined"
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        sx={{ flex: 1 }}
                        //fullWidth
                    />

                    <TextField
                        label="Max Price"
                        variant="outlined"
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        sx={{ flex: 1 }}
                        //fullWidth
                    />

                    <FormControl variant="outlined" sx={{ flex: 1 }}>
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
                      //width: '150px', // Increase the width
                      height: '40px', // Decrease the height
                      padding: '0 16px', // Adjusted padding
                      fontSize: '14px', // Smaller text
                      border: '2px solid #111E56',
                      '&:hover': {
                        backgroundColor: 'white',
                        color: '#111E56',
                        border: '2px solid #111E56', 
                        },
                      }}
                   >
                   Search
                  </Button>
                  </Box>

                {productMessage && <Typography color="error">{productMessage}</Typography>}
            </form>

            {/* Display CircularProgress when loading */}
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress sx={{ color: '#111E56' }} />
            </Box>
        ) : (

            <Box display="flex" flexWrap="wrap" justifyContent="center" sx={{ gap: 3 }}>
                {renderProductCards()}
            </Box>
        )}
                    {renderReviewModal()}

        </Box>
    );
};

export default Products;
