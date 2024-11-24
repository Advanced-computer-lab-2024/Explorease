import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Modal,
    IconButton,
    Alert,
    Snackbar,
    CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [responseText, setResponseText] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('newest');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('info');
    const [alertOpen, setAlertOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Added loading state

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        setLoading(true); // Set loading to true when fetching starts
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('/admins/getAllComplaints', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setComplaints(response.data);
        } catch (error) {
            showAlert('Error fetching complaints.', 'error');
        } finally {
            setLoading(false); // Set loading to false when fetching ends
        }
    };

    const showAlert = (message, severity) => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };

    const handleComplaintClick = (complaint) => {
        setSelectedComplaint(complaint);
        setResponseText('');
    };

    const handleResponseSubmit = async (complaintId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(
                `/admins/adminRespondToComplaint/${complaintId}`,
                { adminResponse: responseText },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setComplaints((prevComplaints) =>
                prevComplaints.map((complaint) =>
                    complaint._id === complaintId
                        ? { ...complaint, status: 'Resolved', adminResponse: responseText }
                        : complaint
                )
            );
            showAlert('Response submitted successfully!', 'success');
            setSelectedComplaint(null);
        } catch (error) {
            showAlert('Error submitting response.', 'error');
        }
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const filteredComplaints = complaints
        .filter(
            (complaint) => statusFilter === 'All' || complaint.status === statusFilter
        )
        .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

    return (
        <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                Complaints
            </Typography>

            <Snackbar
                open={alertOpen}
                autoHideDuration={5000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity={alertSeverity}
                    onClose={handleCloseAlert}
                    sx={{ width: '100%' }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 4,
                }}
            >
                <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        label="Status"
                    >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Resolved">Resolved</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                    <InputLabel>Sort</InputLabel>
                    <Select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        label="Sort"
                    >
                        <MenuItem value="newest">Newest First</MenuItem>
                        <MenuItem value="oldest">Oldest First</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {loading ? ( // Display loading spinner while fetching
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    {filteredComplaints.map((complaint) => (
                        <Card
                            key={complaint._id}
                            sx={{
                                p: 2,
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)', // Added shadow
                                borderRadius: 2,
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                                },
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6">{complaint.title}</Typography>
                                <Button
                                    variant="contained"
                                    color={complaint.status === 'Pending' ? 'primary' : 'success'}
                                    onClick={() => handleComplaintClick(complaint)}
                                    sx={{
                                        mt: 2,
                                        backgroundColor:
                                            complaint.status === 'Pending'
                                                ? '#007bff'
                                                : '#28a745',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            color:
                                                complaint.status === 'Pending'
                                                    ? '#007bff'
                                                    : '#28a745',
                                            border: `1px solid ${
                                                complaint.status === 'Pending'
                                                    ? '#007bff'
                                                    : '#28a745'
                                            }`,
                                        },
                                    }}
                                >
                                    {complaint.status}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            <Modal
                open={Boolean(selectedComplaint)}
                onClose={() => setSelectedComplaint(null)}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: 'white',
                            p: 4,
                            borderRadius: 2,
                            maxWidth: 500,
                            width: '90%',
                            boxShadow: 3,
                            position: 'relative', // For positioning the "X" button
                        }}
                    >
                        <IconButton
                            onClick={() => setSelectedComplaint(null)}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        {selectedComplaint && (
                            <>
                                <Typography variant="h5" gutterBottom align="center">
                                    {selectedComplaint.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    align="center"
                                    sx={{ mb: 2 }}
                                >
                                    <strong>Status:</strong> {selectedComplaint.status}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    align="center"
                                    sx={{ mb: 2 }}
                                >
                                    <strong>Details:</strong> {selectedComplaint.body}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    align="center"
                                    sx={{ mb: 2 }}
                                >
                                    <strong>Submitted by:</strong>{' '}
                                    {selectedComplaint.touristId.username}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    align="center"
                                    sx={{ mb: 2 }}
                                >
                                    <strong>Date:</strong>{' '}
                                    {new Date(selectedComplaint.date).toLocaleString()}
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    label="Admin Response"
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        mt: 2,
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            handleResponseSubmit(selectedComplaint._id)
                                        }
                                        sx={{
                                            backgroundColor: '#111E56',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'white',
                                                color: '#111E56',
                                                border: '1px solid #111E56',
                                            },
                                        }}
                                    >
                                        Submit Response
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default Complaints;
