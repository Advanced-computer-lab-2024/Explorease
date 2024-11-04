import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [productMessage, setProductMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortByRatings, setSortByRatings] = useState('');
    const [editingProductId, setEditingProductId] = useState(null); // Track which product is being edited
    const [updatedProductData, setUpdatedProductData] = useState({}); // Store updated product data

    // Fetch all products initially for the seller
    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch seller products without filters (initial load)
            const response = await axios.get('/admins/products', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data) {
                setProducts(response.data);
            } else {
                setProductMessage('No products found');
            }
        } catch (error) {
            setProductMessage('Error fetching products');
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts(); // Fetch all products on component mount
    }, []);

    const handleInputChange = (e, field) => {
        setUpdatedProductData({ ...updatedProductData, [field]: e.target.value });
    };

    // Handle clicking the "Edit" button
    const handleEditProduct = (product) => {
        setEditingProductId(product._id); // Set the product to be edited
        setUpdatedProductData(product);   // Pre-fill the form with current product data
    };

    // Handle submitting the updated product data
    const handleUpdateSubmit = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`/seller/updateProduct/${productId}`, updatedProductData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProductMessage('Product updated successfully');
            setEditingProductId(null); // Exit edit mode
            fetchProducts(); // Refetch products to update UI
        } catch (error) {
            setProductMessage('Error updating product');
            console.error('Error updating product:', error);
        }
    };

    // Handle deleting a product
    const handleDeleteProduct = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/seller/deleteProduct/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProductMessage('Product deleted successfully');
            setProducts(products.filter(product => product._id !== productId)); // Remove the deleted product from the UI
        } catch (error) {
            setProductMessage('Error deleting product');
            console.error('Error deleting product:', error);
        }
    };

    const handleArchiveProduct = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            // Find the product to get its current Archived status
            const product = products.find(p => p._id === productId);
            
            // Toggle Archived status
            await axios.put(`/admins/archiveProduct/${productId}`, { Archived: !product.Archived }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            setProductMessage(product.Archived ? 'Product unarchived successfully' : 'Product archived successfully');
            fetchProducts(); // Refresh product list after toggling archive status
        } catch (error) {
            setProductMessage('Error updating archive status');
            console.error('Error updating archive status:', error);
        }
    };
    
    // Fetch filtered, sorted, and searched seller products
    const fetchFilteredSellerProducts = async () => {
        try {
            const token = localStorage.getItem('token');

            // Construct query string for filtering, searching, and sorting
            let queryString = '';
            if (searchQuery) queryString += `name=${searchQuery}&`;
            if (minPrice) queryString += `minPrice=${minPrice}&`;
            if (maxPrice) queryString += `maxPrice=${maxPrice}&`;
            if (sortByRatings) queryString += `sortByRatings=${sortByRatings}&`;  // For sorting by ratings

            // Fetch products with the query string
            const response = await axios.get(`/seller/myproducts/filter-sort-search?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data) {
                console.log(response.data);
                setProducts(response.data);
            } else {
                setProductMessage('No products found');
            }
        } catch (error) {
            setProductMessage('Error fetching products');
            console.error('Error fetching products:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchFilteredSellerProducts(); // Fetch products with the filter/sort/search when search is pressed
    };

    const renderProductCards = () => {
        if (!Array.isArray(products) || products.length === 0) {
            return <p>No products available</p>;
        }

        return products.map((product) => (
            <div key={product._id} className="product-card" style={cardStyle}>
                {editingProductId === product._id ? (
                    <>
                        {/* Render editable fields */}
                        <input
                            type="text"
                            value={updatedProductData.Name || ''}
                            onChange={(e) => handleInputChange(e, 'Name')}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            value={updatedProductData.Price || ''}
                            onChange={(e) => handleInputChange(e, 'Price')}
                            style={inputStyle}
                        />
                        <textarea
                            value={updatedProductData.Description || ''}
                            onChange={(e) => handleInputChange(e, 'Description')}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            value={updatedProductData.AvailableQuantity || ''}
                            onChange={(e) => handleInputChange(e, 'AvailableQuantity')}
                            style={inputStyle}
                        />
                        <button
                            onClick={() => handleUpdateSubmit(product._id)}
                            style={saveButtonStyle}
                        >
                            Save Changes
                        </button>
                    </>
                ) : (
                    <>
                        {/* Render normal fields */}
                        <img src={product.imageUrl} alt={product.Name} style={imageStyle} />
                        <h3>{product.Name}</h3>
                        <p><strong>Price:</strong> ${product.Price}</p>
                        <p><strong>Description:</strong> {product.Description}</p>
                        <p><strong>Available Quantity:</strong> {product.AvailableQuantity}</p>
                        <p><strong>Ratings:</strong> {'★'.repeat(product.Ratings)}{'☆'.repeat(5 - product.Ratings)}</p>
                        <button
                            onClick={() => handleEditProduct(product)}
                            style={buttonStyle}
                        >
                            Edit Product
                        </button>
                        <button
                            onClick={() => handleArchiveProduct(product._id)}
                            style={archiveButtonStyle}
                        >
                            {product.Archived ? 'Unarchive Product' : 'Archive Product'}
                        </button>

                        <button
                            onClick={() => handleDeleteProduct(product._id)}
                            style={deleteButtonStyle}
                        >
                            Delete Product
                        </button>
                    </>
                )}
            </div>
        ));
    };

    const inputStyle = {
        padding: '10px',
        marginBottom: '10px',
        width: '100%',
    };

    const cardStyle = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        marginBottom: '20px',
    };

    const buttonStyle = {
        padding: '10px 15px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
        marginTop: '10px',
    };

    const saveButtonStyle = {
        padding: '10px 15px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
        marginTop: '10px',
    };

    const archiveButtonStyle = {
        padding: '10px 15px',
        backgroundColor: '#6c757d', // Grey color for archive button
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
        marginTop: '10px',
        marginLeft: '10px',
    };
    
    const deleteButtonStyle = {
        padding: '10px 15px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
        marginTop: '10px',
        marginLeft: '10px',
    };

    const imageStyle = {
        maxWidth: '100%',
        height: 'auto',
        marginBottom: '10px',
    };

    const productListStyle = {
        display: 'flex',
        flexWrap: 'wrap', // Allow wrapping of products
        gap: '20px',      // Space between the cards
        justifyContent: 'center', // Center items in the flex container
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>My Products</h2>

            <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
                <div>
                    <label>Search by Name: </label>
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>

                <div>
                    <label>Min Price: </label>
                    <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                </div>

                <div>
                    <label>Max Price: </label>
                    <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                </div>

                <div>
                    <label>Sort by Ratings: </label>
                    <select value={sortByRatings} onChange={(e) => setSortByRatings(e.target.value)}>
                        <option value="">Select</option>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>

                <button type="submit" style={buttonStyle}>Search</button>
            </form>

            {productMessage && <p>{productMessage}</p>}

            <div className="product-list" style={productListStyle}>
                {renderProductCards()}
            </div>
        </div>
    );
};

export default AdminProducts;
