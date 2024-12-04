import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
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
import { Box, Typography, Drawer, List, ListItem, ListItemText, IconButton , Button ,Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Wishlist from './Wishlist';
import Checkout from './Checkout';
import SavedEvents from './SavedEvents';
import CircularProgress from '@mui/material/CircularProgress';
import { CurrencyContext } from './CurrencyContext';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import TouristHomePage from './TouristHomePage';



const TouristDashboard = () => {
    const [profile, setProfile] = useState({});
    const [message, setMessage] = useState('');
    const [activeComponent, setActiveComponent] = useState('welcomePage');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const { selectedCurrency, exchangeRates } = useContext(CurrencyContext); // Use CurrencyContext
    const [updateProfileVisible, setUpdateProfileVisible] = useState(false);

    
    const convertPrice = (price) => {
        return (price * (exchangeRates[selectedCurrency] || 1)).toFixed(2);
    };

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

    const stringAvatar = (name) => {
        const initials = name.split(' ').map((n) => n[0]).join('');
        return { children: initials.toUpperCase() };
    };

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
            case 'welcomePage': 
                return <TouristHomePage profile={profile}/>;
            case 'profile':
                return (
                    <>
                        {message && (
                            <Typography
                                color="error"
                                sx={{
                                    marginBottom: '10px',
                                    fontWeight: 'bold',
                                    textAlign: 'left',
                                    paddingLeft: '20px',
                                }}
                            >
                                {message}
                            </Typography>
                        )}
                        {profile && profile.username ? (
                          <Box
                          sx={{
                              display: 'flex',
                              alignItems: 'center', // Flex layout for Profile + Update form
                              flexDirection: 'column', // Align profile and update form horizontally
                              gap: '20px', // Space between profile card and update form
                              width: '100%',
                              position : 'relative' // Ensure they take up the full width
                          }}
                      >
                            {/* Profile Details Card */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                        backgroundColor: 'white',
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                                        padding: '20px',
                                        marginBottom: '20px',
                                        width: '400px',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)', // Hover effect: scaling
                                            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)', // Slightly more pronounced shadow
                                        },
                                    }}
                                >
                                    {/* Avatar and Basic Info */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '20px',
                                        }}
                                    >
                                        <Avatar
                                            {...stringAvatar(profile.username || 'User')}
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                marginRight: '15px',
                                                backgroundColor: '#111E56',
                                                color: '#fff',
                                                fontSize: '20px',
                                                fontWeight: 'bold',
                                            }}
                                        />
                                        <Box>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: '#111E56',
                                                }}
                                            >
                                                {profile.username || 'Your Name'}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#888',
                                                }}
                                            >
                                                {profile.email || 'yourname@gmail.com'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ marginLeft: '180px'}} >
                                        <Tooltip title="Edit Profile" arrow>
                                <IconButton
                                    onClick={() => setUpdateProfileVisible(!updateProfileVisible)}
                                    sx={{
                                        color: '#111E56',
                                        '&:hover': { color: '#111E60' },
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            </Box>
                                    </Box>
            
                                    {/* Profile Details */}
                                    <Box
                                        component="div"
                                        sx={{
                                            fontSize: '16px',
                                            lineHeight: '2.5',
                                            width: '120%',
                                            '& strong': {
                                                color: '#111E56',
                                                fontWeight: 'bold',
                                            },
                                            alignItems : 'left'
                                        }}
                                    >
                                        <p>
                                            <strong>Date of Birth</strong>{' '}
                                            {new Date(profile.dob).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <strong>Nationality</strong> {profile.nationality}
                                        </p>
                                        <p>
                                            <strong>Mobile Number </strong> {profile.mobileNumber}
                                        </p>
                                        <p>
                                            <strong>Wallet Balance</strong> {convertPrice(profile.wallet)} {selectedCurrency}
                                        </p>
                                    </Box>
            
                                    {/* Delete Account Button */}
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
            
                             
                          
                    {/* Render Update Profile Form */}
                    {updateProfileVisible && (
                     <Box
                     sx={{
                         flex: 1,
                         flexDirection: 'column',
                         padding: '20px',
                         borderRadius: '16px',
                         backgroundColor: 'white',
                     }}
                 >
                            <UpdateProfile profile={profile} setProfile={setProfile} />
                        </Box>
                    )}
                </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100px',
                                    paddingLeft: '20px',
                                }}
                            >
                                <CircularProgress size={50} sx={{ color: '#111E56' }} />
                                
                            </Box>
                        )}
                    </>
                );
            

                
            case 'viewProducts':
                return <Products incrementCartCount={incrementCartCount} />

            // case 'updateProfile':
            //     return <UpdateProfile profile={profile} setProfile={setProfile} />;
            case 'fileComplaint':
                return (
                <Box>
                 <ViewComplaints />
                <FileComplaint />
                 </Box>
                 );
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
                { label: 'Complaints', component: 'fileComplaint' },
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
        marginLeft: isSidebarOpen ? 40 : 0,
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
