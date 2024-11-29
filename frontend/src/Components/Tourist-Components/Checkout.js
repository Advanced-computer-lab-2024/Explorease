import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Button,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Alert,
} from '@mui/material';

const Checkout = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [newAddress, setNewAddress] = useState({
        label: '',
        address: '',
        city: '',
        zipCode: '',
        country: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('wallet');
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [finalCost, setFinalCost] = useState(0);
    const [checkoutMessage, setCheckoutMessage] = useState('');
    const [isStripeRedirecting, setIsStripeRedirecting] = useState(false);

    useEffect(() => {
        fetchCartDetails();
        fetchAddresses();
    }, []);

    // Fetch cart details
    const fetchCartDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/cart', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const total = response.data.items.reduce(
                (sum, item) => sum + item.productId.Price * item.quantity,
                0
            );
            setTotalCost(total);
            setFinalCost(total); // Initialize final cost with total cost
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    // Fetch existing delivery addresses
    const fetchAddresses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/delivery-address', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAddresses(response.data.addresses || []);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    // Add a new delivery address
    const handleAddAddress = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                '/tourists/delivery-address',
                newAddress,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchAddresses(); // Refresh the address list
            setNewAddress({ label: '', address: '', city: '', zipCode: '', country: '' });
        } catch (error) {
            console.error('Error adding address:', error.response?.data || error.message);
        }
    };

    // Apply promo code
    const handleApplyPromoCode = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/tourists/promocode', // Promo code validation endpoint
                { promoCode, cartTotal: totalCost },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDiscount(response.data.discount);
            setFinalCost(totalCost - response.data.discount);
            setCheckoutMessage('Promo code applied successfully!');
        } catch (error) {
            console.error('Error applying promo code:', error.response?.data || error.message);
            setCheckoutMessage('Failed to apply promo code. Please try again.');
        }
    };

    // Handle checkout process
    const handleCheckout = async () => {
        if (!selectedAddress) {
            setCheckoutMessage('Please select a delivery address.');
            return;
        }

        if (paymentMethod === 'wallet') {
            await handleWalletCheckout();
        } else if (paymentMethod === 'stripe') {
            await handleStripeCheckout();
        } else if (paymentMethod === 'cod') {
            await handleCODCheckout();
        }
    };

    // Handle Wallet Payment
    const handleWalletCheckout = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/tourists/cart/checkout',
                { address: selectedAddress, paymentMethod: 'wallet', promoCode },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCheckoutMessage(response.data.message);
        } catch (error) {
            console.error('Error during wallet checkout:', error);
            setCheckoutMessage('Checkout failed. Please try again.');
        }
    };

    // Handle Stripe Payment
    const handleStripeCheckout = async () => {
        try {
            setIsStripeRedirecting(true);
            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/tourists/cart/stripe-session',
                { address: selectedAddress, promoCode },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log(promoCode.discount);

            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                setCheckoutMessage('Stripe session creation failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during Stripe checkout:', error);
            setCheckoutMessage('Stripe checkout failed. Please try again.');
        } finally {
            setIsStripeRedirecting(false);
        }
    };

    // Handle Cash on Delivery Payment
    const handleCODCheckout = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/tourists/cart/checkout',
                { address: selectedAddress, paymentMethod: 'cod', promoCode },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCheckoutMessage(response.data.message);
        } catch (error) {
            console.error('Error during COD checkout:', error);
            setCheckoutMessage('Checkout failed. Please try again.');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Checkout</Typography>

            {checkoutMessage && <Alert severity="info" sx={{ mb: 2 }}>{checkoutMessage}</Alert>}

            <Typography variant="h6">Cart Total: ${totalCost}</Typography>
            <Typography variant="h6">Discount: ${discount}</Typography>
            <Typography variant="h6">Final Total: ${finalCost}</Typography>

            <Box sx={{ mt: 3 }}>
    <Typography variant="h6">Have a Promo Code?</Typography>
    <TextField
        label="Enter Promo Code"
        fullWidth
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
        sx={{ mb: 2 }}
    />
    <Button variant="contained" onClick={handleApplyPromoCode} sx={{ mb: 2 }}>
        Apply
    </Button>
    <Typography variant="body1" color="primary">
        Discount: ${discount}
    </Typography>
</Box>


            {/* Delivery Address Section */}
            <Typography variant="h6" sx={{ mt: 3 }}>Select Delivery Address</Typography>
            {addresses.length === 0 ? (
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    No delivery addresses found. Please add a new address.
                </Typography>
            ) : (
                <RadioGroup
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    sx={{ mb: 3 }}
                >
                    {addresses.map((address, index) => (
                        <FormControlLabel
                            key={index}
                            value={address.label}
                            control={<Radio />}
                            label={`${address.label}: ${address.address}, ${address.city}, ${address.zipCode}, ${address.country}`}
                        />
                    ))}
                </RadioGroup>
            )}

            {/* Add New Address Form */}
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Add New Address</Typography>
                <TextField
                    label="Label (e.g., Home, Office)"
                    fullWidth
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Address"
                    fullWidth
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="City"
                    fullWidth
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="ZIP Code"
                    fullWidth
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Country"
                    fullWidth
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" onClick={handleAddAddress} sx={{ mt: 2 }}>
                    Add Address
                </Button>
            </Box>

            {/* Payment Method Section */}
            <Box sx={{ mt: 4 }}>
                <FormControl>
                    <FormLabel>Payment Method</FormLabel>
                    <RadioGroup
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        sx={{ mt: 1 }}
                    >
                        <FormControlLabel value="wallet" control={<Radio />} label="Wallet" />
                        <FormControlLabel value="stripe" control={<Radio />} label="Credit Card (Stripe)" />
                        <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
                    </RadioGroup>
                </FormControl>
            </Box>

            {/* Checkout Button */}
            <Button
                variant="contained"
                color="primary"
                onClick={handleCheckout}
                sx={{ mt: 3 }}
                disabled={addresses.length === 0 || isStripeRedirecting}
            >
                {isStripeRedirecting ? 'Redirecting to Stripe...' : 'Place Order'}
            </Button>
        </Box>
    );
};

export default Checkout;
