import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Grid,
  useTheme,
  alpha,
  Fade,
  Grow,
  LinearProgress,
  Badge,
  Collapse,
  Alert,
  AvatarGroup,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  PersonAdd as AssignIcon,
  Archive as ArchiveIcon,
  Download as DownloadIcon,
  Attachment as AttachmentIcon,
  Note as NoteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Psychology as AIIcon,
  SentimentSatisfied as SentimentPositiveIcon,
  SentimentDissatisfied as SentimentNegativeIcon,
  SentimentNeutral as SentimentNeutralIcon,
  Warning as WarningIcon,
  Visibility as ViewingIcon,
  History as HistoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  SmartToy as SmartToyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

const EmailDetail = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { emailId } = useParams();
  const [loaded, setLoaded] = useState(false);
  const [email, setEmail] = useState(null);
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [assignDialog, setAssignDialog] = useState(false);
  const [noteDialog, setNoteDialog] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [threadExpanded, setThreadExpanded] = useState(false);
  const [viewingAgents, setViewingAgents] = useState([]);

  // Mock enhanced email data with AI features
  const mockEmail = {
    id: emailId,
    from: 'john.doe@email.com',
    to: 'support@intelipro.com',
    subject: 'Policy renewal issue - urgent help needed',
    category: 'complaint',
    status: 'new',
    priority: 'high',
    dateReceived: '2024-12-28T10:30:00',
    assignedTo: null,
    slaStatus: 'warning',
    // AI-powered features data
    aiIntent: {
      category: 'complaint',
      confidence: 94.5,
      subcategories: [
        { name: 'payment_issue', confidence: 87.2 },
        { name: 'document_verification', confidence: 82.1 },
        { name: 'policy_renewal', confidence: 91.3 }
      ]
    },
    sentiment: {
      overall: 'negative',
      score: -0.65, // -1 to 1 scale
      confidence: 89.3,
      emotions: [
        { emotion: 'frustration', intensity: 0.82 },
        { emotion: 'urgency', intensity: 0.91 },
        { emotion: 'concern', intensity: 0.76 }
      ]
    },
    threadHistory: [
      {
        id: 'thread-1',
        from: 'john.doe@email.com',
        subject: 'Initial policy renewal query',
        date: '2024-12-25T14:20:00',
        preview: 'Hi, I wanted to inquire about my policy renewal process...',
        status: 'resolved'
      },
      {
        id: 'thread-2', 
        from: 'support@intelipro.com',
        subject: 'Re: Initial policy renewal query',
        date: '2024-12-25T16:45:00',
        preview: 'Thank you for contacting us. Your renewal process has been initiated...',
        status: 'sent'
      },
      {
        id: 'thread-3',
        from: 'john.doe@email.com',
        subject: 'Follow-up on document submission',
        date: '2024-12-27T09:30:00',
        preview: 'I submitted the required documents but haven\'t received confirmation...',
        status: 'resolved'
      }
    ],
    attachments: [
      { name: 'policy_document.pdf', size: '2.3 MB' },
      { name: 'screenshot.png', size: '854 KB' }
    ],
    body: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Dear Support Team,</p>
        
        <p>I am writing to express my concern regarding the recent policy renewal process. Despite submitting all required documents well before the deadline, I have encountered several issues that need immediate attention:</p>
        
        <ol>
          <li><strong>Payment Processing Delay:</strong> My premium payment was deducted from my account on December 20th, but the system still shows "Payment Pending" status.</li>
          
          <li><strong>Document Verification:</strong> I uploaded my updated KYC documents three times, but they keep showing as "Under Review" without any feedback.</li>
          
          <li><strong>Policy Certificate:</strong> The new policy certificate has not been generated despite multiple follow-ups.</li>
        </ol>
        
        <p>This delay is causing significant inconvenience as I need the updated policy certificate for my upcoming business travel next week. I would appreciate your immediate assistance in resolving these issues.</p>
        
        <p>I have attached the relevant documents including:</p>
        <ul>
          <li>Bank statement showing the payment transaction</li>
          <li>Screenshot of the current system status</li>
        </ul>
        
        <p>Please prioritize this request and provide an update within 24 hours.</p>
        
        <p>Thank you for your prompt attention to this matter.</p>
        
        <p>Best regards,<br>
        John Doe<br>
        Policy Number: POL-2024-567890<br>
        Phone: +1 (555) 123-4567</p>
      </div>
    `,
    rawBody: `Dear Support Team,

I am writing to express my concern regarding the recent policy renewal process. Despite submitting all required documents well before the deadline, I have encountered several issues that need immediate attention:

1. Payment Processing Delay: My premium payment was deducted from my account on December 20th, but the system still shows "Payment Pending" status.

2. Document Verification: I uploaded my updated KYC documents three times, but they keep showing as "Under Review" without any feedback.

3. Policy Certificate: The new policy certificate has not been generated despite multiple follow-ups.

This delay is causing significant inconvenience as I need the updated policy certificate for my upcoming business travel next week. I would appreciate your immediate assistance in resolving these issues.

I have attached the relevant documents including:
- Bank statement showing the payment transaction
- Screenshot of the current system status

Please prioritize this request and provide an update within 24 hours.

Thank you for your prompt attention to this matter.

Best regards,
John Doe
Policy Number: POL-2024-567890
Phone: +1 (555) 123-4567`
  };

  const mockNotes = [
    {
      id: 1,
      author: 'Alice Johnson',
      timestamp: '2024-12-28T11:15:00',
      content: 'Verified payment in banking system. Payment was processed successfully. Updating status to In Progress.'
    },
    {
      id: 2,
      author: 'Bob Smith', 
      timestamp: '2024-12-28T11:45:00',
      content: 'Contacted customer via phone. Explained the verification process. Customer documents are being reviewed by compliance team.'
    }
  ];

  const mockViewingAgents = [
    { name: 'Alice Johnson', avatar: 'A', color: '#1976d2', lastActive: 'now' },
    { name: 'Bob Smith', avatar: 'B', color: '#388e3c', lastActive: '2 min ago' }
  ];

  useEffect(() => {
    setEmail(mockEmail);
    setNotes(mockNotes);
    setViewingAgents(mockViewingAgents);
    setNewStatus(mockEmail.status);
    setNewCategory(mockEmail.category);
    setTimeout(() => setLoaded(true), 100);

    // Simulate real-time viewing updates
    const interval = setInterval(() => {
      setViewingAgents(prev => 
        prev.map(agent => ({
          ...agent,
          lastActive: agent.name === 'Alice Johnson' ? 'now' : 
                     Math.random() > 0.7 ? 'now' : `${Math.floor(Math.random() * 5) + 1} min ago`
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [emailId]);

  // Helper functions for AI features
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <SentimentPositiveIcon color="success" />;
      case 'negative': return <SentimentNegativeIcon color="error" />;
      default: return <SentimentNeutralIcon color="info" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'success';
      case 'negative': return 'error';
      default: return 'info';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'success';
    if (confidence >= 70) return 'warning';
    return 'error';
  };

  const formatConfidence = (confidence) => {
    return `${confidence.toFixed(1)}%`;
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'complaint': return 'error';
      case 'feedback': return 'info';
      case 'refund': return 'warning';
      case 'appointment': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'primary';
      case 'in_progress': return 'warning';
      case 'resolved': return 'success';
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSaveStatus = () => {
    setEmail(prev => ({ ...prev, status: newStatus }));
    setEditingStatus(false);
  };

  const handleSaveCategory = () => {
    setEmail(prev => ({ ...prev, category: newCategory }));
    setEditingCategory(false);
  };

  const handleAddNote = () => {
    const note = {
      id: notes.length + 1,
      author: 'Current User',
      timestamp: new Date().toISOString(),
      content: newNote
    };
    setNotes(prev => [...prev, note]);
    setNewNote('');
    setNoteDialog(false);
  };

  // AI Intent Tagging Component
  const AIIntentTagging = ({ aiIntent }) => (
    <Card sx={{ 
      mb: 3, 
      borderRadius: 3,
      boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <SmartToyIcon color="primary" />
          <Typography variant="h6" fontWeight="600">
            AI Intent Analysis
          </Typography>
          <Chip 
            label="BETA" 
            size="small" 
            color="primary" 
            variant="outlined"
            sx={{ fontSize: '0.7rem', height: 20 }}
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" fontWeight="600">
              Primary Intent: {aiIntent.category.toUpperCase()}
            </Typography>
            <Chip 
              label={formatConfidence(aiIntent.confidence)}
              color={getConfidenceColor(aiIntent.confidence)}
              size="small"
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={aiIntent.confidence} 
            color={getConfidenceColor(aiIntent.confidence)}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Subcategory Analysis:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {aiIntent.subcategories.map((sub, index) => (
            <Tooltip key={index} title={`Confidence: ${formatConfidence(sub.confidence)}`}>
              <Chip 
                label={sub.name.replace('_', ' ')}
                size="small"
                variant="outlined"
                color={getConfidenceColor(sub.confidence)}
                sx={{ textTransform: 'capitalize' }}
              />
            </Tooltip>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  // Sentiment Indicator Component
  const SentimentIndicator = ({ sentiment }) => (
    <Card sx={{ 
      mb: 3, 
      borderRadius: 3,
      boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
      border: sentiment.overall === 'negative' ? 
        `2px solid ${alpha(theme.palette.error.main, 0.3)}` : 
        `1px solid ${alpha(theme.palette.divider, 0.5)}`
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {getSentimentIcon(sentiment.overall)}
          <Typography variant="h6" fontWeight="600">
            Sentiment Analysis
          </Typography>
          {sentiment.overall === 'negative' && (
            <Badge color="error" variant="dot">
              <WarningIcon color="error" fontSize="small" />
            </Badge>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" fontWeight="600">
                {sentiment.overall.toUpperCase()} Sentiment
              </Typography>
              <Chip 
                label={formatConfidence(sentiment.confidence)}
                color={getSentimentColor(sentiment.overall)}
                size="small"
              />
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={Math.abs(sentiment.score) * 100} 
              color={getSentimentColor(sentiment.overall)}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {sentiment.score > 0 ? <TrendingUpIcon color="success" /> : 
             sentiment.score < 0 ? <TrendingDownIcon color="error" /> : 
             <RemoveIcon color="info" />}
            <Typography variant="body2" fontWeight="500">
              {sentiment.score.toFixed(2)}
            </Typography>
          </Box>
        </Box>

        {sentiment.overall === 'negative' && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            <Typography variant="body2">
              This email contains emotionally charged content. Consider prioritizing response and using empathetic communication.
            </Typography>
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Detected Emotions:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {sentiment.emotions.map((emotion, index) => (
            <Chip 
              key={index}
              label={`${emotion.emotion} (${(emotion.intensity * 100).toFixed(0)}%)`}
              size="small"
              variant="outlined"
              color={emotion.intensity > 0.8 ? 'error' : emotion.intensity > 0.5 ? 'warning' : 'default'}
              sx={{ textTransform: 'capitalize' }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  // Real-time Collaboration Component
  const RealTimeCollaboration = ({ viewingAgents }) => (
    <Card sx={{ 
      mb: 3, 
      borderRadius: 3,
      boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <ViewingIcon color="primary" />
          <Typography variant="h6" fontWeight="600">
            Real-time Activity
          </Typography>
          <Badge badgeContent={viewingAgents.filter(agent => agent.lastActive === 'now').length} color="success">
            <CircularProgress size={16} thickness={4} />
          </Badge>
        </Box>
        
        {viewingAgents.length > 0 ? (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 12 } }}>
                {viewingAgents.map((agent, index) => (
                  <Avatar 
                    key={index}
                    sx={{ 
                      bgcolor: agent.color,
                      border: agent.lastActive === 'now' ? `2px solid ${theme.palette.success.main}` : 'none'
                    }}
                  >
                    {agent.avatar}
                  </Avatar>
                ))}
              </AvatarGroup>
              <Typography variant="body2" color="text.secondary">
                {viewingAgents.length} agent{viewingAgents.length > 1 ? 's' : ''} viewing
              </Typography>
            </Box>
            
            <List sx={{ p: 0 }}>
              {viewingAgents.map((agent, index) => (
                <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        fontSize: 11,
                        bgcolor: agent.color,
                        border: agent.lastActive === 'now' ? `2px solid ${theme.palette.success.main}` : 'none'
                      }}
                    >
                      {agent.avatar}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontSize="0.875rem">
                        {agent.name}
                      </Typography>
                    }
                    secondary={
                      <Typography 
                        variant="caption" 
                        color={agent.lastActive === 'now' ? 'success.main' : 'text.secondary'}
                      >
                        {agent.lastActive === 'now' ? '● Active now' : `Last seen ${agent.lastActive}`}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No other agents currently viewing this email
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  // Email Thread Preview Component
  const EmailThreadPreview = ({ threadHistory, expanded, onToggle }) => (
    <Card sx={{ 
      mb: 3, 
      borderRadius: 3,
      boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon color="primary" />
            <Typography variant="h6" fontWeight="600">
              Email Thread History
            </Typography>
            <Chip 
              label={`${threadHistory.length} emails`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
          <Button
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={onToggle}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            {expanded ? 'Collapse' : 'Expand'}
          </Button>
        </Box>

        <Collapse in={expanded}>
          <List sx={{ p: 0 }}>
            {threadHistory.map((thread, index) => (
              <ListItem 
                key={thread.id} 
                sx={{ 
                  px: 0, 
                  py: 1,
                  borderLeft: index === threadHistory.length - 1 ? 'none' : 
                    `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  ml: 1,
                  pl: 2,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: -5,
                    top: '50%',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: thread.from.includes('support') ? theme.palette.success.main : theme.palette.primary.main
                  }
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight="600">
                        {thread.subject}
                      </Typography>
                      <Chip 
                        label={thread.status}
                        size="small"
                        color={thread.status === 'resolved' ? 'success' : 'info'}
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        From: {thread.from} • {formatDate(thread.date)}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                        {thread.preview}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
        
        {!expanded && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Click expand to view {threadHistory.length} previous emails in this conversation thread
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (!email) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="h6">Loading email...</Typography>
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ px: 1 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => navigate('/emails')}
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight="600">
                Email Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {email.id}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<AssignIcon />}
              variant="outlined"
              onClick={() => setAssignDialog(true)}
              sx={{ borderRadius: 2 }}
            >
              Assign
            </Button>
            <Button
              startIcon={<ArchiveIcon />}
              variant="outlined"
              color="secondary"
              sx={{ borderRadius: 2 }}
            >
              Archive
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Email Content */}
          <Grid item xs={12} lg={8}>
            {/* AI-Powered Features */}
            <Grow in={loaded} timeout={200}>
              <Box>
                <AIIntentTagging aiIntent={email.aiIntent} />
              </Box>
            </Grow>

            <Grow in={loaded} timeout={300}>
              <Box>
                <SentimentIndicator sentiment={email.sentiment} />
              </Box>
            </Grow>

            <Grow in={loaded} timeout={350}>
              <Box>
                <EmailThreadPreview 
                  threadHistory={email.threadHistory} 
                  expanded={threadExpanded}
                  onToggle={() => setThreadExpanded(!threadExpanded)}
                />
              </Box>
            </Grow>

            {/* Email Header */}
            <Grow in={loaded} timeout={400}>
              <Card sx={{ 
                mb: 3, 
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" fontWeight="600" gutterBottom>
                        {email.subject}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" color="text.secondary">From:</Typography>
                          <Typography variant="body2" fontWeight="500">{email.from}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" color="text.secondary">To:</Typography>
                          <Typography variant="body2" fontWeight="500">{email.to}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" color="text.secondary">Received:</Typography>
                          <Typography variant="body2" fontWeight="500">{formatDate(email.dateReceived)}</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {editingCategory ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <FormControl size="small" sx={{ minWidth: 120 }}>
                                <Select
                                  value={newCategory}
                                  onChange={(e) => setNewCategory(e.target.value)}
                                >
                                  <MenuItem value="complaint">Complaint</MenuItem>
                                  <MenuItem value="feedback">Feedback</MenuItem>
                                  <MenuItem value="refund">Refund</MenuItem>
                                  <MenuItem value="appointment">Appointment</MenuItem>
                                  <MenuItem value="uncategorized">Uncategorized</MenuItem>
                                </Select>
                              </FormControl>
                              <IconButton size="small" onClick={handleSaveCategory}>
                                <SaveIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => setEditingCategory(false)}>
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip 
                                label={email.category.charAt(0).toUpperCase() + email.category.slice(1)}
                                color={getCategoryColor(email.category)}
                                size="small"
                              />
                              <IconButton size="small" onClick={() => setEditingCategory(true)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {editingStatus ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <FormControl size="small" sx={{ minWidth: 120 }}>
                                <Select
                                  value={newStatus}
                                  onChange={(e) => setNewStatus(e.target.value)}
                                >
                                  <MenuItem value="new">New</MenuItem>
                                  <MenuItem value="in_progress">In Progress</MenuItem>
                                  <MenuItem value="resolved">Resolved</MenuItem>
                                </Select>
                              </FormControl>
                              <IconButton size="small" onClick={handleSaveStatus}>
                                <SaveIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => setEditingStatus(false)}>
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip 
                                label={email.status.replace('_', ' ').toUpperCase()}
                                color={getStatusColor(email.status)}
                                size="small"
                              />
                              <IconButton size="small" onClick={() => setEditingStatus(true)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>

                        <Chip 
                          label={`${email.priority.toUpperCase()} PRIORITY`}
                          color={getPriorityColor(email.priority)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Attachments */}
                  {email.attachments && email.attachments.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachmentIcon fontSize="small" />
                        Attachments ({email.attachments.length})
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {email.attachments.map((attachment, index) => (
                          <Chip
                            key={index}
                            label={`${attachment.name} (${attachment.size})`}
                            icon={<DownloadIcon />}
                            clickable
                            sx={{ borderRadius: 2 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Divider sx={{ my: 3 }} />

                  {/* Email Body */}
                  <Box sx={{ 
                    bgcolor: alpha(theme.palette.background.default, 0.5),
                    p: 3,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.text.primary,
                    '& p': {
                      color: theme.palette.text.primary,
                      margin: '0 0 16px 0'
                    },
                    '& strong': {
                      color: theme.palette.text.primary,
                      fontWeight: 600
                    },
                    '& li': {
                      color: theme.palette.text.primary,
                      marginBottom: '8px'
                    },
                    '& ol, & ul': {
                      paddingLeft: '20px',
                      margin: '16px 0'
                    },
                    '& br': {
                      lineHeight: 1.6
                    }
                  }}>
                    <div 
                      dangerouslySetInnerHTML={{ __html: email.body }} 
                      style={{ 
                        maxWidth: '100%', 
                        wordWrap: 'break-word',
                        /* Basic security styling */
                        '& script': { display: 'none !important' },
                        '& iframe': { display: 'none !important' },
                        '& object': { display: 'none !important' },
                        '& embed': { display: 'none !important' }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Real-time Collaboration */}
            <Grow in={loaded} timeout={500}>
              <Box>
                <RealTimeCollaboration viewingAgents={viewingAgents} />
              </Box>
            </Grow>

            {/* Assignment Info */}
            <Grow in={loaded} timeout={600}>
              <Card sx={{ 
                mb: 3, 
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Assignment
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="500">
                        {email.assignedTo || 'Unassigned'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {email.assignedTo ? 'Assigned Agent' : 'No agent assigned'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grow>

            {/* Internal Notes */}
            <Grow in={loaded} timeout={800}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="600">
                      Internal Notes
                    </Typography>
                    <Button
                      startIcon={<NoteIcon />}
                      variant="outlined"
                      size="small"
                      onClick={() => setNoteDialog(true)}
                      sx={{ borderRadius: 2 }}
                    >
                      Add Note
                    </Button>
                  </Box>
                  
                  <List sx={{ p: 0 }}>
                    {notes.map((note) => (
                      <ListItem key={note.id} sx={{ px: 0, py: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                            {note.author.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight="500">
                              {note.author}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(note.timestamp)}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                {note.content}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>

        {/* Assign Dialog */}
        <Dialog open={assignDialog} onClose={() => setAssignDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Assign Email</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Team Member</InputLabel>
              <Select label="Team Member">
                <MenuItem value="alice">Alice Johnson</MenuItem>
                <MenuItem value="bob">Bob Smith</MenuItem>
                <MenuItem value="charlie">Charlie Brown</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAssignDialog(false)}>Cancel</Button>
            <Button variant="contained">Assign</Button>
          </DialogActions>
        </Dialog>

        {/* Add Note Dialog */}
        <Dialog open={noteDialog} onClose={() => setNoteDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Internal Note</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Note"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNoteDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddNote} disabled={!newNote.trim()}>
              Add Note
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default EmailDetail; 