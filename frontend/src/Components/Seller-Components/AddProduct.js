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
        <Box sx={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Add Product
            </Typography>

            {message && (
                <Alert severity={success ? 'success' : 'error'} sx={{ marginBottom: '20px' }}>
                    {message}
                </Alert>
            )}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <Box sx={{ marginBottom: '10px' }}>
                    <InputLabel htmlFor="Name">Name</InputLabel>
                    <TextField
                        fullWidth
                        id="Name"
                        name="Name"
                        value={productData.Name}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        sx={{ marginBottom: '10px' }}
                    />
                </Box>

                <Box sx={{ marginBottom: '10px' }}>
                    <InputLabel htmlFor="Price">Price</InputLabel>
                    <TextField
                        fullWidth
                        id="Price"
                        name="Price"
                        type="number"
                        value={productData.Price}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        sx={{ marginBottom: '10px' }}
                    />
                </Box>

                <Box sx={{ marginBottom: '10px' }}>
                    <InputLabel htmlFor="Description">Description</InputLabel>
                    <TextareaAutosize
                        id="Description"
                        name="Description"
                        value={productData.Description}
                        onChange={handleInputChange}
                        required
                        minRows={4}
                        placeholder="Enter product description"
                        style={{
                            width: '96%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    />
                </Box>

                <Box sx={{ marginBottom: '10px' }}>
                    <InputLabel htmlFor="AvailableQuantity">Available Quantity</InputLabel>
                    <TextField
                        fullWidth
                        id="AvailableQuantity"
                        name="AvailableQuantity"
                        type="number"
                        value={productData.AvailableQuantity}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        sx={{ marginBottom: '10px' }}
                    />
                </Box>

                <Box sx={{ marginBottom: '10px' }}>
                    <InputLabel htmlFor="image">Upload Image</InputLabel>
                    <OutlinedInput
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        fullWidth
                        sx={{ padding: '10px' }}
                    />
                </Box>

                <Button
                    type="submit"
                    fullWidth
                    sx={{
                        marginTop: '10px',
                        padding: '10px',
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
                    Add Product
                </Button>
            </form>
        </Box>
    );
};

export default AddProduct;
