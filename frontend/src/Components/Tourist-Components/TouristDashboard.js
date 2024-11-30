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
import { Box, Typography, Drawer, List, ListItem, ListItemText, IconButton , Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Wishlist from './Wishlist';
import Checkout from './Checkout';
import SavedEvents from './SavedEvents';
import CircularProgress from '@mui/material/CircularProgress';

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
                        <Typography
                            variant="h4"
                            align="center"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                color: '#111E56',
                                
                                marginBottom: '20px',
                            }}
                        >
                            Tourist Profile
                        </Typography>
                        {message && (
                            <Typography
                                color="error"
                                align="center"
                                sx={{
                                    marginBottom: '10px',
                                    fontWeight: 'bold',
                                    
                                }}
                            >
                                {message}
                            </Typography>
                        )}
                        {profile && profile.username ? (
                            <Box
                                sx={{
                                    marginTop: '50px',
                                    width: '400px', // Set square dimensions
                                    height: '400px', // Ensure square shape
                                    borderRadius: '16px',
                                    backgroundColor: 'white',
                                    margin: '30px auto',
                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                                    textAlign: 'center',
                                    fontFamily: 'Poppins, sans-serif',
                                    padding: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)', // Hover effect: scaling
                                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)', // Slightly more pronounced shadow
                                    },
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#111E56',
                                        marginBottom: '15px',
                                    }}
                                >
                                    Profile Details
                                </Typography>
                                <Box
                                    component="div"
                                    sx={{
                                        fontSize: '16px',
                                        lineHeight: '1.8',
                                        '& strong': {
                                            color: '#111E56',
                                            fontWeight: 'bold',
                                        },
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
                                </Box>
                                <Button
                                    onClick={handleDeleteAccountRequest}
                                    sx={{
                                        marginTop: '20px',
                                        backgroundColor: '#f44336',
                                        color: 'white',
                                        border: '2px solid #f44336',
                                        padding: '10px 20px',
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        textTransform: 'uppercase',
                                        borderRadius: '8px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            color: '#f44336',
                                            border: '2px solid #f44336',
                                        },
                                    }}
                                >
                                    Delete Account
                                </Button>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100px',
                                    marginTop: '20px',
                                }}
                            >
                                <CircularProgress size={50} sx={{ color: '#111E56' }} />
                            </Box>
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
            case 'SavedEvents':
                return <SavedEvents />
            default:
                return <Typography variant="h4" align="center">Welcome to the Dashboard</Typography>;
        }
    };

    return (
        <div>
   {/* Navbar */}
   <TouristNavbar toggleSidebar={toggleSidebar} setActiveComponent={setActiveComponent} cartCount={cartCount} />

{/* Tourist Sidebar */}
{isSidebarOpen && (
    <Box
        sx={{
            width: '250px',
            backgroundColor: '#111E40', // Same color as Admin sidebar
            color: 'white',
            height: 'calc(100vh - 64px)', // Sidebar height excluding navbar
            position: 'fixed',
            top: '64px', // Start below the Navbar
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.3s ease-in-out',
        }}
    >
        {/* Sidebar Navigation */}
        
        <nav>
            {[
                { label: 'View Profile', component: 'profile' },
                { label: 'Update Profile', component: 'updateProfile' },
                { label: 'File Complaint', component: 'fileComplaint' },
                { label: 'View Complaints', component: 'ViewComplaints' },
                { label: 'View Bookings', component: 'ViewBookings' },
                { label: 'Review Tour Guides', component: 'reviewGuides' },
                { label: 'Purchased Products', component: 'PurchasedProduct' },
                { label: 'My Points', component: 'MyPoints' },
                { label: 'Saved Events', component: 'SavedEvents' },
            ].map((item) => (
                <Button
                    key={item.component}
                    sx={{
                        color: 'white',
                        textAlign: 'left',
                        justifyContent: 'flex-start',
                        width: '100%',
                        padding: '10px',
                        marginTop: '10px',
                        backgroundColor: activeComponent === item.component ? '#7BAFD0' : 'transparent',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease', // Smooth animation for scaling and shadow
                        '&:hover': {
                            backgroundColor: '#7BAFD0', // Hover effect
                            transform: 'scale(1.01)', // Slight scaling
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow
                        },
                    }}
                    onClick={() => setActiveComponent(item.component)}
                >
                    {item.label}
                </Button>
            ))}
        </nav>
    </Box>
)}



{/* Main Content */}
<Box
    sx={{
        marginLeft: isSidebarOpen ? 30 : 0,
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
