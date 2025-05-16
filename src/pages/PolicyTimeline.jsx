import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography,
  Card, 
  CardContent, 
  TextField,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Menu,
  Avatar,
  Tab,
  Tabs,
  Tooltip,
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
  FilterList as FilterIcon,
  Event as EventIcon,
  Payment as PaymentIcon,
  ReceiptLong as ReceiptIcon,
  Autorenew as AutorenewIcon,
  Create as CreateIcon,
  Policy as PolicyIcon,
  Info as InfoIcon,
  VerifiedUser as VerifiedUserIcon,
  Warning as WarningIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PolicyTimeline = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [policyData, setPolicyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Sample policy timeline data
  const mockPolicyData = {
    customerId: "CUST-12345",
    customerName: "John Smith",
    policies: [
      {
        policyId: "POL-AUTO-987",
        policyType: "Auto Insurance",
        currentPremium: 1250.00,
        startDate: "2018-06-15",
        events: [
          {
            id: "ev-001",
            date: "2018-06-15",
            type: "creation",
            title: "Policy Created",
            description: "Auto insurance policy initiated with basic coverage",
            details: {
              premium: 980.00,
              coverage: "Basic coverage with $500 deductible",
              agent: "Alice Johnson"
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
              coverage: "Comprehensive coverage with $250 deductible",
              agent: "Bob Miller"
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
              coverage: "Comprehensive coverage with $250 deductible",
              agent: "Alice Johnson"
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
              deductible: 250.00,
              handledBy: "Carol Davis"
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
              coverage: "Comprehensive coverage with $250 deductible",
              agent: "Alice Johnson"
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
              agent: "David Wilson"
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
              agent: "Alice Johnson"
            }
          },
          {
            id: "ev-009",
            date: "2023-10-05",
            type: "communication",
            title: "Coverage Review",
            description: "Scheduled call to review current coverage options",
            details: {
              agent: "Alice Johnson",
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
              agent: "Alice Johnson"
            }
          }
        ]
      },
      {
        policyId: "POL-HOME-456",
        policyType: "Home Insurance",
        currentPremium: 950.00,
        startDate: "2020-09-22",
        events: [
          {
            id: "ev-101",
            date: "2020-09-22",
            type: "creation",
            title: "Policy Created",
            description: "Home insurance policy initiated with standard coverage",
            details: {
              premium: 850.00,
              coverage: "Standard home coverage with $1000 deductible",
              agent: "Bob Miller"
            }
          },
          {
            id: "ev-102",
            date: "2021-08-15",
            type: "modification",
            title: "Coverage Update",
            description: "Added flood protection coverage",
            details: {
              premium: 925.00,
              coverage: "Enhanced coverage with flood protection",
              agent: "Carol Davis"
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
              discount: "5% bundle discount with auto policy",
              coverage: "Enhanced coverage with flood protection",
              agent: "Bob Miller"
            }
          },
          {
            id: "ev-104",
            date: "2022-09-22",
            type: "renewal",
            title: "Policy Renewed",
            description: "Annual policy renewal with home security discount",
            details: {
              premium: 850.00,
              discount: "Added 3% home security system discount",
              coverage: "Enhanced coverage with flood protection",
              agent: "Alice Johnson"
            }
          },
          {
            id: "ev-105",
            date: "2023-04-18",
            type: "claim",
            title: "Claim Filed",
            description: "Claim filed for water damage from broken pipe",
            details: {
              claimAmount: 3200.00,
              status: "Approved",
              deductible: 1000.00,
              handledBy: "David Wilson"
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
              coverage: "Enhanced coverage with flood protection",
              agent: "Carol Davis"
            }
          }
        ]
      }
    ]
  };

  useEffect(() => {
    // This would be replaced with actual API call in a real app
    const fetchPolicyData = async () => {
      try {
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setPolicyData(mockPolicyData);
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
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  
  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    handleFilterClose();
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
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<FilterIcon />}
              onClick={handleFilterClick}
              color="primary"
              sx={{
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              Filter Events
            </Button>
          </Box>
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
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                    },
                    '& .Mui-selected': {
                      fontWeight: 600,
                    }
                  }}
                >
                  {policyData?.policies.map((policy, index) => (
                    <Tab 
                      key={policy.policyId} 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                      ${currentPolicy.currentPremium.toFixed(2)}
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
                                      ? `$${value.toFixed(2)}`
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