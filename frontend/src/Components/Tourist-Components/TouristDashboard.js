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
// import Wallet from './Wallet';
import BookActivity from './BookActivity';
import BookItinerary from './BookItinerary';
import ViewBookings from './ViewBookings';
import ReviewGuides from './ReviewGuides';
import PurchasedProduct from './PurchasedProduct';
import MyPoints from './MyPoints';
import Products from './BuyProduct';
import { Box, Typography, IconButton , Button ,Avatar, Divider } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
import Wishlist from './Wishlist';
import Checkout from './Checkout';
import SavedEvents from './SavedEvents';
import CircularProgress from '@mui/material/CircularProgress';
import { CurrencyContext } from './CurrencyContext';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import TouristHomePage from './TouristHomePage';
import HistoricalPlace from './HistoricalPlaces';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import ArrowBackIcon
import AccountCircle from '@mui/icons-material/AccountCircle';
import logo2 from '../../Misc/logo.png';
import { Container, Stack , Link} from '@mui/material';

import {
    Feedback,          // For Complaints
    CalendarToday,     // For View Bookings
    Star,              // For Review Tour Guides
    ShoppingBasket,    // For Purchased Products
    EmojiEvents,       // For My Points
    Bookmark,          // For Saved Events
  } from '@mui/icons-material';

import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';



