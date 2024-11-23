import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Button,
    Alert,
} from '@mui/material';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistMessage, setWishlistMessage] = useState('');

    // Fetch Wishlist Items
    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/wishlist', {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('Wishlist response:', response.data); // Debugging response
            setWishlistItems(response.data.wishlist.products || []); // Correctly access the `products` array
        } catch (error) {
            setWishlistMessage('Error fetching wishlist items');
            console.error('Error fetching wishlist items:', error);
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
            fetchWishlist(); // Refresh wishlist after removing
        } catch (error) {
            setWishlistMessage('Error removing product from wishlist');
            console.error('Error removing product from wishlist:', error);
        }
    };

    const addToCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                '/tourists/cart/add',
                { productId, quantity: 1 }, // Assuming default quantity is 1
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setWishlistMessage('Product added to cart!');
        } catch (error) {
            setWishlistMessage('Error adding product to cart');
            console.error('Error adding product to cart:', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                My Wishlist
            </Typography>

            {wishlistMessage && <Alert severity="info" sx={{ mb: 2 }}>{wishlistMessage}</Alert>}

            {wishlistItems.length === 0 ? (
                <Typography>No items in wishlist</Typography>
            ) : (
                <Box display="flex" flexDirection="column" gap={2}>
                    {wishlistItems.map((item) => (
                        <Card key={item.id} sx={{ display: 'flex', mb: 2 }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={item.imageUrl || 'https://via.placeholder.com/150'} // Use placeholder if no image
                                alt={item.Name}
                                sx={{ objectFit: 'contain' }}
                            />
                            <CardContent>
                                <Typography variant="h6">{item.Name}</Typography>
                                <Typography variant="body2">Price: ${item.Price}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.Description}
                                </Typography>
                                <Box display="flex" gap={2} sx={{ mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => addToCart(item._id)} // Add to cart
                                    >
                                        Add to Cart
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => removeFromWishlist(item._id)} // Remove from wishlist
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default Wishlist;
