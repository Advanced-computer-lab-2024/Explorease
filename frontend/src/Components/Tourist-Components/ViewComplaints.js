import { Box, Button, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const ViewComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('newest');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        const token = localStorage.getItem('token');
        setLoading(true);
        setErrorMessage('');
        try {
            const response = await axios.get('/tourists/getComplaintsByTourist', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setComplaints(response.data);
        } catch (error) {
            setErrorMessage('Error fetching complaints.');
        } finally {
            setLoading(false);
        }
    };

    const handleComplaintClick = (complaint) => {
        setSelectedComplaint(complaint);
    };

    const closeComplaintDetails = () => {
        setSelectedComplaint(null);
    };

    const containerStyle = {
        padding: '20px',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto',
    };

    const listStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginTop: '20px',
    };

    const cardStyle = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        width: '100%',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'left',
        cursor: 'pointer',
    };

    const statusStyle = {
        display: 'inline-block',
        padding: '5px 10px',
        borderRadius: '5px',
        marginLeft: '10px',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#fff',
    };

    const pendingStyle = {
        ...statusStyle,
        backgroundColor: '#007bff', // Blue for Pending
    };

    const resolvedStyle = {
        ...statusStyle,
        backgroundColor: '#28a745', // Green for Resolved
    };

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    };

    const modalStyle = {
        backgroundColor: '#fff',
        padding: '20px',
        width: '90%',
        maxWidth: '500px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        position: 'relative',
    };

    const closeButtonStyle = {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        fontSize: '18px',
        cursor: 'pointer',
        color: '#888',
    };

    const errorMessageStyle = {
        color: 'red',
        marginBottom: '20px',
    };

    const filteredComplaints = complaints
        .filter(complaint => statusFilter === 'All' || complaint.status === statusFilter)
        .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

    return (
        <div style={containerStyle}>
            <h2>Complaints</h2>
            {errorMessage && <p style={errorMessageStyle}>{errorMessage}</p>}
            
            {loading ? (
    <CircularProgress />
) : filteredComplaints.length > 0 ? (
    <div style={listStyle}>
        {filteredComplaints.map((complaint) => (
            <div key={complaint._id} style={cardStyle}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" style={{ marginBottom: '8px' }}>
                        {complaint.title}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                        <span style={complaint.status === 'Pending' ? pendingStyle : resolvedStyle}>
                            {complaint.status}
                        </span>
                        <Button 
                            variant="contained" 
                            size="small" 
                            onClick={() => handleComplaintClick(complaint)} 
                        >
                            View Details
                        </Button>
                    </Box>
                </Box>
            </div>
        ))}
    </div>
) : (
    <Typography variant="h6" color="textSecondary">
        No Complaints Made
    </Typography>
)}



{selectedComplaint && (
    <div style={overlayStyle}>
        <div style={modalStyle}>
            <button style={closeButtonStyle} onClick={closeComplaintDetails}>X</button>
            <h3>{selectedComplaint.title}</h3>
            <p><strong>Status:</strong> {selectedComplaint.status}</p>
            <p><strong>Details:</strong> {selectedComplaint.body}</p>
            <p><strong>Date:</strong> {new Date(selectedComplaint.date).toLocaleString()}</p>

            {/* Display admin response if it exists */}
            {selectedComplaint.adminResponse && (
                <p><strong>Admin Response:</strong> {selectedComplaint.adminResponse}</p>
            )}
        </div>
    </div>
)}

        </div>
    );
};

export default ViewComplaints;
