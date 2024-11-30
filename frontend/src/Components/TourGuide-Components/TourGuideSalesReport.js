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
    Divider,
    CircularProgress,
} from '@mui/material';

const TourGuideSalesReport = () => {
    const [data, setData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalRevenueAfterCommission, setTotalRevenueAfterCommission] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSalesReport = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/tourguide/salesReport', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const report = response.data.itineraryRevenue.map((item) => ({
                    itineraryName: item.itineraryName,
                    totalRevenue: item.totalRevenue,
                    revenueAfterCommission: item.revenueAfterCommission,
                }));

                const total = report.reduce((sum, item) => sum + item.totalRevenue, 0);
                const totalAfterCommission = report.reduce((sum, item) => sum + item.revenueAfterCommission, 0);

                setData(report);
                setTotalRevenue(total);
                setTotalRevenueAfterCommission(totalAfterCommission);
            } catch (error) {
                console.error('Error fetching tour guide sales report:', error);
                setError('Error fetching sales report');
            } finally {
                setLoading(false);
            }
        };

        fetchSalesReport();
    }, []);

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

            {/* Itineraries Section */}
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
