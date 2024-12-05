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
    Grid,
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



            <Grid
            container
            spacing={3} // Spacing between grid items
            sx={{ padding: 2 }}
          >
            {products.map((product) => (
              <Grid
                item
                key={product._id}
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
        height: 250, // Increased height for the image container
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
        image={product.imageUrl}
        alt={product.Name}
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
        ${product.Price} 
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
                        {product.Name}
                      </Typography>
                    </Box>
      
                    {/* Description */}
                    <Box
                      sx={{
                        height: 50,
                        overflow: "hidden",
                        marginTop: 1,
                        textAlign: "left",
                      }}
                    >
                      <Typography
            variant="body2"
            color="text.secondary"
            sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2, // Limit to 2 lines instead of 3
            }}
        >
            {product.Description}
        </Typography>
                    </Box>
      
                    {/* Ratings */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 2,
                        height: 25,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#FFC107",
                          fontSize: "1.5rem",
                        }}
                      >
                        {"★".repeat(product.Ratings)}{"☆".repeat(5 - product.Ratings)}
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
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
    );
};

export default SellerProducts;
