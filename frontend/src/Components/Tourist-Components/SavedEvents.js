import React, { useEffect, useState , useContext } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    Alert,
    Tooltip,
    CircularProgress,
    Divider, 
} from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import { CurrencyContext } from './CurrencyContext';
// import BookIcon from '@mui/icons-material/Book';
// import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

// const mapContainerStyle = {
//     width: '100%',
//     height: '150px',
// };

const SavedEvents = ({setActiveComponent}) => {
    const [savedActivities, setSavedActivities] = useState([]);
    const [savedItineraries, setSavedItineraries] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);  // Add loading state
    const [bookedActivities, setBookedActivities] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [bookedItineraries, setBookedItineraries] = useState([]);


    // const { isLoaded } = useLoadScript({
    //     googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your Google Maps API key
    // });

    const { selectedCurrency, exchangeRates } = useContext(CurrencyContext); // Use CurrencyContext

    const fetchSavedActivities = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/saved-activity', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSavedActivities(response.data.activities || []);
        } catch (error) {
            setMessage('Error fetching saved activities');
            console.error('Error fetching saved activities:', error);
        }
    };

    const handleBookItinerary = (itinerary) => {
        if (walletBalance === null || isNaN(walletBalance)) {
            setErrorMessage('Error: Wallet balance is not available.');
            return;
        }

        setActiveComponent('PayForItinerary');
    };

    const convertPrice = (price) => {
        return (price * (exchangeRates[selectedCurrency] || 1)).toFixed(2);
      };

    const fetchSavedItineraries = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/saved-itineraries', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSavedItineraries(response.data.itineraries || []);
        } catch (error) {
            setMessage('Error fetching saved itineraries');
            console.error('Error fetching saved itineraries:', error);
        }
    };

    const fetchWalletBalance = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/tourists/myProfile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWalletBalance(response.data.wallet || 0);
        } catch (error) {
            setMessage('Error fetching wallet balance');
            console.error('Error fetching wallet balance:', error);
        }
    };
    const handleUnbookmark = async (type, id) => {
        try {
            const token = localStorage.getItem('token');
            const endpoint = type === 'activity' ? `/tourists/saved-activity/${id}` : `/tourists/saved-itineraries/${id}`;
            await axios.delete(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMessage(`${type === 'activity' ? 'Activity' : 'Itinerary'} removed from saved!`);

            if (type === 'activity') {
                setSavedActivities(savedActivities.filter((item) => item._id !== id));
            } else {
                setSavedItineraries(savedItineraries.filter((item) => item._id !== id));
            }
        } catch (error) {
            setMessage(`Error removing ${type}`);
            console.error(`Error removing ${type}:`, error);
        }
    };

    // const handleBookActivity = async (activity) => {
    //     if (walletBalance < activity.price) {
    //         setMessage('Insufficient wallet balance!');
    //         return;
    //     }
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await axios.post(`/tourists/activities/book/${activity._id}`, {}, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         setWalletBalance(response.data.walletBalance);
    //         setMessage('Activity booked successfully!');
    //     } catch (error) {
    //         setMessage('Error booking activity');
    //         console.error('Error booking activity:', error);
    //     }
    // };


    const handleBookActivity = (activity) => {
        if(bookedActivities.includes(activity._id)){
            setTimeout(() => setMessage("Activity already booked."), 2000);
            return;
        }
        if (walletBalance === null || isNaN(walletBalance)) {
            setErrorMessage('Error: Wallet balance is not available.');
            return;
        }
        setActiveComponent('PayForActivity');
    };
    

    useEffect(() => {
        setLoading(true); // Start loading
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchSavedActivities(),
                    fetchSavedItineraries(),
                    fetchWalletBalance(),
                ]);
            } catch (error) {
                setMessage('Error fetching data');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // End loading after all fetches are done
            }
        };

        const fetchBookedActivities = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/tourists/activities/booked/booked-activities', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(response);
                if (response.data.success) {
                    setBookedActivities(response.data.activityIds); // Save activity IDs
                }
            } catch (error) {
                console.error('Error fetching booked activities:', error);
            } finally {
                setLoading(false);
            }
        };
        const fetchBookedItineraries = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/tourists/itineraries/booked/booked-itineraries', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(response);
                setBookedItineraries(response.data.itineraryIds);
    
          
            } catch (error) {
                console.error('Error fetching booked activities:', error);
            }
        };
        fetchBookedItineraries();
        fetchBookedActivities(); // Trigger data fetching
        fetchData(); // Trigger data fetching
    }, []);
    
    return (
            <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                {message && <Alert severity="info" sx={{ mt : 2, mb: 2 }}>{message}</Alert>}
                {/* Show loading spinner if data is still loading */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <CircularProgress sx={{color:'#111E56'}} />
                </Box>
            ) : (
                <>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#111E56', marginBottom: '50px' }}>
                    Saved Activities
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                    {savedActivities.length > 0 ? (
                        savedActivities.map((activity) => (
<Card
        key={activity._id}
        sx={{
            display: 'flex',
            width: '800px',
            maxWidth: '1200px', // Set a max-width for larger screens
            boxShadow: 3,
            
            borderRadius: 2,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
            },
            height: '300px',
        }}

    >
        {/* Left Section: Image */}
        <Box 
                sx={{ 
                    flex: '1 1 35%', 
                    marginRight: 2, 
                    display: 'flex', 
                    alignItems: 'stretch' ,
                    height:'100%',
                    
                }}
            >
            {activity.imageUrl && (
                <img
                    src={activity.imageUrl}
                    alt={activity.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderBottomLeftRadius:'8px',
                        borderTopLeftRadius:'8px',
                    }}
                    // onClick={() => handleOpenReviewModal(activity._id)}
                />
            )}
        </Box>
    
        {/* Center Section: Details and Action Buttons */}
        <Box 
                sx={{ 
                    flex: '1 1 30%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between' 
                }}
            >
            <CardContent sx={{ padding: 0 }}>
                <Typography
                    variant="h5"
                    sx={{
                        color: '#111E56',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        marginTop: '10px',
                        textAlign: 'center',
                    }}
                >
                    {activity.name}
                </Typography>
                <Typography sx={{marginBottom: '5px',}}><strong style={{fontWeight:'bold' , color:'#111E56'}}>Date:</strong> {new Date(activity.date).toLocaleDateString()}</Typography>
                <Typography sx={{marginBottom: '5px',}}><strong style={{fontWeight:'bold' , color:'#111E56'}}>Time:</strong> {activity.time}</Typography>
                <Typography sx={{marginBottom: '5px',}}><strong style={{fontWeight:'bold' , color:'#111E56'}}>Price:</strong> {convertPrice(activity.price)} {selectedCurrency}</Typography>
                <Typography sx={{marginBottom: '5px',}}><strong style={{fontWeight:'bold' , color:'#111E56'}}>Category:</strong> {activity.category?.name}</Typography>
                {activity.tags && (
                    <Typography sx={{marginBottom: '5px',}}><strong style={{fontWeight:'bold' , color:'#111E56'}}>Tags:</strong> {activity.tags.map(tag => tag.name).join(', ')}</Typography>
                )}
                <Typography sx={{marginBottom: '5px',}}><strong style={{fontWeight:'bold' , color:'#111E56'}}>Special Discounts:</strong> {activity.specialDiscounts}</Typography>
            </CardContent>
    
            {/* Action Buttons */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    padding: 1,
                    marginTop: 0,
                    marginBottom: 1,
                }}
            >
                <Tooltip title="Unbookmark">
<IconButton
    onClick={() => handleUnbookmark('activity',activity._id)}
    sx={{
        backgroundColor: '#FF5733',
        color: 'white',
        '&:hover': {
            backgroundColor: '#FF7961',
            color: 'black',
        },
    }}
>
    <BookmarkRemoveIcon />
</IconButton>
</Tooltip>
<Tooltip title={bookedActivities.includes(activity._id) ? "Already booked" : "Book Now"}>
                    <IconButton
                        onClick={() =>handleBookActivity(activity)}
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
                        //disabled={bookedActivities.includes(activity._id) || loading} // Disable if booked or loading
                    >
                        <BookIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    
        {/* Right Section: Map */}
         <Box 
                sx={{ 
                    flex: '1 1 35%', 
                    marginLeft: 2, 
                    display: 'flex', 
                    alignItems: 'stretch', 
                    overflow: 'hidden', 
                    objectFit: 'cover',
                    height: '100%',
                }}
            >
                <iframe
                    title='activity-location'
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 ,borderBottomRightRadius:'8px',
                        borderTopRightRadius:'8px', height:'100%'}}
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDUP5fw3jw8bvJ7yj9OskV5wdm5sNUbII4&q=${encodeURIComponent(
                        activity.location
                    )}`}
                    allowFullScreen
                ></iframe>
        </Box>
    </Card>
    
// {/* <Tooltip title="Unbookmark">
// <IconButton
//     onClick={() => handleUnbookmark('activity',activity._id)}
//     sx={{
//         backgroundColor: '#FF5733',
//         color: 'white',
//         '&:hover': {
//             backgroundColor: '#FF7961',
//             color: 'black',
//         },
//     }}
// >
//     <BookmarkRemoveIcon />
// </IconButton>
// </Tooltip> */}
                        ))
                    ) : (
                        <Typography>No saved activities available</Typography>
                    )}
                </Box>
        
                {/* Saved Itineraries Section */}
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#111E56', marginTop: '50px' }}>
                    Saved Itineraries
                </Typography>
        
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                    {savedItineraries.length > 0 ? (
                        savedItineraries.map((itinerary) => (
                            <Card
                    key={itinerary._id}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',  // Change to column for horizontal division
                        width: '500px',
                        boxShadow: 3,
                        marginBottom: '20px',
                        borderRadius: '12px',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.03)',
                            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                        },
                    }}
                >
                    {/* Image */}
                    {/* <Box
                            sx={{
                                height: '200px',
                                width: '100%',
                                overflow: 'hidden',
                                borderRadius: 2,
                                marginBottom: 2,
                                objectFit: 'cover',
                            }}
                        > */}
                            {itinerary.imageUrl && (
                                <img
                                    src={itinerary.imageUrl}
                                    alt={itinerary.name}
                                    style={{
                                        width: '100%',
                                        height: '60%',
                                        objectFit: 'cover',
                                        
                                        marginBottom: '10px',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px',

                                    }}
                                />
                            )}
                        {/* </Box> */}
                    {/* Top Section: Image and Details */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        
                
                        {/* Details */}
                        <CardContent sx={{ padding: 0 }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: '#111E56',
                                    fontWeight: 'bold',
                                    marginBottom: '10px',
                                    textAlign: 'center',
                                }}
                            >
                                {itinerary.name}
                            </Typography>
                            <Typography><strong style={{fontWeight:'bold' , color:'#111E56'}}>Total Price:</strong> {convertPrice(itinerary.totalPrice)} {selectedCurrency}</Typography>
                            <Typography><strong style={{fontWeight:'bold' , color:'#111E56'}}>Languages:</strong> {itinerary.LanguageOfTour.join(', ')}</Typography>
                            <Typography><strong style={{fontWeight:'bold' , color:'#111E56'}}>Date :</strong> {new Date(itinerary.AvailableDates[0]).toLocaleDateString()}</Typography>
                        </CardContent>
                    </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-around', padding: 1, marginBottom:'10px' }}>
                                    
                                    <Tooltip title="Unbookmark">
                                        <IconButton
                                            onClick={() => handleUnbookmark('itinerary', itinerary._id)}
                                            sx={{
                                                backgroundColor: '#FF5733',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#FF7961',
                                                    color: 'black',
                                                },
                                            }}
                                        >
                                            <BookmarkRemoveIcon />
                                        </IconButton>
                                    </Tooltip>
                                    {/* <Divider orientation="horizontal" flexItem />
                                    <Divider orientation="horizontal" flexItem /> */}
                                    {/* <Divider orientation="vertical" flexItem /> */}
                                    <Tooltip title={bookedItineraries.includes(itinerary._id) ? "Already booked" : "Book Now"}>
                                        <IconButton
                                            onClick={() => handleBookItinerary(itinerary)}
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
                                            //disabled={bookedActivities.includes(activity._id) || loading} // Disable if booked or loading
                                        >
                                            <BookIcon />
                                        </IconButton>
                                    </Tooltip>

                                </Box>
                            </Card>
                        ))
                    ) : (
                        <Typography>No saved itineraries available</Typography>
                    )}
                </Box>
                </>
            )}
            </Box>
        );        
};

export default SavedEvents;
