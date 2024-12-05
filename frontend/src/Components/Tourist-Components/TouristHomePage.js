import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CardMedia, CircularProgress, Chip, Tooltip, IconButton, Dialog } from '@mui/material';
import Carousel from 'react-multi-carousel'; // Carousel library
import 'react-multi-carousel/lib/styles.css'; // Carousel styles
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const TouristHomePage = ({profile}) => {
    const [activities, setActivities] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [historicalPlaces, setHistoricalPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedType, setSelectedType] = useState('');
    
    const [formProfile, setFormProfile] = useState(profile);


    const handleOpenPopup = (item, type) => {
        setSelectedItem(item);
        setSelectedType(type);
    };
    
    const handleClosePopup = () => {
        setSelectedItem(null);
        setSelectedType('');
    };
    
    

    const fetchWelcomeData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const [activitiesResponse, itinerariesResponse, historicalPlacesResponse] = await Promise.all([
                axios.get('/tourists/activities', { headers }),
                axios.get('/tourists/itineraries', { headers }),
                axios.get('/tourists/historical-places', { headers }),
            ]);

            setActivities(activitiesResponse.data);
            setItineraries(itinerariesResponse.data);
            setHistoricalPlaces(historicalPlacesResponse.data);
        } catch (error) {
            console.error('Error fetching welcome data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWelcomeData();
    }, []);

    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 6 },
        LargeDesktop: { breakpoint: { max: 2000, min: 1024 }, items: 4},
        desktop: { breakpoint: { max: 1024, min: 768 }, items: 3},
        tablet: { breakpoint: { max: 768, min: 464 }, items: 1 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
    };

    const placeholderImage =
        'https://worldwildschooling.com/wp-content/uploads/2024/01/Matterhorn_Mumemories_Adobe-Stock-Photo_682931585.jpg';

        const renderActivityCard = (activity) => (
            <Card
                key={activity._id}
                onClick={() => handleOpenPopup(activity, 'Activity')} // Open popup
                sx={{
                    margin: '10px',
                    marginBottom : '30px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
                    },
                    width: 350, // Fixed width
                    height: 300, // Fixed height
                }}
            >
                <CardMedia
                    component="img"
                    height="140"
                    image={placeholderImage} // Check for empty or blank string
                    alt="Activity Image"
                    sx={{
                        height: "70%",
                        width: "100%",
                        objectFit: "cover", // Ensures image scales properly
                      }}
                />
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#111E56' }}>
                        {activity.name || 'Untitled'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Date: {new Date(activity.date).toLocaleDateString()}
                    </Typography>
                </CardContent>
            </Card>
        );
        
        const renderItineraryCard = (itinerary) => (
            <Card
                key={itinerary._id}
                onClick={() => handleOpenPopup(itinerary, 'Itinerary')} // Open popup
                sx={{
                    margin: '10px',
                    marginBottom : '30px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
                    },
                    width: 350, // Fixed width
                    height: 300, // Fixed height
                }}
            >
                <CardMedia
                    component="img"
                    height="140"
                    image={itinerary.imageUrl || placeholderImage}
                    alt="Itinerary Image"
                    sx={{
                        height: "70%",
                        width: "100%",
                        objectFit: "cover", // Ensures image scales properly
                      }}
                />
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#111E56' }}>
                        {itinerary.name || 'Untitled'}
                    </Typography>
                </CardContent>
            </Card>
        );
        
        const renderHistoricalPlaceCard = (place) => (
            <Card
                key={place._id}
                onClick={() => handleOpenPopup(place, 'Historical Place')} // Open popup
                sx={{
                    margin: '10px',
                    marginBottom : '30px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
                    },
                    width: 350, // Fixed width
                    height: 300, // Fixed height
                }}
            >
                <CardMedia
                    component="img"
                    height="140"
                    image={place.imageUrl || placeholderImage}
                    alt="Historical Place Image"
                    sx={{
                        height: "70%",
                        width: "100%",
                        objectFit: "cover", // Ensures image scales properly
                      }}
                />
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#111E56' }}>
                        {place.Name || 'Untitled'}
                    </Typography>
                </CardContent>
            </Card>
        );
        

    const renderDetailsPopup = () => (
        <Dialog
            open={!!selectedItem}
            onClose={handleClosePopup}
            maxWidth="md"
            fullWidth
        >
            <Box sx={{ display: 'flex', flexDirection: 'row', height: '400px' }}>
                
                {/* Left Section: Image */}
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    <img
                        src={selectedItem?.imageUrl || placeholderImage}
                        alt="Item Detail"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '8px 0 0 8px',
                        }}
                    />
                </Box>
    
                {/* Right Section: Details */}
                <Box sx={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#111E56' }}>
                        {selectedItem?.name || 'Untitled'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '10px' }}>
                        {selectedItem?.description || 'No description available.'}
                    </Typography>
                    {/* Additional Details */}
                    {selectedType === 'Activity' && (
                        <>
                            <Typography variant="body2">
                                <strong>Date:</strong> {new Date(selectedItem.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Tags:</strong> {selectedItem.tags?.map(tag => tag.name).join(', ') || 'N/A'}
                            </Typography>
                        </>
                    )}
                    {selectedType === 'Itinerary' && (
                        <>
                            <Typography variant="body2">
                                <strong>Activities:</strong>{' '}
                                {selectedItem.activities?.map(activity => activity.name).join(', ') || 'N/A'}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Available Dates:</strong>{' '}
                                {selectedItem.AvailableDates?.map(date =>
                                    new Date(date).toLocaleDateString()
                                ).join(', ') || 'N/A'}
                            </Typography>
                        </>
                    )}
                    {selectedType === 'Historical Place' && (
                        <>
                            <Typography variant="body2">
                                <strong>Ticket Prices:</strong>
                                <ul>
                                    <li>Foreigner: ${selectedItem.TicketPrices?.foreigner || 'N/A'}</li>
                                    <li>Native: ${selectedItem.TicketPrices?.native || 'N/A'}</li>
                                    <li>Student: ${selectedItem.TicketPrices?.student || 'N/A'}</li>
                                </ul>
                            </Typography>
                        </>
                    )}
                </Box>
            </Box>
        </Dialog>
    );
    

    // const renderItineraryCard = (itinerary) => (
    //     <Card
    //         key={itinerary._id}
    //         sx={{
    //             margin: '10px',
    //             marginBottom : '25px',
    //             borderRadius: '10px',
    //             boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    //             transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    //             '&:hover': {
    //                 transform: 'scale(1.05)',
    //                 boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
    //             },
    //         }}
    //     >
    //         <CardMedia
    //             component="img"
    //             height="140"
    //             image={itinerary.imageUrl || placeholderImage}
    //             alt="Itinerary Image"
    //         />
    //         <CardContent>
    //             <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#111E56' }}>
    //                 {itinerary.name || 'Untitled'}
    //             </Typography>
    //             <Typography variant="body2" color="text.secondary">
    //               <span style={{marginLeft : '2em'}}><strong>Activities:</strong></span>   {itinerary.activities?.map((a) => a.name).join(', ') || 'N/A'}
    //             </Typography>
    
    //             {/* Available Dates Section */}
    //             <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
    //                 <CalendarTodayIcon sx={{ color: '#111E56' }} />
    //                 {itinerary.AvailableDates && itinerary.AvailableDates.length > 0 ? (
    //                     <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
    //                         {itinerary.AvailableDates.map((date, index) => (
    //                             <Tooltip key={index} title={`Available Date: ${new Date(date).toLocaleDateString()}`} arrow>
    //                                 <Chip
    //                                     label={new Date(date).toLocaleDateString()}
    //                                     sx={{
    //                                         backgroundColor: '#E0E7FF',
    //                                         color: '#111E56',
    //                                         fontSize: '12px',
    //                                         fontWeight: 'bold',
    //                                     }}
    //                                 />
    //                                 {/* Each date shown as a chip */}
    //                             </Tooltip>
    //                         ))}
    //                     </Box>
    //                 ) : (
    //                     <Typography variant="body2" color="text.secondary">
    //                         No available dates.
    //                     </Typography>
    //                 )}
    //             </Box>
    //         </CardContent>
    //     </Card>
    // );
    
    // const renderHistoricalPlaceCard = (place) => (
    //     <Card
    //         key={place._id}
    //         sx={{
    //             margin: '10px',
    //             marginBottom : '25px',
    //             borderRadius: '10px',
    //             boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    //             transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    //             '&:hover': {
    //                 transform: 'scale(1.05)',
    //                 boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
    //             },
    //         }}
    //     >
    //         <CardMedia
    //             component="img"
    //             height="140"
    //             image={place.imageUrl || placeholderImage}
    //             alt="Historical Place Image"
    //         />
    //         <CardContent>
    //             <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#111E56' }}>
    //                 {place.Name || 'Untitled'}
    //             </Typography>
    //             <Typography variant="body2" color="text.secondary">
    //                 {place.Description || 'No description available.'}
    //             </Typography>
    //             <Typography variant="body2" color="text.secondary">
    //                 Ticket Prices:
    //                 <ul>
    //                     <li>Foreigner: ${place.TicketPrices?.foreigner || 'N/A'}</li>
    //                     <li>Native: ${place.TicketPrices?.native || 'N/A'}</li>
    //                     <li>Student: ${place.TicketPrices?.student || 'N/A'}</li>
    //                 </ul>
    //             </Typography>
    //             <Tooltip title="View on Map">
    //                 <IconButton>
    //                     <LocationOnIcon sx={{ color: '#111E56' }} />
    //                 </IconButton>
    //             </Tooltip>
    //         </CardContent>
    //     </Card>
    // );

    return (
        <Box
    sx={{
        padding: 0, // Remove padding
        margin: 0, // Remove margin
        overflowX: 'hidden', // Prevent horizontal scroll
    }}
>
    <Typography
        variant="h4"
        sx={{ fontWeight: 'bold', color: '#111E56', marginBottom: '10px', textAlign: 'left' }}
    >
        Welcome, {profile.username}
    </Typography>
    {loading ? (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
            }}
        >
            <CircularProgress size={50} sx={{ color: '#111E56' }} />
        </Box>
    ) : (
        <>
            {/* Itineraries Section */}
            <Box sx={{ padding: '0 0', marginBottom: '40px' }} >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        color: '#111E56',
                        textAlign: 'left',

                    }}
                >
                    Popular Itineraries
                </Typography>
                <Carousel responsive={responsive}>
                    {itineraries.map(renderItineraryCard)}
                </Carousel>
            </Box>

            {/* Activities Section */}
            <Box sx={{ padding: '0', marginBottom: '20px' }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        color: '#111E56',
                        textAlign: 'left',
                    }}
                >
                    Featured Activities
                </Typography>
                <Carousel responsive={responsive}>
                    {activities.map(renderActivityCard)}
                </Carousel>
            </Box>

            {/* Historical Places Section */}
            <Box sx={{ padding: ' 0', marginBottom: '20px' }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        color: '#111E56',
                        textAlign: 'left',

                    }}
                >
                    Explore Historical Places
                </Typography>
                <Carousel responsive={responsive}>
                    {historicalPlaces.map(renderHistoricalPlaceCard)}
                </Carousel>
            </Box>
        </>
    )}
    {renderDetailsPopup()}
</Box>

    );
};


export default TouristHomePage;
