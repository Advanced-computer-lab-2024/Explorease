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
    Alert,
} from '@mui/material';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [productMessage, setProductMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortByRatings, setSortByRatings] = useState('');

    const fetchAllProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/products', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(response.data || []);
        } catch (error) {
            setProductMessage('Error fetching products');
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const fetchFilteredProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            let queryString = '';
            if (searchQuery) queryString += `name=${searchQuery}&`;
            if (minPrice) queryString += `minPrice=${minPrice}&`;
            if (maxPrice) queryString += `maxPrice=${maxPrice}&`;
            if (sortByRatings) queryString += `sortByRatings=${sortByRatings}&`;

            const response = await axios.get(`/tourists/products/filter-sort-search?${queryString}`, {
                headers: { Authorization: `Bearer ${token}` },
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

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 7 }}>
                All Products
            </Typography>

            {productMessage && (
                <Alert severity={productMessage.includes('Error') ? 'error' : 'success'} sx={{ mb: 3 }}>
                    {productMessage}
                </Alert>
            )}



         
<Box
    sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        flexWrap: 'wrap',
        mb: 5,
    }}
>
    <TextField
        label="Search by Name"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ flex: 1 }}
    />
    <TextField
        label="Min Price"
        variant="outlined"
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        sx={{ flex: 1 }}
    />
    <TextField
        label="Max Price"
        variant="outlined"
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        sx={{ flex: 1 }}
    />
    <FormControl sx={{ flex: 1 }}>
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
    <Button
        variant="contained"
        onClick={handleSearch}
        sx={{
            backgroundColor: '#111E56',
            color: 'white',
            height: '40px',
            padding: '0 16px',
            fontSize: '14px',
            border: '2px solid #111E56',
            '&:hover': {
                backgroundColor: 'white',
                color: '#111E56',
                border: '2px solid #111E56',
            },
        }}
    >
        Search
    </Button>
</Box>







            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                    justifyContent: 'center',
                }}
            >
                {products.map((product) => (
                    <Card
                        key={product._id}
                        sx={{
                            width: 300,
                            boxShadow: 3,
                            borderRadius: 2,
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.03)',
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                            },
                        }}
                    >
                        <CardMedia
                            component="img"
                            image={product.imageUrl}
                            alt={product.Name}
                            sx={{
                                height: 200,
                                objectFit: 'contain',
                                padding: 1,
                                backgroundColor: '#f9f9f9',
                            }}
                        />
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {product.Name}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Price:</strong> ${product.Price}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Description:</strong> {product.Description}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Ratings:</strong> {'★'.repeat(product.Ratings)}{'☆'.repeat(5 - product.Ratings)}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default Products;
