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
    Grid
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
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 7 , color:'#111E56'}}>
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

                </Card>
              </Grid>
            ))}
          </Grid>

        </Box>
    );
};

export default Products;
