import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SellerDashboard = () => {
    const [products, setProducts] = useState([]);  // Initialize products as an empty array
    const [profile, setProfile] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        // Fetch seller's products
        axios.get('/sellers/myProducts', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            console.log('Products:', response.data);  // Log to ensure data is an array
            setProducts(response.data);
        })
        .catch(error => {
            setMessage('Error fetching products');
            console.error('Error fetching products:', error);
        });

        // Fetch seller's profile
        axios.get('/sellers/myProfile', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setProfile(response.data))
        .catch(error => {
            setMessage('Error fetching profile');
            console.error('Error fetching profile:', error);
        });
    }, []);

    return (
        <div>
            <h2>Seller Dashboard</h2>

            {message && <p>{message}</p>}

            <section>
                <h3>Your Products</h3>
                <ul>
                    {Array.isArray(products) && products.length > 0 ? (
                        products.map(product => (
                            <li key={product._id}>
                                {product.name} - ${product.price} - {product.quantity} in stock
                            </li>
                        ))
                    ) : (
                        <p>No products found.</p>
                    )}
                </ul>
            </section>
        </div>
    );
};

export default SellerDashboard;
