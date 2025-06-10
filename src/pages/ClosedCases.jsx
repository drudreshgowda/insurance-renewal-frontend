import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, Typography, Paper, TextField, InputAdornment, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, TablePagination, Chip, IconButton, 
  Menu, MenuItem, Tooltip, Button, Dialog, 
  DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, Stepper, Step, StepLabel,
  List, ListItem, ListItemText, Divider, Alert,
  ListItemIcon, Card, CardContent, Grow, Fade, Zoom, alpha
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  MoreVert as MoreIcon,
  FileDownload as FileDownloadIcon,
  TableView as TableViewIcon,
  InsertDriveFile as InsertDriveFileIcon,
  History as HistoryIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Refresh as RefreshIcon,
  FactCheck as FactCheckIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '@mui/material/styles';

const ClosedCases = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);
  
  const mockCases = useMemo(() => [
    {
      id: 'CASE-002',
      customerName: 'Meera Kapoor',
      policyNumber: 'POL-23456',
      status: 'Renewed',
      agent: 'Rajesh Kumar',
      uploadDate: '2025-04-07',
      closedDate: '2025-04-15',
      isPriority: false,
      batchId: 'BATCH-2025-04-07-B',
      contactInfo: {
        email: 'meera.kapoor@gmail.com',
        phone: '9876543211'
      },
      policyDetails: {
        type: 'Home',
        expiryDate: '2025-05-10',
        premium: 950.00
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Payment Processed', 'Renewed']
    },
    {
      id: 'CASE-006',
      customerName: 'Aditya Malhotra',
      policyNumber: 'POL-67890',
      status: 'Renewed',
      agent: 'Ananya Reddy',
      uploadDate: '2025-04-02',
      closedDate: '2025-04-10',
      isPriority: true,
      batchId: 'BATCH-2025-04-02-A',
      contactInfo: {
        email: 'aditya.malhotra@gmail.com',
        phone: '9876543215'
      },
      policyDetails: {
        type: 'Auto',
        expiryDate: '2025-05-25',
        premium: 1550.00
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Payment Processed', 'Renewed']
    },
    {
      id: 'CASE-008',
      customerName: 'Neha Sharma',
      policyNumber: 'POL-89012',
      status: 'Renewed',
      agent: 'Priya Patel',
      uploadDate: '2025-03-25',
      closedDate: '2025-04-05',
      isPriority: false,
      batchId: 'BATCH-2025-03-25-D',
      contactInfo: {
        email: 'neha.sharma@gmail.com',
        phone: '9876543216'
      },
      policyDetails: {
        type: 'Life',
        expiryDate: '2025-06-15',
        premium: 2250.00
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Payment Processed', 'Renewed']
    }
  ], []);

  const [cases, setCases] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [agentFilter, setAgentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [currentCase, setCurrentCase] = useState(null);

  // Initialize with mock data
  useEffect(() => {
    // In a real application, you would fetch data from an API
    // Initialize with only Renewed status cases
    const initialCases = mockCases.filter(caseItem => caseItem.status === 'Renewed');
    setCases(initialCases);
  }, [mockCases]);

  // Add loaded state for animations similar to Settings page
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 100);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
    
    // Apply all filters
    applyAllFilters(searchValue, agentFilter, dateFilter);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    
    // Apply all filters when the filter menu is closed
    applyAllFilters(searchTerm, agentFilter, dateFilter);
  };

  const handleAgentFilterChange = (event) => {
    const newAgentFilter = event.target.value;
    setAgentFilter(newAgentFilter);
    
    // Apply all filters
    applyAllFilters(searchTerm, newAgentFilter, dateFilter);
  };

  const handleDateFilterChange = (event) => {
    const newDateFilter = event.target.value;
    setDateFilter(newDateFilter);
    
    // Apply all filters
    applyAllFilters(searchTerm, agentFilter, newDateFilter);
  };
  
  // Helper function to apply all filters
  const applyAllFilters = (search, agent, date) => {
    // Process comma-separated search terms
    const searchTerms = search
      .split(',')
      .map(term => term.trim().toLowerCase())
      .filter(term => term !== '');
    
    // Filter cases based on all criteria
    const filteredCases = mockCases.filter(caseItem => {
      // Filter by search terms
      const matchesSearch = searchTerms.length === 0 || searchTerms.some(term => 
        caseItem.id.toLowerCase().includes(term) ||
        caseItem.customerName.toLowerCase().includes(term) ||
        caseItem.policyNumber.toLowerCase().includes(term)
      );
      
      // Filter by agent
      const matchesAgent = agent === 'all' || 
        caseItem.agent.toLowerCase() === agent.toLowerCase();
        
      // Filter by date if needed (example implementation)
      let matchesDate = true;
      if (date !== 'all') {
        const today = new Date();
        const caseDate = new Date(caseItem.closedDate); // Use closedDate for closed cases
        
        if (date === 'today') {
          matchesDate = caseDate.toDateString() === today.toDateString();
        } else if (date === 'yesterday') {
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          matchesDate = caseDate.toDateString() === yesterday.toDateString();
        } else if (date === 'lastWeek') {
          const lastWeek = new Date(today);
          lastWeek.setDate(today.getDate() - 7);
          matchesDate = caseDate >= lastWeek;
        } else if (date === 'lastMonth') {
          const lastMonth = new Date(today);
          lastMonth.setDate(today.getDate() - 30);
          matchesDate = caseDate >= lastMonth;
        }
      }
      
      // Only show cases with Renewed status
      return matchesSearch && matchesAgent && matchesDate && caseItem.status === 'Renewed';
    });
    
    setCases(filteredCases);
    setPage(0); // Reset to first page when filtering
  };

  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleViewFlow = (caseData) => {
    setCurrentCase(caseData);
    navigate(`/logs?caseId=${caseData.id}`);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'renewed': return 'success';
      case 'in progress': return 'info';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ px: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4
        }}>
          <Typography variant="h4" fontWeight="600">
            Closed Cases
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Zoom in={loaded} style={{ transitionDelay: '200ms' }}>
              <Button
                variant="contained"
                startIcon={<FilterIcon />}
                onClick={handleFilterClick}
                color="primary"
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 3,
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
                  }
                }}
              >
                Filters
              </Button>
            </Zoom>

            <Zoom in={loaded} style={{ transitionDelay: '300ms' }}>
              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={handleExportClick}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 3,
                  fontWeight: 600,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                  }
                }}
              >
                Export
              </Button>
            </Zoom>
          </Box>
        </Box>
        
        {successMessage && (
          <Grow in={!!successMessage}>
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              {successMessage}
            </Alert>
          </Grow>
        )}
        
        {error && (
          <Grow in={!!error}>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              {error}
            </Alert>
          </Grow>
        )}
        
        <Grow in={loaded} timeout={400}>
          <Card 
            elevation={0}
            sx={{ 
              mb: 4, 
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
              overflow: 'visible',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleOutlineIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                <Typography variant="h6" fontWeight="600">
                  Search Closed Cases
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <TextField
                placeholder="Search by Case ID, Customer Name or Policy Number (comma-separated for multiple values)"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grow>
        
        <Grow in={loaded} timeout={600}>
          <TableContainer 
            component={Card} 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
              mb: 4,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', p: 3, pb: 1 }}>
              <FactCheckIcon sx={{ mr: 1, color: theme.palette.success.main }} />
              <Typography variant="h6" fontWeight="600">
                Closed Case History
              </Typography>
            </Box>
            <Divider sx={{ mx: 3, my: 2 }} />
            <Box sx={{ p: 1 }}>
              <Table sx={{ minWidth: 650 }} aria-label="closed cases table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>Case ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>Customer Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>Policy Number</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>Batch ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>Agent</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>Closed Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>Upload Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cases
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((caseItem) => (
                      <TableRow 
                        key={caseItem.id}
                        hover
                        onClick={() => navigate(`/cases/${caseItem.id}`)}
                        sx={{ 
                          cursor: 'pointer',
                          transition: 'background-color 0.2s, transform 0.2s',
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                          }
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight="500" color="primary">
                            {caseItem.id}
                          </Typography>
                        </TableCell>
                        <TableCell>{caseItem.customerName}</TableCell>
                        <TableCell>{caseItem.policyNumber}</TableCell>
                        <TableCell>{caseItem.batchId}</TableCell>
                        <TableCell>
                          <Chip
                            label={caseItem.status}
                            color={getStatusColor(caseItem.status)}
                            size="small"
                            sx={{ 
                              fontWeight: 500,
                              minWidth: '90px',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                              borderRadius: 5
                            }}
                          />
                        </TableCell>
                        <TableCell>{caseItem.agent}</TableCell>
                        <TableCell>{new Date(caseItem.closedDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(caseItem.uploadDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex' }}>
                            <Tooltip title="View Details" arrow placement="top">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/cases/${caseItem.id}`);
                                }}
                                sx={{ 
                                  color: 'primary.main',
                                  transition: 'transform 0.2s',
                                  '&:hover': { transform: 'scale(1.15)' }
                                }}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="View History" arrow placement="top">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewFlow(caseItem);
                                }}
                                sx={{ 
                                  color: 'info.main',
                                  transition: 'transform 0.2s',
                                  '&:hover': { transform: 'scale(1.15)' }
                                }}
                              >
                                <HistoryIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <Box sx={{ p: 2 }}>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={cases.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                      fontWeight: 500,
                    },
                    '.MuiTablePagination-actions': {
                      '& .MuiIconButton-root': {
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.15)',
                          backgroundColor: 'transparent'
                        }
                      }
                    }
                  }}
                />
              </Box>
            </Box>
          </TableContainer>
        </Grow>
        
        {/* Export Menu */}
        <Menu
          anchorEl={exportAnchorEl}
          open={Boolean(exportAnchorEl)}
          onClose={handleExportClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: 2, 
              mt: 1,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
            }
          }}
        >
          <MenuItem 
            onClick={() => {
              // Export logic would go here
              handleExportClose();
              setSuccessMessage('Export completed successfully');
              setTimeout(() => setSuccessMessage(''), 3000);
            }} 
            sx={{
              borderRadius: 1,
              py: 1.5,
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            <ListItemIcon>
              <TableViewIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Export as XLS" />
          </MenuItem>
          <MenuItem 
            onClick={() => {
              // Export logic would go here
              handleExportClose();
              setSuccessMessage('Export completed successfully');
              setTimeout(() => setSuccessMessage(''), 3000);
            }} 
            sx={{
              borderRadius: 1,
              py: 1.5,
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            <ListItemIcon>
              <InsertDriveFileIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Export as CSV" />
          </MenuItem>
        </Menu>
        
        {/* Advanced Filter Menu */}
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: 2, 
              minWidth: '220px',
              mt: 1,
              p: 1, 
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
            }
          }}
        >
          <Typography variant="subtitle2" sx={{ px: 1, pb: 2, fontWeight: 600 }}>
            Filter Closed Cases
          </Typography>
          <MenuItem sx={{ py: 1.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Agent</InputLabel>
              <Select
                value={agentFilter}
                label="Agent"
                onChange={handleAgentFilterChange}
                sx={{ 
                  borderRadius: 2,
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <MenuItem value="all">All Agents</MenuItem>
                <MenuItem value="Priya Patel">Priya Patel</MenuItem>
                <MenuItem value="Rajesh Kumar">Rajesh Kumar</MenuItem>
                <MenuItem value="Ananya Reddy">Ananya Reddy</MenuItem>
                <MenuItem value="Amit Shah">Amit Shah</MenuItem>
              </Select>
            </FormControl>
          </MenuItem>
          
          <MenuItem sx={{ py: 1.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Date</InputLabel>
              <Select
                value={dateFilter}
                label="Date"
                onChange={handleDateFilterChange}
                sx={{ 
                  borderRadius: 2,
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <MenuItem value="all">All Dates</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="yesterday">Yesterday</MenuItem>
                <MenuItem value="lastWeek">Last 7 Days</MenuItem>
                <MenuItem value="lastMonth">Last 30 Days</MenuItem>
              </Select>
            </FormControl>
          </MenuItem>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, px: 1 }}>
            <Button 
              variant="contained" 
              onClick={handleFilterClose}
              sx={{
                borderRadius: 2,
                py: 1,
                px: 2,
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
                }
              }}
            >
              Apply Filters
            </Button>
          </Box>
        </Menu>
        
        {/* Auto-refresh button at the bottom right */}
        <Box sx={{ position: 'fixed', right: 30, bottom: 30 }}>
          <Zoom in={loaded} style={{ transitionDelay: '800ms' }}>
            <Tooltip title="Refresh closed cases" arrow>
              <IconButton 
                color="success"
                onClick={() => {
                  // Refresh data
                  setSuccessMessage('Cases refreshed successfully');
                  setTimeout(() => setSuccessMessage(''), 3000);
                }}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: '0 4px 14px rgba(76,175,80,0.25)',
                  width: 56,
                  height: 56,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px) rotate(30deg)',
                    boxShadow: '0 6px 20px rgba(76,175,80,0.35)',
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Zoom>
        </Box>
      </Box>
    </Fade>
  );
};

export default ClosedCases; 