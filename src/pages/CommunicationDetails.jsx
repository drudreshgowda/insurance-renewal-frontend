import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  IconButton,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tab,
  Tabs,
  Stack,
  Badge,
  Tooltip,
  alpha
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
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Sms as SmsIcon,
  WhatsApp as WhatsAppIcon,
  Chat as ChatIcon,
  VideoCall as VideoCallIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  TrendingUp as TrendingUpIcon,
  Download as DownloadIcon,
  Reply as ReplyIcon,
  Forward as ForwardIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`communication-tabpanel-${index}`}
      aria-labelledby={`communication-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CommunicationDetails = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  // Mock communication data
  const communicationData = {
    caseId: caseId,
    customerName: "Rajesh Kumar",
    totalCommunications: 15,
    lastContact: "2024-03-08T14:30:00Z",
    communications: [
      {
        id: 1,
        type: "email",
        direction: "inbound",
        subject: "Policy Renewal Inquiry",
        content: "Hello, I would like to know about my policy renewal options and any available discounts. I've been a loyal customer for 5 years and would appreciate any special offers.",
        timestamp: "2024-03-08T14:30:00Z",
        agent: "Priya Sharma",
        status: "resolved",
        priority: "medium",
        attachments: ["policy_document.pdf", "renewal_options.pdf"],
        starred: true,
        responseTime: "2 hours",
        customerSatisfaction: 5,
        tags: ["renewal", "discount", "loyalty"]
      },
      {
        id: 2,
        type: "phone",
        direction: "outbound",
        subject: "Follow-up Call - Policy Renewal",
        content: "Called customer to discuss renewal options. Customer showed interest in upgrading coverage from ₹5L to ₹10L. Explained benefits and cost difference. Customer requested time to think and will call back by Friday.",
        timestamp: "2024-03-07T10:15:00Z",
        agent: "Amit Singh",
        status: "completed",
        priority: "high",
        duration: "15 minutes",
        starred: false,
        responseTime: "1 hour",
        customerSatisfaction: 4,
        tags: ["renewal", "upgrade", "follow-up"],
        callType: "consultation",
        outcome: "positive"
      },
      {
        id: 3,
        type: "whatsapp",
        direction: "inbound",
        subject: "Claim Form Request",
        content: "Hi, can you please send me the claim form? I need to file a claim for my recent accident. My vehicle registration is MH12AB1234.",
        timestamp: "2024-03-06T16:45:00Z",
        agent: "System Auto-Reply",
        status: "pending",
        priority: "high",
        starred: false,
        responseTime: "pending",
        tags: ["claim", "accident", "urgent"],
        autoReply: true
      },
      {
        id: 4,
        type: "sms",
        direction: "outbound",
        subject: "Payment Reminder",
        content: "Reminder: Your policy premium of ₹12,500 is due on March 15, 2024. Pay now to avoid policy lapse. Use code RENEW2024 for 5% discount.",
        timestamp: "2024-03-05T09:00:00Z",
        agent: "System",
        status: "delivered",
        priority: "medium",
        starred: false,
        tags: ["payment", "reminder", "discount"],
        campaignId: "RENEWAL_REMINDER_2024"
      },
      {
        id: 5,
        type: "email",
        direction: "inbound",
        subject: "Billing Question - Premium Calculation",
        content: "I received my bill but I think there's an error in the calculation. Last year I paid ₹11,000 but this year it's ₹12,500. Can someone please review this and explain the increase?",
        timestamp: "2024-03-04T11:20:00Z",
        agent: "Sarah Johnson",
        status: "in_progress",
        priority: "medium",
        attachments: ["bill_copy.pdf", "previous_year_bill.pdf"],
        starred: false,
        responseTime: "4 hours",
        tags: ["billing", "premium", "calculation"],
        escalated: false
      },
      {
        id: 6,
        type: "phone",
        direction: "inbound",
        subject: "Claim Status Inquiry",
        content: "Customer called to check the status of claim CLM-2024-001234. Provided update that assessment is in progress and should be completed by end of week.",
        timestamp: "2024-03-03T15:20:00Z",
        agent: "Ravi Patel",
        status: "completed",
        priority: "medium",
        duration: "8 minutes",
        starred: false,
        responseTime: "immediate",
        customerSatisfaction: 4,
        tags: ["claim", "status", "inquiry"],
        callType: "inquiry",
        outcome: "satisfied"
      },
      {
        id: 7,
        type: "whatsapp",
        direction: "outbound",
        subject: "Document Submission Reminder",
        content: "Hi Mr. Kumar, we're still waiting for your PAN card copy and address proof for policy renewal. Please submit by March 10th to avoid processing delays.",
        timestamp: "2024-03-02T12:00:00Z",
        agent: "Meera Gupta",
        status: "delivered",
        priority: "high",
        starred: false,
        responseTime: "N/A",
        tags: ["documents", "reminder", "renewal"],
        followUpRequired: true
      },
      {
        id: 8,
        type: "email",
        direction: "outbound",
        subject: "Welcome to Digital Services",
        content: "Welcome to our new digital services platform! You can now manage your policy, make payments, and file claims online. Login details have been sent separately.",
        timestamp: "2024-03-01T10:30:00Z",
        agent: "System",
        status: "delivered",
        priority: "low",
        starred: false,
        tags: ["welcome", "digital", "services"],
        campaignId: "DIGITAL_ONBOARDING_2024"
      },
      {
        id: 9,
        type: "phone",
        direction: "outbound",
        subject: "Policy Renewal Confirmation",
        content: "Called to confirm policy renewal completion. Customer confirmed receipt of new policy documents. Explained new features and benefits. Customer very satisfied with service.",
        timestamp: "2024-02-28T14:45:00Z",
        agent: "Priya Sharma",
        status: "completed",
        priority: "medium",
        duration: "12 minutes",
        starred: true,
        responseTime: "N/A",
        customerSatisfaction: 5,
        tags: ["renewal", "confirmation", "satisfaction"],
        callType: "confirmation",
        outcome: "excellent"
      },
      {
        id: 10,
        type: "sms",
        direction: "outbound",
        subject: "Policy Renewal Success",
        content: "Congratulations! Your policy has been successfully renewed. Policy number: POL-2024-789012. Valid till March 2025. Thank you for choosing us!",
        timestamp: "2024-02-27T16:20:00Z",
        agent: "System",
        status: "delivered",
        priority: "low",
        starred: false,
        tags: ["renewal", "success", "confirmation"],
        campaignId: "RENEWAL_SUCCESS_2024"
      },
      {
        id: 11,
        type: "email",
        direction: "inbound",
        subject: "Add-on Coverage Request",
        content: "I would like to add personal accident cover to my existing policy. Please let me know the process and additional premium required.",
        timestamp: "2024-02-26T09:15:00Z",
        agent: "Amit Singh",
        status: "resolved",
        priority: "medium",
        attachments: ["add_on_details.pdf"],
        starred: false,
        responseTime: "3 hours",
        customerSatisfaction: 4,
        tags: ["add-on", "personal-accident", "coverage"]
      },
      {
        id: 12,
        type: "whatsapp",
        direction: "inbound",
        subject: "Branch Visit Appointment",
        content: "I want to visit your branch to discuss my policy. Can you please tell me the address and timings? Also, what documents should I bring?",
        timestamp: "2024-02-25T11:30:00Z",
        agent: "Sarah Johnson",
        status: "resolved",
        priority: "low",
        starred: false,
        responseTime: "1 hour",
        customerSatisfaction: 4,
        tags: ["branch", "visit", "appointment"]
      },
      {
        id: 13,
        type: "phone",
        direction: "inbound",
        subject: "Complaint - Claim Delay",
        content: "Customer complained about delay in claim processing. Claim was filed 3 weeks ago but no update received. Escalated to claims manager. Promised update within 24 hours.",
        timestamp: "2024-02-24T13:45:00Z",
        agent: "Ravi Patel",
        status: "escalated",
        priority: "high",
        duration: "18 minutes",
        starred: true,
        responseTime: "immediate",
        customerSatisfaction: 2,
        tags: ["complaint", "claim", "delay"],
        callType: "complaint",
        outcome: "escalated",
        escalated: true,
        escalationReason: "claim processing delay"
      },
      {
        id: 14,
        type: "email",
        direction: "outbound",
        subject: "Claim Update - Assessment Complete",
        content: "Your claim assessment has been completed. Approved amount: ₹42,000. Settlement will be processed within 3-5 business days. Thank you for your patience.",
        timestamp: "2024-02-23T10:00:00Z",
        agent: "Claims Team",
        status: "delivered",
        priority: "high",
        starred: false,
        tags: ["claim", "update", "settlement"],
        claimNumber: "CLM-2024-001234"
      },
      {
        id: 15,
        type: "sms",
        direction: "outbound",
        subject: "Feedback Request",
        content: "How was your experience with our service? Please rate us: bit.ly/feedback-rk2024. Your feedback helps us improve. Thank you!",
        timestamp: "2024-02-22T17:30:00Z",
        agent: "System",
        status: "delivered",
        priority: "low",
        starred: false,
        tags: ["feedback", "rating", "improvement"],
        campaignId: "FEEDBACK_REQUEST_2024"
      }
    ],
    summary: {
      totalEmails: 6,
      totalCalls: 4,
      totalSMS: 3,
      totalWhatsApp: 3,
      averageResponseTime: "2.1 hours",
      satisfactionRating: 4.1,
      totalInbound: 8,
      totalOutbound: 7,
      resolvedCommunications: 10,
      pendingCommunications: 2,
      escalatedCommunications: 1,
      averageCallDuration: "13.5 minutes",
      responseRate: "94%",
      firstCallResolution: "78%"
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'email': return <EmailIcon />;
      case 'phone': return <PhoneIcon />;
      case 'sms': return <SmsIcon />;
      case 'whatsapp': return <WhatsAppIcon />;
      case 'chat': return <ChatIcon />;
      case 'video': return <VideoCallIcon />;
      default: return <ChatIcon />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'email': return 'primary';
      case 'phone': return 'success';
      case 'sms': return 'warning';
      case 'whatsapp': return 'success';
      case 'chat': return 'info';
      case 'video': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'pending': return 'error';
      case 'delivered': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton 
          onClick={() => navigate(`/cases/${caseId}`)} 
          sx={{ 
            bgcolor: 'background.paper', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="600">
            Communication Details
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Case ID: {caseId} • Customer: {communicationData.customerName}
          </Typography>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {communicationData.totalCommunications}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Communications
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {communicationData.summary.averageResponseTime}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Response Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {communicationData.summary.satisfactionRating}/5
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Satisfaction Rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {new Date(communicationData.lastContact).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last Contact
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Communication Breakdown */}
      <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
            Communication Breakdown
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 1 }}>
                <EmailIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">{communicationData.summary.totalEmails}</Typography>
                <Typography variant="body2" color="text.secondary">Emails</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 1 }}>
                <PhoneIcon color="success" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">{communicationData.summary.totalCalls}</Typography>
                <Typography variant="body2" color="text.secondary">Calls</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 1 }}>
                <SmsIcon color="warning" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">{communicationData.summary.totalSMS}</Typography>
                <Typography variant="body2" color="text.secondary">SMS</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 1 }}>
                <WhatsAppIcon color="success" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">{communicationData.summary.totalWhatsApp}</Typography>
                <Typography variant="body2" color="text.secondary">WhatsApp</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Communication History */}
      <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
            Communication History
          </Typography>

          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="All Communications" />
            <Tab label="Timeline View" />
            <Tab label="By Channel" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <List>
              {communicationData.communications.map((comm, index) => (
                <React.Fragment key={comm.id}>
                  {index > 0 && <Divider />}
                  <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${getTypeColor(comm.type)}.main` }}>
                        {getTypeIcon(comm.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="600">
                            {comm.subject}
                          </Typography>
                          <Chip 
                            label={comm.direction} 
                            size="small" 
                            color={comm.direction === 'inbound' ? 'primary' : 'secondary'}
                            sx={{ borderRadius: 5 }}
                          />
                          <Chip 
                            label={comm.status} 
                            size="small" 
                            color={getStatusColor(comm.status)}
                            sx={{ borderRadius: 5 }}
                          />
                          <Chip 
                            label={comm.priority} 
                            size="small" 
                            color={getPriorityColor(comm.priority)}
                            variant="outlined"
                            sx={{ borderRadius: 5 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {comm.content}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(comm.timestamp).toLocaleString()} • Agent: {comm.agent}
                            </Typography>
                            {comm.duration && (
                              <Typography variant="caption" color="text.secondary">
                                Duration: {comm.duration}
                              </Typography>
                            )}
                            {comm.attachments && comm.attachments.length > 0 && (
                              <Chip 
                                icon={<DownloadIcon />}
                                label={`${comm.attachments.length} attachment(s)`}
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: 5 }}
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        onClick={() => {/* Handle star toggle */}}
                        color={comm.starred ? "warning" : "default"}
                      >
                        {comm.starred ? <StarIcon /> : <StarBorderIcon />}
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Timeline>
              {communicationData.communications.map((comm) => (
                <TimelineItem key={comm.id}>
                  <TimelineOppositeContent color="text.secondary">
                    {new Date(comm.timestamp).toLocaleDateString()}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color={getTypeColor(comm.type)}>
                      {getTypeIcon(comm.type)}
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span">
                      {comm.subject}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {comm.content}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              {['email', 'phone', 'sms', 'whatsapp'].map((channel) => (
                <Grid item xs={12} md={6} key={channel}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {getTypeIcon(channel)}
                        <Typography variant="h6" sx={{ ml: 1, textTransform: 'capitalize' }}>
                          {channel === 'whatsapp' ? 'WhatsApp' : channel}
                        </Typography>
                      </Box>
                      <List dense>
                        {communicationData.communications
                          .filter(comm => comm.type === channel)
                          .map((comm) => (
                            <ListItem key={comm.id}>
                              <ListItemText
                                primary={comm.subject}
                                secondary={new Date(comm.timestamp).toLocaleDateString()}
                              />
                            </ListItem>
                          ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CommunicationDetails; 