import React, { useEffect, useState } from 'react';
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

export default function PurchasedProduct() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewDetails, setReviewDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
        <CircularProgress />
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
    <Grid container spacing={4}>
        {orders.map((purchase) => (
            <Grid item xs={12} sm={6} md={4} key={purchase._id}>
                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {purchase.productId?.Name ? (
                        <>
                            <CardMedia
                                component="img"
                                height="200"
                                image={purchase.productId.imageUrl || 'https://via.placeholder.com/150'}
                                alt={purchase.productId.Name}
                            />
                            <CardContent>
                                <Typography variant="h6">{purchase.productId.Name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Price: ${purchase.productId.Price || 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Description: {purchase.productId.Description || 'No description available'}
                                </Typography>
                                {isDelivered ? (
                                    <>
                                        <Typography variant="body2" color="primary" gutterBottom>
                                            Status: Delivered
                                        </Typography>
                                        {purchase.review || purchase.rating ? (
                                            <Box mt={1}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Your Review:
                                                </Typography>
                                                <Rating value={purchase.rating} readOnly size="small" />
                                                <Typography variant="body2">{purchase.review}</Typography>
                                            </Box>
                                        ) : (
                                            <Button
                                                size="small"
                                                color="primary"
                                                onClick={() => handleReviewOpen(purchase)}
                                                sx={{ mt: 1 }}
                                            >
                                                Write a Review
                                            </Button>
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
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => handleCancelOrder(purchase._id)}
                                            sx={{ mt: 1 }}
                                        >
                                            Cancel Order
                                        </Button>
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
