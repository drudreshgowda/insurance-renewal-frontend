import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, Typography, Paper, TextField, InputAdornment, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, TablePagination, Chip, IconButton, 
  Menu, MenuItem, Tooltip, Button, Dialog, 
  DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, Stepper, Step, StepLabel,
  List, ListItem, ListItemText, Divider, Alert,
  ListItemIcon, Card, CardContent, Grow, Fade
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
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '@mui/material/styles';

const ClosedCases = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const theme = useTheme();
  
  const mockCases = useMemo(() => [
    {
      id: 'CASE-002',
      customerName: 'Sarah Williams',
      policyNumber: 'POL-23456',
      status: 'Renewed',
      agent: 'Bob Miller',
      uploadDate: '2025-04-07',
      closedDate: '2025-04-15',
      isPriority: false,
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
      id: 'CASE-006',
      customerName: 'James Anderson',
      policyNumber: 'POL-67890',
      status: 'Renewed',
      agent: 'Carol Davis',
      uploadDate: '2025-04-02',
      closedDate: '2025-04-10',
      isPriority: true,
      batchId: 'BATCH-2025-04-02-A',
      contactInfo: {
        email: 'james.a@example.com',
        phone: '555-789-0123'
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
      customerName: 'Michelle Lee',
      policyNumber: 'POL-89012',
      status: 'Renewed',
      agent: 'Alice Johnson',
      uploadDate: '2025-03-25',
      closedDate: '2025-04-05',
      isPriority: false,
      batchId: 'BATCH-2025-03-25-D',
      contactInfo: {
        email: 'michelle.l@example.com',
        phone: '555-012-3456'
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
  const [flowDialogOpen, setFlowDialogOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState(null);

  // Initialize with mock data
  useEffect(() => {
    // In a real application, you would fetch data from an API
    // Filter cases to only show Renewed status
    const filteredCases = mockCases.filter(caseItem => {
      const matchesSearch = !searchTerm || 
        caseItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAgent = agentFilter === 'all' || 
        caseItem.agent.toLowerCase() === agentFilter.toLowerCase();
      
      return matchesSearch && matchesAgent && caseItem.status === 'Renewed';
    });
    
    setCases(filteredCases);
  }, [searchTerm, agentFilter, dateFilter, mockCases]);

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
    setPage(0); // Reset to first page when searching
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleAgentFilterChange = (event) => {
    setAgentFilter(event.target.value);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleViewFlow = (caseData) => {
    setCurrentCase(caseData);
    setFlowDialogOpen(true);
  };

  const handleFlowDialogClose = () => {
    setFlowDialogOpen(false);
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
            <Button
              variant="contained"
              startIcon={<FilterIcon />}
              onClick={handleFilterClick}
              color="primary"
              sx={{
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              Filters
            </Button>

            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportClick}
              sx={{
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              Export
            </Button>
          </Box>
        </Box>
        
        {successMessage && (
          <Grow in={!!successMessage}>
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
              {successMessage}
            </Alert>
          </Grow>
        )}
        
        {error && (
          <Grow in={!!error}>
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
              {error}
            </Alert>
          </Grow>
        )}
        
        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 2 }}>
            <TextField
              placeholder="Search by Case ID, Customer Name or Policy Number"
              variant="outlined"
              size="small"
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
                  backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  '&:hover': {
                    backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                  },
                  transition: 'background-color 0.3s'
                }
              }}
            />
          </CardContent>
        </Card>
        
        <TableContainer 
          component={Paper} 
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
            mb: 4
          }}
        >
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
                        backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
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
                          boxShadow: '0 2px 5px rgba(0,0,0,0.08)'
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
                        <Tooltip title="Case Logs" arrow placement="top">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/logs?caseId=${caseItem.id}`);
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={cases.length}
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
          elevation={3}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: 180,
              boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
            }
          }}
        >
          <MenuItem onClick={() => {
            // Export logic would go here
            handleExportClose();
            setSuccessMessage('Export completed successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
          }} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <TableViewIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText>Export as XLS</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => {
            // Export logic would go here
            handleExportClose();
            setSuccessMessage('Export completed successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
          }} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <InsertDriveFileIcon fontSize="small" color="secondary" />
            </ListItemIcon>
            <ListItemText>Export as CSV</ListItemText>
          </MenuItem>
        </Menu>
        
        {/* Advanced Filter Menu */}
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
          PaperProps={{
            sx: {
              p: 2,
              borderRadius: 2,
              minWidth: 250,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
            }
          }}
        >
          <Typography variant="subtitle2" sx={{ px: 1, pb: 2 }}>
            Filter Closed Cases
          </Typography>
          <MenuItem sx={{ py: 1.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Agent</InputLabel>
              <Select
                value={agentFilter}
                label="Agent"
                onChange={handleAgentFilterChange}
              >
                <MenuItem value="all">All Agents</MenuItem>
                <MenuItem value="alice johnson">Alice Johnson</MenuItem>
                <MenuItem value="bob miller">Bob Miller</MenuItem>
                <MenuItem value="carol davis">Carol Davis</MenuItem>
                <MenuItem value="david wilson">David Wilson</MenuItem>
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
              >
                <MenuItem value="all">All Dates</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="yesterday">Yesterday</MenuItem>
                <MenuItem value="lastWeek">Last 7 Days</MenuItem>
                <MenuItem value="lastMonth">Last 30 Days</MenuItem>
              </Select>
            </FormControl>
          </MenuItem>
        </Menu>
        
        {/* Case Flow Dialog */}
        <Dialog 
          open={flowDialogOpen} 
          onClose={handleFlowDialogClose} 
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
            Case Flow
          </DialogTitle>
          <DialogContent dividers>
            {currentCase && (
              <Box sx={{ width: '100%', p: 2 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="500">
                  {currentCase.id} - {currentCase.customerName}
                </Typography>
                
                <Stepper activeStep={currentCase.flowSteps.length - 1} alternativeLabel sx={{ mt: 3 }}>
                  {['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Payment Processed', 'Renewed'].map((label, index) => {
                    const stepCompleted = currentCase.flowSteps.includes(label);
                    
                    return (
                      <Step key={label} completed={stepCompleted}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom fontWeight="600">
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
                        <Typography variant="subtitle2" fontWeight="500">
                          {step}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {/* In a real app, this would show actual timestamps */}
                          {new Date(new Date(currentCase.closedDate).getTime() - (index * 24 * 60 * 60 * 1000)).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={handleFlowDialogClose}
              variant="contained"
              sx={{ borderRadius: 2, px: 3 }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default ClosedCases; 