import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import './AdminDashboard.css'; // Import the CSS file
import CreateAdminForm from './AdminManagement';
import ManageUsers from './ManageUser';
import EditMyPassword from './EditPassword';
import UserApproval from './UserApproval';
import BlockItinerary from './BlockItinerary';
import Complaints from './Complaints';
import MyProducts from './AdminProducts'
import MyAdminProducts from './AdminMyProducts'
import DeleteRequests from './DeleteRequests';
import PromoCode from './PromoCodes';
import AdminNavBar from './AdminNavBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import SalesReport from './SalesReport';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import ArrowBackIcon
import Tooltip from '@mui/material/Tooltip'; // Import Tooltip

import {
    Home,
    Delete,
    Tag,
    Category,
    ShoppingCart,
    PersonAdd,
    Reviews,
    Block,
    Feedback,
    DeleteForever,
    LocalOffer,
    BarChart,
  } from '@mui/icons-material'; // Import Material-UI icons

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
    const [navigationStack, setNavigationStack] = useState([]); // Stack to keep track of navigation history


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
const [isSidebarVisible, setIsSidebarVisible] = useState(true);


    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('home');

    const handleSectionChange = (section) => {
        setNavigationStack((prevStack) => [...prevStack, activeSection]); // Push current section to stack
        setActiveSection(section); // Set new section
    };
    
        // Function to handle Back button
        const handleBack = () => {
            if (navigationStack.length > 0) {
                const lastSection = navigationStack.pop(); // Get the last section
                setNavigationStack([...navigationStack]); // Update the stack
                setActiveSection(lastSection); // Navigate to the last section
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

 

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
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
        const response = await axios.post('/admins/addProduct', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        // Check if the response was successful
        if (response.status === 201) {
            setProductMessage('Product created successfully!');
            setProductName('');
            setProductPrice('');
            setProductDescription('');
            setAvailableQuantity('');
            setImageFile(null);  // Reset file input
            fetchProducts();  // Refetch products after creation
        }
    } catch (error) {
        // Handle error message
        if (error.response && error.response.status === 400) {
            setProductMessage(error.response.data.message || 'Cannot create product, fields are missing.');
        } else {
            setProductMessage('Error creating product.');
        }
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


    const adminMenuItems = [
        { label: 'Delete Accounts', section: 'deleteAccounts', icon: <Delete /> },
        { label: 'Preference Tag', section: 'preferenceTag', icon: <Tag /> },
        { label: 'Activity Category', section: 'activityCategory', icon: <Category /> },
        { label: 'Product', section: 'product', icon: <ShoppingCart /> },
        { label: 'Add Tourism Governor', section: 'tourismGoverner', icon: <PersonAdd /> },
        { label: 'Review Users', section: 'ReviewUsers', icon: <Reviews /> },
        { label: 'Block Event', section: 'BlockEvent', icon: <Block /> },
        { label: 'Complaints', section: 'Complaints', icon: <Feedback /> },
        { label: 'Delete Requests', section: 'DeleteRequests', icon: <DeleteForever /> },
        { label: 'Promo Code', section: 'PromoCode', icon: <LocalOffer /> },
        { label: 'Sales Report', section: 'SalesReport', icon: <BarChart /> },
      ];

    return (
        <Box>
        <AdminNavBar toggleSidebar={toggleSidebar} handleSectionChange={handleSectionChange} />
{/* Container */}
<Box
        sx={{
          display: 'flex',
          minHeight: '100vh', // Allows content to expand naturally
        }}
      >





        {/* Sidebar */}
    <Box
      sx={{
        width: isSidebarVisible ? '250px' : '70px', // Sidebar width
        backgroundColor: '#111E40',
        color: 'white',
        height: 'calc(100vh - 64px)', // Sidebar height below navbar
        position: 'fixed',
        top: '64px',
        left: 0,
        padding: '10px',
        transition: 'width 0.3s ease', // Smooth width transition
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        overflow: 'hidden', // Prevent overflow in collapsed state
      }}
    >
      <nav>
        {adminMenuItems.map((item) => (
          <Tooltip
            title={!isSidebarVisible ? item.label : ''} // Show tooltip only in collapsed state
            arrow
            placement="right"
            key={item.section}
          >
            <Button
  sx={{
    color: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    padding: isSidebarVisible ? '10px 20px' : '10px 0 10px 10px',
    marginTop: '10px',
    display: 'flex',
    gap: isSidebarVisible ? 2 : 0,
    textAlign: 'left',
    backgroundColor: activeSection === item.section ? '#7BAFD0' : 'transparent',
    borderLeft: activeSection === item.section ? '6px solid #FFFFFF' : '6px solid transparent',
    transition: 'background-color 0.3s ease, border 0.3s ease',
    '&:hover': {
      backgroundColor: '#7BAFD0',
    },
  }}
  onClick={() => handleSectionChange(item.section)}
>
  {item.icon} {/* Render the icon */}
  {isSidebarVisible && item.label} {/* Show label only when sidebar is expanded */}
</Button>

          </Tooltip>
        ))}
      </nav>
    </Box>
        


        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            marginLeft: isSidebarVisible ? '250px' : '55px',
            transition: 'margin-left 0.3s ease-in-out',
           // overflowY: 'auto', // Enables scrolling for the main content
            padding: '20px',
          }}
        >
             {/* Back Button */}
{navigationStack.length > 0 && (
    <Button
        onClick={handleBack}
        startIcon={<ArrowBackIcon />}
        sx={{
            position: 'fixed', // Fix position relative to the viewport
            top: '80px', // Slightly below the navbar
            left: isSidebarVisible ? '270px' : '80px', // Adjust based on sidebar visibility
            backgroundColor: '#111E56',
            color: 'white',
            '&:hover': {
                backgroundColor: 'white',
                color: '#111E56',
                border: '1px solid #111E56',
            },
            zIndex: 1000, // Ensure it appears on top of other content
        }}
    >
        Back
    </Button>
)}

           
    
                {/* Conditionally render sections */}
                {activeSection === 'home' && (
                    <div className="section" style={{fontWeight:'bold',color:'#111E56',fontSize:'32px'}}>
                        <h1>Welcome to your Dashboard</h1>
                        <CreateAdminForm />
                        <EditMyPassword />
                    </div>
                )}
                {activeSection === 'deleteAccounts' && <ManageUsers />}
                {activeSection === 'ReviewUsers' && <UserApproval />}
                {activeSection === 'Block event' && <BlockItinerary />}
                {activeSection === 'Complaints' && <Complaints />}
                {activeSection === 'Delete Requests' && <DeleteRequests />}
                
                {activeSection === 'Promo Code' && <PromoCode />}
                {activeSection === 'Sales Report' && <SalesReport />}
    
                {activeSection === 'preferenceTag' && (
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
        <Typography variant="h5" gutterBottom>
            Manage Preference Tags
        </Typography>

        {/* Display message */}
        {tagMessage && (
            <Box sx={{ marginY: 2 }}>
                <Typography
                    sx={{
                        color: tagMessage.includes('successfully') ? 'green' : 'red',
                    }}
                >
                    {tagMessage}
                </Typography>
            </Box>
        )}

        {/* Create New Tag */}
        <Box
            component="form"
            onSubmit={createTag}
            sx={{
                display: 'grid',
                gap: 2,
                maxWidth: '600px',
                width: '100%',
                marginBottom: '40px',
            }}
        >
            <TextField
                label="New Tag Name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                required
                fullWidth
            />
            <Button
                type="submit"
                variant="contained"
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
                Create Tag
            </Button>
        </Box>

        {/* List of Tags with Update/Delete options */}
        <Box
            sx={{
                width: '100%',
                maxWidth: '600px',
            }}
        >
            <Typography variant="h6" gutterBottom>
                Existing Tags
            </Typography>
            {Array.isArray(preferenceTags) && preferenceTags.length === 0 ? (
                <Typography>No tags found</Typography>
            ) : (
                preferenceTags.map((tag) => (
                    <Box
                        key={tag._id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 2,
                            padding: 2,
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            marginBottom: '10px',
                        }}
                    >
                        <TextField
                            fullWidth
                            value={editedTag[tag._id] || tag.name}
                            onChange={(e) =>
                                handleTagChange(tag._id, e.target.value)
                            }
                        />
                        <Button
                            variant="outlined"
                            onClick={() =>
                                updateTag(tag._id, editedTag[tag._id] || tag.name)
                            }
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
                            Update
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => deleteTag(tag._id)}
                            sx={{
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: '1px solid #f44336',
                                '&:hover': {
                                    backgroundColor: 'white',
                                    color: '#f44336',
                                    border: '1px solid #f44336',
                                },
                            }}
                            
                        >
                            Delete
                        </Button>
                    </Box>
                ))
            )}
        </Box>
    </Box>
)}

