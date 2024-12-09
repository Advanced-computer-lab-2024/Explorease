import React, { useEffect, useState  , useContext} from 'react';
import axios from 'axios';
import {
  Button,
  Typography,
  Box,
  Rating,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  TextField,
  Divider,
} from '@mui/material';
import { CurrencyContext } from './CurrencyContext';

export default function PurchasedProduct() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewDetails, setReviewDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { selectedCurrency, exchangeRates } = useContext(CurrencyContext); // Use CurrencyContext
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get('/tourists/purchases/my-purchases', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPurchases(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch purchases. Please try again later.');
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [token]);

  const handleReviewOpen = (purchase) => {
    setCurrentPurchase(purchase);
    setOpenReviewDialog(true);
  };

  const handleReviewClose = () => {
    setOpenReviewDialog(false);
    setReviewRating(0);
    setReviewDetails('');
    setCurrentPurchase(null);
  };

  const handleReviewSubmit = async () => {
    if (!reviewRating && !reviewDetails.trim()) {
      alert('Please add either a rating or a review.');
      return;
    }

    setSubmitting(true);
    try {
      await axios.put(
        `/tourists/purchase/${currentPurchase._id}/review`,
        {
          rating: reviewRating,
          review: reviewDetails,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPurchases((prevPurchases) =>
        prevPurchases.map((purchase) =>
          purchase._id === currentPurchase._id
            ? { ...purchase, rating: reviewRating, review: reviewDetails }
            : purchase
        )
      );

      handleReviewClose();
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const convertPrice = (price) => {
    return (price * (exchangeRates[selectedCurrency] || 1)).toFixed(2);
  };

  const handleCancelOrder = async (purchaseId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        await axios.delete(`/tourists/purchases/${purchaseId}/cancel`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        // Remove the canceled order from the recent orders
        setPurchases((prevPurchases) =>
            prevPurchases.filter((purchase) => purchase._id !== purchaseId)
        );

        alert('Order canceled successfully.');
    } catch (error) {
        console.error('Error canceling order:', error);
        alert('Failed to cancel the order. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress sx={{color:'#111E56'}} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const deliveredOrders = purchases.filter((purchase) => new Date(purchase.purchaseDate) <= twoDaysAgo);
  const recentOrders = purchases.filter((purchase) => new Date(purchase.purchaseDate) > twoDaysAgo);

  const renderOrders = (orders, isDelivered) => (
    


    // line
    <Grid
            container
            spacing={3} // Spacing between grid items
            sx={{ padding: 2 }}
          >
        {orders.map((purchase) => (
            <Grid
                item
                key={purchase._id}
                xs={12} // For small screens (mobile): full width
                sm={6} // For medium screens: 2 cards per row
                md={4} // For large screens: 4 cards per row
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
                    {purchase.productId?.Name ? (
                        <>
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
                                        image={purchase.productId.imageUrl || 'https://via.placeholder.com/150'}
                                        alt={purchase.productId.Name}
                                        sx={{
                                            objectFit: "cover", // Ensures the image covers the full container width
                                            width: "100%", // Full width of the card
                                            height: "100%", // Full height to ensure proper coverage
                                        }}
                                        // onClick={() => handleProductClick(product._id)}
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
                                        { convertPrice(purchase.productId.Price)}{selectedCurrency}
                                    </Typography>
                                </Box>
                            <CardContent>
                            <Box
                              sx={{
                                flex: 1,
                                padding: "16px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                              }}
                            >
                                <Box
                                  sx={{
                                    height: 35,
                                    overflow: "hidden",
                                    textAlign: "center",
                                  }}
                                >
                                  <Typography variant="h6" sx={{fontWeight:'bold' , color:'#111E56'}}>{purchase.productId.Name}</Typography>
                                </Box>
                                {/* <Typography variant="body2" color="textSecondary">
                                    Price: ${purchase.productId.Price || 'N/A'}
                                </Typography> */}

                                  <Box
                                    sx={{
                                      height: 50,
                                      overflow: "hidden",
                                      marginTop: 1,
                                      textAlign: "left",
                                    }}
                                  >
                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        Description: {purchase.productId.Description || 'No description available'}
                                    </Typography>
                                  </Box>
                                </Box>
                                {isDelivered ? (
                                    <>
                                    {/* Action Buttons */}
                  
                                        <Typography variant="body2" color="primary" gutterBottom>
                                            Status: Delivered
                                        </Typography>
                                        {purchase.review || purchase.rating ? (
                                          <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: "16px",
                                            
                                          }}
                                        >
                                              <Box mt={1 } sx={{height:'30%' , display:'flex' , justifyContent:'flex-start'}} >
                                                <Box mt={1} sx={{marginLeft:'40px' }}>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Your Review:
                                                    </Typography>
                                                    <Rating value={purchase.rating} readOnly size="small" />
                                                </Box>
                                                <Box mt={1} sx={{marginLeft:'30px' , marginTop:'15px'}}>
                                                    <Typography variant="body2">{purchase.review}</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>

                                        ) : (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                              padding: "16px",

                                            }}
                                          >
                                            <Button
                                                size="small"
                                                color="primary"
                                                onClick={() => handleReviewOpen(purchase)}
                                                sx={{ mt: 1 , ml:11}}
                                            >
                                                Write a Review
                                            </Button>
                                        </Box>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="body2" color="secondary" gutterBottom>
                                            Status: Delivering
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Payment Method: {purchase.paymentMethod ? purchase.paymentMethod.charAt(0).toUpperCase() + purchase.paymentMethod.slice(1) : 'Unknown'}
                                        </Typography>
                                        <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px",
                      
                    }}
                  >
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => handleCancelOrder(purchase._id)}
                                            sx={{ mt: 1 , ml:12 }}
                                        >
                                            Cancel Order
                                        </Button>
                                    </Box>
                                    </>
                                )}
                            </CardContent>
                        </>
                    ) : (
                        <CardContent>
                            <Typography variant="h6" color="error">
                                Product has been removed from the market. 
                            </Typography>
                        </CardContent>
                    )}
                </Card>
            </Grid>
        ))}
    </Grid>
);

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom sx={{fontWeight:'bold' , color:'#111E56'}}>
          Past Orders
        </Typography>

        <Box my={4}>
          <Typography variant="h5" gutterBottom sx={{fontWeight:'bold' , color:'#111E56'}}>
            Delivered Orders
          </Typography>
          {deliveredOrders.length > 0 ? renderOrders(deliveredOrders, true) : <Typography>No delivered orders.</Typography>}
        </Box>


        <Divider sx={{ my: 4 }} />

        <Box my={4}>
          <Typography variant="h5" gutterBottom sx={{fontWeight:'bold' , color:'#111E56'}}>
            Recent Orders
          </Typography>
          {recentOrders.length > 0 ? renderOrders(recentOrders, false) : <Typography>No recent orders.</Typography>}
        </Box>
      </Box>

      <Dialog open={openReviewDialog} onClose={handleReviewClose}>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box my={2}>
            <Typography gutterBottom>Rating</Typography>
            <Rating
              name="review-rating"
              value={reviewRating}
              onChange={(event, newValue) => {
                setReviewRating(newValue);
              }}
            />
          </Box>
          <TextField
            autoFocus
            margin="dense"
            id="review-details"
            label="Review Details"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={reviewDetails}
            onChange={(e) => setReviewDetails(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReviewClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReviewSubmit} color="primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
