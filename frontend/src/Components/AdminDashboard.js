import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css'; // Import the CSS file
import Products from './Products';

const AdminDashboard = () => {
    const [newAdminUsername, setNewAdminUsername] = useState('');
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [admins, setAdmins] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [governorUsername, setGovernorUsername] = useState('');
    const [governorEmail, setGovernorEmail] = useState('');
    const [governorPassword, setGovernorPassword] = useState('');
    // State for Activity Categories
    const [activityCategories, setActivityCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [categoryMessage, setCategoryMessage] = useState('');
    const [editedCategory, setEditedCategory] = useState({});


    // State for Product Management
const [products, setProducts] = useState([]);
const [productName, setProductName] = useState('');
const [productPrice, setProductPrice] = useState('');
const [productDescription, setProductDescription] = useState('');
const [availableQuantity, setAvailableQuantity] = useState('');
const [minPrice, setMinPrice] = useState('');
const [maxPrice, setMaxPrice] = useState('');
const [searchQuery, setSearchQuery] = useState('');
const [productMessage, setProductMessage] = useState('');
const [imageFile, setImageFile] = useState(null);  // File upload for image

// State for Preference Tags Management
const [preferenceTags, setPreferenceTags] = useState([]);

const [newTagName, setNewTagName] = useState('');
const [editedTag, setEditedTag] = useState({});
const [tagMessage, setTagMessage] = useState('');

const [tourists, setTourists] = useState([]);  
const [tourGuides, setTourGuides] = useState([]);
const [tourismGovernors, setTourismGovernors] = useState([]);
const [sellers, setSellers] = useState([]);
const [advertisers, setAdvertisers] = useState([]);
const [userMessage, setUserMessage] = useState('');  // For displaying success/error messages

const [isGovernorAdded, setIsGovernorAdded] = useState(false);

    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('home');

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const createNewAdmin = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('/admins/add', {
                username: newAdminUsername,
                email: newAdminEmail,
                password: newAdminPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setMessage('New admin created successfully!');
            fetchAdmins();
        } catch (error) {
            setMessage('Error creating new admin.');
        }
    };

    const handleAddGovernor = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('/admins/addGovernor', {
                username: governorUsername,
                email: governorEmail,
                password: governorPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setMessage('New tourist governor created successfully!');
            setGovernorUsername('');
            setGovernorEmail('');
            setGovernorPassword('');
            setIsGovernorAdded(true);

        } catch (error) {
            console.error('Error creating tourist governor:', error.response ? error.response.data : error.message);
            setMessage('Error creating tourist governor.');
        }
    };

    const fetchAdmins = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('/admins/all', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setAdmins(response.data);
            setLoading(false);
        } catch (error) {
            setMessage('Error fetching admins.');
            setLoading(false);
        }
    };

    const deleteAdmin = async (adminId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/admins/delete/${adminId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setMessage('Admin deleted successfully!');
            fetchAdmins();
        } catch (error) {
            setMessage('Error deleting admin.');
        }
    };

    // Create Activity Category
const createCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
        const response = await axios.post('/admins/createCategory', { name: newCategoryName }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setCategoryMessage('Category created successfully!');
        fetchCategories();  // Refresh category list
    } catch (error) {
        setCategoryMessage('Error creating category.');
    }
};

// Fetch all Activity Categories
const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('/admins/getCategories', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setActivityCategories(response.data);
    } catch (error) {
        setCategoryMessage('Error fetching categories.');
    }
};

// Update Category
const updateCategory = async (id, newName) => {
    const token = localStorage.getItem('token');
    try {
        await axios.put(`/admins/updateCategory/${id}`, { name: newName }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setCategoryMessage('Category updated successfully!');
        fetchCategories(); // Fetch updated categories
    } catch (error) {
        setCategoryMessage('Error updating category.');
    }
};

// Delete Category
const deleteCategory = async (id) => {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`/admins/deleteCategory/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setCategoryMessage('Category deleted successfully!');
        fetchCategories();
    } catch (error) {
        setCategoryMessage('Error deleting category.');
    }
};

const handleCategoryChange = (id, newName) => {
    setEditedCategory({ ...editedCategory, [id]: newName }); // Updates the local state for the category name
};


// Create a new product
const createProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('Name', productName);
    formData.append('Price', productPrice);
    formData.append('Description', productDescription);
    formData.append('AvailableQuantity', availableQuantity);
    formData.append('image', imageFile);  // Append the image file

    try {
        const response = await axios.post('/admins/products', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        setProductMessage('Product created successfully!');
        fetchProducts();
    } catch (error) {
        setProductMessage('Error creating product.');
    }
};

// Fetch all products
const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('/admins/products', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setProducts(response.data);
    } catch (error) {
        setProductMessage('Error fetching products.');
    }
};

// Search for a product by name
const searchProductByName = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`/admins/products/searchProductByName?name=${searchQuery}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setProducts(response.data);
    } catch (error) {
        setProductMessage('Error searching for products.');
    }
};