{activeSection === 'activityCategory' && (
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
        <Typography variant="h5" gutterBottom>
            Manage Activity Categories
        </Typography>

        {/* Display message */}
        {categoryMessage && (
            <Box sx={{ marginY: 2 }}>
                <Typography
                    sx={{
                        color: categoryMessage.includes('successfully') ? 'green' : 'red',
                    }}
                >
                    {categoryMessage}
                </Typography>
            </Box>
        )}

        {/* Create New Category */}
        <Box
            component="form"
            onSubmit={createCategory}
            sx={{
                display: 'grid',
                gap: 2,
                maxWidth: '600px',
                width: '100%',
                marginBottom: '40px',
            }}
        >
            <TextField
                label="New Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
                fullWidth
            />
            <Button
                type="submit"
                variant="contained"
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
                Create Category
            </Button>
        </Box>

        {/* List of Categories with Update/Delete options */}
        <Box
            sx={{
                width: '100%',
                maxWidth: '600px',
            }}
        >
            <Typography variant="h6" gutterBottom>
                Existing Categories
            </Typography>
            {activityCategories.length === 0 ? (
                <Typography>No categories found</Typography>
            ) : (
                activityCategories.map((category) => (
                    <Box
                        key={category._id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 2,
                            padding: 2,
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            marginBottom: '10px',
                        }}
                    >
                        <TextField
                            fullWidth
                            value={editedCategory[category._id] || category.name}
                            onChange={(e) =>
                                handleCategoryChange(category._id, e.target.value)
                            }
                        />
                        <Button
                            variant="outlined"
                            onClick={() =>
                                updateCategory(
                                    category._id,
                                    editedCategory[category._id] || category.name
                                )
                            }
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
                            Update
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => deleteCategory(category._id)}
                            sx={{
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: '1px solid #f44336',
                                '&:hover': {
                                    backgroundColor: 'white',
                                    color: '#f44336',
                                    border: '1px solid #f44336',
                                },
                            }}
                        >
                            Delete
                        </Button>
                    </Box>
                ))
            )}
        </Box>
    </Box>
)}

