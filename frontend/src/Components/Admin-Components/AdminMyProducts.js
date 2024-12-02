import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    IconButton,
    Alert,
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { Delete, Edit, Archive, Unarchive, Save, Cancel, Visibility } from '@mui/icons-material';

const AdminMyProducts = () => {
    const [products, setProducts] = useState([]);
    const [productMessage, setProductMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortByRatings, setSortByRatings] = useState('');
    const [editingProductId, setEditingProductId] = useState(null);
    const [updatedProductData, setUpdatedProductData] = useState({});

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/admins/adminproducts', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(response.data || []);
            
        } catch (error) {
            if (products.length === 0) {
                setProductMessage('No available products for this admin.');
            }else{
                setProductMessage('Error fetching products');
            }
            
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleInputChange = (e, field) => {
        setUpdatedProductData({ ...updatedProductData, [field]: e.target.value });
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

    const handleViewSales = (product) => {
        setProductMessage(`Total Sales for ${product.Name}: ${product.Sales || 0}`);
    };

    const handleSearch = async () => {
        const token = localStorage.getItem('token');
        try {
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
            setProductMessage('Error fetching products');
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Products
            </Typography>

            {productMessage && (
                <Alert severity={productMessage.includes('Error') ? 'error' : 'success'} sx={{ mb: 3 }}>
                    {productMessage}
                </Alert>
            )}
            {products.length !== 0 && (
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
)}

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
                            width: 350,
                            boxShadow: 3,
                            borderRadius: 2,
                            marginTop: 2,
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
                                            border: '2px solid #111E56',
                                            '&:hover': {
                                                backgroundColor: 'white',
                                                color: '#111E56',
                                                border: '2px solid #111E56',
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
                                        <Tooltip title="Edit Product" arrow>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEditProduct(product)}
                                            >
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={product.Archived ? 'Unarchive Product' : 'Archive Product'} arrow>
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
                                                onClick={() => handleViewSales(product)}
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

export default AdminMyProducts;
