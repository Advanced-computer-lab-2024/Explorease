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
    CardMedia,
    Grid,
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

    const renderProductCards = () => {
        if (!products.length) {
            return (
                <Typography
                    variant="h6"
                    align="center"
                    sx={{ marginTop: 4, color: 'text.secondary' }}
                >
                    No products available
                </Typography>
            );
        }
    
        return (
            <Grid
                container
                spacing={3} // Space between cards
                sx={{
                    padding: 2,
                    justifyContent: 'center', // Center the cards
                }}
            >
                {products.map((product) => (
                    <Grid
                        item
                        key={product._id}
                        xs={12} // Full width on small screens
                        sm={6} // Two cards per row on medium screens
                        md={5} // Four cards per row on large screens
                    >
                        {editingProductId === product._id ? (
                            <Card
                                sx={{
                                    width: '100%', // Full width of the grid item
                                    height: 450, // Fixed card height
                                    borderRadius: 4,
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Subtle shadow
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: 2,
                                }}
                            >
                                <TextField
                                    label="Name"
                                    value={updatedProductData.Name || ''}
                                    onChange={(e) =>
                                        setUpdatedProductData({
                                            ...updatedProductData,
                                            Name: e.target.value,
                                        })
                                    }
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Price"
                                    type="number"
                                    value={updatedProductData.Price || ''}
                                    onChange={(e) =>
                                        setUpdatedProductData({
                                            ...updatedProductData,
                                            Price: e.target.value,
                                        })
                                    }
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Description"
                                    value={updatedProductData.Description || ''}
                                    onChange={(e) =>
                                        setUpdatedProductData({
                                            ...updatedProductData,
                                            Description: e.target.value,
                                        })
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
                                        setUpdatedProductData({
                                            ...updatedProductData,
                                            AvailableQuantity: e.target.value,
                                        })
                                    }
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        onClick={() => handleUpdateSubmit(product._id)}
                                        sx={{
                                            backgroundColor: '#111E56',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'white',
                                                color: '#111E56',
                                                border: '2px solid #111E56',
                                            },
                                        }}
                                    >
                                        Save Changes
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => setEditingProductId(null)}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Card>
                        ) : (
                            <Card
                                sx={{
                                    width: '100%', // Full width of the grid item
                                    height: 450, // Fixed card height
                                    borderRadius: 4,
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Subtle shadow
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth hover effects
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                                    },
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {/* Image Section */}
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: 250, // Image container height
                                        overflow: 'hidden',
                                        borderRadius: '12px 12px 0 0', // Rounded top corners
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#f5f5f5', // Placeholder background
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={product.imageUrl}
                                        alt={product.Name}
                                        sx={{
                                            objectFit: 'cover',
                                            width: '100%', // Full width
                                            height: '100%', // Full height
                                        }}
                                    />
                                    {/* Price Badge */}
                                    <Typography
                                        sx={{
                                            position: 'absolute',
                                            top: 10,
                                            left: 10,
                                            backgroundColor: '#4F46E5',
                                            color: 'white',
                                            fontSize: '0.875rem',
                                            fontWeight: 'bold',
                                            borderRadius: 2,
                                            padding: '2px 8px',
                                        }}
                                    >
                                        ${product.Price}
                                    </Typography>
                                </Box>
    
                                {/* Content Section */}
                                <Box
                                    sx={{
                                        flex: 1,
                                        padding: '16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    {/* Product Name */}
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: '#111E56',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            textAlign: 'center',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        {product.Name}
                                    </Typography>
    
                                    {/* Description */}
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 2, // Limit to 2 lines
                                            textAlign: 'center',
                                        }}
                                    >
                                        {product.Description}
                                    </Typography>
                                </Box>
    
                                {/* Action Buttons */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '8px 16px',
                                        borderTop: '1px solid #E5E7EB', // Divider
                                    }}
                                >
                                    <Tooltip title="Edit Product">
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEditProduct(product)}
                                        >
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip
                                        title={product.Archived ? 'Unarchive Product' : 'Archive Product'}
                                    >
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
                            </Card>
                        )}
                    </Grid>
                ))}
            </Grid>
        );
    };

    return (
//        
<Box  sx={{ p: 4 }}>
<Typography variant="h4" gutterBottom sx={{fontWeight:'bold' , color:'#111E56'}}>
    Admin Products
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
<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' , width:'100%' }}>
    {renderProductCards()}
</Box>
</Box>
    );
};

export default AdminMyProducts;
