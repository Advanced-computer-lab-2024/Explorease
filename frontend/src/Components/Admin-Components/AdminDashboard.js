import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css'; // Import the CSS file
import CreateAdminForm from './AdminManagement';
import ManageUsers from './ManageUser';
import EditMyPassword from './EditPassword';
import UserApproval from './UserApproval';
import BlockItinerary from './BlockItinerary';
import Complaints from './Complaints';
import MyProducts from './AdminProducts'


const AdminDashboard = () => {
    const [message, setMessage] = useState('');
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

const [productMessage, setProductMessage] = useState('');
const [imageFile, setImageFile] = useState(null);  // File upload for image

// State for Preference Tags Management
const [preferenceTags, setPreferenceTags] = useState([]);

const [newTagName, setNewTagName] = useState('');
const [editedTag, setEditedTag] = useState({});
const [tagMessage, setTagMessage] = useState('');

const [isGovernorAdded, setIsGovernorAdded] = useState(false);

    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('home');

    const handleSectionChange = (section) => {
        setActiveSection(section);
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

 



    // Create Activity Category
const createCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
        await axios.post('/admins/createCategory', { name: newCategoryName }, {
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
        await axios.post('/admins/products', formData, {
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
// const searchProductByName = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     try {
//         const response = await axios.get(`/admins/products/searchProductByName?name=${searchQuery}`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         setProducts(response.data);
//     } catch (error) {
//         setProductMessage('Error searching for products.');
//     }
// };

// Filter products by price
// const filterProductByPrice = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     try {
//         const response = await axios.get(`/admins/products/filter?minPrice=${minPrice}&maxPrice=${maxPrice}`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         setProducts(response.data);
//     } catch (error) {
//         setProductMessage('Error filtering products by price.');
//     }
// };

// // Delete a product
// const deleteProduct = async (id) => {
//     const token = localStorage.getItem('token');
//     try {
//         await axios.delete(`/admins/deleteProduct/${id}`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         setProductMessage('Product deleted successfully!');
//         fetchProducts();
//     } catch (error) {
//         setProductMessage('Error deleting product.');
//     }
// };

// Sort products by ratings
// const sortProductsByRatings = async () => {
//     const token = localStorage.getItem('token');
//     try {
//         const response = await axios.get('/admins/products/sortByRating', {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         setProducts(response.data);
//     } catch (error) {
//         setProductMessage('Error sorting products by ratings.');
//     }
// };

// Create a new preference tag
const createTag = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
        await axios.post('/admins/createTags', { name: newTagName }, {
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

// const handleArchiveProduct = async (productId) => {
//     const token = localStorage.getItem('token');
//     try {
//         // Find the product to get its current Archived status
//         const product = products.find(p => p._id === productId);
        
//         // Toggle Archived status
//         await axios.put(`/seller/archiveProduct/${productId}`, { Archived: !product.Archived }, {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         });

//         setProductMessage(product.Archived ? 'Product unarchived successfully' : 'Product archived successfully');
//         fetchProducts(); // Refresh product list after toggling archive status
//     } catch (error) {
//         setProductMessage('Error updating archive status');
//         console.error('Error updating archive status:', error);
//     }
// };

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






    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin/login');
        } else {
            fetchCategories();
            fetchProducts();
            fetchTags();  // Fetch tags when the component loads
        }
    }, [navigate]);


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
                    onClick={() => handleSectionChange('editPassword')}
                    className={activeSection === 'editPassword' ? 'active' : ''}
                >
                    Edit Password
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
                <button
                    onClick={() => handleSectionChange('ReviewUsers')}
                    className={activeSection === 'ReviewUsers' ? 'active' : ''}
                >
                    Review Registering Users
                </button>

                <button
                    onClick={() => handleSectionChange('Block event')}
                    className={activeSection === 'Block event' ? 'active' : ''}
                >
                    Block Event
                </button>
                
                <button
                    onClick={() => handleSectionChange('Complaints')}
                    className={activeSection === 'Complaints' ? 'active' : ''}
                >
                    Complaints
                </button>
            </nav>

            {/* Conditionally render sections */}
            {activeSection === 'home' && (
    <div className="section">
        <CreateAdminForm />
    </div>
)}

{activeSection === 'deleteAccounts' && ( <ManageUsers />) }
{activeSection === 'ReviewUsers' && ( <UserApproval />) }
{activeSection === 'Block event' && ( <BlockItinerary />) }
{activeSection === 'Complaints' && ( <Complaints />) }

{activeSection === 'editPassword' && ( <EditMyPassword />) }

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
        <MyProducts products={products} productMessage={productMessage} />

        
    </div>
)}

        </div>
    );
};

export default AdminDashboard;

