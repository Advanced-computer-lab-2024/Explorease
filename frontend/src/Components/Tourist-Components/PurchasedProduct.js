import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Button, Typography, Box, TextField, Rating, Card, CardContent, 
  CardActions, Grid, Container, Dialog, DialogTitle, DialogContent, 
  DialogActions, CircularProgress, Divider
} from '@mui/material';

export default function PurchasedProduct() {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewDetails, setReviewDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/tourists/products');
        const productsWithSpecificAttributes = response.data.map(product => ({
          id: product._id,
          name: product.Name,
          price: product.Price,
          description: product.Description
        }));
        setProducts(productsWithSpecificAttributes);
        setLoading(false);

        // Fetch reviews for each product after loading products
        await fetchReviewsForProducts(productsWithSpecificAttributes);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
      }
    };

    const fetchReviewsForProducts = async (products) => {
      try {
        const reviewsPromises = products.map(product =>
          axios.get(`/tourists/getMyReviews`, { params: { productId: product.id } })
        );
        const reviewsResponses = await Promise.all(reviewsPromises);

        // Map the response into a reviews object for easy lookup
        const reviewsData = reviewsResponses.reduce((acc, response, index) => {
          acc[products[index].id] = response.data.reviews || [];
          return acc;
        }, {});
        setReviews(reviewsData);
      } catch (err) {
        setError('Failed to fetch reviews. Please try again later.');
      }
    };

    fetchProducts();
  }, []);

  const handleReviewOpen = (product) => {
    setCurrentProduct(product);
    setOpenReviewDialog(true);
  };

  const handleReviewClose = () => {
    setOpenReviewDialog(false);
    setReviewRating(0);
    setReviewDetails('');
    setCurrentProduct(null);
  };

  const handleReviewSubmit = async () => {
    if (!reviewRating || !reviewDetails.trim()) {
      alert('All fields (Rating & Details) are required.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(`/tourists/createProductReview`, {
        productId: currentProduct.id,
        Rating: reviewRating,
        Details: reviewDetails
      });
      // Update reviews state to include the new review
      setReviews(prevReviews => ({
        ...prevReviews,
        [currentProduct.id]: [...prevReviews[currentProduct.id], response.data.review]
      }));
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
        {products.map((product) => (
          <Card key={product.id} sx={{ mb: 4 }}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {product.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Price: ${product.price}
                  </Typography>
                  <Typography variant="body2" component="p">
                    Description: {product.description}
                  </Typography>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button size="small" color="primary" onClick={() => handleReviewOpen(product)}>
                      Write a Review
                    </Button>
                  </CardActions>
                </CardContent>
              </Grid>
              <Grid item xs={12} md={6}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Reviews:</Typography>
                  {reviews[product.id] && reviews[product.id].length > 0 ? (
                    reviews[product.id].map((review, index) => (
                      <Box key={index} mb={2}>
                        <Rating value={review.Rating} readOnly size="small" />
                        <Typography variant="body2">{review.Details}</Typography>
                        {index < reviews[product.id].length - 1 && <Divider sx={{ my: 1 }} />}
                      </Box>
                    ))
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
