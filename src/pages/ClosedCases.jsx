import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, Typography, TextField, InputAdornment, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, TablePagination, Chip, IconButton, 
  Menu, MenuItem, Tooltip, Button, FormControl,
  InputLabel, Select, ListItemText, Divider, Alert,
  ListItemIcon, Card, CardContent, Grow, Fade, Zoom, alpha
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  FileDownload as FileDownloadIcon,
  TableView as TableViewIcon,
  InsertDriveFile as InsertDriveFileIcon,
  History as HistoryIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Refresh as RefreshIcon,
  FactCheck as FactCheckIcon,
  PriorityHigh as PriorityHighIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// import { useSettings } from '../context/SettingsContext';
import { useTheme } from '@mui/material/styles';

const ClosedCases = () => {
  const navigate = useNavigate();
  // const { settings } = useSettings();
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);
  
  const mockCases = useMemo(() => [
    {
      id: 'CASE-002',
      customerName: 'Meera Kapoor',
      policyNumber: 'POL-23456',
      status: 'Renewed',
      subStatus: 'Completed',
      policyStatus: 'Active',
      agent: 'Rajesh Kumar',
      uploadDate: '2025-04-07',
      closedDate: '2025-04-15',
      isPriority: false,
      batchId: 'BATCH-2025-04-07-B',
      nextFollowUpDate: '2025-05-07',
      nextActionPlan: 'Policy successfully renewed',
      currentWorkStep: 'Completed',
      // New fields
      customerProfile: 'HNI',
      customerMobile: '9876543211',
      preferredLanguage: 'English',
      assignedAgent: 'Rajesh Kumar',
      productName: 'Home Insurance Premium',
      productCategory: 'Property',
      channel: 'Branch',
      subChannel: 'Relationship Manager',
      lastActionDate: '2025-04-15',
      totalCalls: 5,
      comments: [],
      contactInfo: {
        email: 'meera.kapoor@gmail.com',
        phone: '9876543211'
      },
      policyDetails: {
        type: 'Home',
        expiryDate: '2025-05-10',
        premium: 950.00,
        renewalDate: '2025-05-10'
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Payment Processed', 'Renewed']
    },
    {
      id: 'CASE-006',
      customerName: 'Aditya Malhotra',
      policyNumber: 'POL-67890',
      status: 'Renewed',
      subStatus: 'Completed',
      policyStatus: 'Active',
      agent: 'Ananya Reddy',
      uploadDate: '2025-04-02',
      closedDate: '2025-04-10',
      isPriority: true,
      batchId: 'BATCH-2025-04-02-A',
      nextFollowUpDate: '2025-05-25',
      nextActionPlan: 'Policy renewal completed successfully',
      currentWorkStep: 'Completed',
      // New fields
      customerProfile: 'Normal',
      customerMobile: '9876543215',
      preferredLanguage: 'Hindi',
      assignedAgent: 'Ananya Reddy',
      productName: 'Comprehensive Auto Insurance',
      productCategory: 'Motor',
      channel: 'Online',
      subChannel: 'Website',
      lastActionDate: '2025-04-10',
      totalCalls: 3,
      comments: [],
      contactInfo: {
        email: 'aditya.malhotra@gmail.com',
        phone: '9876543215'
      },
      policyDetails: {
        type: 'Auto',
        expiryDate: '2025-05-25',
        premium: 1550.00,
        renewalDate: '2025-05-25'
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Payment Processed', 'Renewed']
    },
    {
      id: 'CASE-008',
      customerName: 'Neha Sharma',
      policyNumber: 'POL-89012',
      status: 'Renewed',
      subStatus: 'Completed',
      policyStatus: 'Active',
      agent: 'Priya Patel',
      uploadDate: '2025-03-25',
      closedDate: '2025-04-05',
      isPriority: false,
      batchId: 'BATCH-2025-03-25-D',
      nextFollowUpDate: '2025-06-15',
      nextActionPlan: 'Life insurance policy renewed',
      currentWorkStep: 'Completed',
      // New fields
      customerProfile: 'HNI',
      customerMobile: '9876543216',
      preferredLanguage: 'English',
      assignedAgent: 'Priya Patel',
      productName: 'Term Life Insurance Plus',
      productCategory: 'Life',
      channel: 'Telecalling',
      subChannel: 'Outbound',
      lastActionDate: '2025-04-05',
      totalCalls: 7,
      comments: [],
      contactInfo: {
        email: 'neha.sharma@gmail.com',
        phone: '9876543216'
      },
      policyDetails: {
        type: 'Life',
        expiryDate: '2025-06-15',
        premium: 2250.00,
        renewalDate: '2025-06-15'
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
  const [error] = useState(null);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [, setCurrentCase] = useState(null);

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

  const getPolicyStatusColor = (policyStatus) => {
    switch (policyStatus.toLowerCase()) {
      case 'active': return 'success';
      case 'pre due stage': return 'info';
      case 'policy due': return 'warning';
      case 'reinstatement': return 'error';
      default: return 'default';
    }
  };

  const getCustomerProfileColor = (profile) => {
    switch (profile.toLowerCase()) {
      case 'hni': return 'success';
      case 'normal': return 'default';
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
        
        {/* Static Header Section */}
        <Grow in={loaded} timeout={400}>
          <Card 
            elevation={0}
            sx={{ 
              mb: 2, 
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              overflow: 'visible'
            }}
          >
            <CardContent sx={{ p: 3, pb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FactCheckIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                  <Typography variant="h6" fontWeight="600">
                    Closed Case History
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Scroll horizontally to view all columns
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 0.5,
                    '& > div': {
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.success.main, 0.3),
                      animation: 'pulse 1.5s infinite',
                    },
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 0.3 },
                      '50%': { opacity: 1 },
                    }
                  }}>
                    <Box sx={{ animationDelay: '0s' }} />
                    <Box sx={{ animationDelay: '0.2s' }} />
                    <Box sx={{ animationDelay: '0.4s' }} />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grow>

        {/* Scrollable Table Section */}
        <Grow in={loaded} timeout={600}>
          <TableContainer 
            component={Card} 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              overflow: 'auto',
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
              mb: 4,
              transition: 'transform 0.2s, box-shadow 0.2s',
              maxHeight: '75vh',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
              },
              '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: alpha(theme.palette.success.main, 0.1),
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: alpha(theme.palette.success.main, 0.3),
                borderRadius: '4px',
                '&:hover': {
                  background: alpha(theme.palette.success.main, 0.5),
                }
              }
            }}
          >
            <Box sx={{ p: 1 }}>
              <Table sx={{ minWidth: 1800 }} aria-label="closed cases table">
                <TableHead sx={{ 
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  bgcolor: 'background.paper'
                }}>
                  <TableRow sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                    '& .MuiTableCell-head': {
                      borderBottom: `2px solid ${alpha(theme.palette.success.main, 0.1)}`,
                      position: 'sticky',
                      top: 0,
                      bgcolor: alpha(theme.palette.success.main, 0.05),
                      zIndex: 1,
                    }
                  }}>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5, minWidth: 150, whiteSpace: 'nowrap' }}>Actions</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5, minWidth: 100, whiteSpace: 'nowrap' }}>Case ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5, minWidth: 150, whiteSpace: 'nowrap' }}>Customer Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5, minWidth: 120, whiteSpace: 'nowrap' }}>Customer Profile</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5, minWidth: 130, whiteSpace: 'nowrap' }}>Customer Mobile</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5, minWidth: 130, whiteSpace: 'nowrap' }}>Preferred Language</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5, minWidth: 130, whiteSpace: 'nowrap' }}>Policy Number</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5, minWidth: 180, whiteSpace: 'nowrap' }}>Product Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5, minWidth: 120, whiteSpace: 'nowrap' }}>Product Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5, minWidth: 150, whiteSpace: 'nowrap' }}>Channel/Sub Channel</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5, minWidth: 120, whiteSpace: 'nowrap' }}>Batch ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5, minWidth: 100, whiteSpace: 'nowrap' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5, minWidth: 120, whiteSpace: 'nowrap' }}>Policy Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5, minWidth: 130, whiteSpace: 'nowrap' }}>Assigned Agent</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5, minWidth: 100, whiteSpace: 'nowrap' }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5, minWidth: 130, whiteSpace: 'nowrap' }}>Last Action Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5, minWidth: 100, whiteSpace: 'nowrap' }}>Total Calls</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5, minWidth: 130, whiteSpace: 'nowrap' }}>Renewal Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5, minWidth: 120, whiteSpace: 'nowrap' }}>Closed Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5, minWidth: 120, whiteSpace: 'nowrap' }}>Upload Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cases
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((caseItem, index) => (
                      <TableRow 
                        key={caseItem.id}
                        hover
                        onClick={() => navigate(`/cases/${caseItem.id}`)}
                        sx={{ 
                          cursor: 'pointer',
                          transition: 'background-color 0.2s, transform 0.2s',
                          bgcolor: index % 2 === 0 ? 'transparent' : alpha(theme.palette.success.main, 0.02),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.success.main, 0.08),
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            zIndex: 1,
                          },
                          '& .MuiTableCell-root': {
                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                            py: 1.5,
                          }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
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
                        <TableCell>
                          <Typography variant="body2" fontWeight="500" color="primary">
                            {caseItem.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {caseItem.customerName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={caseItem.customerProfile}
                            color={getCustomerProfileColor(caseItem.customerProfile)}
                            size="small"
                            sx={{ 
                              fontWeight: 500,
                              minWidth: '60px',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                              borderRadius: 5
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {caseItem.customerMobile}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {caseItem.preferredLanguage}
                          </Typography>
                        </TableCell>
                        <TableCell>{caseItem.policyNumber}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {caseItem.productName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={caseItem.productCategory}
                            color="info"
                            variant="outlined"
                            size="small"
                            sx={{ 
                              fontWeight: 500,
                              minWidth: '70px',
                              borderRadius: 5
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography variant="body2" fontWeight="500">
                              {caseItem.channel}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {caseItem.subChannel}
                            </Typography>
                          </Box>
                        </TableCell>
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
                        <TableCell>
                          <Chip
                            label={caseItem.policyStatus}
                            color={getPolicyStatusColor(caseItem.policyStatus)}
                            size="small"
                            sx={{ 
                              fontWeight: 500,
                              minWidth: '110px',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                              borderRadius: 5
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {caseItem.assignedAgent}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<PriorityHighIcon />}
                            label={caseItem.isPriority ? "Priority" : "Normal"}
                            color={caseItem.isPriority ? "error" : "primary"}
                            variant={caseItem.isPriority ? "filled" : "outlined"}
                            size="small"
                            sx={{ 
                              cursor: 'pointer',
                              minWidth: '90px',
                              fontWeight: 500,
                              borderRadius: 5,
                              boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                              ...(caseItem.isPriority ? {} : {
                                borderWidth: '1px',
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                '& .MuiChip-icon': {
                                  color: 'primary.main'
                                },
                              })
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {new Date(caseItem.lastActionDate).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" fontWeight="600" color="primary">
                              {caseItem.totalCalls}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              calls
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {new Date(caseItem.policyDetails.renewalDate).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>{new Date(caseItem.closedDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(caseItem.uploadDate).toLocaleDateString()}</TableCell>
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