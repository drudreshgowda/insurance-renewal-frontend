import React, { useState, useEffect } from 'react';
// No need to import getCaseById here as we're using dynamic import in the useEffect
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Alert,
  Card,
  CardContent,
  Stack,
  Avatar,
  Tooltip,
  TextField,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  AccessTime as AccessTimeIcon,
  PriorityHigh as PriorityHighIcon,
} from '@mui/icons-material';
import { useSettings } from '../context/SettingsContext';

const CaseDetails = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchCaseDetails = async () => {
      setLoading(true);
      try {
        // Import the API function to get case by ID
        const { getCaseById } = await import('../services/api');
        
        // Fetch case data using the caseId from URL parameters
        const caseData = await getCaseById(caseId);
        
        setCaseData(caseData);
      } catch (err) {
        setError(`Failed to fetch case details: ${err.message}`);
        console.error('Error fetching case details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [caseId]);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading case details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!caseData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Case not found</Alert>
      </Box>
    );
  }

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
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/cases')} sx={{ bgcolor: 'background.paper' }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Case Details - {caseData.id}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label={caseData.status}
              color={getStatusColor(caseData.status)}
              sx={{ fontWeight: 500 }}
            />
            <Chip
              icon={<PriorityHighIcon />}
              label={caseData.isPriority ? 'Priority' : 'Normal'}
              color={caseData.isPriority ? 'error' : 'default'}
              variant={caseData.isPriority ? 'filled' : 'outlined'}
              onClick={async () => {
                try {
                  const { updateCase } = await import('../services/api');
                  await updateCase(caseId, { isPriority: !caseData.isPriority });
                  setCaseData({ ...caseData, isPriority: !caseData.isPriority });
                  setSuccessMessage(`Priority status ${!caseData.isPriority ? 'enabled' : 'disabled'}`);
                } catch (err) {
                  setError('Failed to update priority status');
                }
              }}
              sx={{ cursor: 'pointer' }}
            />
            <Typography variant="body2" color="text.secondary">
              Last Updated: {new Date(caseData.uploadDate).toLocaleString()}
            </Typography>
          </Stack>
        </Box>
        {settings?.showEditCaseButton !== false && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => {}}
          >
            Edit Case
          </Button>
        )}
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Customer Information */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{caseData.customerName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Customer Details
                  </Typography>
                </Box>
              </Box>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon color="action" />
                  <Typography>{caseData.contactInfo.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon color="action" />
                  <Typography>{caseData.contactInfo.phone}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Policy Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <DescriptionIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Policy Information</Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Policy Number
                      </Typography>
                      <Typography variant="body1">{caseData.policyNumber}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Policy Type
                      </Typography>
                      <Typography variant="body1">{caseData.policyDetails.type}</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Premium
                      </Typography>
                      <Typography variant="body1">
                        ${caseData.policyDetails.premium.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Expiry Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(caseData.policyDetails.expiryDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Case Flow */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TimelineIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Case Flow</Typography>
              </Box>
              <Stepper activeStep={caseData.flowSteps.indexOf(caseData.status)} alternativeLabel>
                {caseData.flowSteps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </Grid>

        {/* Add Comment */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <HistoryIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Add Comment</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button
                  variant="contained"
                  disabled={!comment.trim()}
                  onClick={async () => {
                    try {
                      const { updateCase } = await import('../services/api');
                      const newHistory = [
                        {
                          date: new Date().toISOString(),
                          action: 'Comment Added',
                          details: comment,
                          user: 'Current User', // In a real app, this would come from auth context
                          level: 'info'
                        },
                        ...caseData.history
                      ];
                      await updateCase(caseId, { history: newHistory });
                      setCaseData({ ...caseData, history: newHistory });
                      setComment('');
                      setSuccessMessage('Comment added successfully');
                    } catch (err) {
                      setError('Failed to add comment');
                    }
                  }}
                >
                  Add Comment
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Case History */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <HistoryIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Case History</Typography>
              </Box>
              <List>
                {caseData.history.map((event, index) => (
                  <React.Fragment key={event.date}>
                    {index > 0 && <Divider />}
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2">{event.action}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(event.date).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {event.details}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                              By: {event.user}
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
        </Grid>

        {/* Coverage Details */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AssignmentIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Coverage Details</Typography>
              </Box>
              <Grid container spacing={3}>
                {Object.entries(caseData.policyDetails.coverage).map(([key, value]) => (
                  <Grid item xs={12} sm={4} key={key}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Typography>
                      <Typography variant="body1">{value}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CaseDetails;