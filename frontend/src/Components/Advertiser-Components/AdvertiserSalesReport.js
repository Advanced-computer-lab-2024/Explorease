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
    Divider,
    CircularProgress,
    TextField,
    Button,
} from '@mui/material';

const AdvertiserSalesReport = () => {
    const [data, setData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalRevenueAfterCommission, setTotalRevenueAfterCommission] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    const fetchSalesReport = async () => {
        try {
            const token = localStorage.getItem('token');
            setLoading(true);
            const response = await axios.get('/advertiser/salesReport', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const report = response.data.revenueData;

            // Calculate total revenues
            const total = report.reduce((sum, item) => sum + item.totalRevenue, 0);
            const totalAfterCommission = report.reduce((sum, item) => sum + item.revenueAfterCommission, 0);

            setData(report);
            setTotalRevenue(total);
            setTotalRevenueAfterCommission(totalAfterCommission);
        } catch (err) {
            setError('Error fetching advertiser sales report');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilteredSalesReport = async () => {
        try {
            const token = localStorage.getItem('token');
            setLoading(true);
    
            // Build query parameters
            const params = {
                date: selectedDate || undefined,
                month: selectedMonth || undefined,
            };
    
            // Fetch data using GET with query parameters
            const response = await axios.get('/advertiser/salesReport/filter', {
                headers: { Authorization: `Bearer ${token}` },
                params, // Attach query parameters
            });
    
            const report = response.data.revenueData;
    
            // Calculate total revenues
            const total = report.reduce((sum, item) => sum + item.totalRevenue, 0);
            const totalAfterCommission = report.reduce((sum, item) => sum + item.revenueAfterCommission, 0);
    
            setData(report);
            setTotalRevenue(total);
            setTotalRevenueAfterCommission(totalAfterCommission);
        } catch (err) {
            setError('Error fetching filtered advertiser sales report');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        // Fetch initial sales report without filters
        fetchSalesReport();
    }, []);

    const handleFilter = () => {
        fetchFilteredSalesReport();
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
                    position: 'relative',
                    display: 'inline-block',
                    cursor: 'pointer',
                    '&::after': {
                        content: "''",
                        position: 'absolute',
                        width: '0',
                        height: '2px',
                        bottom: '-4px',
                        left: '0',
                        backgroundColor: '#111E56',
                        transition: 'width 0.3s ease-in-out',
                    },
                    '&:hover::after': {
                        width: '100%',
                    },
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
                        borderRadius: 2,
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
                            <TableCell>Activity Name</TableCell>
                            <TableCell align="right">Total Revenue ($)</TableCell>
                            <TableCell align="right">Revenue After Commission ($)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.activityName}</TableCell>
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
                Advertiser Sales Report
            </Typography>

            {/* Filters Section */}
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 4,
                }}
            >
                <TextField
                    type="date"
                    label="Filter by Date"
                    InputLabelProps={{ shrink: true }}
                    value={selectedDate}
                    onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedMonth(''); // Clear month filter when date is selected
                    }}
                    fullWidth
                />
                <TextField
                    type="month"
                    label="Filter by Month"
                    InputLabelProps={{ shrink: true }}
                    value={selectedMonth}
                    onChange={(e) => {
                        setSelectedMonth(e.target.value);
                        setSelectedDate(''); // Clear date filter when month is selected
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
                            '&:hover': { 
                                backgroundColor: 'white', 
                                color: '#111E56',
                                border: '1px solid #111E56' // Optional: adds a border to match the dark blue on hover
                            },
                    }}
                >
                    Filter
                </Button>
            </Box>

            {renderTable('Activity Sales', data)}

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

export default AdvertiserSalesReport;
