import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TouristNavbar from './TouristNavbar';
import FileComplaint from './fileComplaint';
import UpdateProfile from './UpdateProfile';
import ViewComplaints from './ViewComplaints';
import BookFlight from './BookFlight';
import BookHotel from './BookHotel';
import BookTransport from './BookTransportation';
import Cart from './Cart';
import Wallet from './Wallet';
import BookActivity from './BookActivity';
import BookItinerary from './BookItinerary';
import ViewBookings from './ViewBookings';
import ReviewGuides from './ReviewGuides';
import PurchasedProduct from './PurchasedProduct';
import MyPoints from './MyPoints';
import Products from './BuyProduct';
import { Box, Typography, Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Wishlist from './Wishlist';
import Checkout from './Checkout';

const TouristDashboard = () => {
    const [profile, setProfile] = useState({});
    const [message, setMessage] = useState('');
    const [activeComponent, setActiveComponent] = useState('profile');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
 // Function to refresh cart count (increments by 1)
 const incrementCartCount = () => {
    setCartCount((prevCount) => prevCount + 1);
};
    const sidebarWidth = isSidebarOpen ? 250 : 0;
        const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };


    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
            }

            try {
                const response = await axios.get('/tourists/myProfile', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data) {
                    setProfile(response.data);
                } else {
                    setMessage('No profile data found');
                }
            } catch (error) {
                console.error(
                    'Error fetching profile:',
                    error.response ? error.response.data : error.message
                );
                setMessage('Error fetching profile');
            }
        };

        fetchProfile();
    }, [navigate]);

    

    const handleDeleteAccountRequest = async () => {
        if (
            window.confirm(
                'Are you sure you want to delete your account? This action cannot be undone.'
            )
        ) {
            try {
                const token = localStorage.getItem('token');
                await axios.put(
                    '/tourists/deleteTouristRequest',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setMessage('Account deletion request sent successfully.');
            } catch (error) {
                console.error('Error requesting account deletion:', error);
                setMessage('Failed to request account deletion. Please try again.');
            }
        }
    };

    const renderContent = () => {
        switch (activeComponent) {
            case 'profile':
                return (
                    <>
                        <Typography variant="h4" align="center" gutterBottom>
                            Tourist Profile
                        </Typography>
                        {message && <Typography color="error" align="center">{message}</Typography>}
                        {profile && profile.username ? (
                            <Box
                                sx={{
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    maxWidth: '400px',
                                    margin: '0 auto',
                                    backgroundColor: '#f9f9f9',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    textAlign: 'center',
                                }}
                            >
                                <p>
                                    <strong>Username:</strong> {profile.username}
                                </p>
                                <p>
                                    <strong>Email:</strong> {profile.email}
                                </p>
                                <p>
                                    <strong>Date of Birth:</strong>{' '}
                                    {new Date(profile.dob).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Nationality:</strong> {profile.nationality}
                                </p>
                                <p>
                                    <strong>Wallet Balance:</strong> {profile.wallet} USD
                                </p>
                                <button onClick={handleDeleteAccountRequest} variant="destructive">
                                    Delete Account
                                </button>
                            </Box>
                        ) : (
                            <Typography align="center">Loading profile...</Typography>
                        )}
                    </>
                );
            case 'viewProducts':
                return <Products incrementCartCount={incrementCartCount} />

            case 'updateProfile':
                return <UpdateProfile profile={profile} setProfile={setProfile} />;
            case 'fileComplaint':
                return <FileComplaint />;
            case 'ViewComplaints':
                return <ViewComplaints />;
            case 'cart':
                return <Cart setActiveComponent={setActiveComponent} />;
            case 'checkout':
                return <Checkout setActiveComponent={setActiveComponent}></Checkout>
            case 'wallet':
                return <h2> Still Implementing Wallet!</h2>;
            case 'bookFlight':
                return <BookFlight />;
            case 'bookHotel':
                return <BookHotel />;
            case 'bookActivity':
                return <BookActivity />;
            case 'bookItinerary':
                return <BookItinerary />;
            case 'ViewBookings':
                return <ViewBookings />;
            case 'reviewGuides':
                return <ReviewGuides />;
            case 'bookTransportation':
                return <BookTransport />;
            case 'PurchasedProduct':
                return <PurchasedProduct />;
            case 'MyPoints':
                return <MyPoints />;
            case 'wishlist':
                return <Wishlist />
            default:
                return <Typography variant="h4" align="center">Welcome to the Dashboard</Typography>;
        }
    };

    return (
        <div>
   {/* Navbar */}
   <TouristNavbar toggleSidebar={toggleSidebar} setActiveComponent={setActiveComponent} cartCount={cartCount} />

{/* Sidebar */}
<Box
    sx={{
        position: 'fixed',
        top: '64px', // Navbar height
        left: 0,
        width: sidebarWidth,
        height: 'calc(100% - 64px)', // Full height minus navbar
        backgroundColor: '#f1f1f1',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        zIndex: 1000,
    }}
    onMouseLeave={() => setIsSidebarOpen(false)} // Close sidebar on mouse leave
>
<List sx={{ padding: 0 }}>
    {[
        { text: 'View Profile', component: 'profile' },
        { text: 'Update Profile', component: 'updateProfile' },
        { text: 'File Complaint', component: 'fileComplaint' },
        { text: 'View Complaints', component: 'ViewComplaints' },
        { text: 'View Bookings', component: 'ViewBookings' },
        { text: 'Review Tour Guides', component: 'reviewGuides' },
        { text: 'Purchased Products', component: 'PurchasedProduct' },
        { text: 'My Points', component: 'MyPoints' },
        {text : 'Wishlist', component: 'wishlist'},
    ].map((item, index) => (
        <ListItem
            button
            key={index}
            onClick={() => {
                setActiveComponent(item.component);
                setIsSidebarOpen(false);
            }}
            sx={{
                backgroundColor: index % 2 === 1 ? '#111E56' : '#f5f5f5', // Alternating colors
                color: index % 2 === 1 ? 'white' : '#111E56',
                padding: '15px 20px',
                '&:hover': {
                    backgroundColor: index % 2 === 1 ? '#0D1740' : '#e0e0e0', // Slightly darker on hover
                    cursor: 'pointer',
                },
                transition: 'background-color 0.3s ease',
            }}
        >
            <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                    fontSize: '16px',
                    fontWeight: 500,
                    fontFamily: 'Poppins, sans-serif',
                }}
            />
        </ListItem>
    ))}
</List>
</Box>

{/* Main Content */}
<Box
    sx={{
        marginLeft: isSidebarOpen ? 50 : 0,
        transition: 'margin-left 0.3s ease',
        padding: '20px',
    }}
>
    {renderContent()}
</Box>
        </div>
    );
};

export default TouristDashboard;