const TouristDashboard = () => {
    const [profile, setProfile] = useState({});
    const [message, setMessage] = useState('');
    const [activeComponent, setActiveComponent] = useState('welcomePage');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { selectedCurrency, exchangeRates } = useContext(CurrencyContext); // Use CurrencyContext
    const [updateProfileVisible, setUpdateProfileVisible] = useState(false);
    const [navigationStack, setNavigationStack] = useState([]); // Stack to keep track of navigation history
    const [wishlistCount, setWishlistCount] = useState(0); // Holds the number of items in the wishlist
    const [cartCount, setCartCount] = useState(0); // Holds the number of items in the cart
    const [sectionProps, setSectionProps] = useState({});

    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/cart', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCartCount(response.data.items.length);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/wishlist', {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log('Wishlist response:', response.data); // Debugging response
    
            // Assuming `response.data.wishlist.products` is an array of product objects
            const productIds = response.data.wishlist.products.map((item) => item._id); // Extract product IDs
            setWishlistCount(productIds.length); // Update the count in the parent component
        } catch (error) {
            console.error('Error fetching wishlist items:', error);
        }
    };

    const updateWishlistCount = (count) => {
        setWishlistCount(count); // Callback to update the wishlist count
    };

    const navigate = useNavigate();
    const convertPrice = (price) => {
        return (price * (exchangeRates[selectedCurrency] || 1)).toFixed(2);
    };

 // Function to refresh cart count (increments by 1)
 const incrementCartCount = () => {
    setCartCount((prevCount) => prevCount + 1);
};
    

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };


    const handleSectionChange = (section, props) => {
        setNavigationStack((prevStack) => [...prevStack, activeComponent]); // Push current section to stack
        setActiveComponent(section); // Set new section
        setSectionProps(props); 
    };
    
        // Function to handle Back button
        const handleBack = () => {
            if (navigationStack.length > 0) {
                const lastSection = navigationStack.pop(); // Get the last section
                setNavigationStack([...navigationStack]); // Update the stack
                setActiveComponent(lastSection); // Navigate to the last section
            }
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
        fetchCartItems();
        fetchWishlist();
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
            case 'historical-places':
                return <HistoricalPlace />;
            case 'welcomePage': 
                return <TouristHomePage profile={profile}/>;
            case 'profile':
                return (
                    <Box
                    sx={{
                      marginTop: '50px',
                      width: '450px',
                      borderRadius: '16px',
                      backgroundColor: 'white',
                      margin: '30px auto',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
                      },
                    }}
                  >
                    {message && (
                      <Typography
                        color="error"
                        sx={{
                          marginBottom: '10px',
                          fontWeight: 'bold',
                          width: '100%',
                          textAlign: 'center',
                        }}
                      >
                        {message}
                      </Typography>
                    )}
                    {profile.username ? (
                      <>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '20px',
                            width: '100%',
                          }}
                        >
                          <Box>
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
                                    </Box>
                                    <Box sx={{ flexGrow: 1, textAlign: 'left' }}>
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
                        <Box
                          component="div"
                          sx={{
                            fontSize: '16px',
                            lineHeight: '1.8',
                            width: '100%',
                            textAlign: 'center',
                            '& strong': {
                              color: '#111E56',
                              fontWeight: 'bold',
                            },
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
        
                            
                                <Button
                          onClick={handleDeleteAccountRequest}
                          sx={{
                            marginTop: '20px',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: '2px solid #f44336',
                            padding: '10px 20px',
                            fontWeight: 'bold',
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

                {updateProfileVisible && (
                 <Box
                 sx={{
                    marginTop: '20px',
                    width: '100%',
                    padding: '20px',
                    borderRadius: '8px',

                 }}
             >
                        <UpdateProfile profile={profile} setProfile={setProfile} />
                    </Box>
                )}
                              </>
                    ) : (
                      <CircularProgress sx={{ color: '#111E56' }} />
                    )}
                  </Box>
                );
            

                
            case 'viewProducts':
                return <Products incrementCartCount={fetchCartItems} updateWishlistCount={updateWishlistCount} />

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
                return <Cart handleSectionChange={handleSectionChange} />;
            case 'checkout':
                return <Checkout handleSectionChange={handleSectionChange}></Checkout>
            case 'wallet':
                return <h2> Still Implementing Wallet!</h2>;
            case 'bookFlight':
                return <BookFlight  />;
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
                return <Wishlist incrementCartCount={fetchCartItems}  updateWishlistCount={updateWishlistCount}/>
            case 'SavedEvents':
                return <SavedEvents setActiveComponent={setActiveComponent}/>
            default:
                return <Typography variant="h4" align="center">Welcome to the Dashboard</Typography>;
        }
    };

    const touristMenuItems = [
        { label: 'Complaints', component: 'fileComplaint', icon: <Feedback /> },
        { label: 'View Bookings', component: 'ViewBookings', icon: <CalendarToday /> },
        { label: 'Review Tour Guides', component: 'reviewGuides', icon: <Star /> },
        { label: 'Purchased Products', component: 'PurchasedProduct', icon: <ShoppingBasket /> },
        { label: 'My Points', component: 'MyPoints', icon: <EmojiEvents /> },
        { label: 'Saved Events', component: 'SavedEvents', icon: <Bookmark /> },
      ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
   {/* Navbar */}
   <TouristNavbar toggleSidebar={toggleSidebar} handleSectionChange={handleSectionChange} cartCount={cartCount} wishlistCount={wishlistCount}/>
    {/* Sidebar */} 
   <Box
  sx={{
    width: isSidebarOpen ? '250px' : '70px', // Sidebar width
    backgroundColor: '#111E40',
    color: 'white',
    height: 'calc(100vh - 64px)', // Sidebar height excluding navbar
    position: 'fixed',
    top: '64px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease', // Smooth width transition
    zIndex: 1000,
    overflow: 'hidden',
  }}
>
  <nav>
  <Box >
  {isSidebarOpen ? (
    <Box sx={{marginLeft:'10px'}}>
    <Avatar
      {...stringAvatar(profile.username || 'User')}
      sx={{
        width: 60,
        height: 60,
        marginRight: '15px',
        backgroundColor: 'white',
        color: '#111E56',
        fontSize: '20px',
        fontWeight: 'bold',
        marginLeft:'70px'
      }}
    />
    <Typography
  variant="h6"
  sx={{
    fontWeight: 'bold',
    color: 'white',
    marginRight: '20px',
    marginTop: '10px',
    cursor: 'pointer',  // Adds a pointer cursor to indicate it's clickable
    transition: 'transform 0.3s ease',  // Smooth transition for scaling
    '&:hover': {
      transform: 'scale(1.1)',  // Scales up the text on hover
    }, // Adds a pointer cursor to indicate it's clickable
  }}
  onClick={() => handleSectionChange('profile')}
>
  View Profile
</Typography>

    <Divider sx={{backgroundColor:'white'}}/>
    </Box>
    
  ) : (
    <Tooltip
    title={!isSidebarOpen ? 'profile' : ''} // Tooltip for collapsed sidebar
    arrow
    placement="right"
    key={'profile'}
  >
    <Button
      sx={{
        color: 'white',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        padding: isSidebarOpen ? '10px 20px' : '10px 0 10px 10px',
        marginTop: '10px',
        display: 'flex',
        gap: isSidebarOpen ? 2 : 0,
        textAlign: 'left',
        backgroundColor: activeComponent === 'profile' ? '#7BAFD0' : 'transparent',
        borderLeft: activeComponent === 'profile' ? '6px solid #FFFFFF' : '6px solid transparent',
        transition: 'background-color 0.3s ease, border 0.3s ease',
        '&:hover': {
          backgroundColor: '#7BAFD0',
        },
      }}
      onClick={() => handleSectionChange('profile')}
    >
      <AccountCircle />
    </Button>
  </Tooltip>
    // <IconButton
    // onClick={() => handleSectionChange('profile')} 
    //   sx={{
    //     color: 'white',
    //     '&:hover': { color: '#111E60' },
    //   }}
    // >
    //   <AccountCircle />
    // </IconButton>
  )}
</Box>

    {touristMenuItems.map((item) => (
      <Tooltip
        title={!isSidebarOpen ? item.label : ''} // Tooltip for collapsed sidebar
        arrow
        placement="right"
        key={item.component}
      >
        <Button
          sx={{
            color: 'white',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            padding: isSidebarOpen ? '10px 20px' : '10px 0 10px 10px',
            marginTop: '10px',
            display: 'flex',
            gap: isSidebarOpen ? 2 : 0,
            textAlign: 'left',
            backgroundColor: activeComponent === item.component ? '#7BAFD0' : 'transparent',
            borderLeft: activeComponent === item.component ? '6px solid #FFFFFF' : '6px solid transparent',
            transition: 'background-color 0.3s ease, border 0.3s ease',
            '&:hover': {
              backgroundColor: '#7BAFD0',
            },
          }}
          onClick={() => handleSectionChange(item.component)}
        >
          {item.icon} {/* Render the icon */}
          {isSidebarOpen && item.label} {/* Show label only when expanded */}
        </Button>
      </Tooltip>
    ))}
  </nav>
                {/* Bottom Buttons */}
                <Box sx={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 2  , marginLeft:'5px'}}>
    {/* Settings Button */}
    <Tooltip title="Settings" arrow placement="right">
      <Button
        startIcon={<SettingsIcon sx={{marginLeft:'9px',}} />} // Settings icon
        sx={{
          color: 'white',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          
          padding: isSidebarOpen ? '10px 20px 10px 15px' : '10px 0 10px 10px',
          textAlign: 'left',
          '&:hover': { backgroundColor: '#7BAFD0' },
        }}
        onClick={() => handleSectionChange('settings')} // Set to navigate to the settings section
      >
        {isSidebarOpen ? 'Settings' : null}
      </Button>
    </Tooltip>

    {/* Logout Button */}
    <Tooltip title="Logout" arrow placement="right">
      <Button
        startIcon={<LogoutIcon sx={{marginLeft:'10px',}} />} // Logout icon
        sx={{
          color: 'white',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          
          padding: isSidebarOpen ? '10px 20px 10px 15px' : '10px 0 10px 10px',
          textAlign: 'left',
          '&:hover': { backgroundColor: '#7BAFD0' },
        }}
        onClick={() => {
          // Perform logout functionality
          localStorage.removeItem('token'); // Clear token
          navigate('/login'); // Navigate to login
        }}
      >
        {isSidebarOpen ? 'Logout' : null}
      </Button>
    </Tooltip>
  </Box>
