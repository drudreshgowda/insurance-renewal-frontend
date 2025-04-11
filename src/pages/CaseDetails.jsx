import React, { useState, useEffect } from 'react';
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

const CaseDetails = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      setLoading(true);
      try {
        // Mock data for demonstration
        const mockCase = {
          id: caseId,
          customerName: 'John Smith',
          policyNumber: 'POL-12345',
          status: 'In Progress',
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
            premium: 1250.00,
            coverage: {
              liability: '$300,000',
              collision: '$500 deductible',
              comprehensive: '$250 deductible'
            }
          },
          flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress'],
          history: [
            {
              date: '2025-04-08T09:15:30',
              action: 'Case Created',
              details: 'Case uploaded via bulk upload',
              user: 'System'
            },
            {
              date: '2025-04-08T09:15:35',
              action: 'Validation',
              details: 'All required fields present and valid',
              user: 'System'
            },
            {
              date: '2025-04-08T10:30:12',
              action: 'Assignment',
              details: 'Case assigned to agent Alice Johnson',
              user: 'System'
            }
          ]
        };

        setCaseData(mockCase);
      } catch (err) {
        setError('Failed to fetch case details');
        console.error(err);
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
            />
            <Typography variant="body2" color="text.secondary">
              Last Updated: {new Date(caseData.uploadDate).toLocaleString()}
            </Typography>
          </Stack>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => {}}
        >
          Edit Case
        </Button>
      </Box>

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