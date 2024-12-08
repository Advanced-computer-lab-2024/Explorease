import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    FormControl,
    Button,
    TextField,
} from '@mui/material';

const ActivitySummary = () => {
    const [activitySummary, setActivitySummary] = useState([]);
    const [filteredSummary, setFilteredSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(''); // Format: YYYY-MM

    useEffect(() => {
        const fetchActivitySummary = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/advertiser/activity-summary', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setActivitySummary(response.data.bookingSummary || []);
                setFilteredSummary(response.data.bookingSummary || []); // Default to all activities
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch activity summary.');
                setLoading(false);
            }
        };

        fetchActivitySummary();
    }, []);

    const handleFilter = () => {
        if (!selectedMonth) {
            setFilteredSummary(activitySummary); // Reset to all activities if no month is selected
            return;
        }

        const [year, month] = selectedMonth.split('-');
        const filtered = activitySummary.filter((activity) => {
            const activityDate = new Date(activity.activityDate);
            return (
                activityDate.getFullYear() === parseInt(year, 10) &&
                activityDate.getMonth() + 1 === parseInt(month, 10) // Months are 0-indexed in JavaScript
            );
        });
        setFilteredSummary(filtered);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (activitySummary.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography>No activities with completed bookings found.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography
                variant="h4"
                sx={{
                    mb: 4,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#111E56',
                }}
            >
                Activity Summary
            </Typography>

            {/* Filter Section */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                }}
            >
                <FormControl>
                    <TextField
                        label="Filter by Month"
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </FormControl>
                <Button
                    variant="contained"
                    onClick={handleFilter}
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
                >
                    Apply Filter
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor: '#111E56',
                                '& .MuiTableCell-head': {
                                    color: 'white',
                                    fontWeight: 'bold',
                                },
                            }}
                        >
                            <TableCell>Activity Name</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell align="center">Tourists</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSummary.map((activity) => (
                            <TableRow
                                key={activity.activityName}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#f0f4ff', // Light blue hover effect
                                    },
                                }}
                            >
                                <TableCell>{activity.activityName}</TableCell>
                                <TableCell>
                                    {new Date(activity.activityDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell align="center">{activity.uncanceledBookings}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {filteredSummary.length === 0 && (
                <Typography
                    variant="body1"
                    sx={{ textAlign: 'center', color: '#555', mt: 4 }}
                >
                    No activities found for the selected month.
                </Typography>
            )}
        </Box>
    );
};

export default ActivitySummary;
