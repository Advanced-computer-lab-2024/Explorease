import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SellerNavbar from '../MainPage-Components/TouristNavbar'; // Assume SellerNavbar is similar to TouristNavbar
import Products from './Products'; // Component to manage seller's products
import MyProducts from './MyProducts';
import AddProduct from './AddProduct';

const SellerDashboard = () => {
    const [profile, setProfile] = useState({});
    const [message, setMessage] = useState('');
    const [activeComponent, setActiveComponent] = useState('profile'); // State to manage active component
    const [products, setProducts] = useState([]); // State to manage products
    const [productMessage, setProductMessage] = useState('');
    const navigate = useNavigate();

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Check if token is present

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get('/seller/myProfile', {
                headers: {
                    Authorization: `Bearer ${token}` // Send token in request header
                }
            });


            if (response.data && response.data.seller) {
                setProfile(response.data.seller); // Update profile state with fetched data
            } 
        } catch (error) {
            console.error('Error fetching profile:', error.response ? error.response.data : error.message);
            setMessage('Error fetching profile');
        }
    };

    useEffect(() => {
       
        fetchProfile();
    }, [navigate]);

    // Function to handle updating the profile
    const UpdateProfile = ({ profile, setProfile }) => {
        const [formProfile, setFormProfile] = useState({});
        const [updateMessage, setUpdateMessage] = useState('');
        const [success, setSuccess] = useState(false); // New state to manage success status
    
        // Sync formProfile with profile whenever profile is updated
        useEffect(() => {
            if (profile) {
                setFormProfile(profile);  // Only update formProfile if profile exists
            }
        }, [profile]);
    
        const handleChange = (e) => {
            setFormProfile({ ...formProfile, [e.target.name]: e.target.value });
        };
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('token');
        
            // Log formProfile to ensure correct data is being sent
            console.log('FormProfile Data:', formProfile);
        
            try {
                const response = await axios.put('/seller/myProfile', formProfile, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
        
                console.log('Update Response:', response.data);
                setProfile(response.data.updatedSeller);
                setUpdateMessage('Profile updated successfully');
                setSuccess(true);
                fetchProfile();
            } catch (error) {
                console.error('Error updating profile:', error.response ? error.response.data : error.message);
                setUpdateMessage(error.response?.data?.message || 'Error updating profile');
                setSuccess(false);
            }
            
        };
        
        
    
        // If profile is still loading or formProfile is empty, show a loading indicator
        if (!formProfile.email) {
            return <div>Loading...</div>;
        }

        return (
            <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <h2>Update Profile</h2>
                {/* Display success message */}
                {updateMessage && (
                    <p style={{ color: success ? 'green' : 'red', marginBottom: '20px' }}>
                        {updateMessage}
                    </p>
                )}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formProfile.username || ''}
                            onChange={handleChange}
                            required
                            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formProfile.password || ''}
                            onChange={handleChange}
                            required
                            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                        />
                    </div>
                    <div>
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formProfile.name || ''}
                            onChange={handleChange}
                            required
                            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                        />
                    </div>
                    <div>
                        <label>Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formProfile.description || ''}
                            onChange={handleChange}
                            required
                            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', width: '100%' }}>
                        Update Profile
                    </button>
                </form>
            </div>
        );
    };

    const sidebarStyle = {
        width: '250px',
        backgroundColor: '#f1f1f1',
        padding: '15px',
        position: 'fixed',
        height: '100%',
        top: '45px',
        left: '0',
        display: 'flex',
        flexDirection: 'column',
        zIndex: '1'
    };

    const contentStyle = {
        marginLeft: '260px', // Space for the sidebar
        padding: '20px',
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

    const labelStyle = {
        fontWeight: 'bold',
        marginBottom: '10px',
        display: 'block',
        fontSize: '18px',
    };

    const valueStyle = {
        marginBottom: '20px',
        fontSize: '16px',
        color: '#555',
    };

    // Render content based on active component
    const renderContent = () => {
        switch (activeComponent) {
            case 'profile':
                return (
                    <>
                        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Seller Profile</h2>
                        {message && <p style={{ textAlign: 'center', color: 'red' }}>{message}</p>}
                        {profile && profile.username ? (
                            <div style={cardStyle}>
                                <p><span style={labelStyle}>Username:</span> <span style={valueStyle}>{profile.username}</span></p>
                                <p><span style={labelStyle}>Email:</span> <span style={valueStyle}>{profile.email}</span></p>
                                <p><span style={labelStyle}>Name:</span> <span style={valueStyle}>{profile.name}</span></p>
                                <p><span style={labelStyle}>Description:</span>
                                <span style={valueStyle}>{profile.description}</span></p>
                            </div>
                        ) : (
                            <p>Loading profile...</p>
                        )}
                    </>
                );
            case 'viewProducts':
                return <Products />;
            case 'updateProfile':
                // Pass the profile and setProfile to the UpdateProfile component
                return <UpdateProfile profile={profile} setProfile={setProfile} />;  // Ensure profile and setProfile are passed
            
            case 'myProducts':
                return <MyProducts />


            case 'addProduct' :
                    return <AddProduct />
            default:
                return <h2>Welcome to the Dashboard</h2>;
        }
    };

    return (
        <div>
            <SellerNavbar />  {/* Assuming SellerNavbar is a similar component to TouristNavbar */}

            <div style={sidebarStyle}>
                <h3>Dashboard</h3>
                <ul style={{ listStyleType: 'none', padding: '0' }}>
                    <li onClick={() => setActiveComponent('profile')} style={{ cursor: 'pointer', marginBottom: '10px' }}>View Profile</li>
                    <li onClick={() => setActiveComponent('viewProducts')} style={{ cursor: 'pointer', marginBottom: '10px' }}>View All Products</li>
                    <li onClick={() => setActiveComponent('updateProfile')} style={{ cursor: 'pointer', marginBottom: '10px' }}>Update Profile</li>
                    <li onClick={() => setActiveComponent('myProducts')} style={{ cursor: 'pointer', marginBottom: '10px' }}>View My Products</li>
                    <li onClick={() => setActiveComponent('addProduct')} style={{ cursor: 'pointer', marginBottom: '10px' }}>Add A Product</li>

                </ul>
            </div>

            <div style={contentStyle}>
                {renderContent()}
            </div>
        </div>
    );
};

export default SellerDashboard;

