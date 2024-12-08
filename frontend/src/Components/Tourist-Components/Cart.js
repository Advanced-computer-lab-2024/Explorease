import React, { useEffect, useState, useContext , useCallback } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Alert,
    TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
// import { useNavigate } from 'react-router-dom';
import { CurrencyContext } from './CurrencyContext';

const Cart = ({ handleSectionChange}) => {
    const [cartItems, setCartItems] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [checkoutMessage, setCheckoutMessage] = useState('');

    // const navigate = useNavigate();

    // Memoize the fetchCartItems function using useCallback
    const fetchCartItems = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/cart', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCartItems(response.data.items || []);
            calculateTotalCost(response.data.items || []);
        } catch (error) {
            setCheckoutMessage('Error fetching cart items');
            console.error('Error fetching cart items:', error);
        }
    }, []);

    useEffect(() => {
        fetchCartItems();
        fetchWalletBalance();
    }, [fetchCartItems]);

    const { selectedCurrency, exchangeRates } = useContext(CurrencyContext); // Use CurrencyContext


    const convertPrice = (price) => {
        return (price * (exchangeRates[selectedCurrency] || 1)).toFixed(2);
    };

       // No dependencies for fetchCartItems itself

    // const fetchCartItems = async () => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await axios.get('/tourists/cart', {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         setCartItems(response.data.items || []);
    //         calculateTotalCost(response.data.items || []);
    //     } catch (error) {
    //         setCheckoutMessage('Error fetching cart items');
    //         console.error('Error fetching cart items:', error);
    //     }
    // };

    const fetchWalletBalance = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/myProfile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWalletBalance(response.data.wallet || 0);
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
        }
    };

    const calculateTotalCost = (items) => {

            const total = items.reduce((sum, item) => sum + item.productId.Price * item.quantity, 0);
            setTotalCost(total);
        
    };

    const updateQuantity = async (productId, newQuantity) => {
        try {
            if (newQuantity <= 0) return;
            const token = localStorage.getItem('token');
            await axios.put(
                '/tourists/cart/update',
                { productId, quantity: newQuantity },
                { headers: { Authorization: `Bearer ${token}` } },
            );
            fetchCartItems(); // Refresh cart after updating
        } catch (error) {
            setCheckoutMessage('Error updating quantity');
            console.error('Error updating quantity:', error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/tourists/cart/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCheckoutMessage('Product removed from cart');
            fetchCartItems();
        } catch (error) {
            setCheckoutMessage('Error removing product from cart');
            console.error('Error removing product from cart:', error);
        }
    };

    const handleCheckout = async () => {
        handleSectionChange('checkout'); // Navigate to Checkout component
    };


    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                My Cart
            </Typography>

            {checkoutMessage && <Alert severity="info" sx={{ mb: 2 }}>{checkoutMessage}</Alert>}

            {cartItems.length === 0 ? (
                <Typography>No items in cart</Typography>
            ) : (
                <>
                    <Box display="flex" flexDirection="column" gap={2}>
                        {cartItems.map((item) => (
                            <Card key={item.productId._id} sx={{ display: 'flex', alignItems: 'center', mb: 2, padding: '16px', borderRadius: '8px', boxShadow: 3 }}>
                                <CardMedia
                                    component="img"
                                    image={item.productId.imageUrl}
                                    alt={item.productId.Name}
                                    sx={{ width: '150px', height: '150px', objectFit: 'contain', borderRadius: '8px', marginRight: '16px' }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        {item.productId.Name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Price: {convertPrice(item.productId.Price)} {selectedCurrency}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Total: {convertPrice(item.productId.Price * item.quantity)} {selectedCurrency}
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                        <TextField
                                            value={item.quantity}
                                            inputProps={{ readOnly: true }}
                                            size="small"
                                            sx={{ width: '50px', textAlign: 'center' }}
                                        />
                                        <IconButton
                                            color="primary"
                                            onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => removeFromCart(item.productId._id)}
                                    sx={{ height: '40px', alignSelf: 'center', marginLeft: 'auto' }}
                                >
                                    Remove from Cart
                                </Button>
                            </Card>
                        ))}
                    </Box>

          
                    {/* Summary and Checkout */}
                    <Box mt={4}>
                        <Typography variant="h6">Total Cost: {convertPrice(totalCost.toFixed(2))} {selectedCurrency}</Typography>
                        <Typography variant="h6">Wallet Balance: {convertPrice(walletBalance)} {selectedCurrency}</Typography>
                        <Typography variant="h6">
                            Balance After Purchase: {convertPrice((walletBalance - totalCost).toFixed(2))} {selectedCurrency}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCheckout}
                            sx={{ mt: 2 }}
                        >
                            Proceed to Checkout
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Cart;
