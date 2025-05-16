import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, Typography, Paper, TextField, InputAdornment, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, TablePagination, Chip, IconButton, 
  Menu, MenuItem, Tooltip, Button, Dialog, 
  DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, Stepper, Step, StepLabel,
  List, ListItem, ListItemText, Divider, Alert,
  ListItemIcon
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
  History as HistoryIcon
} from '@mui/icons-material';
import { fetchCases, updateCase } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const CaseTracking = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  
  const mockCases = useMemo(() => [
    {
      id: 'CASE-001',
      customerName: 'John Smith',
      policyNumber: 'POL-12345',
      status: 'Assigned',
      agent: 'Alice Johnson',
      uploadDate: '2025-04-08',
      isPriority: false,
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
  const [flowDialogOpen, setFlowDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    // Filter cases based on current filters
    const filteredCases = mockCases.filter(caseItem => {
      const matchesSearch = !searchTerm || 
        caseItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        caseItem.status.toLowerCase() === statusFilter.toLowerCase();
      
      const matchesAgent = agentFilter === 'all' || 
        caseItem.agent.toLowerCase() === agentFilter.toLowerCase();
      
      return matchesSearch && matchesStatus && matchesAgent;
    });
    
    setCases(filteredCases);
  }, [searchTerm, statusFilter, dateFilter, agentFilter, mockCases]);
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

    // Filter cases based on search term
    const filteredCases = mockCases.filter(caseItem => {
      const searchLower = searchValue.toLowerCase();
      return (
        caseItem.id.toLowerCase().includes(searchLower) ||
        caseItem.customerName.toLowerCase().includes(searchLower) ||
        caseItem.policyNumber.toLowerCase().includes(searchLower)
      );
    });

    setCases(filteredCases);
    setPage(0); // Reset to first page when searching
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
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
    setStatusFilter(event.target.value);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  const handleAgentFilterChange = (event) => {
    setAgentFilter(event.target.value);
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
    setFlowDialogOpen(true);
  };

  const handleFlowDialogClose = () => {
    setFlowDialogOpen(false);
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
    <Box>
      <Typography variant="h4" gutterBottom>
        Case Tracking
      </Typography>
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          placeholder="Search by Case ID, Customer Name or Policy Number"
          variant="outlined"
          size="small"
          sx={{ width: '40%' }}
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={handleFilterClick}
          >
            Filters
          </Button>

          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportClick}
          >
            Export
          </Button>
        </Box>

        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
        >
          <MenuItem>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
                size="small"
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
          
          <MenuItem>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel>Date</InputLabel>
              <Select
                value={dateFilter}
                label="Date"
                onChange={handleDateFilterChange}
                size="small"
              >
                <MenuItem value="all">All Dates</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="yesterday">Yesterday</MenuItem>
                <MenuItem value="lastWeek">Last 7 Days</MenuItem>
                <MenuItem value="lastMonth">Last 30 Days</MenuItem>
              </Select>
            </FormControl>
          </MenuItem>
          
          <MenuItem>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel>Agent</InputLabel>
              <Select
                value={agentFilter}
                label="Agent"
                onChange={handleAgentFilterChange}
                size="small"
              >
                <MenuItem value="all">All Agents</MenuItem>
                <MenuItem value="unassigned">Unassigned</MenuItem>
                <MenuItem value="alice">Alice Johnson</MenuItem>
                <MenuItem value="bob">Bob Miller</MenuItem>
                <MenuItem value="carol">Carol Davis</MenuItem>
                <MenuItem value="david">David Wilson</MenuItem>
              </Select>
            </FormControl>
          </MenuItem>
        </Menu>
      </Box>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="case tracking table">
          <TableHead>
            <TableRow>
              <TableCell>Case ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Policy Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Last Action Date</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cases.map((caseItem) => (
              <TableRow key={caseItem.id}>
                <TableCell>{caseItem.id}</TableCell>
                <TableCell>{caseItem.customerName}</TableCell>
                <TableCell>{caseItem.policyNumber}</TableCell>
                <TableCell>
                  <Chip
                    label={caseItem.status}
                    color={getStatusColor(caseItem.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={caseItem.isPriority ? "Priority" : "Normal"}
                    color={caseItem.isPriority ? "error" : "default"}
                    variant={caseItem.isPriority ? "filled" : "outlined"}
                    size="small"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        // Toggle priority status
                        const updatedCase = { ...caseItem, isPriority: !caseItem.isPriority };
                        await updateCase(caseItem.id, { isPriority: !caseItem.isPriority });
                        
                        // Update the cases array with the updated case
                        setCases(cases.map(c => c.id === caseItem.id ? updatedCase : c));
                        setSuccessMessage(`Priority status ${!caseItem.isPriority ? 'enabled' : 'disabled'} for case ${caseItem.id}`);
                      } catch (err) {
                        setError('Failed to update priority status');
                        // Auto-dismiss error message after 3 seconds
                        setTimeout(() => {
                          setError(null);
                        }, 3000);
                      }
                    }}
                    sx={{ cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell>{new Date(caseItem.uploadDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(caseItem.uploadDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/cases/${caseItem.id}`);
                        }}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {settings?.showEditCaseButton !== false && (
                      <Tooltip title="Edit Case">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentCase(caseItem);
                            setEditDialogOpen(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Case Logs">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/logs?caseId=${caseItem.id}`);
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={100} // In a real app, this would be the total count from API
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      
      {/* Export Menu */}
      <Menu
        anchorEl={exportAnchorEl}
        open={Boolean(exportAnchorEl)}
        onClose={handleExportClose}
      >
        <MenuItem onClick={() => exportData('xls')}>
          <ListItemIcon>
            <TableViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as XLS</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => exportData('csv')}>
          <ListItemIcon>
            <InsertDriveFileIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as CSV</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchorEl}
        open={Boolean(actionMenuAnchorEl)}
        onClose={handleActionMenuClose}
      >
        <MenuItem onClick={() => {
          handleActionMenuClose();
          const caseData = cases.find(c => c.id === selectedCaseId);
          if (caseData) navigate(`/cases/${caseData.id}`);
        }}>View Details</MenuItem>
        <MenuItem onClick={handleActionMenuClose}>Download Policy</MenuItem>
        <MenuItem onClick={() => {
          handleActionMenuClose();
          const caseData = cases.find(c => c.id === selectedCaseId);
          if (caseData) handleCommentDialogOpen(caseData);
        }}>Add Comment</MenuItem>
        <MenuItem onClick={() => {
          const updatedCases = cases.map(c => {
            if (c.id === selectedCaseId) {
              return { ...c, isPriority: !c.isPriority };
            }
            return c;
          });
          setCases(updatedCases);
          setSuccessMessage(`Case ${selectedCaseId} ${updatedCases.find(c => c.id === selectedCaseId).isPriority ? 'marked as' : 'removed from'} priority`);
          setTimeout(() => setSuccessMessage(''), 3000);
          handleActionMenuClose();
        }}>Toggle Priority</MenuItem>
      </Menu>
      
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="md">
        <DialogTitle>Edit Case Details</DialogTitle>
        <DialogContent>
          {currentCase && (
            <Box sx={{ pt: 2, display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <TextField
                label="Customer Name"
                fullWidth
                value={currentCase.customerName}
                onChange={(e) => setCurrentCase({...currentCase, customerName: e.target.value})}
              />
              
              <TextField
                label="Policy Number"
                fullWidth
                value={currentCase.policyNumber}
                disabled // Policy number shouldn't be editable
              />
              
              <TextField
                label="Email"
                fullWidth
                value={currentCase.contactInfo.email}
                onChange={(e) => setCurrentCase({
                  ...currentCase, 
                  contactInfo: {...currentCase.contactInfo, email: e.target.value}
                })}
              />
              
              <TextField
                label="Phone"
                fullWidth
                value={currentCase.contactInfo.phone}
                onChange={(e) => setCurrentCase({
                  ...currentCase, 
                  contactInfo: {...currentCase.contactInfo, phone: e.target.value}
                })}
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
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
      
      {/* Case Flow Dialog */}
      <Dialog open={flowDialogOpen} onClose={handleFlowDialogClose} maxWidth="md">
        <DialogTitle>Case Flow</DialogTitle>
        <DialogContent>
          {currentCase && (
            <Box sx={{ width: '100%', p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {currentCase.id} - {currentCase.customerName}
              </Typography>
              
              <Stepper activeStep={currentCase.flowSteps.length - 1} alternativeLabel>
                {['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Payment Processed', 'Renewed'].map((label, index) => {
                  const stepCompleted = currentCase.flowSteps.includes(label);
                  const stepFailed = label === 'Failed' && currentCase.status === 'Failed';
                  
                  return (
                    <Step key={label} completed={stepCompleted}>
                      <StepLabel error={stepFailed}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Timeline
                </Typography>
                
                {currentCase.flowSteps.map((step, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 2 }}>
                    <Box sx={{ 
                      width: 10, 
                      height: 10, 
                      borderRadius: '50%', 
                      bgcolor: 'primary.main',
                      mt: 1,
                      mr: 2
                    }} />
                    <Box>
                      <Typography variant="subtitle2">
                        {step}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {/* In a real app, this would show actual timestamps */}
                        {new Date(new Date(currentCase.uploadDate).getTime() - (index * 24 * 60 * 60 * 1000)).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFlowDialogClose}>Close</Button>
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
    </Box>
  );
};

export default CaseTracking;