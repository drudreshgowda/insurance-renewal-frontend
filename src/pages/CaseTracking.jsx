import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, Typography, Paper, TextField, InputAdornment, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, TablePagination, Chip, IconButton, 
  Menu, MenuItem, Tooltip, Button, Dialog, 
  DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, Stepper, Step, StepLabel,
  List, ListItem, ListItemText, Divider, Alert,
  ListItemIcon, Card, CardContent, Grow, Zoom, Fade, alpha
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
  PriorityHigh as PriorityHighIcon,
  Refresh as RefreshIcon,
  AssignmentInd as AssignmentIndIcon,
  ManageAccounts as ManageAccountsIcon
} from '@mui/icons-material';
import { fetchCases, updateCase } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '@mui/material/styles';

const CaseTracking = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);
  
  // Function to handle customer name click
  const handleCustomerNameClick = (e, customerName, customerId) => {
    e.stopPropagation(); // Prevent row click event
    navigate(`/policy-timeline?customerName=${encodeURIComponent(customerName)}&customerId=${encodeURIComponent(customerId || 'CUST-' + Math.floor(Math.random() * 10000))}`);
  };
  
  const mockCases = useMemo(() => [
    {
      id: 'CASE-001',
      customerName: 'John Smith',
      policyNumber: 'POL-12345',
      status: 'Assigned',
      agent: 'Alice Johnson',
      uploadDate: '2025-04-08',
      isPriority: false,
      batchId: 'BATCH-2025-04-08-A',
      contactInfo: {
        email: 'john.smith@example.com',
        phone: '555-123-4567'
      },
      policyDetails: {
        type: 'Auto',
        expiryDate: '2025-05-15',
        premium: 1250.00
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress']
    },
    {
      id: 'CASE-002',
      customerName: 'Sarah Williams',
      policyNumber: 'POL-23456',
      status: 'Renewed',
      agent: 'Bob Miller',
      uploadDate: '2025-04-07',
      isPriority: true,
      batchId: 'BATCH-2025-04-07-B',
      contactInfo: {
        email: 'sarah.w@example.com',
        phone: '555-234-5678'
      },
      policyDetails: {
        type: 'Home',
        expiryDate: '2025-05-10',
        premium: 950.00
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Payment Processed', 'Renewed']
    },
    {
      id: 'CASE-003',
      customerName: 'Michael Johnson',
      policyNumber: 'POL-34567',
      status: 'Failed',
      agent: 'Carol Davis',
      uploadDate: '2025-04-06',
      isPriority: false,
      batchId: 'BATCH-2025-04-06-A',
      contactInfo: {
        email: 'michael.j@example.com',
        phone: '555-345-6789'
      },
      policyDetails: {
        type: 'Life',
        expiryDate: '2025-05-05',
        premium: 2100.00
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Failed']
    },
    {
      id: 'CASE-004',
      customerName: 'Emily Brown',
      policyNumber: 'POL-45678',
      status: 'In Progress',
      agent: 'David Wilson',
      uploadDate: '2025-04-05',
      isPriority: false,
      batchId: 'BATCH-2025-04-05-C',
      contactInfo: {
        email: 'emily.b@example.com',
        phone: '555-456-7890'
      },
      policyDetails: {
        type: 'Auto',
        expiryDate: '2025-05-20',
        premium: 1450.00
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress']
    },
    {
      id: 'CASE-005',
      customerName: 'Robert Taylor',
      policyNumber: 'POL-56789',
      status: 'Uploaded',
      agent: 'Unassigned',
      uploadDate: '2025-04-10',
      isPriority: false,
      batchId: 'BATCH-2025-04-10-A',
      contactInfo: {
        email: 'robert.t@example.com',
        phone: '555-567-8901'
      },
      policyDetails: {
        type: 'Home',
        expiryDate: '2025-06-01',
        premium: 1050.00
      },
      flowSteps: ['Uploaded']
    },
  ], []);

  const [cases, setCases] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    // Initialize cases with all non-renewed cases
    const initialCases = mockCases.filter(caseItem => caseItem.status !== 'Renewed');
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
    applyAllFilters(searchValue, statusFilter, dateFilter, agentFilter);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    
    // Apply all filters when the filter menu is closed
    applyAllFilters(searchTerm, statusFilter, dateFilter, agentFilter);
  };

  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const exportData = (format) => {
    // Convert cases data to the selected format
    const data = cases.map(caseItem => ({
      'Case ID': caseItem.id,
      'Customer Name': caseItem.customerName,
      'Policy Number': caseItem.policyNumber,
      'Batch ID': caseItem.batchId,
      'Status': caseItem.status,
      'Priority': caseItem.isPriority ? 'Priority' : 'Normal',
      'Assigned Agent': caseItem.agent,
      'Upload Date': new Date(caseItem.uploadDate).toLocaleDateString()
    }));

    let content = '';
    if (format === 'csv') {
      // Create CSV content
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => Object.values(row).join(','));
      content = `${headers}\n${rows.join('\n')}`;
    } else {
      // Create XLS (tab-separated) content
      const headers = Object.keys(data[0]).join('\t');
      const rows = data.map(row => Object.values(row).join('\t'));
      content = `${headers}\n${rows.join('\n')}`;
    }

    // Create and trigger download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `case_tracking.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Show success message
    setSuccessMessage(`Successfully exported data in ${format.toUpperCase()} format`);
    setTimeout(() => setSuccessMessage(''), 3000);
    handleExportClose();
  };

  const handleStatusFilterChange = (event) => {
    const newStatusFilter = event.target.value;
    setStatusFilter(newStatusFilter);
    
    // Apply all filters
    applyAllFilters(searchTerm, newStatusFilter, dateFilter, agentFilter);
  };

  const handleDateFilterChange = (event) => {
    const newDateFilter = event.target.value;
    setDateFilter(newDateFilter);
    
    // Apply all filters
    applyAllFilters(searchTerm, statusFilter, newDateFilter, agentFilter);
  };

  const handleAgentFilterChange = (event) => {
    const newAgentFilter = event.target.value;
    setAgentFilter(newAgentFilter);
    
    // Apply all filters
    applyAllFilters(searchTerm, statusFilter, dateFilter, newAgentFilter);
  };
  
  // Helper function to apply all filters
  const applyAllFilters = (search, status, date, agent) => {
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
      
      // Filter by status
      const matchesStatus = status === 'all' || 
        caseItem.status.toLowerCase() === status.toLowerCase();
      
      // Filter by agent
      const matchesAgent = agent === 'all' || 
        caseItem.agent.toLowerCase() === agent.toLowerCase();
        
      // Filter by date if needed (example implementation)
      let matchesDate = true;
      if (date !== 'all') {
        const today = new Date();
        const caseDate = new Date(caseItem.uploadDate);
        
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
      
      // Exclude cases with status "Renewed"
      return matchesSearch && matchesStatus && matchesAgent && matchesDate && caseItem.status !== 'Renewed';
    });
    
    setCases(filteredCases);
    setPage(0); // Reset to first page when filtering
  };

  const handleEditClick = (caseData) => {
    setCurrentCase(caseData);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleSaveEdit = async () => {
    try {
      // In a real app, this would call your API
      // await updateCase(currentCase.id, currentCase);
      
      // Update local state
      setCases(cases.map(c => c.id === currentCase.id ? currentCase : c));
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update case:", error);
    }
  };

  const handleViewFlow = (caseData) => {
    setCurrentCase(caseData);
    navigate(`/logs?caseId=${caseData.id}`);
  };

  const handleCommentDialogOpen = (caseData) => {
    setCurrentCase(caseData);
    setCommentDialogOpen(true);
  };

  const handleCommentDialogClose = () => {
    setCommentDialogOpen(false);
    setCommentText('');
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;

    // In a real app, this would call your API to save the comment
    const newComment = {
      id: `comment-${Date.now()}`,
      text: commentText,
      user: 'Current User',
      timestamp: new Date().toISOString(),
    };

    // Update the case with the new comment
    const updatedCase = {
      ...currentCase,
      comments: [...(currentCase.comments || []), newComment]
    };

    // Update cases array with the new comment
    setCases(cases.map(c => c.id === currentCase.id ? updatedCase : c));

    // Close dialog and reset form
    handleCommentDialogClose();
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

  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  const handleActionMenuOpen = (event, caseId) => {
    setActionMenuAnchorEl(event.currentTarget);
    setSelectedCaseId(caseId);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchorEl(null);
    setSelectedCaseId(null);
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
            Case Tracking
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
                <AssignmentIndIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight="600">
                  Search Cases
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
              <ManageAccountsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">
                Case Management
              </Typography>
            </Box>
            <Divider sx={{ mx: 3, my: 2 }} />
            <Box sx={{ p: 1 }}>
              <Table sx={{ minWidth: 650 }} aria-label="case tracking table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>Case ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>Customer Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>Policy Number</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>Batch ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>Upload Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((caseItem) => (
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
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500,
                            color: 'primary.main',
                            cursor: 'pointer',
                            '&:hover': {
                              textDecoration: 'underline'
                            }
                          }}
                          onClick={(e) => handleCustomerNameClick(e, caseItem.customerName, caseItem.customerId)}
                        >
                          {caseItem.customerName}
                        </Typography>
                      </TableCell>
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
                      <TableCell>
                        <Chip
                          icon={<PriorityHighIcon />}
                          label={caseItem.isPriority ? "Priority" : "Normal"}
                          color={caseItem.isPriority ? "error" : "primary"}
                          variant={caseItem.isPriority ? "filled" : "outlined"}
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            try {
                              // Toggle priority status
                              const updatedCase = { ...caseItem, isPriority: !caseItem.isPriority };
                              // await updateCase(caseItem.id, { isPriority: !caseItem.isPriority });
                              
                              // Update the cases array with the updated case
                              setCases(cases.map(c => c.id === caseItem.id ? updatedCase : c));
                              setSuccessMessage(`Priority status ${!caseItem.isPriority ? 'enabled' : 'disabled'} for case ${caseItem.id}`);
                              
                              setTimeout(() => {
                                setSuccessMessage('');
                              }, 3000);
                            } catch (err) {
                              setError('Failed to update priority status');
                              // Auto-dismiss error message after 3 seconds
                              setTimeout(() => {
                                setError(null);
                              }, 3000);
                            }
                          }}
                          sx={{ 
                            cursor: 'pointer',
                            minWidth: '90px',
                            fontWeight: 500,
                            borderRadius: 5,
                            boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                            '&:hover': {
                              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                              transform: 'translateY(-1px)'
                            },
                            transition: 'transform 0.2s, box-shadow 0.2s',
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
                          {settings?.showEditCaseButton !== false && (
                            <Tooltip title="Edit Case" arrow placement="top">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentCase(caseItem);
                                  setEditDialogOpen(true);
                                }}
                                sx={{ 
                                  color: 'secondary.main',
                                  transition: 'transform 0.2s',
                                  '&:hover': { transform: 'scale(1.15)' }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
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

        {/* Filters Menu */}
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
            Filter Cases
          </Typography>
          <MenuItem sx={{ py: 1.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
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
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="uploaded">Uploaded</MenuItem>
                <MenuItem value="assigned">Assigned</MenuItem>
                <MenuItem value="inProgress">In Progress</MenuItem>
                <MenuItem value="processed">Payment Processed</MenuItem>
                <MenuItem value="renewed">Renewed</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
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
                <MenuItem value="Alice Johnson">Alice Johnson</MenuItem>
                <MenuItem value="Bob Miller">Bob Miller</MenuItem>
                <MenuItem value="Carol Davis">Carol Davis</MenuItem>
                <MenuItem value="David Wilson">David Wilson</MenuItem>
                <MenuItem value="Unassigned">Unassigned</MenuItem>
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
              exportData('csv');
              handleExportClose();
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
              <InsertDriveFileIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Export as CSV" />
          </MenuItem>
          <MenuItem 
            onClick={() => { 
              exportData('xls');
              handleExportClose();
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
              <TableViewIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Export as Excel" />
          </MenuItem>
        </Menu>

        {/* Edit Dialog */}
        <Dialog 
          open={editDialogOpen} 
          onClose={handleEditDialogClose} 
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
            Edit Case Details
          </DialogTitle>
          <DialogContent dividers>
            {currentCase && (
              <Box sx={{ pt: 2, display: 'grid', gap: 2.5, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <TextField
                  label="Customer Name"
                  fullWidth
                  value={currentCase.customerName}
                  onChange={(e) => setCurrentCase({...currentCase, customerName: e.target.value})}
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
                
                <TextField
                  label="Policy Number"
                  fullWidth
                  value={currentCase.policyNumber}
                  disabled // Policy number shouldn't be editable
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
                
                <TextField
                  label="Email"
                  fullWidth
                  value={currentCase.contactInfo.email}
                  onChange={(e) => setCurrentCase({
                    ...currentCase, 
                    contactInfo: {...currentCase.contactInfo, email: e.target.value}
                  })}
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
                
                <TextField
                  label="Phone"
                  fullWidth
                  value={currentCase.contactInfo.phone}
                  onChange={(e) => setCurrentCase({
                    ...currentCase, 
                    contactInfo: {...currentCase.contactInfo, phone: e.target.value}
                  })}
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
                
                <FormControl fullWidth>
                  <InputLabel>Policy Type</InputLabel>
                  <Select
                    value={currentCase.policyDetails.type}
                    label="Policy Type"
                    onChange={(e) => setCurrentCase({
                      ...currentCase,
                      policyDetails: {...currentCase.policyDetails, type: e.target.value}
                    })}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="Auto">Auto</MenuItem>
                    <MenuItem value="Home">Home</MenuItem>
                    <MenuItem value="Life">Life</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  label="Premium"
                  type="number"
                  fullWidth
                  value={currentCase.policyDetails.premium}
                  onChange={(e) => setCurrentCase({
                    ...currentCase,
                    policyDetails: {...currentCase.policyDetails, premium: parseFloat(e.target.value)}
                  })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    sx: { borderRadius: 2 }
                  }}
                />
                
                <TextField
                  label="Expiry Date"
                  type="date"
                  fullWidth
                  value={currentCase.policyDetails.expiryDate}
                  onChange={(e) => setCurrentCase({
                    ...currentCase,
                    policyDetails: {...currentCase.policyDetails, expiryDate: e.target.value}
                  })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
                
                <FormControl fullWidth>
                  <InputLabel>Assigned Agent</InputLabel>
                  <Select
                    value={currentCase.agent === 'Unassigned' ? '' : currentCase.agent}
                    label="Assigned Agent"
                    onChange={(e) => setCurrentCase({
                      ...currentCase,
                      agent: e.target.value || 'Unassigned'
                    })}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="">Unassigned</MenuItem>
                    <MenuItem value="Alice Johnson">Alice Johnson</MenuItem>
                    <MenuItem value="Bob Miller">Bob Miller</MenuItem>
                    <MenuItem value="Carol Davis">Carol Davis</MenuItem>
                    <MenuItem value="David Wilson">David Wilson</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button 
              onClick={handleEditDialogClose} 
              variant="outlined"
              sx={{ borderRadius: 2, px: 3 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEdit} 
              variant="contained"
              sx={{ borderRadius: 2, px: 3 }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Comment Dialog */}
        <Dialog open={commentDialogOpen} onClose={handleCommentDialogClose} maxWidth="md" fullWidth>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogContent>
            {currentCase && (
              <Box sx={{ pt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Case: {currentCase.id} - {currentCase.customerName}
                </Typography>
                
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Enter your comment here..."
                  sx={{ mt: 2, mb: 3 }}
                />

                {currentCase.comments && currentCase.comments.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Previous Comments
                    </Typography>
                    <List>
                      {currentCase.comments.map((comment) => (
                        <React.Fragment key={comment.id}>
                          <ListItem alignItems="flex-start">
                            <ListItemText
                              primary={comment.text}
                              secondary={
                                <React.Fragment>
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                    sx={{ display: 'block' }}
                                  >
                                    {comment.user}
                                  </Typography>
                                  {new Date(comment.timestamp).toLocaleString()}
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                          <Divider component="li" />
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCommentDialogClose}>Cancel</Button>
            <Button onClick={handleCommentSubmit} variant="contained" disabled={!commentText.trim()}>
              Add Comment
            </Button>
          </DialogActions>
        </Dialog>

        {/* Auto-refresh button at the bottom right */}
        <Box sx={{ position: 'fixed', right: 30, bottom: 30 }}>
          <Zoom in={loaded} style={{ transitionDelay: '800ms' }}>
            <Tooltip title={settings?.autoRefresh ? "Auto-refresh enabled" : "Refresh cases"} arrow>
              <IconButton 
                color="primary"
                onClick={() => {
                  // Refresh data
                  setSuccessMessage('Cases refreshed successfully');
                  setTimeout(() => setSuccessMessage(''), 3000);
                }}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
                  width: 56,
                  height: 56,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px) rotate(30deg)',
                    boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
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

export default CaseTracking;