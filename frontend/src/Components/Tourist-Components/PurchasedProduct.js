import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Button, Typography, Box, Rating, Card, CardContent, 
  CardActions, Grid, Container, Dialog, DialogTitle, DialogContent, 
  DialogActions, CircularProgress, TextField
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
          headers: { Authorization: `Bearer ${token}` }
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
      const response = await axios.put(`/tourists/purchase/${currentPurchase._id}/review`, {
        rating: reviewRating,
        review: reviewDetails
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update the purchases array to include the new review
      setPurchases(prevPurchases =>
        prevPurchases.map(purchase =>
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

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Purchased Products
        </Typography>
        {purchases.map((purchase) => (
          <Card key={purchase._id} sx={{ mb: 4 }}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {purchase.productId.Name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Price: ${purchase.productId.Price}
                  </Typography>
                  <Typography variant="body2" component="p">
                    Description: {purchase.productId.Description}
                  </Typography>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    {purchase.review || purchase.rating ? (
                      <Typography variant="body2" color="textSecondary">
                        Review already submitted.
                      </Typography>
                    ) : (
                      <Button size="small" color="primary" onClick={() => handleReviewOpen(purchase)}>
                        Write a Review
                      </Button>
                    )}
                  </CardActions>
                </CardContent>
              </Grid>
              <Grid item xs={12} md={6}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Review:</Typography>
                  {purchase.review || purchase.rating ? (
                    <Box mb={2}>
                      <Rating value={purchase.rating || 0} readOnly size="small" />
                      <Typography variant="body2">{purchase.review}</Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2">No reviews yet.</Typography>
                  )}
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        ))}
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
