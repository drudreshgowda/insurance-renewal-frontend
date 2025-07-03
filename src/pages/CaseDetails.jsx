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
  Home as HomeIcon,
  Sms as SmsIcon,
  SmartToy as SmartToyIcon,
  Language as LanguageIcon,
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
  Pending as PendingIcon,
  ArrowForward as ArrowForwardIcon
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
      <Box sx={{ p: 3 }}>
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
                    <Grid item xs={12} sm={6} md={3}>
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
                    <Grid item xs={12} sm={6} md={3}>
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
                    <Grid item xs={12} sm={6} md={3}>
                      <Stack spacing={3}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Annual Income
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            ₹{(caseData.policyDetails.premium * 8).toLocaleString()}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Channel Partner
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            {caseData.policyDetails.type === 'Health' ? 'Corporate Sales - Rajesh Kumar' :
                             caseData.policyDetails.type === 'Auto' ? 'Agent Network - Priya Sharma' :
                             caseData.policyDetails.type === 'Life' ? 'Branch Office - Mumbai Central' :
                             'Online Portal - Direct Sales'}
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
                            <DirectionsCarIcon fontSize="small" sx={{ mr: 1 }} /> Vehicle Insurance
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

          {/* Coverage Details */}
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
                    <AssignmentIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Coverage Details</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  {/* Primary Coverage */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium', color: 'primary.main' }}>
                      Primary Coverage
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined" sx={{ p: 2, height: '100%', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                              ₹{(caseData.policyDetails.premium * 20).toLocaleString()}
                            </Typography>
                            <Typography variant="subtitle2">
                              Sum Insured
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'success.main' }}>
                              ₹{Math.round(caseData.policyDetails.premium * 0.05).toLocaleString()}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                              Deductible
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'info.main' }}>
                              100%
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                              Coverage Ratio
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'warning.main' }}>
                              24/7
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                              Support Coverage
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Coverage Types - Dynamic based on Policy Type */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium', color: 'primary.main' }}>
                      Coverage Types & Limits
                    </Typography>
                    <Grid container spacing={2}>
                      {/* Auto/Vehicle Insurance Coverage */}
                      {caseData.policyDetails.type === 'Auto' && (
                        <>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                🚗 Vehicle Protection
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Comprehensive Coverage:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 20).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Own Damage:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 15).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Engine Protection:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 8).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Zero Depreciation:</Typography>
                                <Chip label="Included" size="small" color="success" />
                              </Box>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                👥 Liability Coverage
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Third Party Liability:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹7,50,000</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Personal Accident (Owner):</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹15,00,000</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Passenger Coverage:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹2,00,000/person</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Legal Liability:</Typography>
                                <Chip label="Unlimited" size="small" color="success" />
                              </Box>
                            </Box>
                          </Grid>
                        </>
                      )}

                      {/* Health Insurance Coverage */}
                      {caseData.policyDetails.type === 'Health' && (
                        <>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                ⚕️ Medical Coverage
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Individual Sum Insured:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 20).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Family Floater:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 25).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Room Rent Limit:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹8,000/day</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">ICU Charges:</Typography>
                                <Chip label="No Limit" size="small" color="success" />
                              </Box>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                🤱 Special Benefits
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Maternity Coverage:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹1,50,000</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">New Born Coverage:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹1,00,000</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Pre-existing Diseases:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>After 2 Years</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Ambulance Coverage:</Typography>
                                <Chip label="Included" size="small" color="success" />
                              </Box>
                            </Box>
                          </Grid>
                        </>
                      )}

                      {/* Life Insurance Coverage */}
                      {caseData.policyDetails.type === 'Life' && (
                        <>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                💰 Life Coverage
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Death Benefit:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 100).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Accidental Death:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 200).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Terminal Illness:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 50).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Waiver of Premium:</Typography>
                                <Chip label="Included" size="small" color="success" />
                              </Box>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                📈 Investment Benefits
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Maturity Benefit:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 80).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Survival Benefits:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 5).toLocaleString()}/year</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Bonus Rate:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹45/₹1000</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Loan Facility:</Typography>
                                <Chip label="Available" size="small" color="info" />
                              </Box>
                            </Box>
                          </Grid>
                        </>
                      )}

                      {/* Home Insurance Coverage */}
                      {caseData.policyDetails.type === 'Home' && (
                        <>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                🏠 Property Coverage
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Building Coverage:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 50).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Contents Coverage:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 20).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Jewelry & Valuables:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 5).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Electronics:</Typography>
                                <Chip label="Covered" size="small" color="success" />
                              </Box>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                🌪️ Natural Disasters
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Fire & Lightning:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 40).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Earthquake Coverage:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 30).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Flood & Storm:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 25).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Temporary Accommodation:</Typography>
                                <Chip label="₹5,000/day" size="small" color="info" />
                              </Box>
                            </Box>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Box>

                  {/* Additional Benefits & Riders - Dynamic based on Policy Type */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium', color: 'primary.main' }}>
                      Additional Benefits & Riders
                    </Typography>
                    <Grid container spacing={2}>
                      {/* Auto Insurance Benefits */}
                      {caseData.policyDetails.type === 'Auto' && (
                        <>
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                🛡️ Enhanced Protection
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="No Claim Bonus: 50%" size="small" />
                                <Chip label="Roadside Assistance" size="small" />
                                <Chip label="Key Replacement" size="small" />
                                <Chip label="Emergency Towing" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'info.contrastText' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                🔧 Add-on Covers
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="Engine Protection" size="small" />
                                <Chip label="Return to Invoice" size="small" />
                                <Chip label="Consumable Cover" size="small" />
                                <Chip label="Depreciation Cover" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                💰 Financial Benefits
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="Cashless Garages: 4500+" size="small" />
                                <Chip label="Quick Settlement" size="small" />
                                <Chip label="Online Claim Filing" size="small" />
                                <Chip label="Premium Discount: 15%" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                        </>
                      )}

                      {/* Health Insurance Benefits */}
                      {caseData.policyDetails.type === 'Health' && (
                        <>
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                🏥 Health Add-ons
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="Annual Health Check-up" size="small" />
                                <Chip label="Ambulance Coverage" size="small" />
                                <Chip label="Day Care Procedures" size="small" />
                                <Chip label="AYUSH Treatment" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'info.contrastText' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                👨‍⚕️ Wellness Benefits
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="Telemedicine" size="small" />
                                <Chip label="Second Opinion" size="small" />
                                <Chip label="Health Coaching" size="small" />
                                <Chip label="Mental Health Support" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                💰 Financial Benefits
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="Tax Benefits: 80D" size="small" />
                                <Chip label="Cashless Hospitals: 7000+" size="small" />
                                <Chip label="No Room Rent Capping" size="small" />
                                <Chip label="Family Discount: 10%" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                        </>
                      )}

                      {/* Life Insurance Benefits */}
                      {caseData.policyDetails.type === 'Life' && (
                        <>
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                💎 Premium Features
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="Guaranteed Returns" size="small" />
                                <Chip label="Loyalty Additions" size="small" />
                                <Chip label="Flexible Premium" size="small" />
                                <Chip label="Policy Loan Available" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'info.contrastText' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                🛡️ Protection Riders
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="Accidental Death Benefit" size="small" />
                                <Chip label="Critical Illness Cover" size="small" />
                                <Chip label="Disability Benefit" size="small" />
                                <Chip label="Waiver of Premium" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                💰 Tax & Investment
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="Tax Benefits: 80C" size="small" />
                                <Chip label="Tax-free Maturity" size="small" />
                                <Chip label="Wealth Creation" size="small" />
                                <Chip label="Estate Planning" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                        </>
                      )}

                      {/* Home Insurance Benefits */}
                      {caseData.policyDetails.type === 'Home' && (
                        <>
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                🏠 Property Protection
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="Replacement Cost Cover" size="small" />
                                <Chip label="Debris Removal" size="small" />
                                <Chip label="Architect Fees" size="small" />
                                <Chip label="Loss of Rent" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'info.contrastText' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                🔧 Additional Covers
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="Electrical Equipment" size="small" />
                                <Chip label="Plumbing Repairs" size="small" />
                                <Chip label="Garden & Landscaping" size="small" />
                                <Chip label="Alternative Accommodation" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                💰 Financial Benefits
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="No Claim Bonus: 20%" size="small" />
                                <Chip label="Cashless Claims" size="small" />
                                <Chip label="24/7 Helpline" size="small" />
                                <Chip label="Multi-policy Discount" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Box>

                  {/* Coverage Exclusions - Dynamic based on Policy Type */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium', color: 'error.main' }}>
                      Important Exclusions
                    </Typography>
                    <Card variant="outlined" sx={{ p: 2, bgcolor: alpha(theme.palette.error.main, 0.05), border: '1px solid', borderColor: 'error.light' }}>
                      <Grid container spacing={2}>
                        {/* Auto Insurance Exclusions */}
                        {caseData.policyDetails.type === 'Auto' && (
                          <>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'error.main' }}>
                                ❌ Not Covered
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">• Driving under influence of alcohol/drugs</Typography>
                                <Typography variant="body2" color="text.secondary">• Racing, speed testing, competitions</Typography>
                                <Typography variant="body2" color="text.secondary">• War, terrorism, nuclear risks</Typography>
                                <Typography variant="body2" color="text.secondary">• Consequential losses</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'warning.main' }}>
                                ⚠️ Conditions Apply
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">• Valid driving license required</Typography>
                                <Typography variant="body2" color="text.secondary">• Immediate reporting of accidents</Typography>
                                <Typography variant="body2" color="text.secondary">• Regular maintenance required</Typography>
                                <Typography variant="body2" color="text.secondary">• Geographical restrictions apply</Typography>
                              </Box>
                            </Grid>
                          </>
                        )}

                        {/* Health Insurance Exclusions */}
                        {caseData.policyDetails.type === 'Health' && (
                          <>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'error.main' }}>
                                ❌ Not Covered
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">• Pre-existing conditions (first 2 years)</Typography>
                                <Typography variant="body2" color="text.secondary">• Cosmetic & aesthetic treatments</Typography>
                                <Typography variant="body2" color="text.secondary">• Self-inflicted injuries</Typography>
                                <Typography variant="body2" color="text.secondary">• Experimental treatments</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'warning.main' }}>
                                ⚠️ Conditions Apply
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">• Waiting period for specific treatments</Typography>
                                <Typography variant="body2" color="text.secondary">• Age-related sub-limits</Typography>
                                <Typography variant="body2" color="text.secondary">• Network hospital restrictions</Typography>
                                <Typography variant="body2" color="text.secondary">• Medical examination may be required</Typography>
                              </Box>
                            </Grid>
                          </>
                        )}

                        {/* Life Insurance Exclusions */}
                        {caseData.policyDetails.type === 'Life' && (
                          <>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'error.main' }}>
                                ❌ Not Covered
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">• Suicide within first year</Typography>
                                <Typography variant="body2" color="text.secondary">• Death due to intoxication</Typography>
                                <Typography variant="body2" color="text.secondary">• Death during criminal activity</Typography>
                                <Typography variant="body2" color="text.secondary">• War and nuclear risks</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'warning.main' }}>
                                ⚠️ Conditions Apply
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">• Premium payment continuity required</Typography>
                                <Typography variant="body2" color="text.secondary">• Medical examination for high sum assured</Typography>
                                <Typography variant="body2" color="text.secondary">• Grace period for premium payment</Typography>
                                <Typography variant="body2" color="text.secondary">• Policy terms and conditions apply</Typography>
                              </Box>
                            </Grid>
                          </>
                        )}

                        {/* Home Insurance Exclusions */}
                        {caseData.policyDetails.type === 'Home' && (
                          <>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'error.main' }}>
                                ❌ Not Covered
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">• War, terrorism, nuclear risks</Typography>
                                <Typography variant="body2" color="text.secondary">• Intentional damage or negligence</Typography>
                                <Typography variant="body2" color="text.secondary">• Normal wear and tear</Typography>
                                <Typography variant="body2" color="text.secondary">• Unoccupied property (over 30 days)</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'warning.main' }}>
                                ⚠️ Conditions Apply
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">• Property security measures required</Typography>
                                <Typography variant="body2" color="text.secondary">• Immediate reporting of incidents</Typography>
                                <Typography variant="body2" color="text.secondary">• Regular property maintenance</Typography>
                                <Typography variant="body2" color="text.secondary">• Geographical location restrictions</Typography>
                              </Box>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Card>
                  </Box>
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
                    <Grid item xs={12} md={3}>
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
                              <SmsIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                              <Typography variant="body2">SMS</Typography>
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
                              <SmartToyIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                              <Typography variant="body2">AI Call</Typography>
                            </Box>
                            <Chip 
                              label="Accepted" 
                              size="small" 
                              variant="outlined"
                              color="info" 
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
                    <Grid item xs={12} md={3}>
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
                    <Grid item xs={12} md={3}>
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
                    
                    {/* Language Preferences */}
                    <Grid item xs={12} md={3}>
                      <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <LanguageIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            Language Preferences
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Preferred Language:
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box 
                                sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 1,
                                  p: 1.5, 
                                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor: alpha(theme.palette.primary.main, 0.2)
                                }}
                              >
                                <span style={{ fontSize: '20px' }}>🇮🇳</span>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                    हिन्दी (Hindi)
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Primary communication language
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Alternative Languages:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip 
                                label="🇬🇧 English"
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: 5, fontWeight: 'medium' }}
                              />
                              <Chip 
                                label="🇮🇳 मराठी"
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: 5, fontWeight: 'medium' }}
                              />
                            </Box>
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Document Language:
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip 
                                label="Hindi & English"
                                size="small"
                                color="primary"
                                sx={{ borderRadius: 5, fontWeight: 'medium' }}
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

          {/* Customer Payment Schedule */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={850}>
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
                    <CalendarTodayIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Customer Payment Schedule</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={3}>
                    {/* Upcoming Payments */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <EventIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            Upcoming Payments
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {/* Next Payment */}
                          <Box 
                            sx={{ 
                              p: 2, 
                              bgcolor: alpha(theme.palette.success.main, 0.1), 
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: alpha(theme.palette.success.main, 0.2)
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                Next Payment Due
                              </Typography>
                              <Chip 
                                label="7 days" 
                                size="small" 
                                color="success"
                                sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                              />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                              ₹12,500
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Due Date: March 15, 2024
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Policy: Health Insurance Premium
                            </Typography>
                          </Box>
                          
                          {/* Subsequent Payments */}
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  ₹8,750
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Motor Insurance - Apr 20, 2024
                                </Typography>
                              </Box>
                              <Chip 
                                label="43 days" 
                                size="small" 
                                variant="outlined"
                                sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                              />
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  ₹15,200
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Life Insurance - Jun 10, 2024
                                </Typography>
                              </Box>
                              <Chip 
                                label="94 days" 
                                size="small" 
                                variant="outlined"
                                sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    
                    {/* Payment History & Patterns */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PendingIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            Payment Patterns & History
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          {/* Payment Statistics */}
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Payment Statistics (Last 12 Months):
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 1 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                    11/12
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    On-time Payments
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 1 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                                    ₹42,650
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Total Paid
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                          
                          {/* Payment Behavior */}
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Payment Behavior:
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Average Payment Timing</Typography>
                                <Chip 
                                  label="5 days early" 
                                  size="small" 
                                  color="success"
                                  variant="outlined"
                                  sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                                />
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Preferred Payment Method</Typography>
                                <Chip 
                                  label="Auto-debit" 
                                  size="small" 
                                  color="primary"
                                  sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                                />
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Payment Reliability</Typography>
                                <Chip 
                                  label="Excellent" 
                                  size="small" 
                                  color="success"
                                  sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                                />
                              </Box>
                            </Box>
                          </Box>
                          
                          {/* Recent Payment Activity */}
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Recent Payment Activity:
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                  ₹12,500 - Paid
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Feb 10, 2024 • Health Insurance
                                </Typography>
                              </Box>
                              <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                  ₹8,750 - Paid
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Jan 18, 2024 • Motor Insurance
                                </Typography>
                              </Box>
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
                            <Divider />
                            <Box sx={{ mt: 2 }}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => navigate(`/communication-details/${caseId}`)}
                                endIcon={<ArrowForwardIcon />}
                                sx={{ 
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  fontWeight: 'medium',
                                  width: '100%'
                                }}
                              >
                                View Detailed Communication History
                              </Button>
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
                                • Vehicle Accident (2023): ₹3,200
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
                            <Divider />
                            <Box sx={{ mt: 2 }}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => navigate(`/claims-history/${caseId}`)}
                                endIcon={<ArrowForwardIcon />}
                                sx={{ 
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  fontWeight: 'medium',
                                  width: '100%'
                                }}
                              >
                                View Detailed Claims History
                              </Button>
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
                      <Grid item xs={12} md={3}>
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
                      
                      <Grid item xs={12} md={3}>
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
                      
                      <Grid item xs={12} md={3}>
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
                      
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined" sx={{ height: '100%', boxShadow: 'none', border: '1px solid', borderColor: 'warning.light' }}>
                          <CardContent>
                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                              <Typography variant="h6" color="warning.main" gutterBottom>
                                Premium Funding
                              </Typography>
                              <Typography variant="subtitle2" color="text.secondary">
                                Finance your premium with third-party funding
                              </Typography>
                            </Box>
                            <Box sx={{ p: 1, mb: 2 }}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                • Preserve cash flow & liquidity
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                • Flexible repayment terms
                              </Typography>
                              <Typography variant="body2">
                                • Tax benefits available*
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'warning.light', borderRadius: 1, color: 'warning.contrastText' }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Interest from 3.5% p.a.
                              </Typography>
                              <Typography variant="caption">
                                *Terms & conditions apply
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
                              Enhanced Vehicle Protection
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              Based on your existing Vehicle policy and claims history, we recommend upgrading to our Enhanced Vehicle Protection plan.
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
                              Bundle your Vehicle, Home, and Life policies to receive our maximum discount package.
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