import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    IconButton,
    Tooltip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
} from '@mui/material';
import { Edit, Delete, Archive, Unarchive, Save, Cancel, Visibility } from '@mui/icons-material';
import axios from 'axios';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [productMessage, setProductMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortByRatings, setSortByRatings] = useState('');
    const [editingProductId, setEditingProductId] = useState(null);
    const [updatedProductData, setUpdatedProductData] = useState({});

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/admins/products', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(response.data || []);
        } catch (error) {
            setProductMessage('Error fetching products');
        }
    };

    const handleSearch = async () => {
        try {
            const token = localStorage.getItem('token');
            let queryString = '';
            if (searchQuery) queryString += `name=${searchQuery}&`;
            if (minPrice) queryString += `minPrice=${minPrice}&`;
            if (maxPrice) queryString += `maxPrice=${maxPrice}&`;
            if (sortByRatings) queryString += `sortByRatings=${sortByRatings}&`;

            const response = await axios.get(`/admins/myproducts/filter-sort-search?${queryString}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(response.data || []);
        } catch (error) {
            setProductMessage('Error fetching filtered products');
        }
    };

    const handleEditProduct = (product) => {
        setEditingProductId(product._id);
        setUpdatedProductData(product);
        setProductMessage('Editing product...');
    };

    const handleUpdateSubmit = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`/admins/updateProduct/${productId}`, updatedProductData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProductMessage('Product updated successfully');
            setEditingProductId(null);
            fetchProducts();
        } catch (error) {
            setProductMessage('Error updating product');
        }
    };

    const handleDeleteProduct = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/admins/deleteProduct/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProductMessage('Product deleted successfully');
            setProducts((prev) => prev.filter((product) => product._id !== productId));
        } catch (error) {
            setProductMessage('Error deleting product');
        }
    };

    const handleArchiveProduct = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            const product = products.find((p) => p._id === productId);
            await axios.put(`/admins/archiveProduct/${productId}`, { Archived: !product.Archived }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProductMessage(
                product.Archived ? 'Product unarchived successfully' : 'Product archived successfully'
            );
            fetchProducts();
        } catch (error) {
            setProductMessage('Error updating archive status');
        }
    };

    const renderProductCards = () => {
        if (!products.length) {
            return <Typography>No products available</Typography>;
        }

        return products.map((product) => (
            <Card
                key={product._id}
                sx={{
                    width: 300,
                    boxShadow: 3,
                    borderRadius: 2,
                    position: 'relative',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                    },
                }}
            >
                <CardContent>
                    {editingProductId === product._id ? (
                        <>
                            <TextField
                                label="Name"
                                value={updatedProductData.Name || ''}
                                onChange={(e) => setUpdatedProductData({ ...updatedProductData, Name: e.target.value })}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Price"
                                type="number"
                                value={updatedProductData.Price || ''}
                                onChange={(e) => setUpdatedProductData({ ...updatedProductData, Price: e.target.value })}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Description"
                                value={updatedProductData.Description || ''}
                                onChange={(e) =>
                                    setUpdatedProductData({ ...updatedProductData, Description: e.target.value })
                                }
                                fullWidth
                                multiline
                                rows={3}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Available Quantity"
                                type="number"
                                value={updatedProductData.AvailableQuantity || ''}
                                onChange={(e) =>
                                    setUpdatedProductData({ ...updatedProductData, AvailableQuantity: e.target.value })
                                }
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
                            <img
                                src={product.imageUrl}
                                alt={product.Name}
                                style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }}
                            />
                            <Typography variant="h6">{product.Name}</Typography>
                            <Typography variant="body2">
                                <strong>Price:</strong> ${product.Price}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Description:</strong> {product.Description}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Available Quantity:</strong> {product.AvailableQuantity}
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                <Tooltip title="Edit Product">
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleEditProduct(product)}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={product.Archived ? 'Unarchive Product' : 'Archive Product'}>
                                    <IconButton
                                        color={product.Archived ? 'success' : 'warning'}
                                        onClick={() => handleArchiveProduct(product._id)}
                                    >
                                        {product.Archived ? <Unarchive /> : <Archive />}
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Product">
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDeleteProduct(product._id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="View Sales">
                                    <IconButton
                                        color="info"
                                        onClick={() => setProductMessage(`Total Sales: ${product.Sales || 0}`)}
                                    >
                                        <Visibility />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </>
                    )}
                </CardContent>
            </Card>
        ));
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
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
                    gap: 2,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    mb: 4,
                }}
            >
                <TextField
                    label="Search by Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    label="Min Price"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    label="Max Price"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    variant="outlined"
                    fullWidth
                />
                <FormControl fullWidth>
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
                        '&:hover': {
                            backgroundColor: 'white',
                            color: '#111E56',
                            border: '1px solid #111E56',
                        },
                    }}
                >
                    Search
                </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
                {renderProductCards()}
            </Box>
        </Box>
    );
};

export default AdminProducts;
