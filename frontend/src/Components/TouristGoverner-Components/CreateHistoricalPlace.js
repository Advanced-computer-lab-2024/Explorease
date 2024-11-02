import React, { useState } from 'react';
import axios from 'axios';

const CreateHistoricalPlace = () => {
    const [formData, setFormData] = useState({
        Name: '',
        Description: '',
        Location: '',
        OpeningHours: '',
        ClosingHours: '',
        TicketPrices: {
            foreigner: '',
            native: '',
            student: ''
        },
        Period: '',
        Type: '',  
        tags: ''
    });

    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    // Handle input changes for simple text fields
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle input changes for TicketPrices
    const handleTicketPriceChange = (e) => {
        setFormData({
            ...formData,
            TicketPrices: {
                ...formData.TicketPrices,
                [e.target.name]: e.target.value
            }
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('Please log in first.');
            return;
        }

        // Prepare tags as an array from a comma-separated string
        const tagsArray = formData.tags.split(',').map(tag => tag.trim());

        // Prepare the final form data
        const finalFormData = {
            ...formData,
            tags: tagsArray
        };

        try {
            const response = await axios.post('/governor/createHistoricalPlace', finalFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                setSuccess(true);
                setMessage('Historical Place created successfully!');
                // Reset the form after successful submission
                setFormData({
                    Name: '',
                    Description: '',
                    Location: '',
                    OpeningHours: '',
                    ClosingHours: '',
                    TicketPrices: {
                        foreigner: '',
                        native: '',
                        student: ''
                    },
                    Period: '',
                    Type: '',  // Reset the Type field as well
                    tags: ''
                });
            } else {
                setMessage('Failed to create Historical Place.');
            }
        } catch (error) {
            setMessage(`Error creating Historical Place: ${error.response?.data?.message || error.message}`);
            console.error('Error:', error.response?.data || error.message);
        }
    };

    return (
        <div>
            <h2>Create Historical Place</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="Name"
                        value={formData.Name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="Description"
                        value={formData.Description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        name="Location"
                        value={formData.Location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Opening Hours:</label>
                    <input
                        type="text"
                        name="OpeningHours"
                        value={formData.OpeningHours}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Closing Hours:</label>
                    <input
                        type="text"
                        name="ClosingHours"
                        value={formData.ClosingHours}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Ticket Price (Foreigner):</label>
                    <input
                        type="number"
                        name="foreigner"
                        value={formData.TicketPrices.foreigner}
                        onChange={handleTicketPriceChange}
                        required
                    />
                </div>
                <div>
                    <label>Ticket Price (Native):</label>
                    <input
                        type="number"
                        name="native"
                        value={formData.TicketPrices.native}
                        onChange={handleTicketPriceChange}
                        required
                    />
                </div>
                <div>
                    <label>Ticket Price (Student):</label>
                    <input
                        type="number"
                        name="student"
                        value={formData.TicketPrices.student}
                        onChange={handleTicketPriceChange}
                        required
                    />
                </div>
                <div>
                    <label>Historical Period:</label>
                    <input
                        type="text"
                        name="Period"
                        value={formData.Period}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* New Type Field */}
                <div>
                    <label>Type:</label>
                    <select
                        name="Type"
                        value={formData.Type}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Monument">Monument</option>
                        <option value="Museum">Museum</option>
                        <option value="Religious Site">Religious Site</option>
                        <option value="Palace">Palace</option>
                        <option value="Castle">Castle</option>
                    </select>
                </div>

                <div>
                    <label>Tags (comma-separated):</label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="e.g., Monument, Museum, Palace"
                    />
                </div>
                <button type="submit">Create Historical Place</button>
            </form>
        </div>
    );
};

export default CreateHistoricalPlace;
