import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TouristNavbar from '../MainPage-Components/GuestNavbar'; // Assuming you're reusing the same navbar
import UpdateProfile from './UpdateProfile';
import AddPhoto from './AddPhoto';

const TourGuideDashboard = () => {
    const [profile, setProfile] = useState({});
    const [message, setMessage] = useState('');
    const [activeComponent, setActiveComponent] = useState('profile'); // State to manage active component
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');  
            if (!token) {
                navigate('/login');  
            }
    
            try {
                const response = await axios.get('/tourguide/myProfile', {  // Placeholder endpoint
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                if (response.data && response.data.tourguide) {
                    setProfile(response.data.tourguide);
                } else {
                    setMessage('No profile data found');
                }
    
            } catch (error) {
                console.error('Error fetching profile:', error.response ? error.response.data : error.message);
                setMessage('Error fetching profile');
            }
        };
        fetchProfile();
    }, [navigate]);
    
    const ViewMyItineraries = () => {
        const [itineraries, setItineraries] = useState([]);
        const [message, setMessage] = useState('');
        const [editingItineraryId, setEditingItineraryId] = useState(null); // Track itinerary being edited
        const [updatedItineraryData, setUpdatedItineraryData] = useState({}); // Store updated itinerary data
        const [availableTags, setAvailableTags] = useState([]); // Set initial state as empty array
    
        // Fetch itineraries and available tags
        useEffect(() => {
            fetchItineraries();
            fetchAvailableTags(); // Fetch tags on component mount
        }, []);
    
        const fetchItineraries = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/tourguide/myItineraries', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (response.data && response.data.length > 0) {
                    setItineraries(response.data);
                } else {
                    setMessage('No itineraries found');
                }
            } catch (error) {
                setMessage('Error fetching itineraries');
                console.error('Error fetching itineraries:', error);
            }
        };
    
        const fetchAvailableTags = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/admins/getTags', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                // Ensure response is an array, or set as an empty array
                setAvailableTags(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error fetching tags:', error);
                setAvailableTags([]); // Set to empty array on error
            }
        };
    
        const handleDeleteItinerary = async (id) => {
            const confirmDelete = window.confirm('Are you sure you want to delete this itinerary?');
            if (!confirmDelete) return;
    
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/tourguide/deleteItinerary/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                // Update the state after deletion by refetching itineraries
                setItineraries(itineraries.filter((itinerary) => itinerary._id !== id));
                setMessage('Itinerary deleted successfully');
                fetchItineraries();
            } catch (error) {
                setMessage('Error deleting itinerary');
                console.error('Error deleting itinerary:', error);
            }
        };
    
        const handleEditClick = (itinerary) => {
            const selectedTagIds = itinerary.tags.map(tag => tag._id); // Get the IDs of the selected tags
            setEditingItineraryId(itinerary._id);
            setUpdatedItineraryData({ ...itinerary, tags: selectedTagIds }); // Pre-fill update form with existing data including tags
        };
    
        const handleInputChange = (e, field) => {
            setUpdatedItineraryData({ ...updatedItineraryData, [field]: e.target.value });
        };
    
        const handleTagChange = (e) => {
            const selectedTags = Array.from(e.target.selectedOptions, (option) => option.value);
            setUpdatedItineraryData({ ...updatedItineraryData, tags: selectedTags });
        };

        const handleActivate = async (id) => {
            const token = localStorage.getItem('token');
        
            try {
                await axios.put(`/tourguide/activateItinerary/${id}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMessage('Itinerary activated successfully');
                await fetchItineraries(); // Refetch itineraries to update UI
            } catch (error) {
                console.error('Error activating itinerary:', error.response ? error.response.data : error.message);
                setMessage('Error activating itinerary');
            }
        };
           

        const handleDeactivate = async (id) => {
            const confirmDe = window.confirm('Are you sure you want to deactivate this itinerary?');
            if (!confirmDe) return; // Exit function if user cancels
        
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Authorization token missing. Please log in again.');
                return;
            }
        
            try {
                // Notice the empty object `{}` as the second parameter to indicate no data is being sent
                await axios.put(`/tourguide/deactivateItinerary/${id}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMessage('Itinerary deactivated successfully');
                await fetchItineraries(); // Refetch itineraries to update UI
            } catch (error) {
                console.error('Error Deactivating itinerary:', error.response ? error.response.data : error.message);
                setMessage('Error Deactivating itinerary');
            }
        };
          
    
        const handleUpdateSubmit = async (id) => {
            console.log('Updated Itinerary Data:', updatedItineraryData); // Log data before making request
            try {
                const token = localStorage.getItem('token');
                await axios.put(`/tourguide/updateItinerary/${id}`, updatedItineraryData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                setMessage('Itinerary updated successfully');
                setEditingItineraryId(null); // Exit edit mode
                fetchItineraries(); // Refetch itineraries to update UI
            } catch (error) {
                console.error('Error updating itinerary:', error.response ? error.response.data : error.message);
                setMessage('Error updating itinerary');
            }
        };
    
        const renderItineraryCards = () => {
            if (!Array.isArray(itineraries) || itineraries.length === 0) {
                return <p>No itineraries available</p>;
            }
    
            return itineraries.map((itinerary) => (
                <div key={itinerary._id} className="itinerary-card" style={cardStyle}>
                    {editingItineraryId === itinerary._id ? (
                        <>
                            {/* Render editable fields */}
                            <input
                                type="text"
                                value={updatedItineraryData.name}
                                onChange={(e) => handleInputChange(e, 'name')}
                                placeholder="Itinerary Name"
                                style={inputStyle}
                            />
                            <input
                                type="text"
                                value={updatedItineraryData.PickUpLocation}
                                onChange={(e) => handleInputChange(e, 'PickUpLocation')}
                                placeholder="Pick Up Location"
                                style={inputStyle}
                            />
                            <input
                                type="text"
                                value={updatedItineraryData.DropOffLocation}
                                onChange={(e) => handleInputChange(e, 'DropOffLocation')}
                                placeholder="Drop Off Location"
                                style={inputStyle}
                            />
                            <input
                                type="text"
                                value={updatedItineraryData.AvailableDates.join(', ')}
                                onChange={(e) => handleInputChange(e, 'AvailableDates')}
                                placeholder="Available Dates"
                                style={inputStyle}
                            />
    
                            {/* Tag selection */}
                            <label>Tags</label>
                            <select
                                multiple
                                name="tags"
                                value={updatedItineraryData.tags || []}
                                onChange={handleTagChange}
                                style={inputStyle}
                            >
                                {/* Ensure availableTags is an array before mapping */}
                                {Array.isArray(availableTags) && availableTags.length > 0
                                    ? availableTags.map((tag) => (
                                          <option key={tag._id} value={tag._id}>
                                              {tag.name}
                                          </option>
                                      ))
                                    : <option disabled>No tags available</option>
                                }
                            </select>
    
                            <button onClick={() => handleUpdateSubmit(itinerary._id)} style={buttonStyle}>
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Render normal fields */}
                            <h3>{itinerary.name}</h3>
                            <p><strong>Total Price:</strong> ${itinerary.totalPrice}</p>
                            <p><strong>Available Dates:</strong> {itinerary.AvailableDates.join(', ')}</p>
                            <p><strong>Pick Up Location:</strong> {itinerary.PickUpLocation}</p>
                            <p><strong>Drop Off Location:</strong> {itinerary.DropOffLocation}</p>
    
                            {/* Add Delete Button */}
                            <button
                                onClick={() => handleDeleteItinerary(itinerary._id)}
                                style={deleteButtonStyle}
                            >
                                Delete Itinerary
                            </button>
    
                            {/* Add Update Button */}
                            <button
                                onClick={() => handleEditClick(itinerary)}
                                style={buttonStyle}
                            >
                                Update Itinerary
                            </button>
                            <p> </p>
                            {/* Conditionally render the "Activate" button if itinerary.isActivated is false */}
                            {!itinerary.isActivated && (
                                <button 
                                    onClick={() => handleActivate(itinerary._id)}
                                    style={buttonStyle2}
                                >
                                    Activate
                                </button>
                            )}
                            <button onClick={() => handleDeactivate(itinerary._id)}
                                style={deleteButtonStyle}
                                >
                                    Deactivate
                            </button>
                                

                        </>
                    )}
                </div>
            ));
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
            marginBottom: '20px',
        };
    
        const inputStyle = {
            padding: '10px',
            marginBottom: '10px',
            width: '100%',
        };
        const buttonStyle2 = {
            padding: '10px 15px',
            backgroundColor: '#33dd33',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
            marginTop: '10px',
            marginRight: '10px', // Add some space between delete and update buttons
        };

        const buttonStyle = {
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
            marginTop: '10px',
        };
    
        const deleteButtonStyle = {
            padding: '10px 15px',
            backgroundColor: '#ff4d4d',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
            marginTop: '10px',
            marginRight: '10px', // Add some space between delete and update buttons
        };
    
        return (
            <div style={{ padding: '20px' }}>
                <h2>My Itineraries</h2>
                {message && <p>{message}</p>}
                <div className="itinerary-list">{renderItineraryCards()}</div>
            </div>
        );
    };
    
    
        

    const CreateItineraryForm = () => {
        const [activities, setActivities] = useState([]); // Initialize as an empty array
        const [tags, setTags] = useState([]); // Initialize as an empty array
        const [itineraryData, setItineraryData] = useState({
            name: '',
            activities: [],
            timeline: '',
            LanguageOfTour: '',
            AvailableDates: '',
            AvailableTimes: '',
            accessibility: '',
            PickUpLocation: '',
            DropOffLocation: '',
            tags: []
        });
        const [message, setMessage] = useState('');
        const [success, setSuccess] = useState(false);
    
        // Fetch activities and tags for the form
        useEffect(() => {
            const fetchActivitiesAndTags = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const activityResponse = await axios.get('/tourists/activities', { // Corrected endpoint
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const tagResponse = await axios.get('/admins/getTags', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    console.log('Tag Response:', tagResponse.data);

    
                    // Ensure both activities and tags are arrays, or set them as empty arrays
                    setActivities(Array.isArray(activityResponse.data) ? activityResponse.data : []);
                    setTags(Array.isArray(tagResponse.data) ? tagResponse.data : []);
                } catch (error) {
                    console.error('Error fetching activities or tags', error);
                }
            };
    
            fetchActivitiesAndTags();
        }, []);
    
    
        // Handle form input changes
        const handleChange = (e) => {
            setItineraryData({ ...itineraryData, [e.target.name]: e.target.value });
        };
    
        // Handle array field changes (activities and tags)
        const handleArrayChange = (e, field) => {
            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
            setItineraryData({ ...itineraryData, [field]: selectedOptions });
        };
    
        // Handle form submission
        const handleSubmit = async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('token');
    
            try {
                await axios.post('/tourguide/createItinerary', itineraryData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
    
                setMessage('Itinerary created successfully!');
                setSuccess(true);
            } catch (error) {
                console.error('Error creating itinerary:', error);
                setMessage('Failed to create itinerary');
                setSuccess(false);
            }
        };
    
        return (
            <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <h2>Create Itinerary</h2>
                {message && (
                    <p style={{ color: success ? 'green' : 'red', marginBottom: '20px' }}>
                        {message}
                    </p>
                )}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Itinerary Name</label>
                        <input
                            type="text"
                            name="name"
                            value={itineraryData.name}
                            onChange={handleChange}
                            required
                            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                        />
                    </div>
                   
                    <div>
                        <label>Language of Tour</label>
                        <input
                            type="text"
                            name="LanguageOfTour"
                            value={itineraryData.LanguageOfTour}
                            onChange={handleChange}
                            required
                            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                        />
                    </div>
                    <div>
                        <label>Available Dates</label>
                        <input
                            type="text"
                            name="AvailableDates"
                            value={itineraryData.AvailableDates}
                            onChange={handleChange}
                            required
                            placeholder="Format: YYYY-MM-DD, comma-separated"
                            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                        />
                    </div>
                    <div>
                        <label>Available Times</label>
                        <input
                            type="text"
                            name="AvailableTimes"
                            value={itineraryData.AvailableTimes}
                            onChange={handleChange}
                            required
                            placeholder="Format: HH:MM, comma-separated"
                            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                        />
                    </div>
                    <div>
                        <label>Pick Up Location</label>
                        <input
                            type="text"
                            name="PickUpLocation"
                            value={itineraryData.PickUpLocation}
                            onChange={handleChange}
                            required
                            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                        />
                    </div>
                    <div>
                        <label>Drop Off Location</label>
                        <input
                            type="text"
                            name="DropOffLocation"
                            value={itineraryData.DropOffLocation}
                            onChange={handleChange}
                            required
                            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                        />
                    </div>
                    <div>
                        <label>Accessibility</label>
                        <input
                            type="text"
                            name="accessibility"
                            value={itineraryData.accessibility}
                            onChange={handleChange}
                            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                        />
                    </div>
                    <div>
                        <label>Activities</label>
                        <select
                            multiple
                            name="activities"
                            value={itineraryData.activities}
                            onChange={(e) => handleArrayChange(e, 'activities')}
                            required
                            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                        >
                            {activities.length > 0 ? activities.map(activity => (
                                <option key={activity._id} value={activity._id}>{activity.name}</option>
                            )) : <option disabled>No activities available</option>}
                        </select>
                    </div>
                    <div>
                        <label>Tags</label>
                        <select
                            multiple
                            name="tags"
                            value={itineraryData.tags}
                            onChange={(e) => handleArrayChange(e, 'tags')}
                            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
                        >
                            {tags.length > 0 ? tags.map(tag => (
                                <option key={tag._id} value={tag.name}>{tag.name}</option>
                            )) : <option disabled>No tags available</option>}
                        </select>
                    </div>
                    <button
                        type="submit"
                        style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', width: '100%' }}
                    >
                        Create Itinerary
                    </button>
                </form>
            </div>
        );
    };

    // Sidebar and content layout
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

    // Styling for the profile card
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
        switch        (activeComponent) {
            case 'profile':
                return (
                    <>
                        <h2 style={{ textAlign: 'center', marginBottom: '20px'}}>Tour Guide Profile</h2>
                        {message && <p style={{ textAlign: 'center', color: 'red' }}>{message}</p>}
                        {profile && profile.username ? (
                            <div style={cardStyle}>
                                {profile.imageUrl && (
                                    <img
                                        src={profile.imageUrl}
                                        alt="Profile"
                                        style={{
                                            width: '300px',
                                            height: '300px',
                                            borderRadius: '80%',
                                            marginBottom: '10px'
                                        }}
                                    />
                                )}
                                <p><span style={labelStyle}>Username:</span> <span style={valueStyle}>{profile.username}</span></p>
                                <p><span style={labelStyle}>Email:</span> <span style={valueStyle}>{profile.email}</span></p>
                                <p><span style={labelStyle}>Years Of Experience:</span> <span style={valueStyle}>{profile.yearsOfExperience}</span></p>
                                <p><span style={labelStyle}>Mobile Number:</span> <span style={valueStyle}>{profile.mobileNumber}</span></p>
                            </div>
                        ) : (
                            <p>Loading profile...</p>
                        )}
                    </>
                );
            case 'viewActivities':
                return <ViewMyItineraries />;  // Correct return for itineraries
            case 'createActivity':
                return <CreateItineraryForm />
            case 'updateProfile':
                return <UpdateProfile profile={profile} setProfile={setProfile}/>;
            case 'uploadProfilePicture':
                return <AddPhoto setProfile = {setProfile} /> // Placeholder for the update itinerary component
            default:
                return <h2>Welcome to the Tour Guide Dashboard</h2>;
        }
    };

    return (
        <div>
            <TouristNavbar /> 

            <div style={sidebarStyle}>
                <h3>Dashboard</h3>
                <ul style={{ listStyleType: 'none', padding: '0' }}>
                    <li onClick={() => setActiveComponent('profile')} style={{ cursor: 'pointer', marginBottom: '10px' }}>View Profile</li>
                    <li onClick={() => setActiveComponent('viewActivities')} style={{ cursor: 'pointer', marginBottom: '10px' }}>View My Itineraries</li>
                    <li onClick={() => setActiveComponent('createActivity')} style={{ cursor: 'pointer', marginBottom: '10px' }}>Create An Itinerary</li>
                    <li onClick={() => setActiveComponent('updateProfile')} style={{ cursor: 'pointer', marginBottom: '10px' }}>Update Profile</li>
                    <li onClick={() => setActiveComponent('uploadProfilePicture')} style={{ cursor: 'pointer', marginBottom: '10px' }}>Upload Profile Picture</li>

                </ul>
            </div>

            <div style={contentStyle}>
                {renderContent()}
            </div>
        </div>
    );
};

export default TourGuideDashboard;

