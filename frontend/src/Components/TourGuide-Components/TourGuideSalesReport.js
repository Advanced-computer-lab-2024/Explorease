import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    TextField,
    Button,
    CircularProgress,
    Divider,
} from '@mui/material';

const TourGuideSalesReport = () => {
    const [data, setData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalRevenueAfterCommission, setTotalRevenueAfterCommission] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [date, setDate] = useState('');
    const [month, setMonth] = useState('');

    useEffect(() => {
        // Fetch initial data (all sales report)
        const fetchInitialData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/tourguide/salesReport', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const total = response.data.itineraryRevenue.reduce(
                    (sum, item) => sum + item.totalRevenue,
                    0
                );

                const totalAfterCommission = response.data.itineraryRevenue.reduce(
                    (sum, item) => sum + item.revenueAfterCommission,
                    0
                );

                setData(response.data.itineraryRevenue);
                setTotalRevenue(total);
                setTotalRevenueAfterCommission(totalAfterCommission);
            } catch (err) {
                setError('Error fetching sales report');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleFilter = async () => {
        setLoading(true); // Show loading spinner
        try {
            const token = localStorage.getItem('token');
            const params = {
                date: date || undefined,
                month: month || undefined,
            };

            const response = await axios.get('/tourguide/salesReport/filter', {
                headers: { Authorization: `Bearer ${token}` },
                params,
            });

            const total = response.data.itineraryRevenue.reduce(
                (sum, item) => sum + item.totalRevenue,
                0
            );

            const totalAfterCommission = response.data.itineraryRevenue.reduce(
                (sum, item) => sum + item.revenueAfterCommission,
                0
            );

            setData(response.data.itineraryRevenue);
            setTotalRevenue(total);
            setTotalRevenueAfterCommission(totalAfterCommission);
        } catch (err) {
            setError('Error fetching filtered sales report');
            console.error(err);
        } finally {
            setLoading(false); // Hide loading spinner
        }
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
            <Box sx={{ p: 3 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    const renderTable = (title, data) => (
        <Box sx={{ mb: 4 }}>
            <Typography
                variant="h5"
                sx={{
                    mb: 2,
                    fontWeight: 'bold',
                    color: '#111E56',
                }}
            >
                {title}
            </Typography>
            <TableContainer component={Paper}>
                <Table
                    sx={{
                        '& .MuiTableRow-root:hover': {
                            backgroundColor: '#f0f4ff', // Light blue hover effect
                        },
                        '& .MuiTableHead-root': {
                            backgroundColor: '#111E56',
                        },
                        '& .MuiTableCell-head': {
                            color: 'white',
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <TableHead>
                    <TableRow
                            sx={{
                                pointerEvents: 'none', // Disable hover events
                                '&:hover': {
                                    backgroundColor: 'inherit', // Remove background color change
                                },
                            }}
                        >
                            <TableCell>Itinerary Name</TableCell>
                            <TableCell align="right">Revenue ($)</TableCell>
                            <TableCell align="right">Revenue After Commission ($)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.itineraryName}</TableCell>
                                <TableCell align="right">${item.totalRevenue.toFixed(2)}</TableCell>
                                <TableCell align="right">${item.revenueAfterCommission.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    return (
        <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2 }}>
            <Typography
                variant="h4"
                sx={{
                    mb: 4,
                    fontWeight: 'bold',
                    color: '#111E56',
                    textAlign: 'center',
                }}
            >
                Tour Guide Sales Report
            </Typography>

            {/* Filters */}
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 4,
                }}
            >
                <TextField
                    type="date"
                    label="Filter by Exact Date"
                    InputLabelProps={{ shrink: true }}
                    value={date}
                    onChange={(e) => {
                        setDate(e.target.value);
                        setMonth(''); // Clear month when date is selected
                    }}
                    fullWidth
                />
                <TextField
                    type="month"
                    label="Filter by Exact Month"
                    InputLabelProps={{ shrink: true }}
                    value={month}
                    onChange={(e) => {
                        setMonth(e.target.value);
                        setDate(''); // Clear date when month is selected
                    }}
                    fullWidth
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFilter}
                    sx={{
                        backgroundColor: '#111E56', 
                            color: 'white', 
                            border: '2px solid #111E56',
                            '&:hover': { 
                                backgroundColor: 'white', 
                                color: '#111E56',
                                border: '2px solid #111E56' // Optional: adds a border to match the dark blue on hover
                            },
                        
                    }}
                >
                    Search
                </Button>
            </Box>

            {/* Table Section */}
            {renderTable('Itinerary Sales', data)}

            <Typography
                variant="h6"
                sx={{
                    mt: 3,
                    fontWeight: 'bold',
                    color: '#111E56',
                }}
            >
                Total Revenue: ${totalRevenue.toFixed(2)}
            </Typography>
            <Typography
                variant="h6"
                sx={{
                    mt: 1,
                    fontWeight: 'bold',
                    color: '#111E56',
                }}
            >
                Total Revenue After App Commission: ${totalRevenueAfterCommission.toFixed(2)}
            </Typography>
            <Divider sx={{ borderColor: '#ddd', my: 3 }} />
        </Box>
    );
};

export default TourGuideSalesReport;
