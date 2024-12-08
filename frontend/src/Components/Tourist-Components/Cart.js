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
    CircularProgress,
    Tooltip,
    Grid,

} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

// import { useNavigate } from 'react-router-dom';
import { CurrencyContext } from './CurrencyContext';

const Cart = ({ handleSectionChange}) => {
    const [cartItems, setCartItems] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [checkoutMessage, setCheckoutMessage] = useState('');
    const [loading, setLoading] = useState(true);  // Add loading state

    // const navigate = useNavigate();

    // Memoize the fetchCartItems function using useCallback
    const fetchCartItems = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/cart', {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response.data.items);
            setCartItems(response.data.items || []);
            calculateTotalCost(response.data.items || []);
        } catch (error) {
            setCheckoutMessage('Error fetching cart items');
            console.error('Error fetching cart items:', error);
        }finally {
            setLoading(false); // End loading after all fetches are done
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
            <Typography variant="h4" sx={{ mb: 3, color: '#111E56', fontWeight: 'bold' }}>
                Cart
            </Typography>
    
            {checkoutMessage && <Alert severity="info" sx={{ mb: 2 }}>{checkoutMessage}</Alert>}
    
            {/* Show loading spinner if cart is loading */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <CircularProgress sx={{ color: '#111E56' }} />
                </Box>
            ) : (
                cartItems.length === 0 ? (
                    <Typography>No items in cart</Typography>
                ) : (
                    <>
                    <Grid
            container
            spacing={3} // Spacing between grid items
            sx={{ padding: 2 }}
          >
            {cartItems.map((product) => (
              <Grid
                item
                key={product.productId._id}
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
        height: 300, // Increased height for the image container
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
        image={product.productId.imageUrl}
        alt={product.productId.Name}
        sx={{
            objectFit: "cover", // Ensures the image covers the full container width
            width: "100%", // Full width of the card
            height: "100%", // Full height to ensure proper coverage
        }}
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
        ${convertPrice(product.productId.Price)} {selectedCurrency}
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
                        {product.productId.Name}
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
                                        <Box display="flex" alignItems="center" gap={2} sx={{marginLeft:'25px'}}>
                                            <IconButton
                                                color="primary"
                                                onClick={() => updateQuantity(product.productId._id, product.quantity - 1)}
                                            >
                                                <RemoveIcon sx={{color:'#111E56'}} />
                                            </IconButton>
                                            <TextField
                                                value={product.quantity}
                                                inputProps={{ readOnly: true }}
                                                size="small"
                                                sx={{ width: '50px', textAlign: 'center' }}
                                            />
                                            <IconButton
                                                color="primary"
                                                onClick={() => updateQuantity(product.productId._id, product.quantity + 1)}
                                            >
                                                <AddIcon sx={{color:'#111E56'}} />
                                            </IconButton>
                                        </Box>
                    {/* Wishlist Button */}
                    
                    <IconButton
                      onClick={() => removeFromCart(product._id)}
                      sx={{
                        transition: "color 0.3s ease-in-out",
                        "&:hover": {
                          color: "#ff4081",
                        },
                        marginRight:'8px'
                      }}
                    >
                        <Tooltip title="Remove from Cart" arrow>
    <DeleteIcon sx={{ color: '#FF0000' }} />
  </Tooltip>
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>


                    {/* line */}
                        {/* <Box display="flex" flexDirection="column" gap={2}>
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
                                        sx={{ height: '40px', alignSelf: 'center', marginLeft: 'auto', backgroundColor: '#f44336',
                                            color: 'white',
                                            border: '2px solid #f44336',
                                            '&:hover': {
                                                backgroundColor: 'white',
                                                color: '#f44336',
                                                border: '2px solid #f44336',
                                            }, }}
                                    >
                                        Remove from Cart
                                    </Button>
                                </Card>
                            ))}
                        </Box> */}
    
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
                                sx={{ mt: 2, backgroundColor: '#111E56', color: 'white', border: '2px solid #111E56',
                                    '&:hover': { 
                                        backgroundColor: 'white', 
                                        color: '#111E56',
                                        border: '2px solid #111E56' 
                                    }, }}
                            >
                                Proceed to Checkout
                            </Button>
                        </Box>
                    </>
                )
            )}
        </Box>
    );
    
};

export default Cart;
