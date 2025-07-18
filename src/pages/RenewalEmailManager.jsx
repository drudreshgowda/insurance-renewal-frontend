import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControl, InputLabel, Select,
  MenuItem, useTheme, alpha, IconButton, Switch, FormControlLabel, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, LinearProgress, Checkbox,
  Tabs, Tab, List, ListItem, ListItemText, ListItemIcon, Divider, AppBar
} from '@mui/material';
import {
  Email as EmailIcon, Send as SendIcon, Inbox as InboxIcon, Outbox as OutboxIcon,
  Reply as ReplyIcon, Delete as DeleteIcon,
  Archive as ArchiveIcon, Star as StarIcon, StarBorder as StarBorderIcon,
  Attachment as AttachmentIcon, Search as SearchIcon,
  MoreVert as MoreVertIcon, Flag as PriorityIcon,
  Close as CloseIcon, Add as AddIcon,
  Edit as EditIcon, Visibility as ViewIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const RenewalEmailManager = () => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  
  // State Management
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialog States
  const [composeDialog, setComposeDialog] = useState(false);
  const [viewEmailDialog, setViewEmailDialog] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [templateDialog, setTemplateDialog] = useState(false);
  
  // Compose Email State
  const [composeData, setComposeData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    template: '',
    priority: 'normal',
    scheduledSend: false,
    scheduleDate: '',
    attachments: [],
    renewalContext: {
      policyNumber: '',
      customerName: '',
      renewalDate: '',
      premiumAmount: ''
    }
  });

  // Mock email data with renewal context
  const loadEmails = useCallback(() => {
    setLoading(true);
    const mockEmails = [
      {
        id: 1,
        type: 'inbox',
        from: 'john.doe@email.com',
        to: 'renewals@company.com',
        subject: 'Policy Renewal Inquiry - POL123456',
        body: 'Hi, I have questions about my upcoming policy renewal. The premium seems higher than last year.',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        starred: false,
        priority: 'high',
        status: 'pending',
        attachments: [],
        renewalContext: {
          policyNumber: 'POL123456',
          customerName: 'John Doe',
          renewalDate: '2024-02-15',
          premiumAmount: '$1,250',
          stage: 'inquiry'
        },
        tags: ['renewal', 'inquiry', 'premium'],
        thread: [
          {
            from: 'john.doe@email.com',
            date: new Date(Date.now() - 2 * 60 * 60 * 1000),
            body: 'Hi, I have questions about my upcoming policy renewal. The premium seems higher than last year.'
          }
        ]
      },
      {
        id: 2,
        type: 'outbox',
        from: 'renewals@company.com',
        to: 'sarah.smith@email.com',
        subject: 'Renewal Reminder - Policy Due in 15 Days',
        body: 'Dear Sarah, This is a friendly reminder that your policy POL789012 is due for renewal.',
        date: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: true,
        starred: false,
        priority: 'normal',
        status: 'sent',
        attachments: ['renewal_documents.pdf'],
        renewalContext: {
          policyNumber: 'POL789012',
          customerName: 'Sarah Smith',
          renewalDate: '2024-02-10',
          premiumAmount: '$890',
          stage: 'reminder'
        },
        tags: ['renewal', 'reminder', 'automated'],
        deliveryStatus: 'delivered',
        openedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        id: 3,
        type: 'inbox',
        from: 'mike.johnson@email.com',
        to: 'renewals@company.com',
        subject: 'Thank You - Renewal Completed',
        body: 'Thank you for the smooth renewal process. Payment has been made successfully.',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true,
        starred: true,
        priority: 'normal',
        status: 'completed',
        attachments: [],
        renewalContext: {
          policyNumber: 'POL345678',
          customerName: 'Mike Johnson',
          renewalDate: '2024-01-30',
          premiumAmount: '$1,100',
          stage: 'completed'
        },
        tags: ['renewal', 'completed', 'payment'],
        thread: [
          {
            from: 'renewals@company.com',
            date: new Date(Date.now() - 48 * 60 * 60 * 1000),
            body: 'Dear Mike, your renewal is now complete. Thank you for your continued trust.'
          },
          {
            from: 'mike.johnson@email.com',
            date: new Date(Date.now() - 24 * 60 * 60 * 1000),
            body: 'Thank you for the smooth renewal process. Payment has been made successfully.'
          }
        ]
      }
    ];
    
    setTimeout(() => {
      setEmails(mockEmails);
      setFilteredEmails(mockEmails);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    loadEmails();
  }, [loadEmails]);

  // Filter emails based on search and filters
  const filterEmails = useCallback(() => {
    let filtered = emails;

    // Tab filter
    if (currentTab === 0) filtered = filtered.filter(email => email.type === 'inbox');
    else if (currentTab === 1) filtered = filtered.filter(email => email.type === 'outbox');

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(email =>
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.renewalContext.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.renewalContext.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(email => email.tags.includes(filterType));
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(email => email.priority === priorityFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(email => email.status === statusFilter);
    }

    setFilteredEmails(filtered);
  }, [emails, currentTab, searchTerm, filterType, priorityFilter, statusFilter]);

  useEffect(() => {
    filterEmails();
  }, [filterEmails]);

  // Email Actions
  const handleEmailSelect = (emailId) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const handleEmailView = (email) => {
    setSelectedEmail(email);
    setViewEmailDialog(true);
    
    // Mark as read if it's an inbox email
    if (email.type === 'inbox' && !email.read) {
      setEmails(prev => prev.map(e => 
        e.id === email.id ? { ...e, read: true } : e
      ));
    }
  };

  const handleStarEmail = (emailId) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ));
  };

  const handleDeleteEmails = () => {
    setEmails(prev => prev.filter(email => !selectedEmails.includes(email.id)));
    setSelectedEmails([]);
  };

  const handleArchiveEmails = () => {
    setEmails(prev => prev.map(email => 
      selectedEmails.includes(email.id) ? { ...email, status: 'archived' } : email
    ));
    setSelectedEmails([]);
  };

  const handleCompose = (template = null) => {
    if (template) {
      setComposeData(prev => ({
        ...prev,
        subject: template.subject,
        body: template.body,
        template: template.name
      }));
    }
    setComposeDialog(true);
  };

  const handleReply = (email) => {
    setComposeData({
      ...composeData,
      to: email.from,
      subject: `Re: ${email.subject}`,
      renewalContext: email.renewalContext
    });
    setComposeDialog(true);
  };

  const handleSendEmail = () => {
    // Mock send email
    const newEmail = {
      id: Date.now(),
      type: 'outbox',
      from: currentUser.email,
      to: composeData.to,
      subject: composeData.subject,
      body: composeData.body,
      date: new Date(),
      read: true,
      starred: false,
      priority: composeData.priority,
      status: 'sent',
      attachments: composeData.attachments,
      renewalContext: composeData.renewalContext,
      tags: ['renewal', 'manual'],
      deliveryStatus: 'sent'
    };

    setEmails(prev => [newEmail, ...prev]);
    setComposeDialog(false);
    setComposeData({
      to: '', cc: '', bcc: '', subject: '', body: '', template: '',
      priority: 'normal', scheduledSend: false, scheduleDate: '',
      attachments: [], renewalContext: { policyNumber: '', customerName: '', renewalDate: '', premiumAmount: '' }
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.info.main;
      default: return theme.palette.text.secondary;
    }
  };

  const mockTemplates = [
    {
      name: 'Renewal Reminder',
      subject: 'Policy Renewal Reminder - Action Required',
      body: 'Dear [Customer Name],\n\nYour policy [Policy Number] is due for renewal on [Renewal Date].\n\nPremium Amount: [Premium Amount]\n\nPlease contact us to complete your renewal.\n\nBest regards,\nRenewal Team'
    },
    {
      name: 'Premium Quote',
      subject: 'Your Renewal Premium Quote - [Policy Number]',
      body: 'Dear [Customer Name],\n\nWe are pleased to provide your renewal quote:\n\nPolicy: [Policy Number]\nRenewal Date: [Renewal Date]\nPremium: [Premium Amount]\n\nTo proceed with renewal, please reply to this email.\n\nThank you for your continued trust.'
    },
    {
      name: 'Documentation Request',
      subject: 'Additional Documents Required - [Policy Number]',
      body: 'Dear [Customer Name],\n\nTo complete your renewal for policy [Policy Number], we need:\n\n1. Updated vehicle registration\n2. Current driving license\n3. No-claims certificate\n\nPlease submit these at your earliest convenience.\n\nBest regards,\nDocumentation Team'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          Renewal Email Manager
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all renewal-related email communications in one place
        </Typography>
      </Box>

      {/* Action Bar */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search emails, policy numbers, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="renewal">Renewal</MenuItem>
                  <MenuItem value="inquiry">Inquiry</MenuItem>
                  <MenuItem value="reminder">Reminder</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="sent">Sent</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleCompose()}
                  fullWidth
                >
                  Compose
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedEmails.length > 0 && (
        <Card sx={{ mb: 2, borderRadius: 3, backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
          <CardContent sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {selectedEmails.length} email(s) selected
              </Typography>
              <Button size="small" startIcon={<DeleteIcon />} onClick={handleDeleteEmails}>
                Delete
              </Button>
              <Button size="small" startIcon={<ArchiveIcon />} onClick={handleArchiveEmails}>
                Archive
              </Button>
              <Button size="small" onClick={() => setSelectedEmails([])}>
                Clear Selection
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Card sx={{ borderRadius: 3 }}>
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderRadius: '12px 12px 0 0' }}>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab 
              icon={<InboxIcon />} 
              label={`Inbox (${emails.filter(e => e.type === 'inbox' && !e.read).length})`}
              iconPosition="start"
            />
            <Tab 
              icon={<OutboxIcon />} 
              label={`Outbox (${emails.filter(e => e.type === 'outbox').length})`}
              iconPosition="start"
            />
          </Tabs>
        </AppBar>

        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <LinearProgress sx={{ mb: 2 }} />
              <Typography>Loading emails...</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {currentTab === 0 ? 'From' : 'To'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Policy</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmails.map((email) => (
                    <TableRow 
                      key={email.id}
                      hover
                      sx={{ 
                        backgroundColor: !email.read && email.type === 'inbox' 
                          ? alpha(theme.palette.primary.main, 0.05) 
                          : 'transparent'
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedEmails.includes(email.id)}
                          onChange={() => handleEmailSelect(email.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton size="small" onClick={() => handleStarEmail(email.id)}>
                            {email.starred ? <StarIcon color="warning" /> : <StarBorderIcon />}
                          </IconButton>
                          {email.attachments.length > 0 && <AttachmentIcon fontSize="small" />}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: !email.read && email.type === 'inbox' ? 600 : 400,
                              cursor: 'pointer'
                            }}
                            onClick={() => handleEmailView(email)}
                          >
                            {currentTab === 0 ? email.from : email.to}
                          </Typography>
                          {email.type === 'outbox' && email.deliveryStatus && (
                            <Chip 
                              size="small" 
                              label={email.deliveryStatus}
                              color={email.deliveryStatus === 'delivered' ? 'success' : 'default'}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: !email.read && email.type === 'inbox' ? 600 : 400,
                            cursor: 'pointer'
                          }}
                          onClick={() => handleEmailView(email)}
                        >
                          {email.subject}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                          {email.tags.map(tag => (
                            <Chip key={tag} size="small" label={tag} variant="outlined" />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {email.renewalContext.policyNumber}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {email.renewalContext.customerName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          icon={<PriorityIcon />}
                          label={email.priority}
                          sx={{ 
                            color: getPriorityColor(email.priority),
                            borderColor: getPriorityColor(email.priority)
                          }}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {email.date.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton size="small" onClick={() => handleEmailView(email)}>
                            <ViewIcon />
                          </IconButton>
                          {email.type === 'inbox' && (
                            <IconButton size="small" onClick={() => handleReply(email)}>
                              <ReplyIcon />
                            </IconButton>
                          )}
                          <IconButton size="small">
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Compose Email Dialog */}
      <Dialog 
        open={composeDialog} 
        onClose={() => setComposeDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Compose Renewal Email</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                size="small" 
                onClick={() => setTemplateDialog(true)}
                startIcon={<EditIcon />}
              >
                Templates
              </Button>
              <IconButton onClick={() => setComposeDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="To"
                value={composeData.to}
                onChange={(e) => setComposeData(prev => ({ ...prev, to: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CC"
                value={composeData.cc}
                onChange={(e) => setComposeData(prev => ({ ...prev, cc: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="BCC"
                value={composeData.bcc}
                onChange={(e) => setComposeData(prev => ({ ...prev, bcc: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                value={composeData.subject}
                onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
              />
            </Grid>
            
            {/* Renewal Context */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Renewal Context
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Policy Number"
                value={composeData.renewalContext.policyNumber}
                onChange={(e) => setComposeData(prev => ({ 
                  ...prev, 
                  renewalContext: { ...prev.renewalContext, policyNumber: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={composeData.renewalContext.customerName}
                onChange={(e) => setComposeData(prev => ({ 
                  ...prev, 
                  renewalContext: { ...prev.renewalContext, customerName: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Renewal Date"
                type="date"
                value={composeData.renewalContext.renewalDate}
                onChange={(e) => setComposeData(prev => ({ 
                  ...prev, 
                  renewalContext: { ...prev.renewalContext, renewalDate: e.target.value }
                }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Premium Amount"
                value={composeData.renewalContext.premiumAmount}
                onChange={(e) => setComposeData(prev => ({ 
                  ...prev, 
                  renewalContext: { ...prev.renewalContext, premiumAmount: e.target.value }
                }))}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={8}
                label="Message"
                value={composeData.body}
                onChange={(e) => setComposeData(prev => ({ ...prev, body: e.target.value }))}
              />
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select 
                  value={composeData.priority}
                  onChange={(e) => setComposeData(prev => ({ ...prev, priority: e.target.value }))}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={composeData.scheduledSend}
                    onChange={(e) => setComposeData(prev => ({ ...prev, scheduledSend: e.target.checked }))}
                  />
                }
                label="Schedule Send"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComposeDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSendEmail} startIcon={<SendIcon />}>
            Send Email
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Email Dialog */}
      <Dialog 
        open={viewEmailDialog} 
        onClose={() => setViewEmailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedEmail && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedEmail.subject}</Typography>
                <IconButton onClick={() => setViewEmailDialog(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">From:</Typography>
                    <Typography variant="body2">{selectedEmail.from}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">To:</Typography>
                    <Typography variant="body2">{selectedEmail.to}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Date:</Typography>
                    <Typography variant="body2">{selectedEmail.date.toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Priority:</Typography>
                    <Chip 
                      size="small" 
                      label={selectedEmail.priority}
                      sx={{ color: getPriorityColor(selectedEmail.priority) }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Renewal Context */}
              <Card sx={{ mb: 3, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Renewal Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Policy Number:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {selectedEmail.renewalContext.policyNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Customer:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {selectedEmail.renewalContext.customerName}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Renewal Date:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {selectedEmail.renewalContext.renewalDate}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Premium:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {selectedEmail.renewalContext.premiumAmount}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {selectedEmail.body}
              </Typography>

              {selectedEmail.attachments.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Attachments:</Typography>
                  {selectedEmail.attachments.map((attachment, index) => (
                    <Chip 
                      key={index}
                      icon={<AttachmentIcon />}
                      label={attachment}
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                  ))}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewEmailDialog(false)}>Close</Button>
              {selectedEmail.type === 'inbox' && (
                <Button 
                  variant="contained" 
                  startIcon={<ReplyIcon />}
                  onClick={() => {
                    setViewEmailDialog(false);
                    handleReply(selectedEmail);
                  }}
                >
                  Reply
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Template Selection Dialog */}
      <Dialog open={templateDialog} onClose={() => setTemplateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Email Templates</Typography>
            <IconButton onClick={() => setTemplateDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <List>
            {mockTemplates.map((template, index) => (
              <ListItem 
                key={index}
                button 
                onClick={() => {
                  handleCompose(template);
                  setTemplateDialog(false);
                }}
              >
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText 
                  primary={template.name}
                  secondary={template.subject}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RenewalEmailManager;