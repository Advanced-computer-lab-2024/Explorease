import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Button,
    Alert,
} from '@mui/material';
import axios from 'axios';

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
            setWishlistItems(response.data.wishlist.products || []);
        } catch (error) {
            setWishlistMessage('Error fetching wishlist items');
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
        } catch (error) {
            setWishlistMessage('Error removing product from wishlist');
        }
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
        } catch (error) {
            setWishlistMessage('Error adding product to cart');
        }
    };

    return (
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

            {wishlistItems.length === 0 ? (
                <Typography>No items in wishlist</Typography>
            ) : (
                <Box display="flex" flexDirection="column" gap={2}>
                    {wishlistItems.map((item) => (
                        <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center', // Centers horizontally
                            alignItems: 'center', // Centers vertically
                            
                        }}
                    >
                        <Card
                            key={item.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                height: '180px',
                                width: '85%',
                                marginTop: '5px',
                                p: 2,
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                borderRadius: '8px',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.03)',
                                    boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                                },
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={item.imageUrl || 'https://via.placeholder.com/150'}
                                alt={item.Name}
                                sx={{
                                    width: '150px',
                                    height: '150px',
                                    objectFit: 'contain',
                                    borderRadius: '8px',
                                }}
                            />
                            <CardContent
                                sx={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    gap: 2,
                                    height: '100%',
                                }}
                            >
                                <Typography variant="h6">{item.Name}</Typography>
                                <Typography variant="body2">Price: ${item.Price}</Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                    }}
                                >
                                    {item.Description}
                                </Typography>
                                <Box display="flex" justifyContent="flex-start" gap={2} sx={{
                            display: 'flex',
                            justifyContent: 'center', // Centers horizontally
                            alignItems: 'center', // Centers vertically
                            
                        }} >
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#111E56',
                                            color: 'white',
                                            border: '2px solid #111E56',
                                            '&:hover': {
                                                backgroundColor: 'white',
                                                color: '#111E56',
                                                border: '2px solid #111E56',
                                            },
                                        }}
                                        onClick={() => addToCart(item._id)}
                                    >
                                        Add to Cart
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'white',
                                                color: '#f44336',
                                                border: '1px solid #f44336',
                                            },
                                        }}
                                        onClick={() => removeFromWishlist(item._id)}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default Wishlist;
