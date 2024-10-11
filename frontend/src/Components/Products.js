import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [productMessage, setProductMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortByRatings, setSortByRatings] = useState('');

    const [editingProductId, setEditingProductId] = useState(null);  // State to track the editing product
    const [editedProduct, setEditedProduct] = useState({});

    // Fetch all products initially
    const fetchAllProducts = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch products without filters (initial load)
            const response = await axios.get('/tourists/products', {
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
        fetchAllProducts(); // Fetch all products on component mount
    }, []);

    // Fetch filtered, sorted, and searched products
    const fetchFilteredProducts = async () => {
        try {
            const token = localStorage.getItem('token');

            // Construct query string for filtering, searching, and sorting
            let queryString = '';
            if (searchQuery) queryString += `name=${searchQuery}&`;
            if (minPrice) queryString += `minPrice=${minPrice}&`;
            if (maxPrice) queryString += `maxPrice=${maxPrice}&`;
            if (sortByRatings) queryString += `sortByRatings=${sortByRatings}&`;  // For sorting by ratings

            // Fetch products with the query string
            const response = await axios.get(`/tourists/products/filter-sort-search?${queryString}`, {
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

    const handleSearch = (e) => {
        e.preventDefault();
        fetchFilteredProducts(); // Fetch products with the filter/sort/search when search is pressed
    };

    const handleAddToCart = (productId) => {
        console.log('Adding product to cart:', productId);
    };

    const handleDeleteProduct = async(productId) => {
        
        try {
            const token = localStorage.getItem('token');

            // Delete product by ID
            const response = await axios.delete(`/admins/deleteProduct/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));

        setProductMessage('Product deleted successfully!');
        } catch (error) {
            setProductMessage('Error fetching products');
            console.error('Error fetching products:', error);
        }
    };

    const handleEditProduct = (product) => {
        setEditingProductId(product._id);  // Set the product to be edited
        setEditedProduct({
            Name: product.Name,
            Price: product.Price,
            Description: product.Description
        });
    };

    // Handle changes to the input fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdateProduct = async (productId) => {
        try {
            const token = localStorage.getItem('token');  // Ensure token is being retrieved correctly
            if (!token) {
                setProductMessage('No authentication token found');
                return;
            }
    
            const updatedProductData = {
                Price: editedProduct.Price,
                AvailableQuantity: editedProduct.AvailableQuantity,
            };
    
            // Make sure you are passing the token correctly in the headers
            await axios.put(`/admins/updateProduct/${productId}`, updatedProductData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Ensure token is prefixed with "Bearer"
                    'Content-Type': 'application/json'
                }
            });
    
            fetchAllProducts();  // Refetch products after successful update
            setProductMessage('Product updated successfully!');
            setEditingProductId(null);  // Exit edit mode
        } catch (error) {
            setProductMessage('Error updating product');
            console.error('Error updating product:', error);
        }
    };
    
    

    const renderProductCards = () => {
        if (!Array.isArray(products) || products.length === 0) {
            return <p>No products available</p>;
        }

        return products.map((product) => (
            <div key={product._id} className="product-card" style={cardStyle}>
                <img src={product.imageUrl} alt={product.Name} style={imageStyle} />
                {editingProductId === product._id ? (
                    <>
                        <input
                            type="text"
                            name="Name"
                            value={editedProduct.Name}
                            onChange={handleInputChange}
                            placeholder="Product Name"
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            name="Price"
                            value={editedProduct.Price}
                            onChange={handleInputChange}
                            placeholder="Product Price"
                            style={inputStyle}
                        />
                        <input
                            type="text"
                            name="Description"
                            value={editedProduct.Description}
                            onChange={handleInputChange}
                            placeholder="Product Description"
                            style={inputStyle}
                        />
                        <button onClick={() => handleUpdateProduct(product._id)} style={buttonStyle}>Save</button>
                    </>
                ) : (
                    <>
                        <h3>{product.Name}</h3>
                        <p><strong>Price:</strong> ${product.Price}</p>
                        <p><strong>Description:</strong> {product.Description}</p>
                        <p><strong>Ratings:</strong> {'★'.repeat(product.Ratings)}{'☆'.repeat(5 - product.Ratings)}</p>
                        <button onClick={() => handleDeleteProduct(product._id)} style={deletebuttonStyle}>Delete</button>
                        <button onClick={() => handleEditProduct(product)} style={buttonStyle}>Edit</button>
                    </>
                )}
            </div>
        ));
    };

    const productListStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center',
    };

    const buttonStyle = {
        padding: '10px 15px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
        marginTop: '10px',
    };

    const deletebuttonStyle = {
        padding: '10px 15px',
    backgroundColor: 'red',  // Red background for delete button
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    marginTop: '10px',
    marginRight: '10px'
    };

    const imageStyle = {
        maxWidth: '100%',
        height: 'auto',
        marginBottom: '10px',
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
    };

    const inputStyle = {
        padding: '10px',
        marginBottom: '10px',
        width: '100%',
        borderRadius: '5px',
        border: '1px solid #ccc'
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>All Products</h2>

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

export default Products;
