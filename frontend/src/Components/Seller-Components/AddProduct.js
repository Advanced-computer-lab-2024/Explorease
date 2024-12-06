import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    InputLabel,
    OutlinedInput,
    TextareaAutosize,
} from '@mui/material';

const AddProduct = () => {
    const [productData, setProductData] = useState({
        Name: '',
        Price: '',
        Description: '',
        AvailableQuantity: '',
    });
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        setProductData({ ...productData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!image) {
            setMessage('Image file is required');
            setSuccess(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('Name', productData.Name);
            formData.append('Price', productData.Price);
            formData.append('Description', productData.Description);
            formData.append('AvailableQuantity', productData.AvailableQuantity);
            formData.append('image', image);

            const response = await axios.post('/seller/createProduct', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage('Product added successfully!');
            setSuccess(true);
            setProductData({ Name: '', Price: '', Description: '', AvailableQuantity: '' });
            setImage(null);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error adding product');
            setSuccess(false);
        }
    };

    return (
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px',
        }}
    >
        <Typography variant="h5" gutterBottom sx={{fontWeight:'bold' , color:'#111E56' , fontSize:'32px'}}>
            Add Products
        </Typography>

        {/* Display message for success or error */}
        {message && (
            <Box sx={{ marginY: 2 }}>
                <Typography
                    sx={{
                        color: message.includes('successfully') ? 'green' : 'red',
                    }}
                >
                    {message}
                </Typography>
            </Box>
        )}

        {/* Create New Product Form */}
        <Box
            component="form"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            sx={{
                display: 'grid',
                gap: 2,
                maxWidth: '600px',
                width: '100%',
                marginBottom: '40px',
            }}
        >
            <TextField
    label="Product Name"
    name="Name"
    value={productData.Name}
    onChange={handleInputChange}
    required
    fullWidth
/>
<TextField
    label="Product Price"
    type="number"
    name="Price"
    value={productData.Price}
    onChange={handleInputChange}
    required
    fullWidth
/>
<TextField
    label="Product Description"
    name="Description"
    value={productData.Description}
    onChange={handleInputChange}
    required
    fullWidth
/>
<TextField
    label="Available Quantity"
    type="number"
    name="AvailableQuantity"
    value={productData.AvailableQuantity}
    onChange={handleInputChange}
    required
    fullWidth
/>
<TextField
    type="file"
    onChange={handleImageChange}
    inputProps={{ accept: 'image/*' }}
    required
    fullWidth
    helperText="Upload an image for the product"
/>

            <Button
                variant="contained"
                type="submit"
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
                Create Product
            </Button>
        </Box>
        </Box>
    );
};

export default AddProduct;

