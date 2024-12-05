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
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 4, boxShadow: 3, borderRadius: 2, backgroundColor: '#fafafa' }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 5 }}>
                Add Product
            </Typography>

            {message && (
                <Alert severity={success ? 'success' : 'error'} sx={{ marginBottom: '20px' }}>
                    {message}
                </Alert>
            )}

            <Box
                component="form"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                sx={{ display: 'flex', flexDirection: 'column', gap: 4 }} 
            >
                

                <Box sx={{ mb: 3 }}>
                    <InputLabel htmlFor="Name" sx={{ fontWeight: 'bold', color: 'black', marginBottom: '6px' }}>
                        NAME
                    </InputLabel>
                    <TextField
                        fullWidth
                        id="Name"
                        name="Name"
                        value={productData.Name}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        sx={{ backgroundColor: 'white' }}
                    />
                </Box>


                
                <Box sx={{ mb: 3 }}>
                    <InputLabel htmlFor="Price" sx={{ fontWeight: 'bold', color: 'black', marginBottom: '6px' }}>
                        PRICE
                    </InputLabel>
                    <TextField
                        fullWidth
                        id="Price"
                        name="Price"
                        type="number"
                        value={productData.Price}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        sx={{ backgroundColor: 'white' }}
                    />
                </Box>


                
                <Box sx={{ mb: 2 }}>
                    <InputLabel htmlFor="Description" sx={{ fontWeight: 'bold', color: 'black', marginBottom: '6px' }}>
                        DESCRIPTION
                    </InputLabel>
                    <TextareaAutosize
                        id="Description"
                        name="Description"
                        value={productData.Description}
                        onChange={handleInputChange}
                        required
                        minRows={4}
                        placeholder="Enter product description"
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '16px',
                        }}
                    />
                </Box>

                
                <Box sx={{ mb: 3 }}>
                    <InputLabel htmlFor="AvailableQuantity" sx={{ fontWeight: 'bold', color: 'black', marginBottom: '6px' }}>
                        AVAILABLE QUANTITY
                    </InputLabel>
                    <TextField
                        fullWidth
                        id="AvailableQuantity"
                        name="AvailableQuantity"
                        type="number"
                        value={productData.AvailableQuantity}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        sx={{ backgroundColor: 'white' }}
                    />
                </Box>

               

                <Box sx={{ mb: 3 }}>
                    <InputLabel htmlFor="image" sx={{ fontWeight: 'bold', color: 'black', marginBottom: '6px' }}>
                        UPLOAD IMAGE
                    </InputLabel>
                    <OutlinedInput
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        fullWidth
                        sx={{ backgroundColor: 'white' }}
                    />
                </Box>



                <Button
                    type="submit"
                    fullWidth
                    sx={{
                        mt: 6,
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



            </Box>
        </Box>
    );
};

export default AddProduct;

