import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [productMessage, setProductMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortByRatings, setSortByRatings] = useState('');
    const [exchangeRates, setExchangeRates] = useState({});
    const [selectedCurrency, setSelectedCurrency] = useState('USD');

    const YOUR_API_KEY = "1b5f2effe7b482f6a6ba499d";


    const fetchAllProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/products', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProducts(response.data || []);
        } catch (error) {
            setProductMessage('Error fetching products');
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchAllProducts();
        fetchExchangeRates();

    }, []);


    const fetchExchangeRates = async () => {
        try {
            const response = await axios.get(`https://v6.exchangerate-api.com/v6/${YOUR_API_KEY}/latest/USD`);
            setExchangeRates(response.data.conversion_rates);
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
        }
    };

    const convertToUSD = (price) => {
        return (price / (exchangeRates[selectedCurrency] || 1)).toFixed(2);
    };

    const fetchFilteredProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            let queryString = '';
            if (searchQuery) queryString += `name=${searchQuery}&`;
            if (minPrice) queryString += `minPrice=${convertToUSD(minPrice)}&`;  
            if (maxPrice) queryString += `maxPrice=${convertToUSD(maxPrice)}&`;  
            if (sortByRatings) queryString += `sortByRatings=${sortByRatings}&`;

            const response = await axios.get(`/tourists/products/filter-sort-search?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProducts(response.data || []);
        } catch (error) {
            setProductMessage('Error fetching products');
            console.error('Error fetching products:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchFilteredProducts();
    };

    const handleCurrencyChange = (e) => {
        setSelectedCurrency(e.target.value);
    };

    const convertPrice = (price) => {
        return (price * (exchangeRates[selectedCurrency] || 1)).toFixed(2);
    };

    const addToCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/tourists/cart/add', { productId, quantity: 1 }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProductMessage('Product added to cart!');
        } catch (error) {
            setProductMessage('Error adding product to cart');
            console.error('Error adding product to cart:', error);
        }
    };
    

    const renderProductCards = () => {
        if (!Array.isArray(products) || products.length === 0) {
            return <Typography>No products available</Typography>;
        }

        return products.map((product) => (
            <Card key={product._id} sx={{ width: '100%', maxWidth: 280, m: 2, boxShadow: 3, flexGrow: 1 }}>
                <CardMedia
                    component="img"
                    height="250"
                    image={product.imageUrl}
                    alt={product.Name}
                    sx={{ objectFit: 'contain', padding: 1 }}
                />
                <CardContent>
                    <Typography variant="h6">{product.Name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                    <strong>Price:</strong> {convertPrice(product.Price)} {selectedCurrency}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Description:</strong> {product.Description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Ratings:</strong> {'★'.repeat(product.Ratings)}{'☆'.repeat(5 - product.Ratings)}
                    </Typography>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }} fullWidth
                    onClick={() => addToCart(product._id)}>
                        Add to Cart
                    </Button>
                </CardContent>
            </Card>
        ));
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>All Products</Typography>
            <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
                <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
                    <TextField
                        label="Search by Name"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Min Price"
                        variant="outlined"
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Max Price"
                        variant="outlined"
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        fullWidth
                    />
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel>Sort by Ratings</InputLabel>
                        <Select
                            value={sortByRatings}
                            onChange={(e) => setSortByRatings(e.target.value)}
                            label="Sort by Ratings"
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="asc">Ascending</MenuItem>
                            <MenuItem value="desc">Descending</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ mb: 2, minWidth: 120 }}>
                <InputLabel>Currency</InputLabel>
                <Select value={selectedCurrency} onChange={handleCurrencyChange} label="Currency">
                    {Object.keys(exchangeRates).map((currency) => (
                        <MenuItem key={currency} value={currency}>
                            {currency}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
                    <Button type="submit" variant="contained" color="primary">Search</Button>
                    
                </Box>

                {productMessage && <Typography color="error">{productMessage}</Typography>}
            </form>

            <Box display="flex" flexWrap="wrap" justifyContent="center" sx={{ gap: 3 }}>
                {renderProductCards()}
            </Box>
        </Box>
    );
};

export default Products;
