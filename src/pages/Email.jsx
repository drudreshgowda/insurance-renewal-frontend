import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  Button,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  useTheme,
  alpha,
  Fade,
  Grow,
  Badge,
  Checkbox,
  Toolbar,
  Snackbar,
  Alert,
  Divider,
  ListItemIcon,
  ListItemText,
  TableSortLabel,
  LinearProgress,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  PersonAdd as AssignIcon,
  Archive as ArchiveIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  Attachment as AttachmentIcon,
  Flag as FlagIcon,
  Schedule as ScheduleIcon,
  CheckCircle as ResolvedIcon,
  Category as CategoryIcon,
  FileDownload as ExportIcon,
  ClearAll as ClearAllIcon,
  Edit as EditIcon,
  Reply as ReplyIcon,
  Circle as CircleIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const EmailInbox = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const [assignDialog, setAssignDialog] = useState({ open: false, emailId: null, emailIds: [] });
  const [reclassifyDialog, setReclassifyDialog] = useState({ open: false, emailId: null, currentCategory: '' });
  const [replyDialog, setReplyDialog] = useState({ open: false, emailId: null, emailSubject: '', emailFrom: '', templateBody: '' });
  const [replyText, setReplyText] = useState('');
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [actionMenus, setActionMenus] = useState({});
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [bulkActionsVisible, setBulkActionsVisible] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // New state for sorting
  const [sortConfig, setSortConfig] = useState({ key: 'dateReceived', direction: 'desc' });

  // New responsive states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [newEmailsCount, setNewEmailsCount] = useState(0);
  
  // Email Templates and Automation states
  const [templatesDialog, setTemplatesDialog] = useState({ open: false, emailId: null });
  const [automationDialog, setAutomationDialog] = useState({ open: false });
  const [templatePreviewDialog, setTemplatePreviewDialog] = useState({ open: false, template: null, emailId: null });

  const [automationSettings, setAutomationSettings] = useState({
    enabled: true,
    autoReplyDelay: 5, // minutes
    businessHoursOnly: true,
    categories: ['complaint', 'feedback', 'appointment'],
    excludeKeywords: ['urgent', 'escalate', 'manager']
  });

  // Custom template management states
  const [customTemplates, setCustomTemplates] = useState([]);
  const [templateManagementDialog, setTemplateManagementDialog] = useState({ open: false });
  const [editTemplateDialog, setEditTemplateDialog] = useState({ 
    open: false, 
    template: null, 
    mode: 'add' // 'add' or 'edit'
  });
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'general',
    subject: '',
    body: ''
  });

  const agentsList = useMemo(() => [
    'Priya Patel',
    'Bob Smith', 
    'Charlie Brown',
    'Diana Wilson',
    'Eric Thompson'
  ], []);

  const categoryOptions = [
    'complaint',
    'feedback', 
    'refund',
    'appointment',
    'uncategorized'
  ];

  // Email Templates
  const emailTemplates = [
    {
      id: 'acknowledgment',
      name: 'Acknowledgment',
      category: 'general',
      subject: 'Re: {{subject}}',
      body: `Dear {{customerName}},

Thank you for contacting us. We have received your email regarding {{subject}} and want to assure you that we are reviewing your request.

Our team will respond to your inquiry within 24 hours during business hours. If this is an urgent matter, please call our customer service line at (555) 123-4567.

We appreciate your patience and look forward to assisting you.

Best regards,
Customer Support Team
Intelipro Insurance`
    },
    {
      id: 'complaint_response',
      name: 'Complaint Response',
      category: 'complaint',
      subject: 'Re: {{subject}} - We\'re Here to Help',
      body: `Dear {{customerName}},

Thank you for bringing this matter to our attention. We sincerely apologize for any inconvenience you have experienced.

Your concern is important to us, and we are committed to resolving this issue promptly. A senior customer service representative will review your case and contact you within 4 hours.

In the meantime, if you have any additional information that might help us resolve this matter, please don't hesitate to share it with us.

We value your business and appreciate your patience as we work to make this right.

Sincerely,
Customer Care Team
Intelipro Insurance`
    },
    {
      id: 'appointment_confirmation',
      name: 'Appointment Confirmation',
      category: 'appointment',
      subject: 'Appointment Confirmation - {{date}}',
      body: `Dear {{customerName}},

This email confirms your appointment scheduled for {{date}} at {{time}}.

Meeting Details:
- Date: {{date}}
- Time: {{time}}
- Duration: 30 minutes
- Meeting Type: {{meetingType}}
- Agent: {{agentName}}

Please ensure you have the following documents ready:
- Valid ID
- Policy documents
- Any relevant correspondence

If you need to reschedule or cancel, please contact us at least 24 hours in advance at (555) 123-4567.

We look forward to meeting with you.

Best regards,
{{agentName}}
Intelipro Insurance`
    },
    {
      id: 'refund_processing',
      name: 'Refund Processing',
      category: 'refund',
      subject: 'Refund Request - Processing Update',
      body: `Dear {{customerName}},

We have received and are processing your refund request for policy {{policyNumber}}.

Refund Details:
- Amount: {{refundAmount}}
- Processing Time: 5-7 business days
- Method: Original payment method
- Reference: {{referenceNumber}}

You will receive an email confirmation once the refund has been processed. The funds should appear in your account within 5-7 business days from the processing date.

If you have any questions about your refund, please contact us at (555) 123-4567 with your reference number.

Thank you for your patience.

Best regards,
Billing Department
Intelipro Insurance`
    },
    {
      id: 'feedback_thanks',
      name: 'Feedback Thank You',
      category: 'feedback',
      subject: 'Thank You for Your Feedback',
      body: `Dear {{customerName}},

Thank you for taking the time to share your feedback with us. Your input is invaluable in helping us improve our services.

We have forwarded your comments to the appropriate team for review and consideration. Your feedback helps us understand what we're doing well and where we can make improvements.

If you have any additional suggestions or concerns, please don't hesitate to reach out to us. We're always here to listen and help.

We appreciate your business and look forward to serving you better.

Warm regards,
Customer Experience Team
Intelipro Insurance`
    }
  ];

  // Generate dynamic email data based on current filters and time
  const generateDynamicEmails = useCallback(() => {
    const baseEmails = [
      {
        id: 'EMAIL-001',
        from: 'john.doe@email.com',
        subject: 'Policy renewal issue - urgent help needed',
        category: 'complaint',
        status: 'new',
        dateReceived: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        hasAttachments: true,
        priority: 'high',
        assignedTo: null,
        slaStatus: 'warning',
        content: 'I am having trouble with my policy renewal...',
        isRead: false,
        slaTimeRemaining: Math.floor(Math.random() * 8 * 60 * 60 * 1000), // Random SLA time
        slaDeadline: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000).toISOString()
      },
      // ... other base emails with dynamic data
    ];

    // Generate additional emails based on filters
    const additionalEmails = [];
    const emailCount = Math.floor(Math.random() * 10) + 15; // 15-25 emails

    for (let i = 0; i < emailCount; i++) {
      const categories = ['complaint', 'feedback', 'refund', 'appointment', 'uncategorized'];
      const statuses = ['new', 'in_progress', 'resolved'];
      const priorities = ['low', 'medium', 'high'];
      const slaStatuses = ['ok', 'warning', 'breach'];
      
      const category = categories[Math.floor(Math.random() * categories.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Apply filter bias
      const categoryBias = categoryFilter !== 'all' ? categoryFilter : category;
      const statusBias = statusFilter !== 'all' ? statusFilter : status;
      
      additionalEmails.push({
        id: `EMAIL-${String(i + 100).padStart(3, '0')}`,
        from: `user${i}@email.com`,
        subject: `Dynamic email ${i + 1} - ${categoryBias} related`,
        category: Math.random() > 0.3 ? categoryBias : category,
        status: Math.random() > 0.3 ? statusBias : status,
        dateReceived: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        hasAttachments: Math.random() > 0.6,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        assignedTo: Math.random() > 0.5 ? agentsList[Math.floor(Math.random() * agentsList.length)] : null,
        slaStatus: slaStatuses[Math.floor(Math.random() * slaStatuses.length)],
        content: `This is a dynamically generated email for ${categoryBias}...`,
        isRead: Math.random() > 0.4,
        slaTimeRemaining: Math.floor(Math.random() * 24 * 60 * 60 * 1000),
        slaDeadline: new Date(Date.now() + Math.random() * 48 * 60 * 60 * 1000).toISOString()
      });
    }

    return [...baseEmails, ...additionalEmails];
  }, [categoryFilter, statusFilter, agentsList]);

  // Auto-refresh functionality
  const refreshEmails = useCallback(async () => {
    setIsRefreshing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newEmails = generateDynamicEmails();
    const previousCount = emails.length;
    const newCount = newEmails.length;
    
    setEmails(newEmails);
    setLastUpdated(new Date());
    
    if (newCount > previousCount) {
      setNewEmailsCount(newCount - previousCount);
      showNotification(`${newCount - previousCount} new emails received`, 'info');
    }
    
    setIsRefreshing(false);
  }, [generateDynamicEmails, emails.length]);

  // Initialize emails and set up auto-refresh
  useEffect(() => {
    const initialEmails = generateDynamicEmails();
    setEmails(initialEmails);
    setFilteredEmails(initialEmails);
    setTimeout(() => setLoaded(true), 100);

    // Auto-refresh every 30 seconds if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        refreshEmails();
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [generateDynamicEmails, autoRefresh, refreshEmails]);

  // Enhanced filtering with real-time updates
  useEffect(() => {
    let filtered = emails;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(email => 
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(email => email.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(email => email.status === statusFilter);
    }

    // Apply date filter with enhanced options
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'yesterday':
          filterDate.setDate(now.getDate() - 1);
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'unread':
          filtered = filtered.filter(email => !email.isRead);
          break;
        case 'sla_breach':
          filtered = filtered.filter(email => email.slaStatus === 'breach');
          break;
        default:
          break;
      }
      
      if (dateFilter !== 'all' && dateFilter !== 'unread' && dateFilter !== 'sla_breach') {
        filtered = filtered.filter(email => 
          new Date(email.dateReceived) >= filterDate
        );
      }
    }

    setFilteredEmails(filtered);
    setPage(1); // Reset to first page when filters change
  }, [emails, searchTerm, categoryFilter, statusFilter, dateFilter]);

  // Update bulk actions visibility when selection changes
  useEffect(() => {
    setBulkActionsVisible(selectedEmails.length > 0);
  }, [selectedEmails]);

  // Manual refresh handler
  const handleManualRefresh = () => {
    refreshEmails();
  };

  // Toggle auto-refresh
  const handleToggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
    showNotification(`Auto-refresh ${!autoRefresh ? 'enabled' : 'disabled'}`, 'info');
  };

  // Enhanced mark as read with real-time update
  const markAsRead = (emailId) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, isRead: true } : email
    ));
    showNotification('Email marked as read', 'success');
  };



  // Sorting functionality
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting to filtered emails
  const sortedEmails = React.useMemo(() => {
    const sortableEmails = [...filteredEmails];
    if (sortConfig.key) {
      sortableEmails.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle different data types
        if (sortConfig.key === 'dateReceived') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableEmails;
  }, [filteredEmails, sortConfig]);

  // SLA Time Remaining Component
  const SLATimeRemaining = ({ email }) => {
    const [timeRemaining, setTimeRemaining] = useState(email.slaTimeRemaining);

    useEffect(() => {
      const interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1000);
      }, 1000);

      return () => clearInterval(interval);
    }, []);

    const formatTime = (ms) => {
      if (ms <= 0) return 'Overdue';
      
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    };

    const getProgressColor = () => {
      if (timeRemaining <= 0) return 'error';
      if (timeRemaining <= 2 * 60 * 60 * 1000) return 'warning'; // Less than 2 hours
      return 'success';
    };

    const getProgressValue = () => {
      const totalSLATime = 24 * 60 * 60 * 1000; // 24 hours SLA
      return Math.max(0, Math.min(100, (timeRemaining / totalSLATime) * 100));
    };

    return (
      <Box sx={{ width: '100%', minWidth: 120 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <AccessTimeIcon 
            fontSize="small" 
            color={timeRemaining <= 0 ? 'error' : timeRemaining <= 2 * 60 * 60 * 1000 ? 'warning' : 'success'} 
          />
          <Typography variant="caption" fontWeight="500">
            {formatTime(timeRemaining)}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={getProgressValue()}
          color={getProgressColor()}
          sx={{
            height: 4,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.grey[500], 0.2)
          }}
        />
      </Box>
    );
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



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedEmails.length === paginatedEmails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(paginatedEmails.map(email => email.id));
    }
  };

  const handleSelectEmail = (emailId) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  // Action handlers
  const handleViewEmail = (emailId) => {
    markAsRead(emailId);
    navigate(`/emails/detail/${emailId}`);
  };

  const handleReplyEmail = (emailId) => {
    const email = emails.find(e => e.id === emailId);
    if (email) {
      setReplyDialog({
        open: true,
        emailId: emailId,
        emailSubject: `Re: ${email.subject}`,
        emailFrom: email.from,
        templateBody: ''
      });
      setReplyText(''); // Clear any previous reply text
      markAsRead(emailId);
    }
  };

  const handleConfirmReply = (_replyText) => {
    // In a real app, this would send the reply
    showNotification(`Reply sent successfully to ${replyDialog.emailFrom}`);
    setReplyDialog({ open: false, emailId: null, emailSubject: '', emailFrom: '', templateBody: '' });
  };

  const handleAssignEmail = (emailId) => {
    if (emailId) {
      setAssignDialog({ open: true, emailId, emailIds: [emailId] });
    } else {
      // Bulk assignment
      setAssignDialog({ open: true, emailId: null, emailIds: selectedEmails });
    }
  };

  const handleConfirmAssign = (agent) => {
    const emailIds = assignDialog.emailIds;
    setEmails(prev => prev.map(email => 
      emailIds.includes(email.id) 
        ? { ...email, assignedTo: agent, status: email.status === 'new' ? 'in_progress' : email.status }
        : email
    ));
    
    setAssignDialog({ open: false, emailId: null, emailIds: [] });
    setSelectedEmails([]);
    showNotification(`${emailIds.length} email(s) assigned to ${agent}`);
  };

  const handleMarkAsResolved = (emailId) => {
    const emailIds = emailId ? [emailId] : selectedEmails;
    setEmails(prev => prev.map(email => 
      emailIds.includes(email.id) 
        ? { ...email, status: 'resolved' }
        : email
    ));
    
    if (!emailId) setSelectedEmails([]);
    showNotification(`${emailIds.length} email(s) marked as resolved`);
  };



  const handleConfirmReclassify = (newCategory) => {
    setEmails(prev => prev.map(email => 
      email.id === reclassifyDialog.emailId 
        ? { ...email, category: newCategory }
        : email
    ));
    
    setReclassifyDialog({ open: false, emailId: null, currentCategory: '' });
    showNotification('Email category updated successfully');
  };

  const handleArchiveEmail = (emailId) => {
    const emailIds = emailId ? [emailId] : selectedEmails;
    setEmails(prev => prev.filter(email => !emailIds.includes(email.id)));
    
    if (!emailId) setSelectedEmails([]);
    showNotification(`${emailIds.length} email(s) archived`);
  };

  const handleExportEmails = (format) => {
    const dataToExport = selectedEmails.length > 0 
      ? emails.filter(email => selectedEmails.includes(email.id))
      : filteredEmails;

    // Prepare data for export - matching Case Tracking format
    const exportData = dataToExport.map(email => ({
      'Email ID': email.id,
      'From': email.from,
      'Subject': email.subject,
      'Category': email.category,
      'Status': email.status,
      'Priority': email.priority,
      'Assigned To': email.assignedTo || 'Unassigned',
      'Date Received': formatDate(email.dateReceived),
      'SLA Status': email.slaStatus,
      'Has Attachments': email.hasAttachments ? 'Yes' : 'No'
    }));

    let content = '';
    if (format === 'csv') {
      // Create CSV content
      const headers = Object.keys(exportData[0]).join(',');
      const rows = exportData.map(row => Object.values(row).map(val => `"${val}"`).join(','));
      content = `${headers}\n${rows.join('\n')}`;
    } else {
      // Create XLS (tab-separated) content
      const headers = Object.keys(exportData[0]).join('\t');
      const rows = exportData.map(row => Object.values(row).join('\t'));
      content = `${headers}\n${rows.join('\n')}`;
    }

    // Create and trigger download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `emails_export_${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    handleExportClose();
    setSelectedEmails([]);
    showNotification(`Successfully exported ${exportData.length} emails in ${format.toUpperCase()} format`);
  };

  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };



  const paginatedEmails = sortedEmails.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Automated Response Logic (removed unused shouldAutoRespond function)

  // Process template variables
  const processTemplate = (template, email, additionalVars = {}) => {
    let processedSubject = template.subject;
    let processedBody = template.body;
    
    const variables = {
      customerName: email.from.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      subject: email.subject,
      date: new Date().toLocaleDateString(),
      time: '2:00 PM',
      meetingType: 'Policy Review',
      agentName: 'Sarah Johnson',
      policyNumber: 'POL-2024-567890',
      refundAmount: '$250.00',
      referenceNumber: 'REF-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      ...additionalVars
    };
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processedSubject = processedSubject.replace(regex, value);
      processedBody = processedBody.replace(regex, value);
    });
    
    return { subject: processedSubject, body: processedBody };
  };



  // Handle template selection and sending
  const handleUseTemplate = (templateId, emailId) => {
    const template = emailTemplates.find(t => t.id === templateId);
    const email = emails.find(e => e.id === emailId);
    
    if (template && email) {
      const processedTemplate = processTemplate(template, email);
      setReplyDialog({
        open: true,
        emailId: emailId,
        emailSubject: processedTemplate.subject,
        emailFrom: email.from,
        templateBody: processedTemplate.body
      });
      setReplyText(processedTemplate.body); // Set the reply text
      setTemplatesDialog({ open: false, emailId: null });
      markAsRead(emailId);
    }
  };

  const handleOpenTemplates = (emailId) => {
    setTemplatesDialog({ open: true, emailId });
  };

  const handleOpenAutomation = () => {
    setAutomationDialog({ open: true });
  };

  const handleSaveAutomationSettings = (newSettings) => {
    setAutomationSettings(newSettings);
    setAutomationDialog({ open: false });
    showNotification('Automation settings saved successfully', 'success');
  };

  // Custom template management functions
  const handleOpenTemplateManagement = () => {
    setTemplateManagementDialog({ open: true });
  };

  const handleAddTemplate = () => {
    setNewTemplate({
      name: '',
      category: 'general',
      subject: '',
      body: ''
    });
    setEditTemplateDialog({ open: true, template: null, mode: 'add' });
  };

  const handleEditTemplate = (template) => {
    setNewTemplate({
      name: template.name,
      category: template.category,
      subject: template.subject,
      body: template.body
    });
    setEditTemplateDialog({ open: true, template: template, mode: 'edit' });
  };

  const handleSaveTemplate = () => {
    if (!newTemplate.name.trim() || !newTemplate.subject.trim() || !newTemplate.body.trim()) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    const templateData = {
      ...newTemplate,
      id: editTemplateDialog.mode === 'add' 
        ? `custom_${Date.now()}` 
        : editTemplateDialog.template.id,
      isCustom: true
    };

    if (editTemplateDialog.mode === 'add') {
      setCustomTemplates([...customTemplates, templateData]);
      showNotification('Template added successfully');
    } else {
      setCustomTemplates(customTemplates.map(t => 
        t.id === editTemplateDialog.template.id ? templateData : t
      ));
      showNotification('Template updated successfully');
    }

    setEditTemplateDialog({ open: false, template: null, mode: 'add' });
    setNewTemplate({ name: '', category: 'general', subject: '', body: '' });
  };

  const handleDeleteTemplate = (templateId) => {
    setCustomTemplates(customTemplates.filter(t => t.id !== templateId));
    showNotification('Template deleted successfully');
  };

  // Get all templates (built-in + custom)
  const getAllTemplates = () => {
    return [...emailTemplates, ...customTemplates];
  };

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
          <Box>
            <Typography variant="h4" fontWeight="600">
              Email Inbox
              {newEmailsCount > 0 && (
                <Badge 
                  badgeContent={newEmailsCount} 
                  color="primary" 
                  sx={{ ml: 2 }}
                  onClick={() => setNewEmailsCount(0)}
                />
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {filteredEmails.length} emails found
              {selectedEmails.length > 0 && ` • ${selectedEmails.length} selected`}
              {isRefreshing && (
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', ml: 1 }}>
                  <CircularProgress size={12} sx={{ mr: 0.5 }} />
                  Refreshing...
                </Box>
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last updated: {lastUpdated.toLocaleTimeString()} 
              {autoRefresh && ' • Auto-refresh enabled'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Tooltip title={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}>
              <IconButton
                onClick={handleToggleAutoRefresh}
                color={autoRefresh ? 'primary' : 'default'}
                sx={{ 
                  bgcolor: autoRefresh ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  '&:hover': { 
                    bgcolor: autoRefresh ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.action.hover, 0.1)
                  }
                }}
              >
                <ScheduleIcon />
              </IconButton>
            </Tooltip>
            <Button
              startIcon={<ExportIcon />}
              variant="outlined"
              onClick={handleExportClick}
              sx={{
                borderRadius: 2,
                py: 1.2,
                px: 3,
                fontWeight: 600,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                }
              }}
            >
              Export
            </Button>
            <Button
              startIcon={<EmailIcon />}
              variant="outlined"
              onClick={handleOpenAutomation}
              sx={{ 
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                }
              }}
            >
              Automation
            </Button>
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              onClick={handleOpenTemplateManagement}
              sx={{ 
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                }
              }}
            >
              Manage Templates
            </Button>
            <Button
              startIcon={isRefreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
              variant="outlined"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              sx={{ borderRadius: 2 }}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </Box>
        </Box>

        {/* Bulk Actions Toolbar */}
        {bulkActionsVisible && (
          <Grow in={bulkActionsVisible} timeout={300}>
            <Paper sx={{ 
              p: 2, 
              mb: 3, 
              borderRadius: 3, 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}>
              <Toolbar sx={{ px: '0 !important', minHeight: 'auto !important' }}>
                <Typography variant="h6" sx={{ flex: 1 }}>
                  {selectedEmails.length} email(s) selected
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    startIcon={<AssignIcon />}
                    variant="contained"
                    size="small"
                    onClick={() => handleAssignEmail()}
                    sx={{ borderRadius: 2 }}
                  >
                    Bulk Assign
                  </Button>
                  <Button
                    startIcon={<ResolvedIcon />}
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleMarkAsResolved()}
                    sx={{ borderRadius: 2 }}
                  >
                    Mark Resolved
                  </Button>
                  <Button
                    startIcon={<ArchiveIcon />}
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleArchiveEmail()}
                    sx={{ borderRadius: 2 }}
                  >
                    Archive
                  </Button>
                  <Button
                    startIcon={<ClearAllIcon />}
                    variant="text"
                    size="small"
                    onClick={() => setSelectedEmails([])}
                    sx={{ borderRadius: 2 }}
                  >
                    Clear Selection
                  </Button>
                </Box>
              </Toolbar>
            </Paper>
          </Grow>
        )}

        {/* Search and Filters */}
        <Grow in={loaded} timeout={400}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                placeholder="Search by subject or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 }
                }}
                sx={{ minWidth: 300, flex: 1 }}
              />
              
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="complaint">Complaint</MenuItem>
                  <MenuItem value="feedback">Feedback</MenuItem>
                  <MenuItem value="refund">Refund</MenuItem>
                  <MenuItem value="appointment">Appointment</MenuItem>
                  <MenuItem value="uncategorized">Uncategorized</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 140 }}>
                <InputLabel>Filter</InputLabel>
                <Select
                  value={dateFilter}
                  label="Filter"
                  onChange={(e) => setDateFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="yesterday">Yesterday</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <Divider />
                  <MenuItem value="unread">Unread Only</MenuItem>
                  <MenuItem value="sla_breach">SLA Breach</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>
        </Grow>

        {/* Email Table */}
        <Grow in={loaded} timeout={600}>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
              overflow: 'hidden'
            }}
          >
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell 
                      padding="checkbox"
                      sx={{ 
                        bgcolor: theme.palette.background.paper,
                        borderBottom: `2px solid ${theme.palette.divider}`,
                        position: 'sticky',
                        top: 0,
                        zIndex: 100
                      }}
                    >
                      <Checkbox
                        indeterminate={selectedEmails.length > 0 && selectedEmails.length < paginatedEmails.length}
                        checked={paginatedEmails.length > 0 && selectedEmails.length === paginatedEmails.length}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        bgcolor: theme.palette.background.paper,
                        borderBottom: `2px solid ${theme.palette.divider}`,
                        position: 'sticky',
                        top: 0,
                        zIndex: 100
                      }}
                    >
                      <TableSortLabel
                        active={sortConfig.key === 'from'}
                        direction={sortConfig.key === 'from' ? sortConfig.direction : 'asc'}
                        onClick={() => handleSort('from')}
                      >
                        From
                      </TableSortLabel>
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        bgcolor: theme.palette.background.paper,
                        borderBottom: `2px solid ${theme.palette.divider}`,
                        position: 'sticky',
                        top: 0,
                        zIndex: 100
                      }}
                    >
                      <TableSortLabel
                        active={sortConfig.key === 'subject'}
                        direction={sortConfig.key === 'subject' ? sortConfig.direction : 'asc'}
                        onClick={() => handleSort('subject')}
                      >
                        Subject
                      </TableSortLabel>
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        bgcolor: theme.palette.background.paper,
                        borderBottom: `2px solid ${theme.palette.divider}`,
                        position: 'sticky',
                        top: 0,
                        zIndex: 100
                      }}
                    >
                      <TableSortLabel
                        active={sortConfig.key === 'category'}
                        direction={sortConfig.key === 'category' ? sortConfig.direction : 'asc'}
                        onClick={() => handleSort('category')}
                      >
                        Category
                      </TableSortLabel>
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        bgcolor: theme.palette.background.paper,
                        borderBottom: `2px solid ${theme.palette.divider}`,
                        position: 'sticky',
                        top: 0,
                        zIndex: 100
                      }}
                    >
                      <TableSortLabel
                        active={sortConfig.key === 'status'}
                        direction={sortConfig.key === 'status' ? sortConfig.direction : 'asc'}
                        onClick={() => handleSort('status')}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        bgcolor: theme.palette.background.paper,
                        borderBottom: `2px solid ${theme.palette.divider}`,
                        position: 'sticky',
                        top: 0,
                        zIndex: 100,
                        minWidth: 150
                      }}
                    >
                      SLA Time Remaining
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        bgcolor: theme.palette.background.paper,
                        borderBottom: `2px solid ${theme.palette.divider}`,
                        position: 'sticky',
                        top: 0,
                        zIndex: 100
                      }}
                    >
                      <TableSortLabel
                        active={sortConfig.key === 'dateReceived'}
                        direction={sortConfig.key === 'dateReceived' ? sortConfig.direction : 'asc'}
                        onClick={() => handleSort('dateReceived')}
                      >
                        Date Received
                      </TableSortLabel>
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        bgcolor: theme.palette.background.paper,
                        borderBottom: `2px solid ${theme.palette.divider}`,
                        position: 'sticky',
                        top: 0,
                        zIndex: 100
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedEmails.map((email) => (
                    <TableRow 
                      key={email.id}
                      selected={selectedEmails.includes(email.id)}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { 
                          bgcolor: alpha(theme.palette.primary.main, 0.04) 
                        },
                        // Unread email highlighting
                        ...(email.isRead ? {} : {
                          bgcolor: alpha(theme.palette.info.main, 0.02),
                          borderLeft: `4px solid ${theme.palette.info.main}`,
                        }),
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedEmails.includes(email.id)}
                          onChange={() => handleSelectEmail(email.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {!email.isRead && (
                            <CircleIcon 
                              sx={{ 
                                fontSize: 8, 
                                color: theme.palette.info.main 
                              }} 
                            />
                          )}
                          <Typography 
                            variant="body2" 
                            fontWeight={email.isRead ? 400 : 600}
                            sx={{ 
                              color: email.isRead ? 'text.primary' : theme.palette.info.main 
                            }}
                          >
                            {email.from}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="body2" 
                            fontWeight={email.isRead ? 400 : 600}
                            sx={{ 
                              color: email.isRead ? 'text.primary' : 'text.primary',
                              maxWidth: 300,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {email.subject}
                          </Typography>
                          {email.hasAttachments && (
                            <AttachmentIcon fontSize="small" color="action" />
                          )}
                          {email.priority === 'high' && (
                            <FlagIcon fontSize="small" color="error" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={email.category} 
                          color={getCategoryColor(email.category)}
                          size="small"
                          sx={{ 
                            textTransform: 'capitalize',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={email.status.replace('_', ' ')} 
                          color={getStatusColor(email.status)}
                          size="small"
                          sx={{ 
                            textTransform: 'capitalize',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <SLATimeRemaining email={email} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(email.dateReceived)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="View">
                            <IconButton 
                              size="small"
                              onClick={() => handleViewEmail(email.id)}
                              sx={{ 
                                color: theme.palette.primary.main,
                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                              }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reply">
                            <IconButton 
                              size="small"
                              onClick={() => handleReplyEmail(email.id)}
                              sx={{ 
                                color: theme.palette.info.main,
                                '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.1) }
                              }}
                            >
                              <ReplyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="More Actions">
                            <IconButton 
                              size="small"
                              onClick={(e) => setActionMenus({ ...actionMenus, [email.id]: e.currentTarget })}
                              sx={{ 
                                color: theme.palette.text.secondary,
                                '&:hover': { bgcolor: alpha(theme.palette.text.secondary, 0.1) }
                              }}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Menu
                            anchorEl={actionMenus[email.id]}
                            open={Boolean(actionMenus[email.id])}
                            onClose={() => setActionMenus({ ...actionMenus, [email.id]: null })}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                          >
                            <MenuItem onClick={() => {
                              handleOpenTemplates(email.id);
                              setActionMenus({ ...actionMenus, [email.id]: null });
                            }}>
                              <ListItemIcon>
                                <EmailIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText>Use Template</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => {
                              handleAssignEmail(email.id);
                              setActionMenus({ ...actionMenus, [email.id]: null });
                            }}>
                              <ListItemIcon>
                                <AssignIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText>Assign to Agent</ListItemText>
                            </MenuItem>
                            <MenuItem 
                              onClick={() => {
                                handleMarkAsResolved([email.id]);
                                setActionMenus({ ...actionMenus, [email.id]: null });
                              }}
                            >
                              <ListItemIcon>
                                <ResolvedIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText>Mark as Resolved</ListItemText>
                            </MenuItem>
                            <MenuItem 
                              onClick={() => {
                                setReclassifyDialog({ 
                                  open: true, 
                                  emailId: email.id, 
                                  currentCategory: email.category 
                                });
                                setActionMenus({ ...actionMenus, [email.id]: null });
                              }}
                            >
                              <ListItemIcon>
                                <CategoryIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText>Reclassify Category</ListItemText>
                            </MenuItem>
                            <MenuItem 
                              onClick={() => {
                                handleArchiveEmail([email.id]);
                                setActionMenus({ ...actionMenus, [email.id]: null });
                              }}
                            >
                              <ListItemIcon>
                                <ArchiveIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText>Archive</ListItemText>
                            </MenuItem>
                          </Menu>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination
                count={Math.ceil(filteredEmails.length / rowsPerPage)}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          </Paper>
        </Grow>

        {/* Enhanced Assign Dialog */}
        <Dialog 
          open={assignDialog.open} 
          onClose={() => setAssignDialog({ open: false, emailId: null, emailIds: [] })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {assignDialog.emailIds.length > 1 
              ? `Assign ${assignDialog.emailIds.length} Emails` 
              : 'Assign Email'
            }
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Team Member</InputLabel>
              <Select label="Team Member">
                {agentsList.map(agent => (
                  <MenuItem key={agent} value={agent}>
                    {agent}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {assignDialog.emailIds.length > 1 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                This action will assign all selected emails to the chosen team member.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAssignDialog({ open: false, emailId: null, emailIds: [] })}>
              Cancel
            </Button>
            <Button 
              variant="contained"
              onClick={(e) => {
                const agent = e.target.closest('form')?.querySelector('input[name="agent"]')?.value || agentsList[0];
                handleConfirmAssign(agent);
              }}
            >
              Assign
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reclassify Dialog */}
        <Dialog 
          open={reclassifyDialog.open} 
          onClose={() => setReclassifyDialog({ open: false, emailId: null, currentCategory: '' })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Reclassify Email Category</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Current category: <strong>{reclassifyDialog.currentCategory}</strong>
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>New Category</InputLabel>
              <Select 
                label="New Category"
                defaultValue={reclassifyDialog.currentCategory}
              >
                {categoryOptions.map(category => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReclassifyDialog({ open: false, emailId: null, currentCategory: '' })}>
              Cancel
            </Button>
            <Button 
              variant="contained"
              onClick={(e) => {
                const newCategory = e.target.closest('form')?.querySelector('input[name="category"]')?.value || categoryOptions[0];
                handleConfirmReclassify(newCategory);
              }}
            >
              Update Category
            </Button>
          </DialogActions>
        </Dialog>

        {/* Enhanced Reply Dialog with Template Selection */}
        <Dialog 
          open={replyDialog.open} 
          onClose={() => {
            setReplyDialog({ open: false, emailId: null, emailSubject: '', emailFrom: '', templateBody: '' });
            setReplyText('');
          }}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Reply to Email
              </Typography>
              <Typography variant="body2" color="text.secondary">
                To: {replyDialog.emailFrom}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Subject: {replyDialog.emailSubject}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              {/* Template Selection Panel */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Email Templates
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Choose a template to get started
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 1,
                    maxHeight: '400px',
                    overflowY: 'auto',
                    pr: 1
                  }}>
                    {getAllTemplates().map((template) => (
                      <Card 
                        key={template.id}
                        sx={{ 
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:hover': {
                            borderColor: 'primary.main',
                            boxShadow: 2
                          }
                        }}
                        onClick={() => {
                          const email = emails.find(e => e.id === replyDialog.emailId);
                          if (email) {
                            const processedTemplate = processTemplate(template, email);
                            setReplyText(processedTemplate.body);
                            setReplyDialog(prev => ({
                              ...prev,
                              emailSubject: processedTemplate.subject,
                              templateBody: processedTemplate.body
                            }));
                          }
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <EmailIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                              <Typography variant="subtitle2" fontWeight={600}>
                                {template.name}
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTemplatePreviewDialog({ 
                                  open: true, 
                                  template: template, 
                                  emailId: replyDialog.emailId 
                                });
                              }}
                              sx={{ color: 'text.secondary' }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Chip 
                            label={template.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            sx={{ mb: 1 }}
                          />
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {template.body.substring(0, 80)}...
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setReplyText('')}
                      sx={{ mt: 1, borderRadius: 2 }}
                    >
                      Clear & Start Fresh
                    </Button>
                  </Box>
                </Paper>
              </Grid>
              
              {/* Reply Composition Area */}
              <Grid item xs={12} md={8}>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <TextField
                        label="Subject"
                        fullWidth
                        value={replyDialog.emailSubject}
                        onChange={(e) => setReplyDialog(prev => ({ ...prev, emailSubject: e.target.value }))}
                        variant="outlined"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                      <Button
                        variant="outlined"
                        startIcon={<EmailIcon />}
                        onClick={() => setTemplatesDialog({ open: true, emailId: replyDialog.emailId })}
                        sx={{ borderRadius: 2, minWidth: 140 }}
                      >
                        Templates
                      </Button>
                    </Box>
                  
                  <TextField
                    label="Your Reply"
                    fullWidth
                    multiline
                    rows={12}
                    variant="outlined"
                    placeholder="Type your reply here or select a template from the left panel..."
                    value={replyText || replyDialog.templateBody}
                    onChange={(e) => setReplyText(e.target.value)}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                  
                                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Chip icon={<EmailIcon />} label="Email Reply" color="primary" size="small" />
                      {replyDialog.templateBody && (
                        <Chip 
                          icon={<CheckCircleIcon />} 
                          label="Template Applied" 
                          color="success" 
                          size="small" 
                        />
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {replyText?.length || replyDialog.templateBody?.length || 0} characters
                      </Typography>
                    </Box>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button 
              onClick={() => {
                setReplyDialog({ open: false, emailId: null, emailSubject: '', emailFrom: '', templateBody: '' });
                setReplyText('');
              }}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                const finalReplyText = replyText || replyDialog.templateBody;
                handleConfirmReply(finalReplyText);
                setReplyText('');
              }}
              variant="contained"
              startIcon={<ReplyIcon />}
              sx={{ borderRadius: 2 }}
              disabled={!replyText && !replyDialog.templateBody}
            >
              Send Reply
            </Button>
          </DialogActions>
        </Dialog>

        {/* Email Templates Dialog */}
        <Dialog 
          open={templatesDialog.open} 
          onClose={() => setTemplatesDialog({ open: false, emailId: null })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight={600}>
              Choose Email Template
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select a pre-built template to respond quickly and consistently
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {getAllTemplates().map((template) => (
                <Grid item xs={12} sm={6} key={template.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                      }
                    }}
                    onClick={() => handleUseTemplate(template.id, templatesDialog.emailId)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EmailIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6" fontWeight={600}>
                            {template.name}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTemplatePreviewDialog({ 
                              open: true, 
                              template: template, 
                              emailId: templatesDialog.emailId 
                            });
                          }}
                          sx={{ color: 'text.secondary' }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Chip 
                        label={template.category} 
                        size="small" 
                        color="primary" 
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Subject: {template.subject}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {template.body.substring(0, 150)}...
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setTemplatesDialog({ open: false, emailId: null })}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Template Preview Dialog */}
        <Dialog 
          open={templatePreviewDialog.open} 
          onClose={() => setTemplatePreviewDialog({ open: false, template: null, emailId: null })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Template Preview: {templatePreviewDialog.template?.name}
              </Typography>
              <Chip 
                label={templatePreviewDialog.template?.category} 
                size="small" 
                color="primary" 
                sx={{ mt: 1 }}
              />
            </Box>
          </DialogTitle>
          <DialogContent>
            {templatePreviewDialog.template && templatePreviewDialog.emailId && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Subject:
                </Typography>
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                  <Typography variant="body1">
                    {processTemplate(
                      templatePreviewDialog.template, 
                      emails.find(e => e.id === templatePreviewDialog.emailId) || {}
                    ).subject}
                  </Typography>
                </Paper>
                
                <Typography variant="subtitle2" gutterBottom>
                  Message Body:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      whiteSpace: 'pre-line',
                      fontFamily: 'monospace'
                    }}
                  >
                    {processTemplate(
                      templatePreviewDialog.template, 
                      emails.find(e => e.id === templatePreviewDialog.emailId) || {}
                    ).body}
                  </Typography>
                </Paper>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setTemplatePreviewDialog({ open: false, template: null, emailId: null })}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                if (templatePreviewDialog.template && templatePreviewDialog.emailId) {
                  handleUseTemplate(templatePreviewDialog.template.id, templatePreviewDialog.emailId);
                  setTemplatePreviewDialog({ open: false, template: null, emailId: null });
                }
              }}
              variant="contained"
              startIcon={<EmailIcon />}
              sx={{ borderRadius: 2 }}
            >
              Use This Template
            </Button>
          </DialogActions>
        </Dialog>

        {/* Automation Settings Dialog */}
        <Dialog 
          open={automationDialog.open} 
          onClose={() => setAutomationDialog({ open: false })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight={600}>
              Email Automation Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure automated responses and smart email processing
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              {/* Auto-Response Settings */}
              <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Automated Responses
                </Typography>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={automationSettings.enabled}
                      onChange={(e) => setAutomationSettings({
                        ...automationSettings,
                        enabled: e.target.checked
                      })}
                    />
                  }
                  label="Enable automated responses"
                  sx={{ mb: 2 }}
                />
                
                {automationSettings.enabled && (
                  <Box sx={{ ml: 4 }}>
                    <TextField
                      label="Auto-reply delay (minutes)"
                      type="number"
                      value={automationSettings.autoReplyDelay}
                      onChange={(e) => setAutomationSettings({
                        ...automationSettings,
                        autoReplyDelay: parseInt(e.target.value)
                      })}
                      sx={{ mb: 2, mr: 2, width: 200 }}
                      inputProps={{ min: 1, max: 60 }}
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={automationSettings.businessHoursOnly}
                          onChange={(e) => setAutomationSettings({
                            ...automationSettings,
                            businessHoursOnly: e.target.checked
                          })}
                        />
                      }
                      label="Business hours only (9 AM - 5 PM)"
                      sx={{ mb: 2 }}
                    />
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Auto-respond to these categories:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {categoryOptions.filter(cat => cat !== 'uncategorized').map(category => (
                        <FormControlLabel
                          key={category}
                          control={
                            <Checkbox 
                              checked={automationSettings.categories.includes(category)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setAutomationSettings({
                                    ...automationSettings,
                                    categories: [...automationSettings.categories, category]
                                  });
                                } else {
                                  setAutomationSettings({
                                    ...automationSettings,
                                    categories: automationSettings.categories.filter(c => c !== category)
                                  });
                                }
                              }}
                            />
                          }
                          label={category.charAt(0).toUpperCase() + category.slice(1)}
                        />
                      ))}
                    </Box>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Exclude emails containing these keywords:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {automationSettings.excludeKeywords.map((keyword, index) => (
                        <Chip
                          key={index}
                          label={keyword}
                          onDelete={() => {
                            setAutomationSettings({
                              ...automationSettings,
                              excludeKeywords: automationSettings.excludeKeywords.filter((_, i) => i !== index)
                            });
                          }}
                          size="small"
                        />
                      ))}
                      <TextField
                        size="small"
                        placeholder="Add keyword"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            setAutomationSettings({
                              ...automationSettings,
                              excludeKeywords: [...automationSettings.excludeKeywords, e.target.value.trim()]
                            });
                            e.target.value = '';
                          }
                        }}
                        sx={{ width: 120 }}
                      />
                    </Box>
                  </Box>
                )}
              </Paper>

              {/* Template Management */}
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Template Management
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {emailTemplates.length} templates available
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {emailTemplates.map(template => (
                    <Chip
                      key={template.id}
                      label={template.name}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Paper>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setAutomationDialog({ open: false })}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handleSaveAutomationSettings(automationSettings)}
              variant="contained"
              sx={{ borderRadius: 2 }}
            >
              Save Settings
            </Button>
          </DialogActions>
        </Dialog>

        {/* Template Management Dialog */}
        <Dialog 
          open={templateManagementDialog.open} 
          onClose={() => setTemplateManagementDialog({ open: false })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Manage Email Templates
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create, edit, and manage your custom email templates
                </Typography>
              </Box>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={handleAddTemplate}
                sx={{ borderRadius: 2 }}
              >
                Add Template
              </Button>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <Box sx={{ mt: 2 }}>
              {/* Built-in Templates */}
              <Typography variant="h6" gutterBottom>
                Built-in Templates
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {emailTemplates.map((template) => (
                  <Grid item xs={12} sm={6} key={template.id}>
                    <Card sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="h6" fontWeight={600}>
                            {template.name}
                          </Typography>
                          <Chip 
                            label="Built-in" 
                            size="small" 
                            color="default" 
                            variant="outlined"
                          />
                        </Box>
                        <Chip 
                          label={template.category} 
                          size="small" 
                          color="primary" 
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {template.body.substring(0, 100)}...
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Custom Templates */}
              <Typography variant="h6" gutterBottom>
                Custom Templates ({customTemplates.length})
              </Typography>
              {customTemplates.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
                  <Typography variant="body2" color="text.secondary">
                    No custom templates yet. Click "Add Template" to create your first one.
                  </Typography>
                </Paper>
              ) : (
                <Grid container spacing={2}>
                  {customTemplates.map((template) => (
                    <Grid item xs={12} sm={6} key={template.id}>
                      <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="h6" fontWeight={600}>
                              {template.name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleEditTemplate(template)}
                                color="primary"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteTemplate(template.id)}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                          <Chip 
                            label={template.category} 
                            size="small" 
                            color="secondary" 
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {template.body.substring(0, 100)}...
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setTemplateManagementDialog({ open: false })}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add/Edit Template Dialog */}
        <Dialog 
          open={editTemplateDialog.open} 
          onClose={() => setEditTemplateDialog({ open: false, template: null, mode: 'add' })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight={600}>
              {editTemplateDialog.mode === 'add' ? 'Add New Template' : 'Edit Template'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create a reusable email template with dynamic variables
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Template Name"
                fullWidth
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="e.g., Welcome New Customer"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newTemplate.category}
                  label="Category"
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="complaint">Complaint</MenuItem>
                  <MenuItem value="feedback">Feedback</MenuItem>
                  <MenuItem value="refund">Refund</MenuItem>
                  <MenuItem value="appointment">Appointment</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Subject Line"
                fullWidth
                value={newTemplate.subject}
                onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                placeholder="e.g., Welcome to {{customerName}}!"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              
              <TextField
                label="Email Body"
                fullWidth
                multiline
                rows={8}
                value={newTemplate.body}
                onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                placeholder="Write your email template here. Use {{variableName}} for dynamic content..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Available Variables:
                </Typography>
                                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                   {['{{customerName}}', '{{subject}}', '{{date}}', '{{agentName}}', '{{policyNumber}}', '{{companyName}}'].map((variable) => (
                    <Chip
                      key={variable}
                      label={variable}
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setNewTemplate({ 
                          ...newTemplate, 
                          body: newTemplate.body + ' ' + variable 
                        });
                      }}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Paper>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setEditTemplateDialog({ open: false, template: null, mode: 'add' })}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveTemplate}
              variant="contained"
              sx={{ borderRadius: 2 }}
            >
              {editTemplateDialog.mode === 'add' ? 'Add Template' : 'Update Template'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Export Menu */}
        <Menu
          anchorEl={exportAnchorEl}
          open={Boolean(exportAnchorEl)}
          onClose={handleExportClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: 2, 
              mt: 1,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
            }
          }}
        >
          <MenuItem 
            onClick={() => handleExportEmails('csv')}
            sx={{
              borderRadius: 1,
              py: 1.5,
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            <ListItemIcon>
              <ExportIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Export as CSV" 
              secondary={`${selectedEmails.length > 0 ? selectedEmails.length : filteredEmails.length} emails`}
            />
          </MenuItem>
          <MenuItem 
            onClick={() => handleExportEmails('xls')}
            sx={{
              borderRadius: 1,
              py: 1.5,
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            <ListItemIcon>
              <ExportIcon color="secondary" />
            </ListItemIcon>
            <ListItemText 
              primary="Export as Excel" 
              secondary={`${selectedEmails.length > 0 ? selectedEmails.length : filteredEmails.length} emails`}
            />
          </MenuItem>
        </Menu>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setNotification({ ...notification, open: false })} 
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default EmailInbox; 