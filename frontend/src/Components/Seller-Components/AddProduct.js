import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
    const [productData, setProductData] = useState({
        Name: '',
        Price: '',
        Description: '',
        AvailableQuantity: '',
    });
    const [image, setImage] = useState(null); // State to store the uploaded image file
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        setProductData({ ...productData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // Get the selected file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        if (!image) {
            console.log('Image file is required');
            return;
        }
    
        try {
            // Create a FormData object to handle multipart/form-data request
            const formData = new FormData();
            formData.append('Name', productData.Name);
            formData.append('Price', productData.Price);
            formData.append('Description', productData.Description);
            formData.append('AvailableQuantity', productData.AvailableQuantity);
            formData.append('image', image); // Append the image file
    
            console.log('Form data:', formData); // Check form data is correct
    
            const response = await axios.post('/seller/createProduct', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            console.log('Response:', response.data); // Log the response
            setMessage('Product added successfully!');
            setSuccess(true);
            setProductData({ Name: '', Price: '', Description: '', AvailableQuantity: '' });
            setImage(null); // Reset the image input
        } catch (error) {
            console.error('Error adding product:', error.response ? error.response.data : error.message); // Log error
            setMessage(error.response?.data?.message || 'Error adding product');
            setSuccess(false);
        }
    };
    
    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Add Product</h2>
            {message && (
                <p style={{ color: success ? 'green' : 'red', marginBottom: '20px' }}>{message}</p>
            )}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="Name"
                        value={productData.Name}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                    />
                </div>
                <div>
                    <label>Price</label>
                    <input
                        type="number"
                        name="Price"
                        value={productData.Price}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        name="Description"
                        value={productData.Description}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                    />
                </div>
                <div>
                    <label>Available Quantity</label>
                    <input
                        type="number"
                        name="AvailableQuantity"
                        value={productData.AvailableQuantity}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                    />
                </div>
                <div>
                    <label>Upload Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                    }}
                >
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
