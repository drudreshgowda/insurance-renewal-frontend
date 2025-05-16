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
  LocalOffer as LocalOfferIcon,
  DirectionsCar as DirectionsCarIcon,
  HealthAndSafety as HealthAndSafetyIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  Settings as SettingsIcon,
  Chat as ChatIcon,
  ArrowCircleUp as ArrowCircleUpIcon,
  MailOutline as MailOutlineIcon,
  Payments as PaymentsIcon,
  AccountBalance as AccountBalanceIcon,
  CheckCircle as CheckCircleIcon,
  WhatsApp as WhatsAppIcon,
  CreditCard as CreditCardIcon
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
              color={caseData.isPriority ? 'error' : 'primary'}
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
              sx={{ 
                cursor: 'pointer',
                ...(caseData.isPriority ? {} : {
                  borderWidth: '1px',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '& .MuiChip-icon': {
                    color: 'primary.main'
                  },
                  fontWeight: 500
                })
              }}
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
          <Card sx={{ height: '100%' }}>
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
          <Card sx={{ height: '100%' }}>
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

        {/* Customer Preferences */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SettingsIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Customer Preferences</Typography>
              </Box>
              
              <Grid container spacing={3}>
                {/* Communication Preferences */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ChatIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                        Communication Preferences
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EmailIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="body2">Email</Typography>
                        </Box>
                        <Chip 
                          label="Preferred" 
                          size="small" 
                          color="primary" 
                          sx={{ fontWeight: 'medium' }} 
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PhoneIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="body2">Phone Call</Typography>
                        </Box>
                        <Chip 
                          label="Backup" 
                          size="small" 
                          variant="outlined" 
                          sx={{ fontWeight: 'medium' }} 
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <WhatsAppIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="body2">WhatsApp</Typography>
                        </Box>
                        <Chip 
                          label="Accepted" 
                          size="small" 
                          variant="outlined"
                          color="success" 
                          sx={{ fontWeight: 'medium' }} 
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <MailOutlineIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="body2">Postal Mail</Typography>
                        </Box>
                        <Chip 
                          label="Opted Out" 
                          size="small" 
                          variant="outlined"
                          color="error" 
                          sx={{ fontWeight: 'medium' }} 
                        />
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                
                {/* Renewal Timeline Preferences */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                        Renewal Timeline
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Typical Renewal Pattern:
                          </Typography>
                        </Box>
                        <Box 
                          sx={{ 
                            p: 1, 
                            bgcolor: 'primary.light', 
                            color: 'primary.contrastText', 
                            borderRadius: 1, 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          <ArrowCircleUpIcon />
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Pays 7-14 days before due date
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Reminder Schedule:
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="body2">• 30 days before due date (Email)</Typography>
                          <Typography variant="body2">• 14 days before due date (Email)</Typography>
                          <Typography variant="body2">• 7 days before due date (Phone)</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                
                {/* Payment Method Preferences */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PaymentsIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                        Payment Methods
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Primary Payment Method:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                            <CreditCardIcon color="primary" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              Credit Card
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              **** **** **** 5678 • Expires 06/26
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Alternate Methods Used:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip 
                            icon={<AccountBalanceIcon />} 
                            label="Bank Transfer" 
                            size="small" 
                            variant="outlined" 
                          />
                          <Chip 
                            icon={<PaymentsIcon />} 
                            label="PayPal" 
                            size="small" 
                            variant="outlined" 
                          />
                        </Box>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Auto-Payment Enrollment:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircleIcon color="success" />
                          <Typography variant="body2">Enrolled in Auto-Pay</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Profiling */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PersonIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Customer Profiling</Typography>
              </Box>
              
              {/* Payment History */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                  Payment History
                </Typography>
                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                          95%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          On-time Payments
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                          5 years
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Customer Since
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                          Excellent
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Payment Rating
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                          $4,850
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Paid (YTD)
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>

              {/* Policy Information */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                  Policy Information
                </Typography>
                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                          3
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Active Policies
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                          2
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Family Policies
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                          1
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Expired/Lapsed
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>

              {/* Communication & Claims History */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                  Communication & Claims History
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, height: '100%' }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                        Communication History
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Total Communications: 8
                          </Typography>
                        </Box>
                        <Divider />
                        <Box>
                          <Typography variant="body2">
                            • Policy Inquiries: 3
                          </Typography>
                          <Typography variant="body2">
                            • Billing Questions: 2
                          </Typography>
                          <Typography variant="body2">
                            • Coverage Updates: 2
                          </Typography>
                          <Typography variant="body2">
                            • Complaints: 1
                          </Typography>
                        </Box>
                        <Divider />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'info.main' }}>
                            Last Contact: 3 weeks ago (Policy Renewal)
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, height: '100%' }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                        Claims History
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Total Claims: 2
                          </Typography>
                        </Box>
                        <Divider />
                        <Box>
                          <Typography variant="body2">
                            • Auto Accident (2023): $3,200
                          </Typography>
                          <Typography variant="body2">
                            • Home Water Damage (2022): $1,850
                          </Typography>
                        </Box>
                        <Divider />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                            Claim Rating: Low Risk
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Available Offers */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocalOfferIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Available Offers</Typography>
              </Box>
              
              {/* Payment Options */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                  Flexible Payment Options
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined" sx={{ height: '100%', boxShadow: 'none', border: '1px solid', borderColor: 'primary.light' }}>
                      <CardContent>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                          <Typography variant="h6" color="primary.main" gutterBottom>
                            EMI Payment Plan
                          </Typography>
                          <Typography variant="subtitle2" color="text.secondary">
                            Split your premium into easy monthly payments
                          </Typography>
                        </Box>
                        <Box sx={{ p: 1, mb: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • No additional charges
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • Flexible payment schedule
                          </Typography>
                          <Typography variant="body2">
                            • Easy auto-debit option
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            Monthly EMI: ${Math.round(caseData.policyDetails.premium / 12)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined" sx={{ height: '100%', boxShadow: 'none' }}>
                      <CardContent>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            Quarterly Payment
                          </Typography>
                          <Typography variant="subtitle2" color="text.secondary">
                            Pay every three months
                          </Typography>
                        </Box>
                        <Box sx={{ p: 1, mb: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • 2% discount on total premium
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • Reduced payment frequency
                          </Typography>
                          <Typography variant="body2">
                            • Scheduled reminders
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            Quarterly: ${Math.round((caseData.policyDetails.premium * 0.98) / 4)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined" sx={{ height: '100%', boxShadow: 'none' }}>
                      <CardContent>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            Annual Payment
                          </Typography>
                          <Typography variant="subtitle2" color="text.secondary">
                            Pay once and save
                          </Typography>
                        </Box>
                        <Box sx={{ p: 1, mb: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • 5% discount on total premium
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • No hassle of multiple payments
                          </Typography>
                          <Typography variant="body2">
                            • Get it done in one go
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            Annual: ${Math.round(caseData.policyDetails.premium * 0.95)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
              
              {/* Product Recommendations */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                  Recommended Insurance Products
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ 
                      p: 2, 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { sm: 'center' },
                      gap: 2,
                      boxShadow: 'none',
                      border: '1px solid',
                      borderColor: 'secondary.light'
                    }}>
                      <Avatar sx={{ bgcolor: 'secondary.light', width: 60, height: 60, alignSelf: { xs: 'center', sm: 'flex-start' } }}>
                        <DirectionsCarIcon sx={{ fontSize: 30 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Enhanced Auto Protection
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Based on your existing Auto policy and claims history, we recommend upgrading to our Enhanced Auto Protection plan.
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          <Chip label="Roadside Assistance" size="small" />
                          <Chip label="Rental Coverage" size="small" />
                          <Chip label="Gap Insurance" size="small" />
                        </Box>
                        <Typography variant="body2" color="secondary" sx={{ fontWeight: 'bold' }}>
                          Special offer: 15% discount for multi-policy holders
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ 
                      p: 2, 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { sm: 'center' },
                      gap: 2,
                      boxShadow: 'none'
                    }}>
                      <Avatar sx={{ bgcolor: 'info.light', width: 60, height: 60, alignSelf: { xs: 'center', sm: 'flex-start' } }}>
                        <HealthAndSafetyIcon sx={{ fontSize: 30 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Family Health Insurance
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          With 2 family policies already, complement your coverage with our comprehensive health insurance plan.
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          <Chip label="Preventive Care" size="small" />
                          <Chip label="Hospital Coverage" size="small" />
                          <Chip label="Prescription Benefits" size="small" />
                        </Box>
                        <Typography variant="body2" color="info.main" sx={{ fontWeight: 'bold' }}>
                          Family package: Cover all members at a flat rate
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ 
                      p: 2, 
                      display: 'flex', 
                      flexDirection: { xs: 'column', md: 'row' },
                      alignItems: { md: 'center' },
                      gap: 2,
                      boxShadow: 'none',
                      bgcolor: 'success.light',
                      color: 'white'
                    }}>
                      <Avatar sx={{ bgcolor: 'white', color: 'success.main', width: 60, height: 60, alignSelf: { xs: 'center', md: 'flex-start' } }}>
                        <WorkspacePremiumIcon sx={{ fontSize: 30 }} />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          Premium Bundle Discount
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Bundle your Auto, Home, and Life policies to receive our maximum discount package.
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                          Save up to 25% on all policies
                        </Typography>
                      </Box>
                      <Button variant="contained" color="secondary">
                        View Bundle Options
                      </Button>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
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
        
        {/* Journey Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TimelineIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Journey Summary</Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Case Started
                      </Typography>
                      <Typography variant="body1">
                        {new Date(caseData.uploadDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Current Status
                      </Typography>
                      <Typography variant="body1">
                        <Chip
                          label={caseData.status}
                          color={getStatusColor(caseData.status)}
                          size="small"
                        />
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Handling Agent
                      </Typography>
                      <Typography variant="body1">
                        {caseData.agent || "Unassigned"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Processing Time
                      </Typography>
                      <Typography variant="body1">
                        {Math.ceil((new Date() - new Date(caseData.uploadDate)) / (1000 * 60 * 60 * 24))} days
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Journey Progress
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {caseData.flowSteps.map((step, index) => {
                      const isCompleted = caseData.flowSteps.indexOf(caseData.status) >= index;
                      return (
                        <Box 
                          key={step} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2,
                            opacity: isCompleted ? 1 : 0.5
                          }}
                        >
                          <Box 
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              borderRadius: '50%', 
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              bgcolor: isCompleted ? 'success.main' : 'grey.500',
                              fontSize: '0.8rem'
                            }}
                          >
                            {index + 1}
                          </Box>
                          <Typography 
                            variant="body2" 
                            sx={{ fontWeight: isCompleted ? 'bold' : 'normal' }}
                          >
                            {step}
                            {step === caseData.status && ' (Current)'}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CaseDetails;