{activeSection === 'tourismGoverner' && (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            padding: '20px',
        }}
    >
        <Typography variant="h5" gutterBottom>
            Add Tourism Governor
        </Typography>

        {/* Success Message */}
        {isGovernorAdded && (
            <Typography sx={{ color: 'green', marginBottom: 2 }}>
                Tourism Governor added successfully!
            </Typography>
        )}

        {/* Form to Add Governor */}
        <Box
            component="form"
            onSubmit={handleAddGovernor}
            sx={{
                display: 'grid',
                gap: 2,
                maxWidth: '600px',
                width: '100%',
            }}
        >
            <TextField
                label="Governor Username"
                value={governorUsername}
                onChange={(e) => setGovernorUsername(e.target.value)}
                required
                fullWidth
            />
            <TextField
                label="Governor Email"
                type="email"
                value={governorEmail}
                onChange={(e) => setGovernorEmail(e.target.value)}
                required
                fullWidth
            />
            <TextField
                label="Governor Password"
                type="password"
                value={governorPassword}
                onChange={(e) => setGovernorPassword(e.target.value)}
                required
                fullWidth
            />
            <Button
                type="submit"
                variant="contained"
                sx={{
                    backgroundColor: '#111E56',
                    color: 'white',
                    border: '2px solid #111E56',
                    '&:hover': {
                        backgroundColor: 'white',
                        color: '#111E56',
                        border: '1px solid #111E56',
                        border: '2px solid #111E56',
                    },
                }}
            >
                Add Governor
            </Button>
        </Box>
    </Box>
)}

    {activeSection === 'product' && (
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
            Manage Products
        </Typography>

        {/* Display message for success or error */}
        {productMessage && (
            <Box sx={{ marginY: 2 }}>
                <Typography
                    sx={{
                        color: productMessage.includes('successfully') ? 'green' : 'red',
                    }}
                >
                    {productMessage}
                </Typography>
            </Box>
        )}

        {/* Create New Product Form */}
        <Box
            component="form"
            onSubmit={createProduct}
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
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                fullWidth
            />
            <TextField
                label="Product Price"
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                required
                fullWidth
            />
            <TextField
                label="Product Description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                required
                fullWidth
            />
            <TextField
                label="Available Quantity"
                type="number"
                value={availableQuantity}
                onChange={(e) => setAvailableQuantity(e.target.value)}
                required
                fullWidth
            />
            <TextField
                type="file"
                onChange={(e) => setImageFile(e.target.files[0])}
                inputProps={{ accept: 'image/*' }} // Restrict to image files
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

        {/* List of Products */}
        <Box
            sx={{
                width: '100%',
                maxWidth: '800px',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <MyAdminProducts products={products} productMessage={productMessage} />
                <MyProducts products={products} productMessage={productMessage} />
            </Box>
        </Box>
    </Box>
)}



            </Box>
        </Box>
        </Box>
    );
    
    };

    

export default AdminDashboard;

