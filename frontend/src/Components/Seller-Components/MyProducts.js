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
    IconButton,
    Tooltip,
    Alert,
} from '@mui/material';
import { Delete, Edit, Archive, Unarchive, Save, Cancel, Visibility } from '@mui/icons-material';

const SellerProducts = () => {
    const [products, setProducts] = useState([]);
    const [productMessage, setProductMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortByRatings, setSortByRatings] = useState('');
    const [editingProductId, setEditingProductId] = useState(null);
    const [updatedProductData, setUpdatedProductData] = useState({});
    const [viewSales, setViewSales] = useState(null);

    const fetchSellerProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/seller/myproducts', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(response.data || []);
        } catch (error) {
            setProductMessage('Error fetching products');
        }
    };

    useEffect(() => {
        fetchSellerProducts();
    }, []);

    const handleInputChange = (e, field) => {
        setUpdatedProductData({ ...updatedProductData, [field]: e.target.value });
    };

    const handleEditProduct = (product) => {
        setEditingProductId(product._id);
        setUpdatedProductData(product);
    };

    const handleUpdateSubmit = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`/seller/updateProduct/${productId}`, updatedProductData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProductMessage('Product updated successfully');
            setEditingProductId(null);
            fetchSellerProducts();
        } catch (error) {
            setProductMessage('Error updating product');
        }
    };

    const handleDeleteProduct = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/seller/deleteProduct/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProductMessage('Product deleted successfully');
            setProducts(products.filter((product) => product._id !== productId));
        } catch (error) {
            setProductMessage('Error deleting product');
        }
    };

    const handleArchiveProduct = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            const product = products.find((p) => p._id === productId);
            await axios.put(`/seller/archiveProduct/${productId}`, { Archived: !product.Archived }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProductMessage(
                product.Archived ? 'Product unarchived successfully' : 'Product archived successfully'
            );
            fetchSellerProducts();
        } catch (error) {
            setProductMessage('Error updating archive status');
        }
    };

    const handleViewSales = (productId) => {
        const product = products.find((p) => p._id === productId);
        alert(`Total Sales: ${product.Sales || 0}`);
    };

    const fetchFilteredSellerProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            let queryString = '';
            if (searchQuery) queryString += `name=${searchQuery}&`;
            if (minPrice) queryString += `minPrice=${minPrice}&`;
            if (maxPrice) queryString += `maxPrice=${maxPrice}&`;
            if (sortByRatings) queryString += `sortByRatings=${sortByRatings}&`;
            const response = await axios.get(`/seller/myproducts/filter-sort-search?${queryString}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(response.data || []);
        } catch (error) {
            setProductMessage('Error fetching products');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchFilteredSellerProducts();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                My Products
            </Typography>

            {productMessage && (
                <Alert severity={productMessage.includes('Error') ? 'error' : 'success'} sx={{ mb: 3 }}>
                    {productMessage}
                </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 5 , mt:5, marginLeft:'100px' }}>
                <Box >
                <TextField
                    label="Search by Name"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                />
                <FormControl fullWidth sx={{marginTop:'10px'}}>
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
                </Box>
                <Box>
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
                    sx={{ marginTop: '10px' }}
                />
                </Box>
                <Box >
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    sx={{
                        backgroundColor: '#111E56',
                        color: 'white',
                        height: '56px',
                        marginTop: '65px',
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
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
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
                                backgroundColor: '#f9f9f9',
                            }}
                        />
                        <CardContent>
                            {editingProductId === product._id ? (
                                <>
                                    <TextField
                                        label="Name"
                                        value={updatedProductData.Name || ''}
                                        onChange={(e) => handleInputChange(e, 'Name')}
                                        fullWidth
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        label="Price"
                                        type="number"
                                        value={updatedProductData.Price || ''}
                                        onChange={(e) => handleInputChange(e, 'Price')}
                                        fullWidth
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        label="Description"
                                        value={updatedProductData.Description || ''}
                                        onChange={(e) => handleInputChange(e, 'Description')}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        label="Available Quantity"
                                        type="number"
                                        value={updatedProductData.AvailableQuantity || ''}
                                        onChange={(e) => handleInputChange(e, 'AvailableQuantity')}
                                        fullWidth
                                        sx={{ mb: 2 }}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={() => handleUpdateSubmit(product._id)}
                                        sx={{
                                            backgroundColor: '#111E56',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'white',
                                                color: '#111E56',
                                                border: '1px solid #111E56',
                                            },
                                        }}
                                    >
                                        <Save /> Save Changes
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => setEditingProductId(null)}
                                    >
                                        <Cancel /> Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Typography variant="h6">{product.Name}</Typography>
                                    <Typography variant="body2">
                                        <strong>Price:</strong> ${product.Price}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Description:</strong> {product.Description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                        <Tooltip title="Edit Product" arrow>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEditProduct(product)}
                                            >
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip
                                            title={
                                                product.Archived ? 'Unarchive Product' : 'Archive Product'
                                            }
                                            arrow
                                        >
                                            <IconButton
                                                color={product.Archived ? 'success' : 'warning'}
                                                onClick={() => handleArchiveProduct(product._id)}
                                            >
                                                {product.Archived ? <Unarchive /> : <Archive />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Product" arrow>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteProduct(product._id)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="View Sales" arrow>
                                            <IconButton
                                                color="info"
                                                onClick={() => handleViewSales(product._id)}
                                            >
                                                <Visibility />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default SellerProducts;
