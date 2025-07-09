import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography,
  Card, 
  CardContent, 
  TextField,
  Grid,
  Paper,
  Button,
  Chip,
  Divider,
  InputAdornment,
  Avatar,
  Tab,
  Tabs,
  useTheme,
  alpha,
  Fade,
  Grow,
  Zoom
} from '@mui/material';
import { 
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import { 
  Search as SearchIcon,
  Event as EventIcon,
  Payment as PaymentIcon,
  Autorenew as AutorenewIcon,
  Create as CreateIcon,
  Policy as PolicyIcon,
  Info as InfoIcon,
  VerifiedUser as VerifiedUserIcon,
  Warning as WarningIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  Chat as ChatIcon,
  AccessTime as AccessTimeIcon,
  Payments as PaymentsIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  MailOutline as MailOutlineIcon,
  WhatsApp as WhatsAppIcon,
  ArrowCircleUp as ArrowCircleUpIcon,
  Sms as SmsIcon,
  SmartToy as SmartToyIcon,
  Language as LanguageIcon,
  CalendarToday as CalendarTodayIcon,
  Pending as PendingIcon
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

const PolicyTimeline = () => {
  const location = useLocation();
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [policyData, setPolicyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [customerSummary, setCustomerSummary] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  
  // Extract customer data from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const customerNameFromUrl = queryParams.get('customerName');
  const customerIdFromUrl = queryParams.get('customerId');

  // Sample policy timeline data - wrapped in useMemo to prevent re-creation on every render
  const mockPolicyData = useMemo(() => ({
    customerId: customerIdFromUrl || "CUST-12345",
    customerName: customerNameFromUrl || "Arjun Sharma",
    policies: [
      {
        policyId: "POL-VEHICLE-987",
        policyType: "Vehicle Insurance",
        currentPremium: 1250.00,
        startDate: "2018-06-15",
        events: [
          {
            id: "ev-001",
            date: "2018-06-15",
            type: "creation",
            title: "Policy Created",
            description: "Vehicle insurance policy initiated with basic coverage",
            details: {
              premium: 980.00,
              coverage: "Basic coverage with ₹25,000 deductible",
              agent: "Priya Patel"
            }
          },
          {
            id: "ev-002",
            date: "2019-05-30",
            type: "modification",
            title: "Coverage Update",
            description: "Added comprehensive coverage to the policy",
            details: {
              premium: 1120.00,
              coverage: "Comprehensive coverage with ₹15,000 deductible",
              agent: "Rajesh Kumar"
            }
          },
          {
            id: "ev-003",
            date: "2020-06-15",
            type: "renewal",
            title: "Policy Renewed",
            description: "Annual policy renewal with 5% loyalty discount",
            details: {
              premium: 1064.00,
              coverage: "Comprehensive coverage with ₹15,000 deductible",
              agent: "Priya Patel"
            }
          },
          {
            id: "ev-004",
            date: "2021-03-22",
            type: "claim",
            title: "Claim Filed",
            description: "Claim filed for minor accident - dent repair",
            details: {
              claimAmount: 1200.00,
              status: "Approved",
              deductible: 15000.00,
              handledBy: "Ananya Reddy"
            }
          },
          {
            id: "ev-005",
            date: "2021-06-15",
            type: "renewal",
            title: "Policy Renewed",
            description: "Annual policy renewal with adjusted premium after claim",
            details: {
              premium: 1150.00,
              coverage: "Comprehensive coverage with ₹15,000 deductible",
              agent: "Priya Patel"
            }
          },
          {
            id: "ev-006",
            date: "2022-01-10",
            type: "payment",
            title: "Payment Method Updated",
            description: "Switched to quarterly payment schedule",
            details: {
              method: "Auto-debit",
              schedule: "Quarterly",
              nextPayment: "2022-04-10"
            }
          },
          {
            id: "ev-007",
            date: "2022-06-15",
            type: "renewal",
            title: "Policy Renewed",
            description: "Annual policy renewal with added roadside assistance",
            details: {
              premium: 1195.00,
              coverage: "Comprehensive coverage with roadside assistance",
              agent: "Amit Shah"
            }
          },
          {
            id: "ev-008",
            date: "2023-06-15",
            type: "renewal",
            title: "Policy Renewed",
            description: "Annual policy renewal with multi-policy discount",
            details: {
              premium: 1135.00,
              discount: "5% multi-policy discount applied",
              coverage: "Comprehensive coverage with roadside assistance",
              agent: "Priya Patel"
            }
          },
          {
            id: "ev-009",
            date: "2023-10-05",
            type: "communication",
            title: "Coverage Review",
            description: "Scheduled call to review current coverage options",
            details: {
              agent: "Priya Patel",
              outcome: "No changes requested by customer",
              followUp: "Annual review scheduled for same time next year"
            }
          },
          {
            id: "ev-010",
            date: "2024-06-15",
            type: "renewal",
            title: "Policy Renewed",
            description: "Annual policy renewal with loyalty discount",
            details: {
              premium: 1250.00,
              coverage: "Comprehensive coverage with roadside assistance and rental car service",
              agent: "Priya Patel"
            }
          }
        ]
      },
      {
        policyId: "POL-LIFE-456",
        policyType: "Life Insurance",
        currentPremium: 950.00,
        startDate: "2020-09-22",
        events: [
          {
            id: "ev-101",
            date: "2020-09-22",
            type: "creation",
            title: "Policy Created",
            description: "Life insurance policy initiated with standard coverage",
            details: {
              premium: 850.00,
              coverage: "Standard Life coverage with ₹50,000 deductible",
              agent: "Rajesh Kumar"
            }
          },
          {
            id: "ev-102",
            date: "2021-08-15",
            type: "modification",
            title: "Coverage Update",
            description: "Added critical illness coverage",
            details: {
              premium: 925.00,
              coverage: "Enhanced coverage with critical illness protection",
              agent: "Ananya Reddy"
            }
          },
          {
            id: "ev-103",
            date: "2021-09-22",
            type: "renewal",
            title: "Policy Renewed",
            description: "Annual policy renewal with bundle discount",
            details: {
              premium: 879.00,
              discount: "5% bundle discount with Vehicle policy",
              coverage: "Enhanced coverage with critical illness protection",
              agent: "Rajesh Kumar"
            }
          },
          {
            id: "ev-104",
            date: "2022-09-22",
            type: "renewal",
            title: "Policy Renewed",
            description: "Annual policy renewal with loyalty discount",
            details: {
              premium: 850.00,
              discount: "Added 3% loyalty discount",
              coverage: "Enhanced coverage with critical illness protection",
              agent: "Priya Patel"
            }
          },
          {
            id: "ev-105",
            date: "2023-04-18",
            type: "claim",
            title: "Claim Filed",
            description: "Claim filed for critical illness coverage",
            details: {
              claimAmount: 3200.00,
              status: "Approved",
              deductible: 50000.00,
              handledBy: "Amit Shah"
            }
          },
          {
            id: "ev-106",
            date: "2023-09-22",
            type: "renewal",
            title: "Policy Renewed",
            description: "Annual policy renewal with premium adjustment after claim",
            details: {
              premium: 950.00,
              coverage: "Enhanced coverage with critical illness protection",
              agent: "Ananya Reddy"
            }
          }
        ]
      }
    ]
  }), [customerIdFromUrl, customerNameFromUrl]);

  useEffect(() => {
    // This would be replaced with actual API call in a real app
    const fetchPolicyData = async () => {
      try {
        // In a real app, you would fetch data based on customerIdFromUrl
        // For example: const response = await api.getPolicyData(customerIdFromUrl);
        
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use the customer data from URL if available
        const policyDataToUse = {
          ...mockPolicyData,
          customerId: customerIdFromUrl || mockPolicyData.customerId,
          customerName: customerNameFromUrl || mockPolicyData.customerName
        };
        
        setPolicyData(policyDataToUse);
        setLoading(false);
        // Set loaded state for animations after a brief delay
        setTimeout(() => {
          setLoaded(true);
        }, 100);
      } catch (err) {
        setError("Failed to load policy data");
        setLoading(false);
      }
    };
    
    fetchPolicyData();
  }, [customerIdFromUrl, customerNameFromUrl, mockPolicyData]);

  useEffect(() => {
    if (policyData) {
      const totalPolicies = policyData.policies.length;
      let totalEvents = 0;
      const eventTypeCounts = {};
      let earliestStartDate = new Date(); // Initialize with a future date
      let totalCurrentPremium = 0;

      policyData.policies.forEach(policy => {
        totalEvents += policy.events.length;
        totalCurrentPremium += policy.currentPremium;
        if (new Date(policy.startDate) < earliestStartDate) {
          earliestStartDate = new Date(policy.startDate);
        }
        policy.events.forEach(event => {
          eventTypeCounts[event.type] = (eventTypeCounts[event.type] || 0) + 1;
        });
      });

      const customerTenureYears = Math.floor((new Date() - earliestStartDate) / (365.25 * 24 * 60 * 60 * 1000));

      setCustomerSummary({
        totalPolicies,
        totalEvents,
        eventTypeCounts,
        earliestStartDate: earliestStartDate.toISOString().split('T')[0],
        customerTenureYears,
        totalCurrentPremium
      });

      // AI Summary Generation (Simulated)
      const numClaims = eventTypeCounts.claim || 0;
      let claimLikelihood = "Low";
      if (numClaims > 2) claimLikelihood = "High";
      else if (numClaims > 0) claimLikelihood = "Moderate";

      let customerProfile = "Good";
      if (customerTenureYears > 5 && totalPolicies >= 2 && numClaims <= 1) {
        customerProfile = "Excellent";
      } else if (customerTenureYears >= 2 && numClaims < 3) {
        customerProfile = "Good";
      } else {
        customerProfile = "Average";
      }

      const observations = [
        `Customer has been with us for ${customerTenureYears} years across ${totalPolicies} policies.`,
      ];
      if (numClaims > 0) {
        observations.push(`They have filed ${numClaims} claim(s) in total.`);
      }
      if (eventTypeCounts.renewal > 0) {
        observations.push(`Regular renewals indicate high retention.`);
      }
      if (eventTypeCounts.communication > 0) {
        observations.push(`Engaged customer with ${eventTypeCounts.communication} communication events.`);
      }
      if (eventTypeCounts.payment > 0) {
        observations.push(`There are ${eventTypeCounts.payment} payment-related events recorded.`);
      }

      setAiSummary({
        claimLikelihood,
        customerProfile,
        observations: observations.join(" ")
      });
    }
  }, [policyData]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  

  
  const handleFilterTypeChange = (type) => {
    setFilterType(type);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const getEventIcon = (type) => {
    switch (type) {
      case 'creation':
        return <CreateIcon />;
      case 'renewal':
        return <AutorenewIcon />;
      case 'modification':
        return <DescriptionIcon />;
      case 'claim':
        return <WarningIcon />;
      case 'payment':
        return <PaymentIcon />;
      case 'communication':
        return <PhoneIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'creation':
        return 'success';
      case 'renewal':
        return 'primary';
      case 'modification':
        return 'info';
      case 'claim':
        return 'warning';
      case 'payment':
        return 'secondary';
      case 'communication':
        return 'grey';
      default:
        return 'grey';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Get currently selected policy based on tab
  const getCurrentPolicy = () => {
    if (!policyData || !policyData.policies || policyData.policies.length === 0) {
      return null;
    }
    return policyData.policies[tabValue];
  };
  
  // Filter events based on filterType
  const getFilteredEvents = () => {
    const currentPolicy = getCurrentPolicy();
    if (!currentPolicy || !currentPolicy.events) return [];
    
    return currentPolicy.events
      .filter(event => filterType === 'all' || event.type === filterType)
      .filter(event => !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));  // Sort by date descending
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="h5">Loading policy data...</Typography>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="h5" color="error">{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ borderRadius: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }
  
  const currentPolicy = getCurrentPolicy();
  const filteredEvents = getFilteredEvents();

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ px: 1 }}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4
        }}>
          <Typography variant="h4" fontWeight="600">
            Policy Timeline
          </Typography>
          

        </Box>
        
        {/* Customer Information */}
        <Grow in={loaded} timeout={400}>
          <Card sx={{ mb: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.05)', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.primary.main, 
                    width: 60, 
                    height: 60,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    mr: 2 
                  }}
                >
                  {policyData?.customerName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="600">
                    {policyData?.customerName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Customer ID: {policyData?.customerId}
                  </Typography>
                </Box>
              </Box>
              
              {/* Policy Tabs */}
              <Box sx={{ mt: 3 }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  textColor="primary"
                  indicatorColor="primary"
                  sx={{
                    '& .MuiTab-root': {
                      fontWeight: 500,
                      borderRadius: '8px 8px 0 0',
                      minHeight: 48,
                      transition: 'all 0.2s',
                      textAlign: 'center',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                    },
                    '& .Mui-selected': {
                      fontWeight: 600,
                    },
                    '& .MuiTabs-indicator': {
                      height: 3,
                      borderRadius: '3px 3px 0 0',
                    }
                  }}
                >
                  {policyData?.policies.map((policy, _index) => (
                    <Tab 
                      key={policy.policyId} 
                      label={
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          gap: 1,
                          width: '100%'
                        }}>
                          <PolicyIcon fontSize="small" />
                          <Typography component="span" sx={{ display: { xs: 'none', sm: 'inline' }}}>
                            {policy.policyType}
                          </Typography>
                          <Typography component="span" sx={{ display: { xs: 'inline', sm: 'none' }}}>
                            {policy.policyType.split(' ')[0]}
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
                </Tabs>
              </Box>
            </CardContent>
          </Card>
        </Grow>
        
        {/* Customer Summary Card */}
        {customerSummary && (
          <Grow in={loaded} timeout={600}>
            <Card sx={{ mb: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.05)', borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>
                  Customer Overview
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography variant="body2" color="text.secondary">Total Policies</Typography>
                      <Typography variant="h6" fontWeight="600" color="primary.main">{customerSummary.totalPolicies}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography variant="body2" color="text.secondary">Total Events</Typography>
                      <Typography variant="h6" fontWeight="600" color="info.main">{customerSummary.totalEvents}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography variant="body2" color="text.secondary">Customer Since</Typography>
                      <Typography variant="h6" fontWeight="600" color="success.main">{formatDate(customerSummary.earliestStartDate)}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography variant="body2" color="text.secondary">Tenure</Typography>
                      <Typography variant="h6" fontWeight="600" color="warning.main">{customerSummary.customerTenureYears} Years</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Event Type Breakdown:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {Object.entries(customerSummary.eventTypeCounts).map(([type, count]) => (
                        <Chip
                          key={type}
                          label={`${type.charAt(0).toUpperCase() + type.slice(1)}: ${count}`}
                          size="small"
                          icon={getEventIcon(type)}
                          color={getEventColor(type)}
                          sx={{ fontWeight: 500 }}
                        />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography variant="body2" color="text.secondary">Combined Annual Premium</Typography>
                      <Typography variant="h6" fontWeight="600" color="secondary.main">₹{customerSummary.totalCurrentPremium.toFixed(2)}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grow>
        )}
        
        {/* AI Powered Summary Card */}
        {aiSummary && (
          <Grow in={loaded} timeout={700}>
            <Card sx={{ mb: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.05)', borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <VerifiedUserIcon sx={{ fontSize: 30, color: 'primary.main', mr: 1.5 }} />
                  <Typography variant="h5" fontWeight="600">
                    AI-Powered Insights
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Claim Likelihood:</Typography>
                    <Typography variant="h6" fontWeight="600" color={aiSummary.claimLikelihood === 'High' ? 'error.main' : aiSummary.claimLikelihood === 'Moderate' ? 'warning.main' : 'success.main'}>
                      {aiSummary.claimLikelihood}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Customer Profile:</Typography>
                    <Typography variant="h6" fontWeight="600" color={aiSummary.customerProfile === 'Excellent' ? 'success.main' : aiSummary.customerProfile === 'Average' ? 'warning.main' : 'primary.main'}>
                      {aiSummary.customerProfile}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Key Observations:</Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {aiSummary.observations}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grow>
        )}

        {/* Customer Preferences */}
        <Grid item xs={12} sx={{ mb: 4 }}>
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
        <Grid item xs={12} sx={{ mb: 4 }}>
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
                                variant="outlined"
                                sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                              />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="body2">Late Payment History</Typography>
                              <Chip 
                                label="1 instance" 
                                size="small" 
                                color="warning"
                                variant="outlined"
                                sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                              />
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
        
        {/* Search and Filter */}
        <Grow in={loaded} timeout={600}>
          <Card sx={{ mb: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.05)', borderRadius: 3 }}>
            <CardContent sx={{ p: 2 }}>
              <TextField
                placeholder="Search in timeline events"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
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
              
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  label="All Events" 
                  color={filterType === 'all' ? 'primary' : 'default'}
                  clickable
                  onClick={() => handleFilterTypeChange('all')}
                  variant={filterType === 'all' ? 'filled' : 'outlined'}
                  sx={{ 
                    fontWeight: 500,
                    boxShadow: filterType === 'all' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                />
                <Chip 
                  label="Creation" 
                  icon={<CreateIcon />}
                  color={filterType === 'creation' ? 'success' : 'default'}
                  clickable
                  onClick={() => handleFilterTypeChange('creation')}
                  variant={filterType === 'creation' ? 'filled' : 'outlined'}
                  sx={{ 
                    fontWeight: 500,
                    boxShadow: filterType === 'creation' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                />
                <Chip 
                  label="Renewal" 
                  icon={<AutorenewIcon />}
                  color={filterType === 'renewal' ? 'primary' : 'default'}
                  clickable
                  onClick={() => handleFilterTypeChange('renewal')}
                  variant={filterType === 'renewal' ? 'filled' : 'outlined'}
                  sx={{ 
                    fontWeight: 500,
                    boxShadow: filterType === 'renewal' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                />
                <Chip 
                  label="Modification" 
                  icon={<DescriptionIcon />}
                  color={filterType === 'modification' ? 'info' : 'default'}
                  clickable
                  onClick={() => handleFilterTypeChange('modification')}
                  variant={filterType === 'modification' ? 'filled' : 'outlined'}
                  sx={{ 
                    fontWeight: 500,
                    boxShadow: filterType === 'modification' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                />
                <Chip 
                  label="Claim" 
                  icon={<WarningIcon />}
                  color={filterType === 'claim' ? 'warning' : 'default'}
                  clickable
                  onClick={() => handleFilterTypeChange('claim')}
                  variant={filterType === 'claim' ? 'filled' : 'outlined'}
                  sx={{ 
                    fontWeight: 500,
                    boxShadow: filterType === 'claim' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                />
                <Chip 
                  label="Payment" 
                  icon={<PaymentIcon />}
                  color={filterType === 'payment' ? 'secondary' : 'default'}
                  clickable
                  onClick={() => handleFilterTypeChange('payment')}
                  variant={filterType === 'payment' ? 'filled' : 'outlined'}
                  sx={{ 
                    fontWeight: 500,
                    boxShadow: filterType === 'payment' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                />
                <Chip 
                  label="Communication" 
                  icon={<PhoneIcon />}
                  color={filterType === 'communication' ? 'info' : 'default'}
                  clickable
                  onClick={() => handleFilterTypeChange('communication')}
                  variant={filterType === 'communication' ? 'filled' : 'outlined'}
                  sx={{ 
                    fontWeight: 500,
                    boxShadow: filterType === 'communication' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grow>
        
        {/* Policy Information Summary */}
        {currentPolicy && (
          <Grow in={loaded} timeout={800}>
            <Card sx={{ mb: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.05)', borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Policy ID
                    </Typography>
                    <Typography variant="h6" fontWeight="600">
                      {currentPolicy.policyId}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Current Premium
                    </Typography>
                    <Typography variant="h6" fontWeight="600" color="primary.main">
                      ₹{currentPolicy.currentPremium.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Start Date
                    </Typography>
                    <Typography variant="h6" fontWeight="500">
                      {formatDate(currentPolicy.startDate)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Policy Age
                    </Typography>
                    <Typography variant="h6" fontWeight="500">
                      {Math.floor((new Date() - new Date(currentPolicy.startDate)) / (365.25 * 24 * 60 * 60 * 1000))} years
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        )}
        
        {/* Timeline */}
        <Grow in={loaded} timeout={1000}>
          <Paper 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)', 
              borderRadius: 3, 
              mb: 4 
            }}
          >
            <Typography variant="h5" fontWeight="600" gutterBottom>
              Policy Event Timeline
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Full history of events, communications, and changes
            </Typography>
            
            {filteredEvents.length === 0 ? (
              <Box sx={{ 
                py: 5, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                borderRadius: 2
              }}>
                <InfoIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No events found matching your criteria
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ mt: 2, borderRadius: 2 }}
                  onClick={() => {
                    setFilterType('all');
                    setSearchTerm('');
                  }}
                >
                  Reset Filters
                </Button>
              </Box>
            ) : (
              <Timeline position="right">
                {filteredEvents.map((event, index) => (
                  <TimelineItem key={event.id}>
                    <TimelineOppositeContent 
                      color="text.secondary"
                      sx={{ 
                        maxWidth: { xs: 90, sm: 120 },
                        minWidth: { xs: 90, sm: 120 }
                      }}
                    >
                      <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
                        {formatDate(event.date)}
                      </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <Zoom in={loaded} style={{ transitionDelay: `${index * 100}ms` }}>
                        <TimelineDot color={getEventColor(event.type)}>
                          {getEventIcon(event.type)}
                        </TimelineDot>
                      </Zoom>
                      {index < filteredEvents.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={400 + (index * 100)}>
                        <Card 
                          sx={{ 
                            mb: 3, 
                            borderLeft: `4px solid ${theme.palette[getEventColor(event.type)].main}`,
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                              transform: 'translateY(-3px)',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                            }
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="h6" fontWeight="600">
                                {event.title}
                              </Typography>
                              <Chip 
                                label={event.type.charAt(0).toUpperCase() + event.type.slice(1)} 
                                size="small"
                                color={getEventColor(event.type)}
                                sx={{ fontWeight: 500 }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                              {event.description}
                            </Typography>
                            
                            <Box sx={{ 
                              bgcolor: theme => alpha(theme.palette[getEventColor(event.type)].main, 0.08),
                              borderRadius: 2,
                              p: 1.5,
                            }}>
                              {event.details && Object.entries(event.details).map(([key, value]) => (
                                <Box key={key} sx={{ display: 'flex', mb: 0.5, alignItems: 'center' }}>
                                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, mr: 2, fontWeight: 500 }}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                                  </Typography>
                                  <Typography variant="body2">
                                    {typeof value === 'number' && key.toLowerCase().includes('premium') 
                                      ? `₹${value.toFixed(2)}`
                                      : value.toString()}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grow>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            )}
          </Paper>
        </Grow>
      </Box>
    </Fade>
  );
};

export default PolicyTimeline;