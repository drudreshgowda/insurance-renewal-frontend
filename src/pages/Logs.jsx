import React, { useState } from 'react';
import { 
  Box, Typography, Paper, TextField, Button, 
  List, ListItem, ListItemText, Divider, 
  Chip, CircularProgress, Alert, 
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { fetchLogs } from '../services/api';

const Logs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('caseId');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
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
            details: 'Case assigned to agent Alice Johnson',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-004',
            timestamp: '2025-04-09T11:45:22',
            action: 'Contact Update',
            details: 'Customer phone number updated from 555-123-4567 to 555-123-9876',
            user: 'Alice Johnson',
            level: 'warning'
          },
          {
            id: 'log-005',
            timestamp: '2025-04-09T14:20:05',
            action: 'Processing',
            details: 'Agent has begun renewal processing',
            user: 'Alice Johnson',
            level: 'info'
          },
          {
            id: 'log-006',
            timestamp: '2025-04-10T09:05:18',
            action: 'Comment Added',
            details: 'Customer requested additional coverage options. Will follow up tomorrow.',
            user: 'Alice Johnson',
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
            details: 'Case assigned to agent Alice Johnson',
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
  };

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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Case Logs
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
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
          />
          
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={loading}
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
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        
        {!loading && searched && logs.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No logs found for the specified {searchType === 'caseId' ? 'Case ID' : 'Policy Number'}. Please check your input and try again.
          </Alert>
        )}
      </Paper>
      
      {logs.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Activity Log
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              {searchType === 'caseId' ? 'Case ID:' : 'Policy Number:'} <strong>{searchQuery}</strong>
            </Typography>
          </Box>
          
          <List>
            {logs.map((log, index) => (
              <React.Fragment key={log.id}>
                {index > 0 && <Divider />}
                <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {log.action}
                          </Typography>
                          <Chip 
                            label={log.level} 
                            color={getLogLevelColor(log.level)}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(log.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ display: 'block' }}>
                          {log.details}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          By: {log.user}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default Logs;