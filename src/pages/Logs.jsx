import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Box, Typography, TextField, Button, 
  List, ListItem, ListItemText, Divider, 
  Chip, CircularProgress, Alert, 
  FormControl, InputLabel, Select, MenuItem,
  Card, CardContent,
  Fade, Grow, InputAdornment
} from '@mui/material';
import { 
  Search as SearchIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';


const Logs = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const caseIdParam = queryParams.get('caseId');
  
  const [searchQuery, setSearchQuery] = useState(caseIdParam || '');
  const [searchType, setSearchType] = useState('caseId');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      // In a real app, this would call your API
      // const logsData = await fetchLogs(searchType, searchQuery);
      // setLogs(logsData);
      
      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (searchType === 'caseId' && searchQuery === 'CASE-001') {
        setLogs([
          {
            id: 'log-001',
            timestamp: '2025-04-08T09:15:30',
            action: 'Case Created',
            details: 'Case uploaded via bulk upload',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-002',
            timestamp: '2025-04-08T09:15:35',
            action: 'Validation',
            details: 'All required fields present and valid',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-003',
            timestamp: '2025-04-08T10:30:12',
            action: 'Assignment',
            details: 'Case assigned to agent Priya Patel',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-004',
            timestamp: '2025-04-09T11:45:22',
            action: 'Contact Update',
            details: 'Customer phone number updated from 555-123-4567 to 555-123-9876',
            user: 'Priya Patel',
            level: 'warning'
          },
          {
            id: 'log-005',
            timestamp: '2025-04-09T14:20:05',
            action: 'Processing',
            details: 'Agent has begun renewal processing',
            user: 'Priya Patel',
            level: 'info'
          },
          {
            id: 'log-006',
            timestamp: '2025-04-10T09:05:18',
            action: 'Comment Added',
            details: 'Customer requested additional coverage options. Will follow up tomorrow.',
            user: 'Priya Patel',
            level: 'info'
          }
        ]);
      } else if (searchType === 'policyNumber' && searchQuery === 'POL-12345') {
        setLogs([
          {
            id: 'log-001',
            timestamp: '2025-04-08T09:15:30',
            action: 'Case Created',
            details: 'Case uploaded via bulk upload',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-002',
            timestamp: '2025-04-08T09:15:35',
            action: 'Validation',
            details: 'All required fields present and valid',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-003',
            timestamp: '2025-04-08T10:30:12',
            action: 'Assignment',
            details: 'Case assigned to agent Priya Patel',
            user: 'System',
            level: 'info'
          }
        ]);
      } else {
        setLogs([]);
      }
    } catch (err) {
      setError('Failed to fetch logs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchType, searchQuery]);

  useEffect(() => {
    // Set loaded state for animations
    setTimeout(() => {
      setLoaded(true);
    }, 100);

    // Auto-search if caseId is provided in URL
    if (caseIdParam) {
      handleSearch();
    }
  }, [caseIdParam, handleSearch]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'success': return 'success';
      default: return 'default';
    }
  };

  const getLogLevelIcon = (level) => {
    switch (level) {
      case 'error': return <ErrorIcon fontSize="small" />;
      case 'warning': return <WarningIcon fontSize="small" />;
      case 'info': return <InfoIcon fontSize="small" />;
      case 'success': return <CheckCircleIcon fontSize="small" />;
      default: return <InfoIcon fontSize="small" />;
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
            Case Logs
          </Typography>
        </Box>
        
        <Grow in={loaded} timeout={400}>
          <Card sx={{ mb: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.05)', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Search Logs
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                Search for detailed logs by Case ID or Policy Number to view the complete activity history.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <FormControl sx={{ width: 150 }}>
                  <InputLabel>Search By</InputLabel>
                  <Select
                    value={searchType}
                    label="Search By"
                    onChange={(e) => setSearchType(e.target.value)}
                    size="small"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="caseId">Case ID</MenuItem>
                    <MenuItem value="policyNumber">Policy Number</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  placeholder={searchType === 'caseId' ? "Enter Case ID (e.g., CASE-001)" : "Enter Policy Number (e.g., POL-12345)"}
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 2,
                      backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      '&:hover': {
                        backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
                      },
                      transition: 'background-color 0.3s'
                    }
                  }}
                />
                
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    boxShadow: 2,
                    minWidth: 100
                  }}
                >
                  Search
                </Button>
              </Box>
              
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              )}
              
              {error && (
                <Grow in={!!error}>
                  <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                    {error}
                  </Alert>
                </Grow>
              )}
              
              {!loading && searched && logs.length === 0 && (
                <Grow in={true}>
                  <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                    No logs found for the specified {searchType === 'caseId' ? 'Case ID' : 'Policy Number'}. Please check your input and try again.
                  </Alert>
                </Grow>
              )}
            </CardContent>
          </Card>
        </Grow>
        
        {logs.length > 0 && (
          <Grow in={!loading} timeout={600}>
            <Card sx={{ boxShadow: '0 8px 24px rgba(0,0,0,0.05)', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="600">
                    Activity Log
                  </Typography>
                  
                  <Chip
                    label={searchType === 'caseId' ? `Case ID: ${searchQuery}` : `Policy: ${searchQuery}`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
                
                <List sx={{ 
                  bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}>
                  {logs.map((log, index) => (
                    <React.Fragment key={log.id}>
                      {index > 0 && <Divider sx={{ opacity: 0.5 }} />}
                      <ListItem 
                        alignItems="flex-start" 
                        sx={{ 
                          py: 2,
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.03)',
                          }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1" fontWeight="600">
                                  {log.action}
                                </Typography>
                                <Chip 
                                  label={log.level} 
                                  color={getLogLevelColor(log.level)}
                                  size="small"
                                  icon={getLogLevelIcon(log.level)}
                                  sx={{ 
                                    fontWeight: 500,
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.08)'
                                  }}
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(log.timestamp).toLocaleString()}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography 
                                variant="body2" 
                                component="span"
                                sx={{ 
                                  display: 'block',
                                  mb: 0.5
                                }}
                              >
                                {log.details}
                              </Typography>
                              <Typography 
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'flex-end'
                                }}
                              >
                                User: {log.user}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grow>
        )}
      </Box>
    </Fade>
  );
};

export default Logs;