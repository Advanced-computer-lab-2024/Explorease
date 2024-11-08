// components/Cart.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Card, CardContent, CardMedia, Alert } from '@mui/material';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [checkoutMessage, setCheckoutMessage] = useState('');

    useEffect(() => {
        fetchCartItems();
        fetchWalletBalance();
    }, []);

    // Fetch items in the tourist's cart
    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(response.data.items || []);
            calculateTotalCost(response.data.items || []);
        } catch (error) {
            setCheckoutMessage('Error fetching cart items');
            console.error('Error fetching cart items:', error);
        }
    };

    // Fetch tourist's wallet balance
    const fetchWalletBalance = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/myProfile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWalletBalance(response.data.wallet || 0);
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
        }
    };

    // Calculate total cost of items in the cart
    const calculateTotalCost = (items) => {
        const total = items.reduce((sum, item) => sum + item.productId.Price * item.quantity, 0);
        setTotalCost(total);
    };

    const removeFromCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/tourists/cart/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCheckoutMessage('Product removed from cart');
            fetchCartItems();
        } catch (error) {
            setCheckoutMessage('Error removing product from cart');
            console.error('Error removing product from cart:', error);
        }
    };

    // Handle checkout process
    const handleCheckout = async () => {
        if (walletBalance < totalCost) {
            setCheckoutMessage('Insufficient funds in wallet. Please add more funds.');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            // Perform checkout, creating purchase records
            const response = await axios.post('/tourists/cart/checkout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update wallet balance and show success message
            setWalletBalance(response.data.newWalletBalance);
            setCartItems([]); // Clear cart
            setCheckoutMessage('Purchase successful! Items have been purchased.');
        } catch (error) {
            setCheckoutMessage('Checkout failed. Please try again.');
            console.error('Error during checkout:', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>My Cart</Typography>

            {checkoutMessage && <Alert severity="info" sx={{ mb: 2 }}>{checkoutMessage}</Alert>}

            {cartItems.length === 0 ? (
                <Typography>No items in cart</Typography>
            ) : (
                <>
                    <Box display="flex" flexDirection="column" gap={2}>
                        {cartItems.map((item) => (
                            <Card key={item.productId._id} sx={{ display: 'flex', mb: 2}}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={item.productId.imageUrl}
                                    alt={item.productId.Name}
                                    sx={{objectFit: "contain"}}
                                />
                                <CardContent>
                                    <Typography variant="h6">{item.productId.Name}</Typography>
                                    <Typography variant="body2">Price: ${item.productId.Price}</Typography>
                                    <Typography variant="body2">Quantity: {item.quantity}</Typography>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => removeFromCart(item.productId._id)}
                                        sx={{ mt: 2 }}
                                    >
                                        Remove from Cart
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>

                    {/* Summary and Checkout */}
                    <Box mt={4}>
                        <Typography variant="h6">Total Cost: ${totalCost}</Typography>
                        <Typography variant="h6">Wallet Balance: ${walletBalance}</Typography>
                        <Typography variant="h6">
                            Balance After Purchase: ${walletBalance - totalCost}
                        </Typography>

                        {walletBalance >= totalCost ? (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCheckout}
                                sx={{ mt: 2 }}
                            >
                                Proceed to Checkout
                            </Button>
                        ) : (
                            <Typography color="error" sx={{ mt: 2 }}>
                                Insufficient funds in wallet. Please add more funds.
                            </Typography>
                        )}
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Cart;