// Filter products by price
const filterProductByPrice = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`/admins/products/filter?minPrice=${minPrice}&maxPrice=${maxPrice}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setProducts(response.data);
    } catch (error) {
        setProductMessage('Error filtering products by price.');
    }
};

// Delete a product
const deleteProduct = async (id) => {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`/admins/deleteProduct/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setProductMessage('Product deleted successfully!');
        fetchProducts();
    } catch (error) {
        setProductMessage('Error deleting product.');
    }
};

// Sort products by ratings
const sortProductsByRatings = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('/admins/products/sortByRating', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setProducts(response.data);
    } catch (error) {
        setProductMessage('Error sorting products by ratings.');
    }
};

// Create a new preference tag
const createTag = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
        const response = await axios.post('/admins/createTags', { name: newTagName }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setTagMessage('Tag created successfully!');
        fetchTags();  // Refresh the tag list after creation
    } catch (error) {
        setTagMessage('Error creating tag.');
    }
};

// Fetch all preference tags
const fetchTags = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('/admins/getTags', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setPreferenceTags(response.data);  // Store tags in state
    } catch (error) {
        setTagMessage('Error fetching tags.');
    }
};

// Update a preference tag
const updateTag = async (id, newName) => {
    const token = localStorage.getItem('token');
    try {
        await axios.put(`/admins/updateTag/${id}`, { name: newName }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setTagMessage('Tag updated successfully!');
        fetchTags();  // Refresh the tag list after updating
    } catch (error) {
        setTagMessage('Error updating tag.');
    }
};

// Delete a preference tag
const deleteTag = async (id) => {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`/admins/deleteTag/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setTagMessage('Tag deleted successfully!');
        fetchTags();  // Refresh the tag list after deletion
    } catch (error) {
        setTagMessage('Error deleting tag.');
    }
};

// Handle tag name input change
const handleTagChange = (id, newName) => {
    setEditedTag({ ...editedTag, [id]: newName });  // Update local state for each tag being edited
};


// Fetch tourists
const fetchTourists = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('/admins/tourists', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setTourists(response.data);  // Store fetched tourists in state
    } catch (error) {
        setUserMessage('Error fetching tourists.');
    }
};

// Fetch sellers
const fetchSellers = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('/admins/sellers', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setSellers(response.data);  // Store fetched sellers in state
    } catch (error) {
        setUserMessage('Error fetching sellers.');
    }
};

// Fetch tour guides
const fetchTourGuides = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('/admins/tourGuides', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setTourGuides(response.data);  // Store fetched tour guides in state
    } catch (error) {
        setUserMessage('Error fetching tour guides.');
    }
};

// Fetch tourism governors
const fetchTourismGovernors = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('/admins/tourismGovernors', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setTourismGovernors(response.data);  // Store fetched tourism governors in state
    } catch (error) {
        setUserMessage('Error fetching tourism governors.');
    }
};

// Fetch advertisers
const fetchAdvertisers = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('/admins/advertisers', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setAdvertisers(response.data);  // Store fetched advertisers in state
    } catch (error) {
        setUserMessage('Error fetching advertisers.');
    }
};


const deleteUser = async (id, userType, setStateFunction) => {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`/admins/deleteUser/${id}/${userType}`, {  // Relative URL
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setUserMessage(`${userType} deleted successfully!`);
        
        // Re-fetch users after deletion
        switch (userType) {
            case 'tourist':
                fetchTourists();
                break;
            case 'seller':
                fetchSellers();
                break;
            case 'tourGuide':
                fetchTourGuides();
                break;
            case 'tourismGovernor':
                fetchTourismGovernors();
                break;
            case 'advertiser':
                fetchAdvertisers();
                break;
            default:
                break;
        }
    } catch (error) {
        console.error(`Error deleting ${userType}:`, error.response ? error.response.data : error.message);
        setUserMessage(`Error deleting ${userType}.`);
    }
};




    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin/login');
        } else {
            fetchAdmins();
            fetchCategories();
            fetchProducts();
            fetchTags();  // Fetch tags when the component loads

            fetchTourists();
        fetchSellers();
        fetchTourGuides();
        fetchTourismGovernors();
        fetchAdvertisers();
        }
    }, [navigate]);

    if (loading) {
        return <p>Loading admins...</p>;
    }

    return (
        <div className="container">
            
            <h1>Welcome to the Admin Dashboard</h1>

            {/* Navigation bar */}
            <nav>
                <button
                    onClick={() => handleSectionChange('home')}
                    className={activeSection === 'home' ? 'active' : ''}
                >
                    Home
                </button>
                <button
                    onClick={() => handleSectionChange('deleteAccounts')}
                    className={activeSection === 'deleteAccounts' ? 'active' : ''}
                >
                    Delete Accounts
                </button>
                <button
                    onClick={() => handleSectionChange('preferenceTag')}
                    className={activeSection === 'preferenceTag' ? 'active' : ''}
                >
                    Preference Tag
                </button>
                <button
                    onClick={() => handleSectionChange('activityCategory')}
                    className={activeSection === 'activityCategory' ? 'active' : ''}
                >
                    Activity Category
                </button>
                <button
                    onClick={() => handleSectionChange('product')}
                    className={activeSection === 'product' ? 'active' : ''}
                >
                    Product

                </button>

                <button
                    onClick={() => handleSectionChange('tourismGoverner')}
                    className={activeSection === 'tourismGoverner' ? 'active' : ''}
                >
                    Add Tourism Governer
                    
                </button>

            </nav>

            {/* Conditionally render sections */}
            {activeSection === 'home' && (
                <div className="section">
                    <h2>Create New Admin</h2>
                    <form onSubmit={createNewAdmin}>
                        <div className="form-group">
                            <label>New Admin Username:</label>
                            <input
                                type="text"
                                value={newAdminUsername}
                                onChange={(e) => setNewAdminUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>New Admin Email:</label>
                            <input
                                type="email"
                                value={newAdminEmail}
                                onChange={(e) => setNewAdminEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>New Admin Password:</label>
                            <input
                                type="password"
                                value={newAdminPassword}
                                onChange={(e) => setNewAdminPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-btn">Create Admin</button>
                    </form>

                    <h2>Manage Admins</h2>
                    <ul className="admin-list">
                        {admins.length === 0 ? (
                            <p>{message}</p>
                        ) : (
                            admins.map(admin => (
                                <li key={admin._id}>
                                    {admin.username} ({admin.email})
                                    <button onClick={() => deleteAdmin(admin._id)}>Delete</button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}

{activeSection === 'deleteAccounts' && (
    <div className="section">
        <h2>Manage Users</h2>

        {/* Tourists */}
        <h3>Tourists</h3>
        <ul className="admin-list">
            {Array.isArray(tourists) && tourists.length === 0 ? (
                <p>No tourists found</p>
            ) : (
                Array.isArray(tourists) && tourists.map(user => (
                    <li key={user._id}>
                        <p>{user.username} - {user.email}</p>
                        <button 
                            onClick={() => deleteUser(user._id, 'tourist', setTourists)} 
                            style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Delete Tourist
                        </button>
                    </li>
                ))
            )}
        </ul>

        {/* Sellers */}
        <h3>Sellers</h3>
        <ul className="admin-list">
            {Array.isArray(sellers) && sellers.length === 0 ? (
                <p>No sellers found</p>
            ) : (
                Array.isArray(sellers) && sellers.map(user => (
                    <li key={user._id}>
                        <p>{user.username} - {user.email}</p>
                        <button 
                            onClick={() => deleteUser(user._id, 'seller', setSellers)} 
                            style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Delete Seller
                        </button>
                    </li>
                ))
            )}
        </ul>

        {/* Tourism Governors */}
        <h3>Tourism Governors</h3>
        <ul className="admin-list">
            {Array.isArray(tourismGovernors) && tourismGovernors.length === 0 ? (
                <p>No tourism governors found</p>
            ) : (
                Array.isArray(tourismGovernors) && tourismGovernors.map(user => (
                    <li key={user._id}>
                        <p>{user.username} - {user.email}</p>
                        <button 
                            onClick={() => deleteUser(user._id, 'tourismGovernor', setTourismGovernors)} 
                            style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Delete Tourism Governor
                        </button>
                    </li>
                ))
            )}
        </ul>

        {/* Tour Guides */}
        <h3>Tour Guides</h3>
        <ul className="admin-list">
            {Array.isArray(tourGuides) && tourGuides.length === 0 ? (
                <p>No tour guides found</p>
            ) : (
                Array.isArray(tourGuides) && tourGuides.map(user => (
                    <li key={user._id}>
                        <p>{user.username} - {user.email}</p>
                        <button 
                            onClick={() => deleteUser(user._id, 'tourGuide', setTourGuides)} 
                            style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Delete Tour Guide
                        </button>
                    </li>
                ))
            )}
        </ul>

        {/* Advertisers */}
        <h3>Advertisers</h3>
        <ul className="admin-list">
            {Array.isArray(advertisers) && advertisers.length === 0 ? (
                <p>No advertisers found</p>
            ) : (
                Array.isArray(advertisers) && advertisers.map(user => (
                    <li key={user._id}>
                        <p>{user.username} - {user.email}</p>
                        <button 
                            onClick={() => deleteUser(user._id, 'advertiser', setAdvertisers)} 
                            style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Delete Advertiser
                        </button>
                    </li>
                ))
            )}
        </ul>
    </div>
)}



{activeSection === 'preferenceTag' && (
    <div className="section">
        <h2>Manage Preference Tags</h2>
        
        {/* Create New Tag */}
        <form onSubmit={createTag}>
            <div className="form-group">
                <label>New Tag Name:</label>
                <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="submit-btn">Create Tag</button>
        </form>

        {/* Display message */}
        <p>{tagMessage}</p>

        {/* List of Tags with Update/Delete options */}
        <ul className="admin-list">
            {Array.isArray(preferenceTags) && preferenceTags.length === 0 ? (
                <p>No tags found</p>
            ) : (
                Array.isArray(preferenceTags) && preferenceTags.map(tag => (
                    <li key={tag._id}>
                        <input
                            type="text"
                            value={editedTag[tag._id] || tag.name}  // Show edited name or default name
                            onChange={(e) => handleTagChange(tag._id, e.target.value)}  // Update local state
                        />
                        <button 
                            onClick={() => updateTag(tag._id, editedTag[tag._id] || tag.name)} 
                            style={{ backgroundColor: 'lightblue', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Update
                        </button>
                        <button onClick={() => deleteTag(tag._id)} style={{ marginLeft: '10px' }}>Delete</button>
                    </li>
                ))
            )}
        </ul>
    </div>
)}



{activeSection === 'activityCategory' && (
    <div className="section">
        <h2>Manage Activity Categories</h2>
        
        {/* Create New Category */}
        <form onSubmit={createCategory}>
            <div className="form-group">
                <label>New Category Name:</label>
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="submit-btn">Create Category</button>
        </form>
        
        {/* Display message */}
        <p>{categoryMessage}</p>

        {/* List of Categories with Update/Delete options */}
        <ul className="admin-list">
            {activityCategories.length === 0 ? (
                <p>No categories found</p>
            ) : (
                activityCategories.map(category => (
                    <li key={category._id}>
                        <input
                            type="text"
                            value={editedCategory[category._id] || category.name}  // Show edited name or default name
                            onChange={(e) => handleCategoryChange(category._id, e.target.value)}  // Update local state
                        />
                        <button 
                            onClick={() => updateCategory(category._id, editedCategory[category._id] || category.name)} 
                            style={{ backgroundColor: 'lightblue', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Update
                        </button>
                        <button onClick={() => deleteCategory(category._id)} style={{ marginLeft: '10px' }}>Delete</button>
                    </li>
                ))
            )}
        </ul>
    </div>
)}

{activeSection === 'tourismGoverner' && ( 
    <div className="section">
        <h2>Add Tourism Governer</h2>
        {isGovernorAdded && (
                    <div className="success-message">
                        <p style={{ color: 'green' }}>Tourism Governor added successfully!</p>
                    </div>
                )}
        <form onSubmit={handleAddGovernor}>
            <div className="form-group">
                <label>Tourism Governer Username:</label>
                <input
                    type="text"
                    value={governorUsername}
                    onChange={(e) => setGovernorUsername(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Tourism Governer Email:</label>
                <input
                    type="email"
                    value={governorEmail}
                    onChange={(e) => setGovernorEmail(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Tourism Governer Password:</label>
                <input
                    type="password"
                    value={governorPassword}
                    onChange={(e) => setGovernorPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="submit-btn">Add Tourism Governer</button>
        </form>

        
    </div>
)}




{activeSection === 'product' && (
    <div className="section">
        <h2>Manage Products</h2>
        
        {/* Create New Product */}
        <form onSubmit={createProduct} encType="multipart/form-data">
            <div className="form-group">
                <label>Product Name:</label>
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Product Price:</label>
                <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Product Description:</label>
                <input
                    type="text"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Available Quantity:</label>
                <input
                    type="number"
                    value={availableQuantity}
                    onChange={(e) => setAvailableQuantity(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Product Image:</label>
                <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    required
                />
            </div>
            <button type="submit" className="submit-btn">Create Product</button>
        </form>
        <Products products={products} productMessage={productMessage} />

        
    </div>
)}

        </div>
    );
};

export default AdminDashboard;

