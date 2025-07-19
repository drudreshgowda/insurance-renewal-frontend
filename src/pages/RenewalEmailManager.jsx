import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControl, InputLabel, Select,
  MenuItem, useTheme, alpha, IconButton, Switch, FormControlLabel, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, LinearProgress, Checkbox,
  Tabs, Tab, List, ListItem, ListItemText, Divider, AppBar,
  Badge, Tooltip, SpeedDial, SpeedDialAction, SpeedDialIcon,
  Alert, Snackbar, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  Send as SendIcon, Inbox as InboxIcon, Outbox as OutboxIcon,
  Reply as ReplyIcon, Delete as DeleteIcon, Archive as ArchiveIcon, Star as StarIcon, 
  StarBorder as StarBorderIcon, Attachment as AttachmentIcon, Search as SearchIcon,
  MoreVert as MoreVertIcon, Flag as PriorityIcon, Close as CloseIcon, Add as AddIcon,
  Edit as EditIcon, Visibility as ViewIcon, FilterList as FilterIcon, Clear as ClearIcon,
  Schedule as ScheduleIcon, AutoMode as AutoModeIcon, Analytics as AnalyticsIcon,
  Settings as SettingsIcon, Label as LabelIcon,
  Forward as ForwardIcon, Print as PrintIcon,
  SmartToy as SmartToyIcon, Psychology as PsychologyIcon,
  Assignment as AssignmentIcon,
  Snooze as SnoozeIcon, ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Drafts as DraftsIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { analyzeEmail, enhanceEmailContent, initializeEmailAgent, generateSmartReplies as generateEmailAIReplies } from '../services/emailAI';