</Box>


{/* Main Content */}
<Box
    sx={{
        marginLeft: isSidebarOpen ? '270px' : '65px',
        transition: 'margin-left 0.3s ease',
        padding: '20px',
        flexGrow: 1, // Ensures content takes up available space, pushing footer dow
    }}
>
{navigationStack.length > 0 && (
        <Button
        onClick={handleBack}
        sx={{
            position: 'fixed',
            top: '80px',
            left: isSidebarOpen ? '270px' : '80px',
            backgroundColor: 'transparent',
            color: '#111E56',
            fontSize: '1rem',
            width:'45px',
            padding: '10px 20px',
            borderRadius: '35px',
            transition: 'left 0.3s ease, background-color 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)', // Transparent gray
                color: '#111E56',
            },
            zIndex: 1000,
        }}
    >
        <ArrowBackIcon
            sx={{
                fontSize: '2rem', // Explicitly setting the icon size
            }}
        />
    </Button>
    )}
    {renderContent()}
</Box>
{/* Footer */}
    <footer style={{
        backgroundColor: '#111E56',
        color: 'white',
        padding: '30px 0',
        marginLeft: isSidebarOpen ? '250px' : '70px', // Adjust margin-left with sidebar
        transition: 'margin-left 0.3s ease', // Smooth transition for margin-left
    }}>
                <Container>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                        sx={{ textAlign: { xs: 'center', sm: 'left' } }}
                    >
                        <img
                            src={logo2}
                            alt="Explorease"
                            style={{ height: '3em', marginLeft: '5px' }}
                        />
                        <Typography variant="body2">© 2024. All rights reserved.</Typography>
                        <Stack direction="row" spacing={3}>
                            <Link href="#" underline="hover" sx={{
            fontWeight: 'bold',
            position: 'relative',
            display: 'inline-block',
            '&::after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '2px',
            backgroundColor: '#111E56',
            bottom: '-2px',
            left: '0',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.3s ease-in-out',
        },
        '&:hover::after': {
            transform: 'scaleX(1)',
        },
    }}>
                                Terms & Conditions
                            </Link>
                            <Link href="#" underline="hover" sx={{
            fontWeight: 'bold',
            position: 'relative',
            display: 'inline-block',
            '&::after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '2px',
            backgroundColor: '#111E56',
            bottom: '-2px',
            left: '0',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.3s ease-in-out',
        },
        '&:hover::after': {
            transform: 'scaleX(1)',
        },
    }}>
                                Privacy Policy
                            </Link>
                            <Link href="#" underline="hover" sx={{
            fontWeight: 'bold',
            position: 'relative',
            display: 'inline-block',
            '&::after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '2px',
            backgroundColor: '#111E56',
            bottom: '-2px',
            left: '0',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.3s ease-in-out',
        },
        '&:hover::after': {
            transform: 'scaleX(1)',
        },
    }}>
                                Contact Us
                            </Link>
                        </Stack>
                    </Stack>
                </Container>
            </footer>
        </Box>
    );
};

export default TouristDashboard;
