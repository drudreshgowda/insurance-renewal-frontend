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
  Grow,
  Fade,
  Zoom,
  alpha
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
  CreditCard as CreditCardIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '@mui/material/styles';

const CaseDetails = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const theme = useTheme();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loaded, setLoaded] = useState(false);

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

  // Add loaded state for animations
  useEffect(() => {
    if (!loading && caseData) {
      setTimeout(() => {
        setLoaded(true);
      }, 100);
    }
  }, [loading, caseData]);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography variant="h6">Loading case details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Alert severity="error" sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>{error}</Alert>
      </Box>
    );
  }

  if (!caseData) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Alert severity="warning" sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>Case not found</Alert>
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
    <Fade in={true} timeout={800}>
      <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Zoom in={loaded} style={{ transitionDelay: '100ms' }}>
            <IconButton 
              onClick={() => navigate('/cases')} 
              sx={{ 
                bgcolor: 'background.paper', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Zoom>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="600">
              Case Details - {caseData.id}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                label={caseData.status}
                color={getStatusColor(caseData.status)}
                sx={{ fontWeight: 500, borderRadius: 5 }}
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
                  borderRadius: 5,
                  fontWeight: 500,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    transform: 'translateY(-1px)'
                  },
                  ...(caseData.isPriority ? {} : {
                    borderWidth: '1px',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '& .MuiChip-icon': {
                      color: 'primary.main'
                    }
                  })
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Last Updated: {new Date(caseData.uploadDate).toLocaleString()}
              </Typography>
            </Stack>
          </Box>
          {settings?.showEditCaseButton !== false && (
            <Zoom in={loaded} style={{ transitionDelay: '200ms' }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => {}}
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
                Edit Case
              </Button>
            </Zoom>
          )}
        </Box>

        {successMessage && (
          <Grow in={!!successMessage}>
            <Alert 
              severity="success" 
              sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
              onClose={() => setSuccessMessage('')}
            >
              {successMessage}
            </Alert>
          </Grow>
        )}

        <Grid container spacing={3}>
          {/* Customer Information */}
          <Grid item xs={12} md={4}>
            <Grow in={loaded} timeout={400}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%', 
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="600">{caseData.customerName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Customer Details
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon color="primary" />
                      <Typography>{caseData.contactInfo.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon color="primary" />
                      <Typography>{caseData.contactInfo.phone}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Policy Information */}
          <Grid item xs={12} md={8}>
            <Grow in={loaded} timeout={500}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%', 
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <DescriptionIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Policy Information</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={3}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Policy Number
                          </Typography>
                          <Typography variant="body1" fontWeight="500">{caseData.policyNumber}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Policy Type
                          </Typography>
                          <Typography variant="body1" fontWeight="500">{caseData.policyDetails.type}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={3}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Premium
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            ₹{caseData.policyDetails.premium.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Expiry Date
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            {new Date(caseData.policyDetails.expiryDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Policy Features */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={550}>
              <Card 
                elevation={0}
                sx={{ 
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <HealthAndSafetyIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Policy Features</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={3}>
                    {caseData.policyDetails.type === 'Health' && (
                      <>
                        {/* Health Insurance Section */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <HealthAndSafetyIcon fontSize="small" sx={{ mr: 1 }} /> Health Insurance (Corporate/Group)
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">Sum Insured: ₹1L–₹10L; family floater available.</Typography>
                            <Typography variant="body2">PED Coverage: Included from Day 1.</Typography>
                            <Typography variant="body2">Cashless Network: 7000+ hospitals PAN-India.</Typography>
                            <Typography variant="body2">Maternity: ₹50K–₹1L, includes newborn.</Typography>
                            <Typography variant="body2">Daycare Surgeries: 500+ procedures covered.</Typography>
                            <Typography variant="body2">Room Rent: No cap; private AC room eligibility.</Typography>
                            <Typography variant="body2">AYUSH: Coverage up to ₹25K/year.</Typography>
                          </Stack>
                        </Grid>
                        
                        {/* Wellness Benefits Section */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <WorkspacePremiumIcon fontSize="small" sx={{ mr: 1 }} /> Wellness Benefits
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">Health Checkups: Annual, 35+ parameters.</Typography>
                            <Typography variant="body2">Doctor at Home: 2 visits/year.</Typography>
                            <Typography variant="body2">Mental Wellness: Quarterly sessions.</Typography>
                            <Typography variant="body2">Fitness Access: Subsidized gyms/yoga.</Typography>
                            <Typography variant="body2">Nutrition Plans: Personalized counseling.</Typography>
                          </Stack>
                        </Grid>
                        
                        {/* Preventive Care Section */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <LocalOfferIcon fontSize="small" sx={{ mr: 1 }} /> Preventive Care
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">Chronic Condition Support: Diabetes, hypertension, etc.</Typography>
                            <Typography variant="body2">Digital Health Records: ABDM-compliant.</Typography>
                            <Typography variant="body2">Teleconsultation: 24x7 access to doctors.</Typography>
                            <Typography variant="body2">Medicine Delivery: With discounts.</Typography>
                            <Typography variant="body2">Lab Tests: 15–30% discounted diagnostics.</Typography>
                          </Stack>
                        </Grid>
                        
                        {/* OPD, Dental & Vision Section */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <AssignmentIcon fontSize="small" sx={{ mr: 1 }} /> OPD, Dental & Vision
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">OPD Cover: ₹2.5K–₹15K annually.</Typography>
                            <Typography variant="body2">Dental: Annual cleaning & basic procedures.</Typography>
                            <Typography variant="body2">Vision: Eye check + spectacles up to ₹2K.</Typography>
                            <Typography variant="body2">Vaccinations: Flu, COVID, travel vaccines included.</Typography>
                          </Stack>
                        </Grid>
                        
                        {/* Value-Added Services Section */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <AccountBalanceIcon fontSize="small" sx={{ mr: 1 }} /> Value-Added Services
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">Second Opinions: Global/National access.</Typography>
                            <Typography variant="body2">Claims Helpdesk: Virtual & onsite support.</Typography>
                            <Typography variant="body2">Health Risk Assessments: With scoring.</Typography>
                            <Typography variant="body2">Emergency Ambulance: Up to ₹2K per case.</Typography>
                          </Stack>
                        </Grid>
                      </>
                    )}
                    
                    {caseData.policyDetails.type === 'Auto' && (
                      <>
                        {/* Auto Insurance Section */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <DirectionsCarIcon fontSize="small" sx={{ mr: 1 }} /> Auto Insurance
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">Comprehensive Coverage: Own damage + third-party liability.</Typography>
                            <Typography variant="body2">Zero Depreciation: Full claim without depreciation deduction.</Typography>
                            <Typography variant="body2">Roadside Assistance: 24x7 emergency support.</Typography>
                            <Typography variant="body2">NCB Protection: No claims bonus safeguard.</Typography>
                            <Typography variant="body2">Engine Protection: Coverage for hydrostatic lock damage.</Typography>
                          </Stack>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <LocalOfferIcon fontSize="small" sx={{ mr: 1 }} /> Additional Benefits
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">Key Replacement: Coverage for lost or damaged keys.</Typography>
                            <Typography variant="body2">Return to Invoice: Full invoice value in case of total loss.</Typography>
                            <Typography variant="body2">Personal Accident Cover: ₹15 lakh for owner-driver.</Typography>
                            <Typography variant="body2">Passenger Cover: ₹1 lakh per passenger.</Typography>
                            <Typography variant="body2">Consumables Cover: For oils, lubricants, etc.</Typography>
                          </Stack>
                        </Grid>
                      </>
                    )}
                    
                    {caseData.policyDetails.type === 'Life' && (
                      <>
                        {/* Life Insurance Section */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <WorkspacePremiumIcon fontSize="small" sx={{ mr: 1 }} /> Life Insurance
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">Term Coverage: Up to ₹2 Crore sum assured.</Typography>
                            <Typography variant="body2">Critical Illness: Coverage for 36 critical conditions.</Typography>
                            <Typography variant="body2">Accidental Death: Double sum assured payout.</Typography>
                            <Typography variant="body2">Premium Waiver: On disability or critical illness.</Typography>
                            <Typography variant="body2">Tax Benefits: Under Section 80C and 10(10D).</Typography>
                          </Stack>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <AccountBalanceIcon fontSize="small" sx={{ mr: 1 }} /> Investment Benefits
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">Guaranteed Returns: 5-6% annual guaranteed returns.</Typography>
                            <Typography variant="body2">Maturity Benefits: Lump sum payment at policy maturity.</Typography>
                            <Typography variant="body2">Loyalty Additions: Extra bonus for long-term policyholders.</Typography>
                            <Typography variant="body2">Partial Withdrawals: Available after lock-in period.</Typography>
                            <Typography variant="body2">Loan Facility: Up to 80% of surrender value.</Typography>
                          </Stack>
                        </Grid>
                      </>
                    )}
                    
                    {caseData.policyDetails.type === 'Home' && (
                      <>
                        {/* Home Insurance Section */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <HomeIcon fontSize="small" sx={{ mr: 1 }} /> Home Insurance
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">Structure Coverage: Up to ₹5 Crore building value.</Typography>
                            <Typography variant="body2">Contents Protection: Furniture, appliances, valuables.</Typography>
                            <Typography variant="body2">Natural Disasters: Flood, earthquake, storm damage.</Typography>
                            <Typography variant="body2">Burglary & Theft: Coverage for stolen possessions.</Typography>
                            <Typography variant="body2">Temporary Accommodation: If home becomes uninhabitable.</Typography>
                          </Stack>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <LocalOfferIcon fontSize="small" sx={{ mr: 1 }} /> Additional Protections
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">Liability Coverage: For third-party injuries on property.</Typography>
                            <Typography variant="body2">Electrical Equipment: Protection against short circuits.</Typography>
                            <Typography variant="body2">Rent Loss Cover: Compensation for lost rental income.</Typography>
                            <Typography variant="body2">Renovation Coverage: Protection during home improvements.</Typography>
                            <Typography variant="body2">Jewelry & Valuables: Special coverage for high-value items.</Typography>
                          </Stack>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Case Flow */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={600}>
              <Card 
                elevation={0}
                sx={{ 
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TimelineIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Case Flow</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Stepper 
                    activeStep={caseData.flowSteps.indexOf(caseData.status)} 
                    alternativeLabel 
                    sx={{
                      '.MuiStepLabel-label': {
                        fontWeight: 500,
                        mt: 1
                      }
                    }}
                  >
                    {caseData.flowSteps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Add Comment */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={700}>
              <Card 
                elevation={0}
                sx={{ 
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <ChatIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Add Comment</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      InputProps={{
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
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        fontWeight: 600,
                        boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
                        }
                      }}
                    >
                      Add Comment
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Customer Preferences */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={800}>
              <Card 
                elevation={0}
                sx={{ 
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <SettingsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Customer Preferences</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={3}>
                    {/* Communication Preferences */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
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
                              sx={{ fontWeight: 'medium', borderRadius: 5 }} 
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
                              sx={{ fontWeight: 'medium', borderRadius: 5 }} 
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
                              sx={{ fontWeight: 'medium', borderRadius: 5 }} 
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
                              sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    
                    {/* Renewal Timeline Preferences */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
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
                                p: 1.5, 
                                bgcolor: alpha(theme.palette.primary.main, 0.1), 
                                color: theme.palette.primary.main, 
                                borderRadius: 2, 
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
                      <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
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
                              <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.2) }}>
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
                                avatar={<Avatar sx={{ bgcolor: 'transparent !important' }}><AccountBalanceIcon fontSize="small" /></Avatar>}
                                label="Bank Transfer"
                                size="small"
                                sx={{ borderRadius: 5 }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Customer Profiling */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={900}>
              <Card 
                elevation={0}
                sx={{ 
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Customer Profiling</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
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
                              ₹4,850
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
                                • Auto Accident (2023): ₹3,200
                              </Typography>
                              <Typography variant="body2">
                                • Home Water Damage (2022): ₹1,850
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
            </Grow>
          </Grid>

          {/* Available Offers */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={1000}>
              <Card 
                elevation={0}
                sx={{ 
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LocalOfferIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Available Offers</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
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
                                ₹{Math.round(caseData.policyDetails.premium / 12)}
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
                                ₹{Math.round((caseData.policyDetails.premium * 0.98) / 4)}
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
                                ₹{Math.round(caseData.policyDetails.premium * 0.95)}
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
            </Grow>
          </Grid>

          {/* Coverage Details */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={1100}>
              <Card 
                elevation={0}
                sx={{ 
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <AssignmentIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Coverage Details</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={3}>
                    {Object.entries(caseData.policyDetails.coverage).map(([key, value]) => (
                      <Grid item xs={12} sm={4} key={key}>
                        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </Typography>
                          <Typography variant="body1">{typeof value === 'string' ? value.replace(/\$/g, '₹') : value}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Case History */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={1200}>
              <Card 
                elevation={0}
                sx={{ 
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <HistoryIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Case History</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
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
            </Grow>
          </Grid>
          
          {/* Journey Summary */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={1300}>
              <Card 
                elevation={0}
                sx={{ 
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TimelineIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Journey Summary</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
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
            </Grow>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default CaseDetails;