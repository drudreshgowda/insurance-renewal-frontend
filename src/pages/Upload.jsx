import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Button, Grid, 
  LinearProgress, Alert, AlertTitle, List, 
  ListItem, ListItemText, Divider, Chip,
  Card, CardContent, alpha, useTheme,
  Fade, Grow, Zoom
} from '@mui/material';
import { 
  CloudUpload as UploadIcon, 
  Download as DownloadIcon,
  CheckCircleOutline as CheckIcon,
  ErrorOutline as ErrorIcon,
  HourglassEmpty as PendingIcon
} from '@mui/icons-material';
import { uploadPolicyData } from '../services/api';

const Upload = () => {
  const theme = useTheme();
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckIcon color="success" />;
      case 'Processing': return <PendingIcon color="warning" />;
      case 'Failed': return <ErrorIcon color="error" />;
      default: return null;
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Upload Policy Data
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Grow in={true} timeout={800}>
              <Card 
                elevation={0} 
                sx={{ 
                  mb: 3, 
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  overflow: 'visible'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    Upload New File
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      Upload cases using our template format. Only Excel (.xlsx) or CSV files are supported.
                    </Typography>
                    
                    <Button 
                      variant="outlined" 
                      startIcon={<DownloadIcon />}
                      onClick={handleDownloadTemplate}
                      sx={{ 
                        mt: 1, 
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      Download Template
                    </Button>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      border: `2px dashed ${theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.3) : alpha(theme.palette.primary.main, 0.2)}`,
                      borderRadius: 3, 
                      p: 4, 
                      textAlign: 'center',
                      mb: 3,
                      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.05) : alpha(theme.palette.primary.main, 0.03),
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.primary.main, 0.05),
                        borderColor: theme.palette.primary.main,
                      }
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
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <UploadIcon 
                          sx={{ 
                            fontSize: 60, 
                            color: theme.palette.primary.main,
                            opacity: 0.7,
                            mb: 2
                          }} 
                        />
                        <Button
                          variant="contained"
                          component="span"
                          startIcon={<UploadIcon />}
                          disabled={uploading}
                          sx={{
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
                            }
                          }}
                        >
                          {file ? 'Change File' : 'Select File'}
                        </Button>
                        
                        <Typography variant="body2" sx={{ mt: 2, color: theme.palette.text.secondary }}>
                          Drag and drop or click to select
                        </Typography>
                      </Box>
                    </label>
                    
                    {file && (
                      <Zoom in={Boolean(file)}>
                        <Box sx={{ 
                          mt: 3, 
                          p: 2, 
                          borderRadius: 2, 
                          backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : alpha(theme.palette.background.paper, 0.8),
                          border: `1px solid ${theme.palette.divider}`
                        }}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {file.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {(file.size / 1024).toFixed(2)} KB • {file.type}
                          </Typography>
                        </Box>
                      </Zoom>
                    )}
                  </Box>
                  
                  {file && !uploading && (
                    <Fade in={Boolean(file && !uploading)}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleUpload}
                        fullWidth
                        size="large"
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
                          }
                        }}
                      >
                        Upload and Process File
                      </Button>
                    </Fade>
                  )}
                  
                  {uploading && (
                    <Box sx={{ width: '100%', mt: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={uploadProgress} 
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: alpha(theme.palette.primary.main, 0.2),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                          }
                        }}
                      />
                      <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', fontWeight: 500 }}>
                        Uploading... {uploadProgress}%
                      </Typography>
                    </Box>
                  )}
                  
                  {uploadStatus && (
                    <Grow in={Boolean(uploadStatus)}>
                      <Alert 
                        severity={uploadStatus.type} 
                        sx={{ 
                          mt: 3,
                          borderRadius: 2,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        icon={uploadStatus.type === 'success' ? <CheckIcon /> : <ErrorIcon />}
                      >
                        <AlertTitle>{uploadStatus.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
                        {uploadStatus.message}
                      </Alert>
                    </Grow>
                  )}
                </CardContent>
              </Card>
            </Grow>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Grow in={true} timeout={1000}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    Recent Uploads
                  </Typography>
                  
                  <List sx={{ px: 1 }}>
                    {uploadHistory.map((upload, index) => (
                      <Grow key={upload.id} in={true} timeout={(index + 1) * 200}>
                        <Box>
                          {index > 0 && <Divider sx={{ my: 2 }} />}
                          <ListItem 
                            alignItems="flex-start" 
                            disableGutters
                            sx={{ px: 1 }}
                          >
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {upload.filename}
                                  </Typography>
                                  <Chip 
                                    label={upload.status} 
                                    color={getStatusColor(upload.status)}
                                    size="small"
                                    icon={getStatusIcon(upload.status)}
                                    sx={{ 
                                      fontWeight: 500,
                                      '& .MuiChip-icon': { fontSize: '0.8rem' }
                                    }}
                                  />
                                </Box>
                              }
                              secondary={
                                <>
                                  <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                    {new Date(upload.timestamp).toLocaleString()}
                                  </Typography>
                                  <Box sx={{ 
                                    mt: 1, 
                                    p: 1.5, 
                                    borderRadius: 2, 
                                    backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.4) : alpha(theme.palette.background.default, 0.8),
                                    border: `1px solid ${theme.palette.divider}`
                                  }}>
                                    <Grid container spacing={2}>
                                      <Grid item xs={4}>
                                        <Typography variant="body2" color="text.secondary">
                                          Total Records
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                          {upload.records}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={4}>
                                        <Typography variant="body2" color="success.main">
                                          Successful
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                                          {upload.successful}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={4}>
                                        <Typography variant="body2" color="error.main">
                                          Failed
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                                          {upload.failed}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Box>
                                </>
                              }
                            />
                          </ListItem>
                        </Box>
                      </Grow>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default Upload;