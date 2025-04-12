import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Button, Grid, 
  LinearProgress, Alert, AlertTitle, List, 
  ListItem, ListItemText, Divider, Chip 
} from '@mui/material';
import { CloudUpload as UploadIcon, Download as DownloadIcon } from '@mui/icons-material';
import { uploadPolicyData } from '../services/api';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([
    {
      id: 'upload-123',
      filename: 'april_renewals.xlsx',
      timestamp: '2025-04-10T09:30:00',
      status: 'Completed',
      records: 156,
      successful: 142,
      failed: 14
    },
    {
      id: 'upload-122',
      filename: 'march_end_batch.xlsx',
      timestamp: '2025-03-28T14:15:00',
      status: 'Completed',
      records: 203,
      successful: 189,
      failed: 14
    }
  ]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 500);
    
    try {
      // In a real app, this would call your API
      // const result = await uploadPolicyData(file);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Mock successful upload
      const newUpload = {
        id: `upload-${Date.now()}`,
        filename: file.name,
        timestamp: new Date().toISOString(),
        status: 'Processing',
        records: 178,
        successful: '...',
        failed: '...'
      };
      
      setUploadHistory([newUpload, ...uploadHistory]);
      
      setUploadStatus({
        type: 'success',
        message: 'File uploaded successfully. Processing has begun.'
      });
      
      // Simulate status change after processing
      setTimeout(() => {
        setUploadHistory(prev => {
          const updated = [...prev];
          updated[0] = {
            ...updated[0],
            status: 'Completed',
            successful: 165,
            failed: 13
          };
          return updated;
        });
      }, 8000);
      
    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus({
        type: 'error',
        message: error.message || 'Failed to upload file. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // In a real app, this would download a template file
    alert('Template download would start here');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Processing': return 'warning';
      case 'Failed': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Upload Data
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload New File
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Upload cases using our template format. Only Excel (.xlsx) or CSV files are supported.
              </Typography>
              
              <Button 
                variant="outlined" 
                startIcon={<DownloadIcon />}
                onClick={handleDownloadTemplate}
                sx={{ mb: 2 }}
              >
                Download Template
              </Button>
            </Box>
            
            <Box 
              sx={{ 
                border: '2px dashed #ccc', 
                borderRadius: 2, 
                p: 3, 
                textAlign: 'center',
                mb: 3
              }}
            >
              <input
                accept=".xlsx,.csv"
                style={{ display: 'none' }}
                id="upload-file-button"
                type="file"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <label htmlFor="upload-file-button">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<UploadIcon />}
                  disabled={uploading}
                >
                  Select File
                </Button>
              </label>
              
              {file && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </Typography>
              )}
            </Box>
            
            {file && !uploading && (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleUpload}
                fullWidth
              >
                Upload and Process
              </Button>
            )}
            
            {uploading && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                  Uploading... {uploadProgress}%
                </Typography>
              </Box>
            )}
            
            {uploadStatus && (
              <Alert 
                severity={uploadStatus.type} 
                sx={{ mt: 2 }}
              >
                <AlertTitle>{uploadStatus.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
                {uploadStatus.message}
              </Alert>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Uploads
            </Typography>
            
            <List>
              {uploadHistory.map((upload, index) => (
                <React.Fragment key={upload.id}>
                  {index > 0 && <Divider />}
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1">
                            {upload.filename}
                          </Typography>
                          <Chip 
                            label={upload.status} 
                            color={getStatusColor(upload.status)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {new Date(upload.timestamp).toLocaleString()}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2">
                              Total Records: {upload.records} | 
                              Successful: {upload.successful} | 
                              Failed: {upload.failed}
                            </Typography>
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Upload;