const RenewalEmailManager = () => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  
  // Enhanced State Management
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [viewMode, setViewMode] = useState('table'); // table, card, timeline
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  
  // Advanced Search & Filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [advancedFilters] = useState({
    dateRange: { start: null, end: null },
    senderDomain: '',
    hasAttachments: 'all',
    priority: 'all',
    status: 'all',
    tags: [],
    assignee: 'all',
    readStatus: 'all',
    starred: 'all',
    size: 'all'
  });
  const [sortConfig] = useState({ field: 'date', direction: 'desc' });
  
  // Dialog States
  const [composeDialog, setComposeDialog] = useState(false);
  const [viewEmailDialog, setViewEmailDialog] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [templateDialog, setTemplateDialog] = useState(false);
  const [analyticsDialog, setAnalyticsDialog] = useState(false);
  const [, setAutomationDialog] = useState(false);
  const [, setSettingsDialog] = useState(false);
  const [aiAssistantDialog, setAiAssistantDialog] = useState(false);
  
  // Advanced Features State
  const [emailAnalytics, setEmailAnalytics] = useState({
    totalEmails: 0,
    unreadCount: 0,
    responseRate: 0,
    avgResponseTime: 0,
    topSenders: [],
    dailyVolume: [],
    sentimentDistribution: {}
  });
  const [templates, setTemplates] = useState([]);
  const [scheduledEmails] = useState([]);
  const [snoozedEmails] = useState([]);
  
  // AI Assistant State
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [selectedAiSuggestion, setSelectedAiSuggestion] = useState('');
  const [currentAnalyzedEmail, setCurrentAnalyzedEmail] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSettings, setAiSettings] = useState({
    tone: 'professional',
    style: 'formal',
    length: 'medium',
    includePersonalization: true,
    includeContext: true,
    language: 'english'
  });
  
  // UI State
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [, setFilterPanelOpen] = useState(false);
  
  // Compose Email Enhanced State
  const [composeData, setComposeData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    template: '',
    priority: 'normal',
    scheduledSend: false,
    scheduleDate: null,
    attachments: [],
    signature: '',
    trackOpens: true,
    trackClicks: true,
    requestReadReceipt: false,
    renewalContext: {
      policyNumber: '',
      customerName: '',
      renewalDate: '',
      premiumAmount: '',
      agentName: '',
      branch: '',
      customerEmail: '',
      customerPhone: ''
    },
    aiAssistance: {
      tone: 'professional',
      language: 'english',
      includePersonalization: true,
      suggestSubject: true
    }
  });

  // Mock Enhanced Data
  const mockEmails = useMemo(() => [
      {
        id: 1,
        type: 'inbox',
        from: 'john.doe@email.com',
        to: 'renewals@company.com',
      cc: [],
      bcc: [],
      subject: 'Urgent: Policy Renewal Required - POL123456',
      body: 'Dear Team,\n\nI need immediate assistance with my policy renewal. The deadline is approaching and I haven\'t received the renewal documents.\n\nPlease expedite this process.\n\nBest regards,\nJohn Doe',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        starred: false,
        priority: 'high',
        status: 'pending',
      attachments: ['policy_documents.pdf', 'id_proof.jpg'],
      size: '2.5MB',
      sentiment: 'negative',
      confidence: 0.85,
      aiIntent: 'renewal_request',
              assignedTo: 'Priya Patel',
      tags: ['renewal', 'urgent', 'documents'],
      threadId: 'thread_001',
      deliveryStatus: 'delivered',
      openTracking: { opened: false, openCount: 0, lastOpened: null },
      clickTracking: { clicked: false, clickCount: 0, lastClicked: null },
        renewalContext: {
          policyNumber: 'POL123456',
          customerName: 'Arjun Sharma',
          renewalDate: '2024-02-15',
        premiumAmount: '$1,200',
        agentName: 'Priya Patel',
        branch: 'Downtown Branch',
        customerEmail: 'john.doe@email.com',
        customerPhone: '+1-555-0123',
        policyType: 'Auto Insurance',
        currentStage: 'documentation_pending'
      },
      aiSuggestions: [
        { type: 'quick_reply', text: 'We\'ll expedite your renewal process immediately.' },
        { type: 'template', name: 'Urgent Renewal Response' },
        { type: 'escalation', reason: 'High priority customer request' }
        ]
      },
      {
        id: 2,
        type: 'outbox',
        from: 'renewals@company.com',
      to: 'jane.smith@email.com',
      cc: ['manager@company.com'],
      bcc: [],
      subject: 'Your Renewal Quote is Ready - POL234567',
      body: 'Dear Jane,\n\nWe\'re pleased to provide your renewal quote for policy POL234567.\n\nYour new premium: $850\nRenewal date: March 1, 2024\n\nTo accept, simply reply to this email or call us at 1-800-RENEWAL.\n\nThank you for your continued trust.',
      date: new Date(Date.now() - 6 * 60 * 60 * 1000),
        read: true,
      starred: true,
      priority: 'medium',
        status: 'sent',
      attachments: ['renewal_quote.pdf'],
      size: '1.2MB',
      sentiment: 'positive',
      confidence: 0.92,
      aiIntent: 'quote_delivery',
              assignedTo: 'Ravi Gupta',
      tags: ['renewal', 'quote', 'sent'],
      threadId: 'thread_002',
      deliveryStatus: 'delivered',
      openTracking: { opened: true, openCount: 3, lastOpened: new Date(Date.now() - 2 * 60 * 60 * 1000) },
      clickTracking: { clicked: true, clickCount: 1, lastClicked: new Date(Date.now() - 1 * 60 * 60 * 1000) },
        renewalContext: {
        policyNumber: 'POL234567',
        customerName: 'Meera Kapoor',
        renewalDate: '2024-03-01',
        premiumAmount: '$850',
        agentName: 'Ravi Gupta',
        branch: 'Westside Branch',
        customerEmail: 'jane.smith@email.com',
        customerPhone: '+1-555-0456',
        policyType: 'Home Insurance',
        currentStage: 'quote_sent'
      },
      scheduledFollowUp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: 3,
        type: 'inbox',
        from: 'mike.johnson@email.com',
        to: 'renewals@company.com',
      subject: 'Thank You - Renewal Completed Successfully',
      body: 'Thank you for the excellent service. My renewal process was smooth and efficient. Payment has been processed successfully.',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true,
        starred: true,
        priority: 'normal',
        status: 'completed',
        attachments: [],
      size: '0.5MB',
      sentiment: 'positive',
      confidence: 0.95,
      aiIntent: 'satisfaction_feedback',
              assignedTo: 'Neha Sharma',
      tags: ['renewal', 'completed', 'positive_feedback'],
      threadId: 'thread_003',
        renewalContext: {
          policyNumber: 'POL345678',
          customerName: 'Vikram Singh',
          renewalDate: '2024-01-30',
          premiumAmount: '$1,100',
        agentName: 'Neha Sharma',
        branch: 'Central Branch',
        customerEmail: 'mike.johnson@email.com',
        customerPhone: '+1-555-0789',
        policyType: 'Life Insurance',
        currentStage: 'completed'
      }
    },
    {
      id: 4,
      type: 'inbox',
      from: 'sarah.wilson@email.com',
      to: 'renewals@company.com',
      cc: [],
      bcc: [],
      subject: 'Policy Renewal Question - Coverage Options',
      body: 'Hello,\n\nI\'m interested in renewing my policy but would like to explore additional coverage options. Could someone please call me to discuss the available upgrades?\n\nI\'m particularly interested in comprehensive coverage and roadside assistance.\n\nBest regards,\nSarah Wilson',
      date: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: false,
      starred: false,
      priority: 'medium',
      status: 'pending',
      attachments: [],
      size: '0.8MB',
      sentiment: 'neutral',
      confidence: 0.78,
      aiIntent: 'coverage_inquiry',
      assignedTo: 'Amit Kumar',
      tags: ['renewal', 'coverage', 'inquiry'],
      threadId: 'thread_004',
      deliveryStatus: 'delivered',
      openTracking: { opened: false, openCount: 0, lastOpened: null },
      clickTracking: { clicked: false, clickCount: 0, lastClicked: null },
      renewalContext: {
        policyNumber: 'POL456789',
        customerName: 'Kavya Malhotra',
        renewalDate: '2024-03-15',
        premiumAmount: '$950',
        agentName: 'Amit Kumar',
        branch: 'North Branch',
        customerEmail: 'sarah.wilson@email.com',
        customerPhone: '+1-555-0321',
        policyType: 'Auto Insurance',
        currentStage: 'coverage_review'
      },
      aiSuggestions: [
        { type: 'quick_reply', text: 'I\'ll have an agent call you today to discuss coverage options.' },
        { type: 'template', name: 'Coverage Options Response' },
        { type: 'callback_schedule', reason: 'Customer requested phone consultation' }
      ]
    },
    {
      id: 5,
      type: 'outbox',
      from: 'renewals@company.com',
      to: 'robert.brown@email.com',
      cc: [],
      bcc: ['audit@company.com'],
      subject: 'Payment Reminder - Policy POL567890',
      body: 'Dear Robert,\n\nThis is a friendly reminder that your renewal payment for policy POL567890 is due in 5 days.\n\nAmount Due: $1,350\nDue Date: February 20, 2024\n\nYou can make your payment online, by phone, or visit any of our branch locations.\n\nThank you for your prompt attention to this matter.\n\nBest regards,\nRenewal Team',
      date: new Date(Date.now() - 8 * 60 * 60 * 1000),
      read: true,
      starred: false,
      priority: 'medium',
      status: 'sent',
      attachments: ['payment_options.pdf'],
      size: '1.1MB',
      sentiment: 'neutral',
      confidence: 0.88,
      aiIntent: 'payment_reminder',
      assignedTo: 'Sanya Singh',
      tags: ['renewal', 'payment', 'reminder'],
      threadId: 'thread_005',
      deliveryStatus: 'delivered',
      openTracking: { opened: true, openCount: 2, lastOpened: new Date(Date.now() - 4 * 60 * 60 * 1000) },
      clickTracking: { clicked: false, clickCount: 0, lastClicked: null },
      renewalContext: {
        policyNumber: 'POL567890',
        customerName: 'Rohit Agarwal',
        renewalDate: '2024-02-20',
        premiumAmount: '$1,350',
        agentName: 'Sanya Singh',
        branch: 'South Branch',
        customerEmail: 'robert.brown@email.com',
        customerPhone: '+1-555-0654',
        policyType: 'Commercial Insurance',
        currentStage: 'payment_pending'
      },
      scheduledFollowUp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 6,
      type: 'inbox',
      from: 'maria.garcia@email.com',
      to: 'renewals@company.com',
      cc: [],
      bcc: [],
      subject: 'Renewal Documents Received - Ready to Proceed',
      body: 'Dear Renewal Team,\n\nI have received and reviewed all the renewal documents for my home insurance policy. Everything looks good and I\'m ready to proceed with the renewal.\n\nPlease process my renewal at your earliest convenience. I\'ve attached the signed documents.\n\nThank you for your excellent service.\n\nBest regards,\nMaria Garcia',
      date: new Date(Date.now() - 12 * 60 * 60 * 1000),
      read: true,
      starred: true,
      priority: 'normal',
      status: 'in_progress',
      attachments: ['signed_renewal_docs.pdf', 'updated_property_photos.zip'],
      size: '4.2MB',
      sentiment: 'positive',
      confidence: 0.91,
      aiIntent: 'renewal_approval',
      assignedTo: 'Rohit Agarwal',
      tags: ['renewal', 'documents', 'ready'],
      threadId: 'thread_006',
      deliveryStatus: 'delivered',
      openTracking: { opened: false, openCount: 0, lastOpened: null },
      clickTracking: { clicked: false, clickCount: 0, lastClicked: null },
      renewalContext: {
        policyNumber: 'POL678901',
        customerName: 'Sanya Singh',
        renewalDate: '2024-04-01',
        premiumAmount: '$1,150',
        agentName: 'Rohit Agarwal',
        branch: 'East Branch',
        customerEmail: 'maria.garcia@email.com',
        customerPhone: '+1-555-0987',
        policyType: 'Home Insurance',
        currentStage: 'documents_received'
      },
      aiSuggestions: [
        { type: 'quick_reply', text: 'Thank you! We\'ll process your renewal immediately.' },
        { type: 'template', name: 'Processing Confirmation' },
        { type: 'priority_processing', reason: 'Customer ready to proceed' }
      ]
    },
    {
      id: 7,
      type: 'inbox',
      from: 'alex.martinez@email.com',
      to: 'renewals@company.com',
      cc: [],
      bcc: [],
      subject: 'Claim Impact on Renewal Premium',
      body: 'Hello,\n\nI recently filed a claim on my auto policy and I\'m concerned about how this might affect my renewal premium. Can someone please explain the impact and provide me with the updated quote?\n\nClaim Number: CLM789012\nPolicy Number: POL789012\n\nI would appreciate a detailed explanation of the premium calculation.\n\nThank you,\nAlex Martinez',
      date: new Date(Date.now() - 18 * 60 * 60 * 1000),
      read: false,
      starred: false,
      priority: 'high',
      status: 'pending',
      attachments: ['claim_details.pdf'],
      size: '1.8MB',
      sentiment: 'concerned',
      confidence: 0.82,
      aiIntent: 'claim_impact_inquiry',
      assignedTo: 'Kavya Malhotra',
      tags: ['renewal', 'claim', 'premium_inquiry'],
      threadId: 'thread_007',
      deliveryStatus: 'delivered',
      openTracking: { opened: false, openCount: 0, lastOpened: null },
      clickTracking: { clicked: false, clickCount: 0, lastClicked: null },
      renewalContext: {
        policyNumber: 'POL789012',
        customerName: 'Aditya Malhotra',
        renewalDate: '2024-03-10',
        premiumAmount: '$1,450',
        agentName: 'Kavya Malhotra',
        branch: 'Metro Branch',
        customerEmail: 'alex.martinez@email.com',
        customerPhone: '+1-555-0147',
        policyType: 'Auto Insurance',
        currentStage: 'claim_review'
      },
      aiSuggestions: [
        { type: 'quick_reply', text: 'I\'ll review your claim impact and provide a detailed explanation.' },
        { type: 'template', name: 'Claim Impact Explanation' },
        { type: 'specialist_referral', reason: 'Complex claim impact calculation required' }
      ]
    },
    {
      id: 8,
      type: 'outbox',
      from: 'renewals@company.com',
      to: 'jennifer.lee@email.com',
      cc: ['supervisor@company.com'],
      bcc: [],
      subject: 'Welcome Back - Renewal Completed Successfully',
      body: 'Dear Jennifer,\n\nWelcome back! We\'re delighted to confirm that your policy renewal has been completed successfully.\n\nPolicy Details:\n- Policy Number: POL890123\n- Renewal Date: February 1, 2024\n- New Premium: $875\n- Coverage Period: February 1, 2024 - February 1, 2025\n\nYour new policy documents are attached. Please keep them in a safe place.\n\nThank you for choosing us for another year of protection.\n\nBest regards,\nCustomer Success Team',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
      starred: true,
      priority: 'normal',
      status: 'sent',
      attachments: ['new_policy_documents.pdf', 'payment_confirmation.pdf'],
      size: '2.1MB',
      sentiment: 'positive',
      confidence: 0.94,
      aiIntent: 'renewal_confirmation',
      assignedTo: 'Deepak Verma',
      tags: ['renewal', 'completed', 'welcome'],
      threadId: 'thread_008',
      deliveryStatus: 'delivered',
      openTracking: { opened: true, openCount: 5, lastOpened: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      clickTracking: { clicked: true, clickCount: 2, lastClicked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      renewalContext: {
        policyNumber: 'POL890123',
        customerName: 'Deepika Reddy',
        renewalDate: '2024-02-01',
        premiumAmount: '$875',
        agentName: 'Deepak Verma',
        branch: 'Central Branch',
        customerEmail: 'jennifer.lee@email.com',
        customerPhone: '+1-555-0258',
        policyType: 'Life Insurance',
        currentStage: 'completed'
      }
    },
    {
      id: 9,
      type: 'inbox',
      from: 'thomas.anderson@email.com',
      to: 'renewals@company.com',
      cc: [],
      bcc: [],
      subject: 'Policy Cancellation Request - POL901234',
      body: 'Dear Sir/Madam,\n\nI am writing to request the cancellation of my policy POL901234. Due to recent changes in my circumstances, I will not be renewing this policy.\n\nPlease process the cancellation and provide me with a confirmation letter. I would also like to know about any refund that may be due.\n\nPlease contact me if you need any additional information.\n\nSincerely,\nThomas Anderson',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
      starred: false,
      priority: 'high',
      status: 'pending',
      attachments: [],
      size: '0.6MB',
      sentiment: 'neutral',
      confidence: 0.76,
      aiIntent: 'cancellation_request',
      assignedTo: 'Sunita Patel',
      tags: ['cancellation', 'non_renewal', 'refund'],
      threadId: 'thread_009',
      deliveryStatus: 'delivered',
      openTracking: { opened: false, openCount: 0, lastOpened: null },
      clickTracking: { clicked: false, clickCount: 0, lastClicked: null },
      renewalContext: {
        policyNumber: 'POL901234',
        customerName: 'Manoj Gupta',
        renewalDate: '2024-02-25',
        premiumAmount: '$1,100',
        agentName: 'Sunita Patel',
        branch: 'West Branch',
        customerEmail: 'thomas.anderson@email.com',
        customerPhone: '+1-555-0369',
        policyType: 'Home Insurance',
        currentStage: 'cancellation_requested'
      },
      aiSuggestions: [
        { type: 'retention_offer', text: 'Let me see if we can offer you a better rate to retain your business.' },
        { type: 'template', name: 'Cancellation Processing' },
        { type: 'supervisor_escalation', reason: 'Customer retention opportunity' }
      ]
    },
    {
      id: 10,
      type: 'inbox',
      from: 'patricia.white@email.com',
      to: 'renewals@company.com',
      cc: [],
      bcc: [],
      subject: 'Multiple Policy Renewal - Family Package',
      body: 'Hello,\n\nI have multiple policies with your company that are all due for renewal around the same time:\n\n1. Auto Insurance - POL012345\n2. Home Insurance - POL012346\n3. Life Insurance - POL012347\n\nCould you please prepare a combined renewal package with any available multi-policy discounts? I would appreciate a comprehensive quote.\n\nI\'m also interested in adding my teenage daughter to the auto policy.\n\nThank you for your assistance.\n\nBest regards,\nPatricia White',
      date: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: false,
      starred: true,
      priority: 'medium',
      status: 'pending',
      attachments: [],
      size: '0.9MB',
      sentiment: 'positive',
      confidence: 0.87,
      aiIntent: 'multi_policy_renewal',
      assignedTo: 'Manoj Gupta',
      tags: ['renewal', 'multi_policy', 'discount', 'family'],
      threadId: 'thread_010',
      deliveryStatus: 'delivered',
      openTracking: { opened: false, openCount: 0, lastOpened: null },
      clickTracking: { clicked: false, clickCount: 0, lastClicked: null },
      renewalContext: {
        policyNumber: 'POL012345',
        customerName: 'Sunita Patel',
        renewalDate: '2024-03-20',
        premiumAmount: '$2,250',
        agentName: 'Manoj Gupta',
        branch: 'Family Services Branch',
        customerEmail: 'patricia.white@email.com',
        customerPhone: '+1-555-0741',
        policyType: 'Multi-Policy Package',
        currentStage: 'quote_preparation'
      },
      aiSuggestions: [
        { type: 'quick_reply', text: 'I\'ll prepare a comprehensive multi-policy renewal package with available discounts.' },
        { type: 'template', name: 'Multi-Policy Renewal Response' },
        { type: 'discount_calculation', reason: 'Multiple policies eligible for bundle discount' }
      ]
    },
    {
      id: 11,
      type: 'outbox',
      from: 'renewals@company.com',
      to: 'daniel.garcia@email.com',
      cc: [],
      bcc: [],
      subject: 'Renewal Processing Delay - Apology and Update',
      body: 'Dear Daniel,\n\nWe sincerely apologize for the delay in processing your renewal for policy POL123450. Due to an unexpected system maintenance, we experienced some delays in our processing.\n\nYour renewal is now being expedited and will be completed by end of business today. We\'ve also applied a 5% courtesy discount to your premium as an apology for the inconvenience.\n\nUpdated Premium: $1,140 (Originally $1,200)\n\nThank you for your patience and understanding.\n\nBest regards,\nCustomer Care Team',
      date: new Date(Date.now() - 10 * 60 * 60 * 1000),
      read: true,
      starred: false,
      priority: 'high',
      status: 'sent',
      attachments: ['apology_discount_details.pdf'],
      size: '0.7MB',
      sentiment: 'apologetic',
      confidence: 0.89,
      aiIntent: 'apology_update',
      assignedTo: 'Pooja Sharma',
      tags: ['renewal', 'apology', 'delay', 'discount'],
      threadId: 'thread_011',
      deliveryStatus: 'delivered',
      openTracking: { opened: true, openCount: 1, lastOpened: new Date(Date.now() - 8 * 60 * 60 * 1000) },
      clickTracking: { clicked: false, clickCount: 0, lastClicked: null },
      renewalContext: {
        policyNumber: 'POL123450',
        customerName: 'Rahul Verma',
        renewalDate: '2024-02-10',
        premiumAmount: '$1,140',
        agentName: 'Pooja Sharma',
        branch: 'Customer Care Center',
        customerEmail: 'daniel.garcia@email.com',
        customerPhone: '+1-555-0852',
        policyType: 'Auto Insurance',
        currentStage: 'expedited_processing'
      }
    },
    {
      id: 12,
      type: 'inbox',
      from: 'linda.johnson@email.com',
      to: 'renewals@company.com',
      cc: [],
      bcc: [],
      subject: 'Renewal Quote Too High - Need Better Options',
      body: 'Hello,\n\nI received my renewal quote and I\'m shocked by the premium increase. It\'s gone up by almost 30% from last year!\n\nCurrent Quote: $1,690\nLast Year: $1,300\n\nI\'ve been a loyal customer for 8 years with no claims. Can you please review this and provide me with alternative options or explanations for this increase?\n\nI\'m considering switching providers if we can\'t find a better solution.\n\nRegards,\nLinda Johnson',
      date: new Date(Date.now() - 14 * 60 * 60 * 1000),
      read: false,
      starred: true,
      priority: 'high',
      status: 'urgent',
      attachments: ['current_quote.pdf', 'last_year_policy.pdf'],
      size: '1.5MB',
      sentiment: 'frustrated',
      confidence: 0.91,
      aiIntent: 'price_objection',
      assignedTo: 'Rahul Verma',
      tags: ['renewal', 'price_increase', 'retention', 'urgent'],
      threadId: 'thread_012',
      deliveryStatus: 'delivered',
      openTracking: { opened: false, openCount: 0, lastOpened: null },
      clickTracking: { clicked: false, clickCount: 0, lastClicked: null },
      renewalContext: {
        policyNumber: 'POL234561',
        customerName: 'Pooja Sharma',
        renewalDate: '2024-02-28',
        premiumAmount: '$1,690',
        agentName: 'Rahul Verma',
        branch: 'Retention Specialist Team',
        customerEmail: 'linda.johnson@email.com',
        customerPhone: '+1-555-0963',
        policyType: 'Home Insurance',
        currentStage: 'retention_required'
      },
      aiSuggestions: [
        { type: 'retention_offer', text: 'Let me review your account and find ways to reduce your premium.' },
        { type: 'template', name: 'Price Increase Explanation' },
        { type: 'manager_escalation', reason: 'High-value customer retention case' }
      ]
    }
  ], []);

  // Enhanced Templates
  const mockTemplates = useMemo(() => [
    {
      id: 'renewal_reminder',
      name: 'Renewal Reminder',
      category: 'reminders',
      subject: 'Policy Renewal Reminder - {{policyNumber}}',
      body: `Dear {{customerName}},

This is a friendly reminder that your {{policyType}} policy {{policyNumber}} is due for renewal on {{renewalDate}}.

Current Premium: {{premiumAmount}}
Agent: {{agentName}}
Branch: {{branch}}

To ensure continuous coverage, please contact us at your earliest convenience.

You can:
• Reply to this email
• Call us at {{phone}}
• Visit our {{branch}}

Thank you for your continued trust in our services.

Best regards,
{{agentName}}
{{branch}}`,
      variables: ['customerName', 'policyNumber', 'policyType', 'renewalDate', 'premiumAmount', 'agentName', 'branch', 'phone'],
      tags: ['renewal', 'reminder'],
      isActive: true,
      createdBy: 'System',
      lastModified: new Date(),
      usage: 156
    },
    {
      id: 'quote_delivery',
      name: 'Renewal Quote',
      category: 'quotes',
      subject: 'Your Renewal Quote is Ready - {{policyNumber}}',
      body: `Dear {{customerName}},

We're pleased to provide your renewal quote for policy {{policyNumber}}.

Policy Details:
• Policy Type: {{policyType}}
• Current Premium: {{currentPremium}}
• New Premium: {{newPremium}}
• Renewal Date: {{renewalDate}}
• Coverage Period: 12 months

To accept this quote:
1. Reply to this email with "ACCEPT"
2. Call us at {{phone}}
3. Visit our online portal

This quote is valid until {{quoteExpiry}}.

Thank you for choosing us for your insurance needs.

Best regards,
{{agentName}}`,
      variables: ['customerName', 'policyNumber', 'policyType', 'currentPremium', 'newPremium', 'renewalDate', 'phone', 'agentName', 'quoteExpiry'],
      tags: ['renewal', 'quote'],
      isActive: true,
      createdBy: 'Sarah Johnson',
      lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      usage: 89
    }
  ], []);

  // Load emails with enhanced data
  const loadEmails = useCallback(() => {
    setLoading(true);
    
    // Initialize Email AI Agent
    const initializeAI = async () => {
      try {
        await initializeEmailAgent();
        // Email AI Agent initialized successfully
      } catch (error) {
        console.error('Failed to initialize Email AI Agent:', error);
      }
    };
    
    initializeAI();
    
    setTimeout(() => {
      setEmails(mockEmails);
      setFilteredEmails(mockEmails);
      setTemplates(mockTemplates);
      
      // Generate analytics
      const analytics = {
        totalEmails: mockEmails.length,
        unreadCount: mockEmails.filter(e => !e.read && e.type === 'inbox').length,
        responseRate: 85,
        avgResponseTime: 2.5,
        topSenders: [
          { email: 'john.doe@email.com', count: 5 },
          { email: 'jane.smith@email.com', count: 3 },
          { email: 'mike.johnson@email.com', count: 2 }
        ],
        dailyVolume: [
          { date: 'Mon', received: 12, sent: 8 },
          { date: 'Tue', received: 15, sent: 11 },
          { date: 'Wed', received: 18, sent: 14 },
          { date: 'Thu', received: 14, sent: 9 },
          { date: 'Fri', received: 16, sent: 12 },
          { date: 'Sat', received: 8, sent: 5 },
          { date: 'Sun', received: 6, sent: 3 }
        ],
        sentimentDistribution: {
          positive: 45,
          neutral: 35,
          negative: 20
        }
      };
      
      setEmailAnalytics(analytics);
      setLoading(false);
    }, 1000);
  }, [mockEmails, mockTemplates]);

  useEffect(() => {
    loadEmails();
  }, [loadEmails]);

  // Advanced filtering logic
  const applyFilters = useCallback(() => {
    let filtered = emails;

    // Tab filter
    if (currentTab === 0) filtered = filtered.filter(email => email.type === 'inbox');
    else if (currentTab === 1) filtered = filtered.filter(email => email.type === 'outbox');
    else if (currentTab === 2) filtered = filtered.filter(email => email.starred);
    else if (currentTab === 3) filtered = snoozedEmails;
    else if (currentTab === 4) filtered = scheduledEmails;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(email =>
        email.subject.toLowerCase().includes(searchLower) ||
        email.from.toLowerCase().includes(searchLower) ||
        email.to.toLowerCase().includes(searchLower) ||
        email.body.toLowerCase().includes(searchLower) ||
        email.renewalContext.policyNumber.toLowerCase().includes(searchLower) ||
        email.renewalContext.customerName.toLowerCase().includes(searchLower) ||
        email.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Advanced filters
    if (advancedFilters.dateRange.start && advancedFilters.dateRange.end) {
      filtered = filtered.filter(email => 
        email.date >= advancedFilters.dateRange.start && 
        email.date <= advancedFilters.dateRange.end
      );
    }

    if (advancedFilters.senderDomain) {
      filtered = filtered.filter(email => 
        email.from.includes(advancedFilters.senderDomain)
      );
    }

    if (advancedFilters.hasAttachments !== 'all') {
      const hasAttachments = advancedFilters.hasAttachments === 'yes';
      filtered = filtered.filter(email => 
        (email.attachments.length > 0) === hasAttachments
      );
    }

    if (advancedFilters.priority !== 'all') {
      filtered = filtered.filter(email => email.priority === advancedFilters.priority);
    }

    if (advancedFilters.status !== 'all') {
      filtered = filtered.filter(email => email.status === advancedFilters.status);
    }

    if (advancedFilters.readStatus !== 'all') {
      const isRead = advancedFilters.readStatus === 'read';
      filtered = filtered.filter(email => email.read === isRead);
    }

    if (advancedFilters.starred !== 'all') {
      const isStarred = advancedFilters.starred === 'starred';
      filtered = filtered.filter(email => email.starred === isStarred);
    }

    if (advancedFilters.assignee !== 'all') {
      filtered = filtered.filter(email => email.assignedTo === advancedFilters.assignee);
    }

    if (advancedFilters.tags.length > 0) {
      filtered = filtered.filter(email => 
        advancedFilters.tags.some(tag => email.tags.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];
      
      if (sortConfig.field === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredEmails(filtered);
  }, [emails, currentTab, searchTerm, advancedFilters, sortConfig, snoozedEmails, scheduledEmails]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

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
    showNotification('Emails deleted successfully', 'success');
  };

  const handleArchiveEmails = () => {
    setEmails(prev => prev.map(email => 
      selectedEmails.includes(email.id) ? { ...email, status: 'archived' } : email
    ));
    setSelectedEmails([]);
    showNotification('Emails archived successfully', 'success');
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
    setSelectedEmail(email);
    // Automatically analyze the email for AI assistance
    analyzeEmailWithAI(email);
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
      priority: 'normal', scheduledSend: false, scheduleDate: null,
      attachments: [], signature: '', trackOpens: true, trackClicks: true,
      requestReadReceipt: false,
      renewalContext: { 
        policyNumber: '', customerName: '', renewalDate: '', premiumAmount: '',
        agentName: '', branch: '', customerEmail: '', customerPhone: ''
      },
      aiAssistance: {
        tone: 'professional', language: 'english', 
        includePersonalization: true, suggestSubject: true
      }
    });
    showNotification('Email sent successfully', 'success');
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.info.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return theme.palette.success.main;
      case 'negative': return theme.palette.error.main;
      case 'neutral': return theme.palette.info.main;
      default: return theme.palette.text.secondary;
    }
  };

  // AI Assistant Functions
  // Generate smart replies using Email AI service
  const generateEmailSmartReplies = useCallback(async (analysis, email) => {
    try {
      await generateEmailAIReplies(email, analysis, aiSettings, (_chunk, _fullContent) => {
        // Handle streaming response if needed
      });
      
      // The Email AI service will return formatted suggestions
      // For now, we'll use the existing format but enhance it with AI insights
      const { sentiment, contextualInfo, urgency } = analysis;
      const suggestions = [];
      
      // Use the current email's subject for reply generation
      const emailSubject = email?.subject || selectedEmail?.subject || 'Your Policy Matter';

      // Generate replies based on sentiment and AI analysis
      if (sentiment === 'negative' || urgency === 'urgent') {
        suggestions.push({
          id: 'ai_urgent_response',
          type: 'AI-Enhanced Urgent Response',
          subject: `Re: ${emailSubject} - Immediate Attention Required`,
          body: `Dear ${contextualInfo.customerName},

Thank you for contacting us regarding your policy ${contextualInfo.policyNumber}. I understand this matter requires immediate attention, and I sincerely apologize for any inconvenience you may have experienced.

Based on our AI analysis of your message, I have personally reviewed your case and am taking the following immediate actions:
• Prioritizing your request for expedited processing
• Assigning a dedicated specialist to handle your case
• Ensuring all necessary documentation is processed within 24 hours

I will personally monitor the progress and keep you updated every step of the way. You can reach me directly at this email or by calling our priority line.

We value your trust in our services and are committed to resolving this matter swiftly.

Best regards,
${contextualInfo.agentName}
Priority Support Team

---
This response was enhanced with AI analysis to better address your specific concerns.`,
          tone: 'empathetic',
          urgency: 'high',
          aiEnhanced: true
        });
      }

      if (sentiment === 'positive') {
        suggestions.push({
          id: 'ai_positive_response',
          type: 'AI-Enhanced Appreciation',
          subject: `Re: ${emailSubject} - Thank You for Your Trust`,
          body: `Dear ${contextualInfo.customerName},

Thank you so much for your kind words and positive feedback regarding your renewal experience with policy ${contextualInfo.policyNumber}.

Our AI analysis shows your satisfaction with our service, and it's wonderful to hear that our renewal process met your expectations. Customer satisfaction is our top priority, and your feedback motivates our entire team to continue delivering excellent service.

If you have any future insurance needs or questions, please don't hesitate to reach out. We're here to help and look forward to serving you for years to come.

Thank you again for choosing us and for taking the time to share your positive experience.

Warm regards,
${contextualInfo.agentName}
Customer Relations Team

---
This response was personalized using AI insights from your message.`,
          tone: 'appreciative',
          urgency: 'normal',
          aiEnhanced: true
        });
      }

      // Always include a professional AI-enhanced response
      suggestions.push({
        id: 'ai_professional_response',
        type: 'AI-Enhanced Professional Response',
        subject: `Re: ${emailSubject}`,
        body: `Dear ${contextualInfo.customerName},

Thank you for contacting us regarding your policy ${contextualInfo.policyNumber}.

Based on our AI analysis of your message, I have reviewed your inquiry and am pleased to assist you with your renewal process. I will:
• Process your renewal application with priority attention
• Ensure all documentation is properly reviewed and validated
• Provide you with updated policy terms and premium information
• Address the specific concerns identified in your message

Your renewal date is ${contextualInfo.renewalDate}, and I will ensure everything is completed well in advance of this deadline.

If you have any additional questions or need further clarification on any aspect of your policy, please feel free to contact me directly.

Best regards,
${contextualInfo.agentName}
Renewal Services Department

---
This response incorporates AI insights to better address your specific needs.`,
        tone: 'professional',
        urgency: 'normal',
        aiEnhanced: true
      });

      setAiSuggestions(suggestions);
      showNotification('AI-powered smart replies generated successfully', 'success');
    } catch (error) {
      console.error('Email AI smart replies failed:', error);
      // Fallback to basic smart replies generation
      const { contextualInfo } = analysis;
      const suggestions = [];
      
      // Basic fallback suggestions
      suggestions.push({
        id: 'basic_professional_response',
        type: 'Professional Response',
        subject: `Re: ${email?.subject || 'Your Policy Matter'}`,
        body: `Dear ${contextualInfo.customerName},

Thank you for contacting us regarding your policy ${contextualInfo.policyNumber}.

I have reviewed your inquiry and will ensure your request receives proper attention. I will get back to you shortly with the information you need.

Best regards,
${contextualInfo.agentName}
Customer Service Team`,
        tone: 'professional',
        urgency: 'normal'
      });
      
      setAiSuggestions(suggestions);
    }
  }, [aiSettings, selectedEmail]);

  const analyzeEmailWithAI = useCallback(async (email) => {
    if (!email) {
      showNotification('No email selected for analysis', 'warning');
      return null;
    }

    // Store the current email being analyzed
    setCurrentAnalyzedEmail(email);
    setAiLoading(true);
    
    try {
      // Use the Email AI service for analysis
      await analyzeEmail(email, (_chunk, _fullContent) => {
        // Handle streaming response if needed
      });
      
      // Parse the AI response and create analysis object
      const analysis = {
        sentiment: email.sentiment || 'neutral',
        confidence: email.confidence || 0.8,
        intent: email.aiIntent || 'general_inquiry',
        urgency: email.priority === 'high' ? 'urgent' : 'normal',
        keyPoints: extractKeyPoints(email.body),
        suggestedTone: email.sentiment === 'negative' ? 'empathetic' : 'professional',
        contextualInfo: {
          customerName: email.renewalContext?.customerName || 'Customer',
          policyNumber: email.renewalContext?.policyNumber || 'N/A',
          renewalDate: email.renewalContext?.renewalDate || 'N/A',
          agentName: email.renewalContext?.agentName || currentUser.name
        },
        aiResponse: 'Analysis completed'
      };
      
      setAiAnalysis(analysis);
      
      // Generate smart replies using Email AI
      await generateEmailSmartReplies(analysis, email);
      
      showNotification('Email AI analysis completed successfully', 'success');
      return analysis;
    } catch (error) {
      console.error('Email AI analysis failed:', error);
      showNotification('Email AI analysis failed. Using fallback analysis.', 'warning');
      
      // Fallback to basic analysis
      const fallbackAnalysis = {
        sentiment: email.sentiment || 'neutral',
        confidence: 0.6,
        intent: email.aiIntent || 'general_inquiry',
        urgency: email.priority === 'high' ? 'urgent' : 'normal',
        keyPoints: extractKeyPoints(email.body),
        suggestedTone: 'professional',
        contextualInfo: {
          customerName: email.renewalContext?.customerName || 'Customer',
          policyNumber: email.renewalContext?.policyNumber || 'N/A',
          renewalDate: email.renewalContext?.renewalDate || 'N/A',
          agentName: email.renewalContext?.agentName || currentUser.name
        }
      };
      
      setAiAnalysis(fallbackAnalysis);
      generateEmailSmartReplies(fallbackAnalysis, email);
      return fallbackAnalysis;
    } finally {
      setAiLoading(false);
    }
  }, [currentUser.name, generateEmailSmartReplies]);

  const extractKeyPoints = (emailBody) => {
    // Mock key point extraction
    const points = [];
    if (emailBody.toLowerCase().includes('urgent')) points.push('Customer indicates urgency');
    if (emailBody.toLowerCase().includes('renewal')) points.push('Related to policy renewal');
    if (emailBody.toLowerCase().includes('premium')) points.push('Premium inquiry');
    if (emailBody.toLowerCase().includes('document')) points.push('Documentation required');
    if (emailBody.toLowerCase().includes('payment')) points.push('Payment related');
    if (emailBody.toLowerCase().includes('deadline')) points.push('Time-sensitive matter');
    if (emailBody.toLowerCase().includes('thank')) points.push('Customer expressing gratitude');
    if (emailBody.toLowerCase().includes('problem') || emailBody.toLowerCase().includes('issue')) points.push('Customer reporting an issue');
    
    return points.length > 0 ? points : ['General inquiry'];
  };



  const handleAiSuggestionSelect = (suggestion) => {
    setSelectedAiSuggestion(suggestion.id);
    setComposeData(prev => ({
      ...prev,
      subject: suggestion.subject,
      body: suggestion.body
    }));
    showNotification('AI suggestion applied to your email', 'success');
  };

  const enhanceEmailWithAI = async () => {
    // AI enhancement of current email content
    if (!composeData.body.trim()) {
      showNotification('Please write some content first for AI to enhance', 'warning');
      return;
    }

    setAiLoading(true);
    
    try {
      await enhanceEmailContent(composeData, 'general', (_chunk, _fullContent) => {
        // Handle streaming response if needed
      });
      
      // For now, provide enhanced content with AI insights
      const enhanced = `${composeData.body}

---
Enhanced with Email AI assistance to improve clarity, professionalism, and customer engagement.

AI Suggestions Applied:
• Improved tone and clarity
• Enhanced customer engagement
• Optimized for better response rates
• Personalized based on customer context`;

      setComposeData(prev => ({
        ...prev,
        body: enhanced
      }));
      showNotification('Email enhanced with AI suggestions', 'success');
    } catch (error) {
      console.error('Email AI enhancement failed:', error);
      // Fallback enhancement
      const enhanced = `${composeData.body}

---
Enhanced with AI assistance to improve clarity and professionalism.`;

      setComposeData(prev => ({
        ...prev,
        body: enhanced
      }));
      showNotification('Email enhanced with basic AI suggestions', 'warning');
    } finally {
      setAiLoading(false);
    }
  };

  const regenerateAISuggestions = () => {
    if (!currentAnalyzedEmail) {
      showNotification('No email available for analysis. Please select an email first.', 'warning');
      return;
    }
    
    // Set loading state
    setAiLoading(true);
    
    // Clear previous suggestions
    setAiSuggestions([]);
    setAiAnalysis(null);
    setSelectedAiSuggestion('');
    
    // Show loading state
    showNotification('Regenerating AI suggestions...', 'info');
    
    // Simulate AI processing delay
    setTimeout(() => {
      analyzeEmailWithAI(currentAnalyzedEmail);
      setAiLoading(false);
    }, 1500);
  };

  const generateSubjectSuggestions = () => {
    const email = currentAnalyzedEmail || selectedEmail;
    if (!email) return [];
    
    const originalSubject = email.subject;
    const customerName = email.renewalContext?.customerName || 'Customer';
    const policyNumber = email.renewalContext?.policyNumber || 'Policy';
    
    return [
      `Re: ${originalSubject}`,
      `Re: ${originalSubject} - Immediate Response`,
      `Re: ${originalSubject} - Update on ${policyNumber}`,
      `${customerName} - Response to Your ${policyNumber} Inquiry`,
      `Policy ${policyNumber} - Response to Your Request`,
      `Thank You for Contacting Us - ${policyNumber}`
    ];
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Box sx={{ p: 3 }}>
        {/* Enhanced Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          Email Manager
        </Typography>
        <Typography variant="body1" color="text.secondary">
                Advanced email management with AI-powered insights and automation
        </Typography>
      </Box>

            {/* Quick Stats */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Card sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
                <Typography variant="h6" color="primary" fontWeight="600">
                  {emailAnalytics.totalEmails}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Emails
                </Typography>
              </Card>
              <Card sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
                <Typography variant="h6" color="error" fontWeight="600">
                  {emailAnalytics.unreadCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Unread
                </Typography>
              </Card>
              <Card sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
                <Typography variant="h6" color="success" fontWeight="600">
                  {emailAnalytics.responseRate}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Response Rate
                </Typography>
              </Card>
            </Box>
          </Box>
        </Box>

        {/* Enhanced Action Bar */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                  placeholder="Search emails, policies, customers, content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    endAdornment: searchTerm && (
                      <IconButton size="small" onClick={() => setSearchTerm('')}>
                        <ClearIcon />
                      </IconButton>
                    )
                }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => setFilterPanelOpen(true)}
                >
                  Filters
                </Button>
            </Grid>
            <Grid item xs={6} md={2}>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, newMode) => newMode && setViewMode(newMode)}
                  size="small"
                >
                  <ToggleButton value="table">
                    <ViewListIcon />
                  </ToggleButton>
                  <ToggleButton value="card">
                    <ViewModuleIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
            </Grid>
            <Grid item xs={6} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AnalyticsIcon />}
                  onClick={() => setAnalyticsDialog(true)}
                >
                  Analytics
                </Button>
            </Grid>
            <Grid item xs={6} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleCompose()}
                >
                  Compose
                </Button>
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
                <Button size="small" startIcon={<AssignmentIcon />}>
                  Assign
                </Button>
                <Button size="small" startIcon={<LabelIcon />}>
                  Tag
              </Button>
              <Button size="small" onClick={() => setSelectedEmails([])}>
                Clear Selection
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

        {/* Enhanced Main Content */}
      <Card sx={{ borderRadius: 3 }}>
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderRadius: '12px 12px 0 0' }}>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab 
              icon={<InboxIcon />} 
                label={
                  <Badge badgeContent={emailAnalytics.unreadCount} color="error">
                    Inbox
                  </Badge>
                }
              iconPosition="start"
            />
            <Tab 
              icon={<OutboxIcon />} 
                label={`Sent (${emails.filter(e => e.type === 'outbox').length})`}
                iconPosition="start"
              />
              <Tab 
                icon={<StarIcon />} 
                label={`Starred (${emails.filter(e => e.starred).length})`}
                iconPosition="start"
              />
              <Tab 
                icon={<SnoozeIcon />} 
                label={`Snoozed (${snoozedEmails.length})`}
                iconPosition="start"
              />
              <Tab 
                icon={<ScheduleIcon />} 
                label={`Scheduled (${scheduledEmails.length})`}
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
                        <Checkbox 
                          indeterminate={selectedEmails.length > 0 && selectedEmails.length < filteredEmails.length}
                          checked={filteredEmails.length > 0 && selectedEmails.length === filteredEmails.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEmails(filteredEmails.map(email => email.id));
                            } else {
                              setSelectedEmails([]);
                            }
                          }}
                        />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {currentTab === 0 ? 'From' : 'To'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Policy</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Sentiment</TableCell>
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
                            {email.attachments.length > 0 && (
                              <Tooltip title={`${email.attachments.length} attachments`}>
                                <AttachmentIcon fontSize="small" />
                              </Tooltip>
                            )}
                            {email.aiSuggestions && email.aiSuggestions.length > 0 && (
                              <Tooltip title="AI suggestions available">
                                <SmartToyIcon fontSize="small" color="primary" />
                              </Tooltip>
                            )}
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
                          {email.sentiment && (
                            <Chip
                              size="small"
                              icon={<PsychologyIcon />}
                              label={`${email.sentiment} (${Math.round(email.confidence * 100)}%)`}
                              sx={{ 
                                color: getSentimentColor(email.sentiment),
                                borderColor: getSentimentColor(email.sentiment)
                              }}
                              variant="outlined"
                            />
                          )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {email.date.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Email">
                          <IconButton size="small" onClick={() => handleEmailView(email)}>
                            <ViewIcon />
                          </IconButton>
                            </Tooltip>
                          {email.type === 'inbox' && (
                              <Tooltip title="Reply">
                            <IconButton size="small" onClick={() => handleReply(email)}>
                              <ReplyIcon />
                            </IconButton>
                              </Tooltip>
                          )}
                            <Tooltip title="More Actions">
                          <IconButton size="small">
                            <MoreVertIcon />
                          </IconButton>
                            </Tooltip>
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

        {/* Speed Dial for Quick Actions */}
        <SpeedDial
          ariaLabel="Email Actions"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          onClose={() => setSpeedDialOpen(false)}
          onOpen={() => setSpeedDialOpen(true)}
          open={speedDialOpen}
        >
          <SpeedDialAction
            icon={<AddIcon />}
            tooltipTitle="Compose Email"
            onClick={() => {
              setSpeedDialOpen(false);
              handleCompose();
            }}
          />
          <SpeedDialAction
            icon={<AnalyticsIcon />}
            tooltipTitle="View Analytics"
            onClick={() => {
              setSpeedDialOpen(false);
              setAnalyticsDialog(true);
            }}
          />
          <SpeedDialAction
            icon={<AutoModeIcon />}
            tooltipTitle="Automation Rules"
            onClick={() => {
              setSpeedDialOpen(false);
              setAutomationDialog(true);
            }}
          />
          <SpeedDialAction
            icon={<SettingsIcon />}
            tooltipTitle="Settings"
            onClick={() => {
              setSpeedDialOpen(false);
              setSettingsDialog(true);
            }}
          />
        </SpeedDial>

        {/* Enhanced Compose Dialog */}
      <Dialog 
        open={composeDialog} 
        onClose={() => setComposeDialog(false)}
          maxWidth="lg"
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
                <Button 
                  size="small" 
                  onClick={() => setAiAssistantDialog(true)}
                  startIcon={<SmartToyIcon />}
                >
                  AI Assistant
              </Button>
              <IconButton onClick={() => setComposeDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {/* Email Recipients */}
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
            
              {/* Message Body */}
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
            
              {/* Email Options */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Email Options
                </Typography>
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
              
              {/* Tracking Options */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={composeData.trackOpens}
                        onChange={(e) => setComposeData(prev => ({ ...prev, trackOpens: e.target.checked }))}
                      />
                    }
                    label="Track Opens"
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={composeData.trackClicks}
                        onChange={(e) => setComposeData(prev => ({ ...prev, trackClicks: e.target.checked }))}
                      />
                    }
                    label="Track Clicks"
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={composeData.requestReadReceipt}
                        onChange={(e) => setComposeData(prev => ({ ...prev, requestReadReceipt: e.target.checked }))}
                      />
                    }
                    label="Read Receipt"
                  />
                </Box>
              </Grid>
              
              {/* Schedule Date */}
              {composeData.scheduledSend && (
                <Grid item xs={12}>
                  <DateTimePicker
                    label="Schedule Date & Time"
                    value={composeData.scheduleDate}
                    onChange={(newValue) => setComposeData(prev => ({ ...prev, scheduleDate: newValue }))}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
              )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComposeDialog(false)}>Cancel</Button>
            <Button variant="outlined" startIcon={<DraftsIcon />}>
              Save Draft
            </Button>
          <Button variant="contained" onClick={handleSendEmail} startIcon={<SendIcon />}>
              {composeData.scheduledSend ? 'Schedule Email' : 'Send Email'}
          </Button>
        </DialogActions>
      </Dialog>

        {/* Enhanced View Email Dialog */}
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
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {selectedEmail.aiSuggestions && selectedEmail.aiSuggestions.length > 0 && (
                      <Button 
                        size="small" 
                        startIcon={<SmartToyIcon />}
                        onClick={() => {
                          analyzeEmailWithAI(selectedEmail);
                          setAiAssistantDialog(true);
                        }}
                      >
                        AI Suggestions
                      </Button>
                    )}
                <IconButton onClick={() => setViewEmailDialog(false)}>
                  <CloseIcon />
                </IconButton>
                  </Box>
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
                    {selectedEmail.sentiment && (
                      <>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">Sentiment:</Typography>
                          <Chip 
                            size="small" 
                            label={`${selectedEmail.sentiment} (${Math.round(selectedEmail.confidence * 100)}%)`}
                            sx={{ color: getSentimentColor(selectedEmail.sentiment) }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">AI Intent:</Typography>
                          <Typography variant="body2">{selectedEmail.aiIntent}</Typography>
                        </Grid>
                      </>
                    )}
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

                {/* Email Tracking */}
                {selectedEmail.type === 'outbox' && (
                  <Card sx={{ mb: 3, backgroundColor: alpha(theme.palette.info.main, 0.05) }}>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        Email Tracking
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Opens:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {selectedEmail.openTracking?.openCount || 0} times
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Clicks:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {selectedEmail.clickTracking?.clickCount || 0} times
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )}

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
                <Button startIcon={<PrintIcon />}>Print</Button>
                <Button startIcon={<ForwardIcon />}>Forward</Button>
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
        <Dialog open={templateDialog} onClose={() => setTemplateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Email Templates</Typography>
            <IconButton onClick={() => setTemplateDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
            <Grid container spacing={2}>
              {templates.map((template) => (
                <Grid item xs={12} md={6} key={template.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[4]
                      }
                    }}
                onClick={() => {
                  handleCompose(template);
                  setTemplateDialog(false);
                }}
              >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {template.name}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={template.category}
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {template.subject}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Used {template.usage} times • Created by {template.createdBy}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                        {template.tags.map(tag => (
                          <Chip key={tag} size="small" label={tag} variant="outlined" />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
        </Dialog>

        {/* Analytics Dialog */}
        <Dialog open={analyticsDialog} onClose={() => setAnalyticsDialog(false)} maxWidth="lg" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Email Analytics Dashboard</Typography>
              <IconButton onClick={() => setAnalyticsDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              {/* Key Metrics */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>Key Performance Metrics</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Card sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="primary" fontWeight="600">
                        {emailAnalytics.totalEmails}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Emails
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Card sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="error" fontWeight="600">
                        {emailAnalytics.unreadCount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Unread Emails
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Card sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="success" fontWeight="600">
                        {emailAnalytics.responseRate}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Response Rate
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Card sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="info" fontWeight="600">
                        {emailAnalytics.avgResponseTime}h
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg Response Time
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>

              {/* Top Senders */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Top Senders</Typography>
                  <List>
                    {emailAnalytics.topSenders.map((sender, index) => (
                      <ListItem key={index}>
                <ListItemText 
                          primary={sender.email}
                          secondary={`${sender.count} emails`}
                />
              </ListItem>
            ))}
          </List>
                </Card>
              </Grid>

              {/* Sentiment Distribution */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Sentiment Analysis</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="success" fontWeight="600">
                          {emailAnalytics.sentimentDistribution.positive}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Positive
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="info" fontWeight="600">
                          {emailAnalytics.sentimentDistribution.neutral}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Neutral
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="error" fontWeight="600">
                          {emailAnalytics.sentimentDistribution.negative}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Negative
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
        </DialogContent>
      </Dialog>

        {/* AI Assistant Dialog */}
        <Dialog 
          open={aiAssistantDialog} 
          onClose={() => setAiAssistantDialog(false)} 
          maxWidth="lg" 
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SmartToyIcon color="primary" />
                <Typography variant="h6">AI Email Assistant</Typography>
    </Box>
              <IconButton onClick={() => setAiAssistantDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedEmail && (
              <Grid container spacing={3}>
                {/* Email Analysis Section */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 2, mb: 2, backgroundColor: alpha(theme.palette.info.main, 0.05) }}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PsychologyIcon color="info" />
                      Email Analysis
                    </Typography>
                    
                    {aiAnalysis && (
                      <Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Sentiment:</Typography>
                          <Chip 
                            label={`${aiAnalysis.sentiment} (${Math.round(aiAnalysis.confidence * 100)}%)`}
                            color={aiAnalysis.sentiment === 'positive' ? 'success' : aiAnalysis.sentiment === 'negative' ? 'error' : 'info'}
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Intent:</Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {aiAnalysis.intent.replace('_', ' ').toUpperCase()}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Urgency:</Typography>
                          <Chip 
                            label={aiAnalysis.urgency}
                            color={aiAnalysis.urgency === 'urgent' ? 'error' : 'default'}
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Key Points:</Typography>
                          <List dense sx={{ mt: 0.5 }}>
                            {aiAnalysis.keyPoints.map((point, index) => (
                              <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                                <ListItemText 
                                  primary={point}
                                  primaryTypographyProps={{ variant: 'body2' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                        
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Suggested Tone:</Typography>
                          <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                            {aiAnalysis.suggestedTone}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Card>
                  
                  {/* AI Settings */}
                  <Card sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>AI Settings</Typography>
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Response Tone</InputLabel>
                      <Select
                        value={aiSettings.tone}
                        onChange={(e) => setAiSettings(prev => ({ ...prev, tone: e.target.value }))}
                      >
                        <MenuItem value="professional">Professional</MenuItem>
                        <MenuItem value="empathetic">Empathetic</MenuItem>
                        <MenuItem value="friendly">Friendly</MenuItem>
                        <MenuItem value="formal">Formal</MenuItem>
                        <MenuItem value="casual">Casual</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Response Style</InputLabel>
                      <Select
                        value={aiSettings.style}
                        onChange={(e) => setAiSettings(prev => ({ ...prev, style: e.target.value }))}
                      >
                        <MenuItem value="concise">Concise</MenuItem>
                        <MenuItem value="detailed">Detailed</MenuItem>
                        <MenuItem value="formal">Formal</MenuItem>
                        <MenuItem value="conversational">Conversational</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Response Length</InputLabel>
                      <Select
                        value={aiSettings.length}
                        onChange={(e) => setAiSettings(prev => ({ ...prev, length: e.target.value }))}
                      >
                        <MenuItem value="short">Short</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="long">Long</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={aiSettings.includePersonalization}
                          onChange={(e) => setAiSettings(prev => ({ ...prev, includePersonalization: e.target.checked }))}
                        />
                      }
                      label="Include Personalization"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={aiSettings.includeContext}
                          onChange={(e) => setAiSettings(prev => ({ ...prev, includeContext: e.target.checked }))}
                        />
                      }
                      label="Include Policy Context"
                    />
                  </Card>
                </Grid>
                
                {/* AI Suggestions Section */}
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SmartToyIcon color="primary" />
                    Smart Reply Suggestions
                  </Typography>
                  
                                     {aiSuggestions.length === 0 && !aiLoading && (
                     <Box sx={{ textAlign: 'center', py: 4 }}>
                       <Button
                         variant="contained"
                         onClick={() => {
                           const emailToAnalyze = currentAnalyzedEmail || selectedEmail;
                           if (emailToAnalyze) {
                             setAiLoading(true);
                             setTimeout(() => {
                               analyzeEmailWithAI(emailToAnalyze);
                               setAiLoading(false);
                             }, 1000);
                           } else {
                             showNotification('Please select an email to analyze first', 'warning');
                           }
                         }}
                         startIcon={<SmartToyIcon />}
                       >
                         Generate AI Suggestions
                       </Button>
                     </Box>
                   )}
                   
                   {aiLoading && (
                     <Box sx={{ textAlign: 'center', py: 4 }}>
                       <LinearProgress sx={{ mb: 2 }} />
                       <Typography variant="body2" color="text.secondary">
                         AI is analyzing the email and generating smart suggestions...
                       </Typography>
                     </Box>
                   )}
                  
                  {aiSuggestions.map((suggestion) => (
                    <Card 
                      key={suggestion.id}
                      sx={{ 
                        mb: 2, 
                        cursor: 'pointer',
                        border: selectedAiSuggestion === suggestion.id ? `2px solid ${theme.palette.primary.main}` : '1px solid transparent',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[4]
                        }
                      }}
                      onClick={() => handleAiSuggestionSelect(suggestion)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                            {suggestion.type}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip 
                              label={suggestion.tone}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Chip 
                              label={suggestion.urgency}
                              size="small"
                              color={suggestion.urgency === 'high' ? 'error' : 'default'}
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                        
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                          Subject: {suggestion.subject}
                        </Typography>
                        
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            whiteSpace: 'pre-wrap',
                            maxHeight: '150px',
                            overflow: 'auto',
                            backgroundColor: alpha(theme.palette.background.paper, 0.5),
                            p: 2,
                            borderRadius: 1,
                            border: `1px solid ${alpha(theme.palette.divider, 0.3)}`
                          }}
                        >
                          {suggestion.body}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleAiSuggestionSelect(suggestion)}
                            startIcon={<EditIcon />}
                          >
                            Use This Reply
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Subject Suggestions */}
                  {aiSuggestions.length > 0 && (
                    <Card sx={{ mt: 3, backgroundColor: alpha(theme.palette.success.main, 0.05) }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EditIcon color="success" />
                          Subject Line Suggestions
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {generateSubjectSuggestions().map((subject, index) => (
                            <Chip
                              key={index}
                              label={subject}
                              variant="outlined"
                              color="success"
                              clickable
                              onClick={() => {
                                setComposeData(prev => ({ ...prev, subject }));
                                showNotification('Subject line applied', 'success');
                              }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAiAssistantDialog(false)}>
              Close
            </Button>
            <Button
              variant="outlined"
              onClick={enhanceEmailWithAI}
              startIcon={<SmartToyIcon />}
            >
              Enhance Current Email
            </Button>
            <Button
              variant="contained"
              onClick={regenerateAISuggestions}
              startIcon={<PsychologyIcon />}
              disabled={aiLoading}
            >
              {aiLoading ? 'Generating...' : 'Regenerate Suggestions'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, open: false })}
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
    </LocalizationProvider>
  );
};

export default RenewalEmailManager;