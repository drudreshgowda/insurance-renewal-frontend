import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Tabs, Tab, Button,
  IconButton, Tooltip, Chip, Avatar, LinearProgress, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  InputAdornment, Alert, Fab, Fade, Grow,
  useTheme, alpha, Switch, FormControlLabel, Collapse, Checkbox
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Add as AddIcon,
  Edit as EditIcon,

  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,

  Upload as UploadIcon,
  Star as StarIcon,

  CallMade as CallMadeIcon,
  CallReceived as CallReceivedIcon,
  Message as MessageIcon,
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,

  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,



  PersonAdd as PersonAddIcon,

  Save as SaveIcon,
  Cancel as CancelIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,

  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Settings as SettingsIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  ContactPhone as ContactPhoneIcon,
  LocalOffer as LocalOfferIcon,
  Note as NoteIcon,
  Event as EventIcon,
  SwapHoriz as SwapHorizIcon,
  EventAvailable as EventAvailableIcon
} from '@mui/icons-material';



const LeadManagement = () => {
  const theme = useTheme();

  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [leadDialog, setLeadDialog] = useState({ open: false, mode: 'create', data: {} });
  const [assignmentDialog, setAssignmentDialog] = useState({ open: false, leads: [], agent: null });
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assignedToFilter, setAssignedToFilter] = useState('all');

  const [viewMode, setViewMode] = useState('list'); // 'list' or 'cards'
  const [selectedLeads, setSelectedLeads] = useState([]);

  const [leadProfileDialog, setLeadProfileDialog] = useState({ open: false, lead: null });
  const [addNoteDialog, setAddNoteDialog] = useState({ 
    open: false, 
    note: '', 
    type: 'note',
    changeStatus: false,
    newStatus: '',
    setFollowUp: false,
    followUpDate: null,
    followUpTime: ''
  });
  const [draggedLead, setDraggedLead] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);
  const [quickActions] = useState({
    todaysCalls: 12,
    pendingFollowUps: 23,
    newLeads: 8,
    scheduledMessages: 15
  });
  
  // Notifications and Alerts
  const [notifications] = useState([
    {
      id: 1,
      type: 'follow-up',
      title: 'Follow-up Due',
      message: '5 leads require follow-up today',
      priority: 'high',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'new-lead',
      title: 'New Hot Lead',
      message: 'High-value lead from website form',
      priority: 'high',
      time: '30 minutes ago'
    },
    {
      id: 3,
      type: 'call-scheduled',
      title: 'Upcoming Call',
      message: 'Call with Rajesh Kumar in 1 hour',
      priority: 'medium',
      time: '1 hour ago'
    }
  ]);

  // Lead Management Statistics
  const [leadStats] = useState({
    totalLeads: 2847,
    newLeads: 156,
    qualifiedLeads: 892,
    convertedLeads: 234,
    conversionRate: 8.2,
    avgResponseTime: 2.3, // hours
    hotLeads: 67,
    warmLeads: 445,
    coldLeads: 1201,
    followUpDue: 89
  });

  // Sample Lead Data
  const [leads, setLeads] = useState([
    {
      id: 'LD001',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91-9876543210',
      company: 'Tech Solutions Pvt Ltd',
      designation: 'IT Manager',
      source: 'Website',
      status: 'new',
      priority: 'high',
      score: 85,
      assignedTo: 'Priya Sharma',
      assignedToId: 'AGT001',
      createdAt: '2025-01-15T10:30:00Z',
      lastContact: '2025-01-15T14:20:00Z',
      nextFollowUp: '2025-01-16T10:00:00Z',
      location: 'Mumbai, Maharashtra',
      policyInterest: 'Health Insurance',
      estimatedValue: 25000,
      notes: 'Interested in family health coverage for 4 members',
      contactHistory: [
        { type: 'call', date: '2025-01-15T14:20:00Z', duration: 12, outcome: 'interested' },
        { type: 'email', date: '2025-01-15T11:00:00Z', subject: 'Health Insurance Inquiry' }
      ],
      tags: ['family-plan', 'urgent', 'high-value']
    },
    {
      id: 'LD002',
      name: 'Priya Patel',
      email: 'priya.patel@company.com',
      phone: '+91-9876543211',
      company: 'Digital Marketing Agency',
      designation: 'Founder',
      source: 'Referral',
      status: 'qualified',
      priority: 'medium',
      score: 72,
      assignedTo: 'Amit Singh',
      assignedToId: 'AGT002',
      createdAt: '2025-01-14T09:15:00Z',
      lastContact: '2025-01-15T16:45:00Z',
      nextFollowUp: '2025-01-17T11:30:00Z',
      location: 'Pune, Maharashtra',
      policyInterest: 'Business Insurance',
      estimatedValue: 45000,
      notes: 'Looking for comprehensive business coverage',
      contactHistory: [
        { type: 'whatsapp', date: '2025-01-15T16:45:00Z', message: 'Sent policy details' },
        { type: 'call', date: '2025-01-14T15:30:00Z', duration: 18, outcome: 'follow-up-needed' }
      ],
      tags: ['business', 'referral', 'qualified']
    },
    {
      id: 'LD003',
      name: 'Arjun Mehta',
      email: 'arjun.mehta@gmail.com',
      phone: '+91-9876543212',
      company: 'Freelancer',
      designation: 'Consultant',
      source: 'Social Media',
      status: 'contacted',
      priority: 'low',
      score: 45,
      assignedTo: 'Neha Gupta',
      assignedToId: 'AGT003',
      createdAt: '2025-01-13T14:20:00Z',
      lastContact: '2025-01-14T10:15:00Z',
      nextFollowUp: '2025-01-18T14:00:00Z',
      location: 'Bangalore, Karnataka',
      policyInterest: 'Term Life Insurance',
      estimatedValue: 15000,
      notes: 'Young professional, price-sensitive',
      contactHistory: [
        { type: 'email', date: '2025-01-14T10:15:00Z', subject: 'Term Insurance Options' }
      ],
      tags: ['individual', 'price-sensitive']
    },
    {
      id: 'LD004',
      name: 'Ananya Sharma',
      email: 'ananya.sharma@outlook.com',
      phone: '+91-9876543213',
      company: 'Global Retail Ltd',
      designation: 'Operations Director',
      source: 'Email Campaign',
      status: 'follow-up',
      priority: 'high',
      score: 78,
      assignedTo: 'Priya Sharma',
      assignedToId: 'AGT001',
      createdAt: '2025-01-12T11:45:00Z',
      lastContact: '2025-01-14T13:20:00Z',
      nextFollowUp: '2025-01-16T15:30:00Z',
      location: 'Delhi, NCR',
      policyInterest: 'Group Health Insurance',
      estimatedValue: 120000,
      notes: 'Looking for employee benefits package for 50+ staff',
      contactHistory: [
        { type: 'call', date: '2025-01-14T13:20:00Z', duration: 22, outcome: 'very-interested' },
        { type: 'email', date: '2025-01-13T09:45:00Z', subject: 'Group Insurance Quote' }
      ],
      tags: ['corporate', 'high-value', 'urgent']
    },
    {
      id: 'LD005',
      name: 'Vikram Malhotra',
      email: 'vikram.malhotra@gmail.com',
      phone: '+91-9876543214',
      company: 'Self-employed',
      designation: 'Financial Consultant',
      source: 'Cold Calling',
      status: 'new',
      priority: 'medium',
      score: 62,
      assignedTo: 'Amit Singh',
      assignedToId: 'AGT002',
      createdAt: '2025-01-15T09:10:00Z',
      lastContact: '2025-01-15T09:10:00Z',
      nextFollowUp: '2025-01-17T10:00:00Z',
      location: 'Chennai, Tamil Nadu',
      policyInterest: 'Investment Plans',
      estimatedValue: 35000,
      notes: 'Interested in tax-saving investment options',
      contactHistory: [
        { type: 'call', date: '2025-01-15T09:10:00Z', duration: 8, outcome: 'interested' }
      ],
      tags: ['investment', 'tax-planning']
    },
    {
      id: 'LD006',
      name: 'Sunita Reddy',
      email: 'sunita.reddy@techcorp.in',
      phone: '+91-9876543215',
      company: 'Tech Corporation',
      designation: 'HR Manager',
      source: 'Website',
      status: 'qualified',
      priority: 'high',
      score: 88,
      assignedTo: 'Neha Gupta',
      assignedToId: 'AGT003',
      createdAt: '2025-01-11T15:30:00Z',
      lastContact: '2025-01-15T11:45:00Z',
      nextFollowUp: '2025-01-16T14:00:00Z',
      location: 'Hyderabad, Telangana',
      policyInterest: 'Employee Benefits',
      estimatedValue: 85000,
      notes: 'Comprehensive employee benefits package for tech startup',
      contactHistory: [
        { type: 'meeting', date: '2025-01-15T11:45:00Z', duration: 45, outcome: 'proposal-requested' },
        { type: 'email', date: '2025-01-13T16:20:00Z', subject: 'Meeting Request' },
        { type: 'call', date: '2025-01-12T10:30:00Z', duration: 15, outcome: 'interested' }
      ],
      tags: ['corporate', 'high-value', 'hot-lead']
    },
    {
      id: 'LD007',
      name: 'Rahul Verma',
      email: 'rahul.verma@gmail.com',
      phone: '+91-9876543216',
      company: 'Verma Enterprises',
      designation: 'Business Owner',
      source: 'Referral',
      status: 'contacted',
      priority: 'medium',
      score: 70,
      assignedTo: 'Priya Sharma',
      assignedToId: 'AGT001',
      createdAt: '2025-01-14T12:15:00Z',
      lastContact: '2025-01-15T10:05:00Z',
      nextFollowUp: '2025-01-18T11:00:00Z',
      location: 'Ahmedabad, Gujarat',
      policyInterest: 'Business Liability Insurance',
      estimatedValue: 50000,
      notes: 'Small business owner looking for liability coverage',
      contactHistory: [
        { type: 'whatsapp', date: '2025-01-15T10:05:00Z', message: 'Sent policy brochure' },
        { type: 'call', date: '2025-01-14T14:30:00Z', duration: 10, outcome: 'follow-up-needed' }
      ],
      tags: ['small-business', 'referral']
    }
  ]);

  // Agents/Team Members
  const [agents] = useState([
    {
      id: 'AGT001',
      name: 'Priya Sharma',
      email: 'priya.sharma@company.com',
      phone: '+91-9876543220',
      role: 'Senior Lead Agent',
      specialization: 'Health Insurance',
      activeLeads: 45,
      convertedThisMonth: 12,
      conversionRate: 15.2,
      avgResponseTime: 1.8,
      performance: 'excellent',
      avatar: null
    },
    {
      id: 'AGT002',
      name: 'Amit Singh',
      email: 'amit.singh@company.com',
      phone: '+91-9876543221',
      role: 'Lead Agent',
      specialization: 'Business Insurance',
      activeLeads: 38,
      convertedThisMonth: 8,
      conversionRate: 12.7,
      avgResponseTime: 2.1,
      performance: 'good',
      avatar: null
    },
    {
      id: 'AGT003',
      name: 'Neha Gupta',
      email: 'neha.gupta@company.com',
      phone: '+91-9876543222',
      role: 'Junior Lead Agent',
      specialization: 'Life Insurance',
      activeLeads: 32,
      convertedThisMonth: 5,
      conversionRate: 8.9,
      avgResponseTime: 3.2,
      performance: 'average',
      avatar: null
    }
  ]);

  // Lead Sources Performance
  const [sourcePerformance] = useState([
    { source: 'Website', leads: 1245, converted: 156, rate: 12.5, cost: 45.67 },
    { source: 'Referral', leads: 678, converted: 98, rate: 14.5, cost: 23.45 },
    { source: 'Social Media', leads: 456, converted: 34, rate: 7.5, cost: 67.89 },
    { source: 'Cold Calling', leads: 234, converted: 28, rate: 12.0, cost: 89.12 },
    { source: 'Email Campaign', leads: 189, converted: 15, rate: 7.9, cost: 34.56 },
    { source: 'Events', leads: 45, converted: 8, rate: 17.8, cost: 125.00 }
  ]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'primary',
      contacted: 'info',
      qualified: 'warning',
      converted: 'success',
      lost: 'error',
      'follow-up': 'secondary'
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'info'
    };
    return colors[priority] || 'default';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getSourceColor = (source) => {
    const colors = {
      'Website': 'primary',
      'Social Media': 'secondary',
      'Referral': 'success',
      'Cold Call': 'warning',
      'Email Campaign': 'info'
    };
    return colors[source] || 'default';
  };

  const handleLeadCreate = () => {
    setLeadDialog({
      open: true,
      mode: 'create',
      data: {
        name: '',
        email: '',
        phone: '',
        company: '',
        designation: '',
        source: 'website',
        priority: 'medium',
        policyInterest: '',
        estimatedValue: 0,
        notes: '',
        assignedTo: ''
      }
    });
  };

  const handleLeadEdit = (lead) => {
    setLeadDialog({
      open: true,
      mode: 'edit',
      data: { ...lead }
    });
  };

  const handleLeadFieldUpdate = (leadId, field, value) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId 
          ? { ...lead, [field]: value }
          : lead
      )
    );
    
    // Add visual feedback
    // Field updated for lead
    
    // Show success notification (you can integrate with your notification system)
    // Field updated successfully
    
    // Here you would typically make an API call to update the lead
    // Example: 
    // try {
    //   await updateLeadField(leadId, field, value);
    //   showNotification(`${fieldLabel} updated successfully`, 'success');
    // } catch (error) {
    //   showNotification(`Failed to update ${fieldLabel}`, 'error');
    //   // Revert the change
    //   setLeads(prevLeads => prevLeads.map(lead => 
    //     lead.id === leadId ? { ...lead, [field]: originalValue } : lead
    //   ));
    // }
  };

  const handleAddNote = () => {
    setAddNoteDialog({ 
      open: true, 
      note: '', 
      type: 'note',
      changeStatus: false,
      newStatus: leadProfileDialog.lead?.status || '',
      setFollowUp: false,
      followUpDate: null,
      followUpTime: '09:00'
    });
  };

  const handleSaveNote = () => {
    if (!addNoteDialog.note.trim()) return;

    const newInteraction = {
      type: addNoteDialog.type,
      date: new Date().toISOString(),
      message: addNoteDialog.note,
      addedBy: 'Current User' // In real app, get from auth context
    };

    // Update the lead's contact history and other fields
    if (leadProfileDialog.lead) {
      const updatedLead = {
        ...leadProfileDialog.lead,
        contactHistory: [newInteraction, ...(leadProfileDialog.lead.contactHistory || [])]
      };

      // Update status if requested
      if (addNoteDialog.changeStatus && addNoteDialog.newStatus) {
        updatedLead.status = addNoteDialog.newStatus;
        
        // Add status change to interaction history
        const statusChangeInteraction = {
          type: 'status-change',
          date: new Date().toISOString(),
          message: `Status changed from ${leadProfileDialog.lead.status} to ${addNoteDialog.newStatus}`,
          addedBy: 'Current User',
          oldStatus: leadProfileDialog.lead.status,
          newStatus: addNoteDialog.newStatus
        };
        updatedLead.contactHistory = [statusChangeInteraction, ...updatedLead.contactHistory];
      }

      // Set follow-up date if requested
      if (addNoteDialog.setFollowUp && addNoteDialog.followUpDate) {
        const followUpDateTime = new Date(addNoteDialog.followUpDate);
        const [hours, minutes] = addNoteDialog.followUpTime.split(':');
        followUpDateTime.setHours(parseInt(hours), parseInt(minutes));
        
        updatedLead.nextFollowUp = followUpDateTime.toISOString();
        
        // Add follow-up scheduled to interaction history
        const followUpInteraction = {
          type: 'follow-up-scheduled',
          date: new Date().toISOString(),
          message: `Follow-up scheduled for ${followUpDateTime.toLocaleString()}`,
          addedBy: 'Current User',
          scheduledFor: followUpDateTime.toISOString()
        };
        updatedLead.contactHistory = [followUpInteraction, ...updatedLead.contactHistory];
      }

      // Update the lead in the main leads array
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadProfileDialog.lead.id 
            ? updatedLead
            : lead
        )
      );

      // Update the dialog with the new lead data
      setLeadProfileDialog(prev => ({
        ...prev,
        lead: updatedLead
      }));
    }

    // Close the add note dialog
    setAddNoteDialog({ 
      open: false, 
      note: '', 
      type: 'note',
      changeStatus: false,
      newStatus: '',
      setFollowUp: false,
      followUpDate: null,
      followUpTime: ''
    });
    
    // Note added successfully
    // Status changed if requested
    // Follow-up scheduled if requested
  };

  // Drag and Drop handlers
  const handleDragStart = (e, lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.dataTransfer.setDragImage(e.target, 0, 0);
  };

  const handleDragOver = (e, stage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverStage(null);
  };

  const handleDrop = (e, newStage) => {
    e.preventDefault();
    setDragOverStage(null);
    
    if (draggedLead && draggedLead.status !== newStage) {
      // Update the lead's status
      const updatedLead = {
        ...draggedLead,
        status: newStage
      };

      // Update in the main leads array
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === draggedLead.id ? updatedLead : lead
        )
      );

      // Add status change to interaction history
      const statusChangeInteraction = {
        type: 'status-change',
        date: new Date().toISOString(),
        message: `Status changed from ${draggedLead.status} to ${newStage} via pipeline drag & drop`,
        addedBy: 'Current User',
        oldStatus: draggedLead.status,
        newStatus: newStage
      };

      // Update the lead with the new interaction
      const finalUpdatedLead = {
        ...updatedLead,
        contactHistory: [statusChangeInteraction, ...(updatedLead.contactHistory || [])]
      };

      // Update leads array with interaction history
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === draggedLead.id ? finalUpdatedLead : lead
        )
      );

      // Update profile dialog if it's open for this lead
      if (leadProfileDialog.open && leadProfileDialog.lead?.id === draggedLead.id) {
        setLeadProfileDialog(prev => ({
          ...prev,
          lead: finalUpdatedLead
        }));
      }

      // Lead moved successfully
    }
    
    setDraggedLead(null);
  };

  const handleDragEnd = () => {
    setDraggedLead(null);
    setDragOverStage(null);
  };

  // Get leads for a specific stage
  const getLeadsForStage = (stage) => {
    return leads.filter(lead => lead.status === stage);
  };

  // Get stage-specific lead count
  const getStageCount = (stage) => {
    return getLeadsForStage(stage).length;
  };

  const handleLeadSave = () => {
    if (leadDialog.mode === 'create') {
      const newLead = {
        ...leadDialog.data,
        id: `LD${String(leads.length + 1).padStart(3, '0')}`,
        status: 'new',
        score: Math.floor(Math.random() * 40) + 40, // Random score between 40-80
        createdAt: new Date().toISOString(),
        contactHistory: [],
        tags: []
      };
      setLeads(prev => [newLead, ...prev]);
    } else {
      setLeads(prev => prev.map(lead => 
        lead.id === leadDialog.data.id ? leadDialog.data : lead
      ));
    }
    setLeadDialog({ open: false, mode: 'create', data: {} });
  };

  const handleBulkAssignment = () => {
    if (selectedLeads.length === 0) return;
    setAssignmentDialog({ open: true, leads: selectedLeads, agent: null });
  };

  const handleAssignmentSave = () => {
    if (!assignmentDialog.agent) return;
    
    setLeads(prev => prev.map(lead => 
      selectedLeads.includes(lead.id) 
        ? { ...lead, assignedTo: assignmentDialog.agent.name, assignedToId: assignmentDialog.agent.id }
        : lead
    ));
    
    setSelectedLeads([]);
    setAssignmentDialog({ open: false, leads: [], agent: null });
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source.toLowerCase() === sourceFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    const matchesAssignee = assignedToFilter === 'all' || lead.assignedToId === assignedToFilter;
    
    return matchesSearch && matchesStatus && matchesSource && matchesPriority && matchesAssignee;
  });

  const StatCard = ({ title, value, subtitle, icon, color, trend }) => (
    <Grow in={loaded} timeout={600}>
      <Card 
        elevation={0}
        sx={{ 
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" fontWeight="700" color={`${color}.main`}>
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Avatar sx={{ bgcolor: alpha(theme.palette[color].main, 0.1), width: 56, height: 56 }}>
              {React.cloneElement(icon, { sx: { color: `${color}.main`, fontSize: 28 } })}
            </Avatar>
          </Box>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5, fontSize: 16 }} />
              <Typography variant="body2" color="success.main" fontWeight="600">
                +{trend}% from last month
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grow>
  );

  const LeadCard = ({ lead }) => (
    <Card 
      elevation={0}
      sx={{ 
        borderRadius: 3,
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        },
        border: selectedLeads.includes(lead.id) ? `2px solid ${theme.palette.primary.main}` : '1px solid transparent'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
              {lead.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="600">
                {lead.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {lead.designation} at {lead.company}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={lead.status} 
              size="small" 
              color={getStatusColor(lead.status)}
              variant="outlined"
            />
                              <IconButton size="small" onClick={(e) => e.preventDefault()}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">{lead.email}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">{lead.phone}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOnIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">{lead.location}</Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Lead Score</Typography>
            <Typography variant="body2" fontWeight="600" color={`${getScoreColor(lead.score)}.main`}>
              {lead.score}/100
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={lead.score} 
            color={getScoreColor(lead.score)}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">Priority</Typography>
            <Chip 
              label={lead.priority} 
              size="small" 
              color={getPriorityColor(lead.priority)}
              sx={{ mt: 0.5 }}
            />
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">Est. Value</Typography>
            <Typography variant="body2" fontWeight="600" color="primary.main">
              ₹{lead.estimatedValue.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Assigned to: <strong>{lead.assignedTo}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Source: {lead.source}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {lead.tags.map((tag, index) => (
            <Chip key={index} label={tag} size="small" variant="outlined" />
          ))}
        </Box>

                              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Button 
                          size="small" 
                          startIcon={<PhoneIcon />}
                          variant="outlined"
                          sx={{ flex: 1 }}
                        >
                          Call
                        </Button>
                        <Button 
                          size="small" 
                          startIcon={<EmailIcon />}
                          variant="outlined"
                          sx={{ flex: 1 }}
                        >
                          Email
                        </Button>
                        <Button 
                          size="small" 
                          startIcon={<WhatsAppIcon />}
                          variant="outlined"
                          color="success"
                          sx={{ flex: 1 }}
                        >
                          WhatsApp
                        </Button>
                      </Box>
                      
                      <Button 
                        size="small" 
                        variant="contained"
                        startIcon={<VisibilityIcon />}
                        fullWidth
                        onClick={() => setLeadProfileDialog({ open: true, lead })}
                      >
                        View Profile
                      </Button>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Fade in={loaded} timeout={800}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight="700" gutterBottom>
                
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage leads, track performance, and optimize conversion rates
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {/* View Toggle */}
              <Box sx={{ display: 'flex', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => setViewMode('list')}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                  sx={{ borderRadius: 0 }}
                >
                  <ViewListIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setViewMode('cards')}
                  color={viewMode === 'cards' ? 'primary' : 'default'}
                  sx={{ borderRadius: 0 }}
                >
                  <ViewModuleIcon />
                </IconButton>
              </Box>
              
              <Button
                variant="outlined"
                startIcon={<SettingsIcon />}
                onClick={() => window.location.href = '/lms-settings'}
              >
                Settings
              </Button>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={() => {}}
              >
                Import Leads
              </Button>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={handleLeadCreate}
                sx={{ borderRadius: 2 }}
              >
                Add Lead
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>

      {/* Quick Actions Bar */}
      <Grow in={loaded} timeout={1200}>
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
            mb: 3
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="600">
                Quick Actions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Today's Activities
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<PersonAddIcon />}
                  onClick={handleLeadCreate}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Add New Lead
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<MessageIcon />}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Bulk Message ({quickActions.scheduledMessages})
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<PhoneIcon />}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Schedule Call ({quickActions.todaysCalls})
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ScheduleIcon />}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Follow-ups ({quickActions.pendingFollowUps})
                </Button>
              </Grid>
            </Grid>
            
            {/* Notifications */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
                Recent Notifications
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {notifications.slice(0, 3).map((notification) => (
                  <Alert 
                    key={notification.id}
                    severity={notification.priority === 'high' ? 'warning' : 'info'}
                    sx={{ 
                      flex: '1 1 300px',
                      minWidth: 300,
                      '& .MuiAlert-message': {
                        width: '100%'
                      }
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight="600">
                        {notification.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {notification.message} • {notification.time}
                      </Typography>
                    </Box>
                  </Alert>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grow>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Leads"
            value={leadStats.totalLeads.toLocaleString()}
            subtitle="All time"
            icon={<PeopleIcon />}
            color="primary"
            trend={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New Leads"
            value={leadStats.newLeads}
            subtitle="This month"
            icon={<PersonAddIcon />}
            color="info"
            trend={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Qualified Leads"
            value={leadStats.qualifiedLeads}
            subtitle="Ready for conversion"
            icon={<StarIcon />}
            color="warning"
            trend={15}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Conversion Rate"
            value={`${leadStats.conversionRate}%`}
            subtitle="Last 30 days"
            icon={<TrendingUpIcon />}
            color="success"
            trend={5}
          />
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Grow in={loaded} timeout={1000}>
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
            overflow: 'visible'
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                aria-label="lead management tabs"
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 120,
                    px: 3
                  }
                }}
              >
                <Tab icon={<PeopleIcon />} label="All Leads" />
                <Tab icon={<MessageIcon />} label="Messaging" />
                <Tab icon={<WhatsAppIcon />} label="WhatsApp" />
                <Tab icon={<PhoneIcon />} label="Calling" />
                <Tab icon={<TimelineIcon />} label="Pipeline" />
                <Tab icon={<AssessmentIcon />} label="Analytics" />
                <Tab icon={<AssignmentIcon />} label="Tasks" />
              </Tabs>
            </Box>

            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                {/* Filters and Search */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="600">
                      
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<FilterListIcon />}
                        onClick={() => setFilterExpanded(!filterExpanded)}
                        endIcon={filterExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      >
                        Filters
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={() => {}}
                      >
                        Refresh
                      </Button>
                      {selectedLeads.length > 0 && (
                        <Button
                          variant="contained"
                          startIcon={<AssignmentIcon />}
                          onClick={handleBulkAssignment}
                        >
                          Assign ({selectedLeads.length})
                        </Button>
                      )}
                    </Box>
                  </Box>

                  <Collapse in={filterExpanded}>
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'background.default' }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                              value={statusFilter}
                              onChange={(e) => setStatusFilter(e.target.value)}
                              label="Status"
                            >
                              <MenuItem value="all">All Status</MenuItem>
                              <MenuItem value="new">New</MenuItem>
                              <MenuItem value="contacted">Contacted</MenuItem>
                              <MenuItem value="qualified">Qualified</MenuItem>
                              <MenuItem value="converted">Converted</MenuItem>
                              <MenuItem value="lost">Lost</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <FormControl fullWidth>
                            <InputLabel>Source</InputLabel>
                            <Select
                              value={sourceFilter}
                              onChange={(e) => setSourceFilter(e.target.value)}
                              label="Source"
                            >
                              <MenuItem value="all">All Sources</MenuItem>
                              <MenuItem value="website">Website</MenuItem>
                              <MenuItem value="referral">Referral</MenuItem>
                              <MenuItem value="social media">Social Media</MenuItem>
                              <MenuItem value="cold calling">Cold Calling</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <FormControl fullWidth>
                            <InputLabel>Priority</InputLabel>
                            <Select
                              value={priorityFilter}
                              onChange={(e) => setPriorityFilter(e.target.value)}
                              label="Priority"
                            >
                              <MenuItem value="all">All Priorities</MenuItem>
                              <MenuItem value="high">High</MenuItem>
                              <MenuItem value="medium">Medium</MenuItem>
                              <MenuItem value="low">Low</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <FormControl fullWidth>
                            <InputLabel>Assigned To</InputLabel>
                            <Select
                              value={assignedToFilter}
                              onChange={(e) => setAssignedToFilter(e.target.value)}
                              label="Assigned To"
                            >
                              <MenuItem value="all">All Agents</MenuItem>
                              {agents.map((agent) => (
                                <MenuItem key={agent.id} value={agent.id}>
                                  {agent.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Collapse>
                </Box>

                {/* Leads Display */}
                {viewMode === 'list' ? (
                  <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={selectedLeads.length > 0 && selectedLeads.length < filteredLeads.length}
                            checked={filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedLeads(filteredLeads.map(lead => lead.id));
                              } else {
                                setSelectedLeads([]);
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>Lead</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Source</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Assigned To</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Last Contact</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredLeads.map((lead) => (
                        <TableRow key={lead.id} hover>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedLeads.includes(lead.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLeads([...selectedLeads, lead.id]);
                                } else {
                                  setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 40, height: 40 }}>
                                {lead.name.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="600">
                                  {lead.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {lead.designation} at {lead.company}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <EmailIcon sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                                {lead.email}
                              </Typography>
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                <PhoneIcon sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                                {lead.phone}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <Select
                                value={lead.source}
                                onChange={(e) => handleLeadFieldUpdate(lead.id, 'source', e.target.value)}
                                variant="outlined"
                                sx={{ 
                                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                  '& .MuiSelect-select': { 
                                    py: 0.5,
                                    borderRadius: 1,
                                    transition: 'background-color 0.2s',
                                    color: getSourceColor(lead.source) === 'primary' ? 'primary.main' :
                                           getSourceColor(lead.source) === 'success' ? 'success.main' :
                                           getSourceColor(lead.source) === 'warning' ? 'warning.main' :
                                           getSourceColor(lead.source) === 'info' ? 'info.main' : 'text.primary'
                                  },
                                  '&:hover .MuiSelect-select': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.04)
                                  }
                                }}
                              >
                                <MenuItem value="Website">Website</MenuItem>
                                <MenuItem value="Social Media">Social Media</MenuItem>
                                <MenuItem value="Referral">Referral</MenuItem>
                                <MenuItem value="Cold Call">Cold Call</MenuItem>
                                <MenuItem value="Email Campaign">Email Campaign</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <FormControl size="small" sx={{ minWidth: 100 }}>
                              <Select
                                value={lead.status}
                                onChange={(e) => handleLeadFieldUpdate(lead.id, 'status', e.target.value)}
                                variant="outlined"
                                sx={{ 
                                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                  '& .MuiSelect-select': { 
                                    py: 0.5,
                                    borderRadius: 1,
                                    transition: 'background-color 0.2s',
                                    color: getStatusColor(lead.status) === 'success' ? 'success.main' :
                                           getStatusColor(lead.status) === 'warning' ? 'warning.main' :
                                           getStatusColor(lead.status) === 'info' ? 'info.main' :
                                           getStatusColor(lead.status) === 'error' ? 'error.main' : 'text.primary'
                                  },
                                  '&:hover .MuiSelect-select': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.04)
                                  }
                                }}
                              >
                                <MenuItem value="New">New</MenuItem>
                                <MenuItem value="Contacted">Contacted</MenuItem>
                                <MenuItem value="Qualified">Qualified</MenuItem>
                                <MenuItem value="Proposal">Proposal</MenuItem>
                                <MenuItem value="Negotiation">Negotiation</MenuItem>
                                <MenuItem value="Closed">Closed</MenuItem>
                                <MenuItem value="Lost">Lost</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" fontWeight="600" sx={{ mr: 1 }}>
                                {lead.score}
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={lead.score} 
                                sx={{ 
                                  width: 60, 
                                  height: 6, 
                                  borderRadius: 3,
                                  bgcolor: alpha(theme.palette.grey[300], 0.3),
                                  '& .MuiLinearProgress-bar': {
                                    borderRadius: 3,
                                    bgcolor: getScoreColor(lead.score) === 'success' ? theme.palette.success.main :
                                             getScoreColor(lead.score) === 'warning' ? theme.palette.warning.main :
                                             theme.palette.error.main
                                  }
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <FormControl size="small" sx={{ minWidth: 90 }}>
                              <Select
                                value={lead.priority}
                                onChange={(e) => handleLeadFieldUpdate(lead.id, 'priority', e.target.value)}
                                variant="outlined"
                                sx={{ 
                                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                  '& .MuiSelect-select': { 
                                    py: 0.5,
                                    borderRadius: 1,
                                    transition: 'background-color 0.2s',
                                    color: getPriorityColor(lead.priority) === 'error' ? 'error.main' :
                                           getPriorityColor(lead.priority) === 'warning' ? 'warning.main' :
                                           getPriorityColor(lead.priority) === 'info' ? 'info.main' : 'text.primary'
                                  },
                                  '&:hover .MuiSelect-select': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.04)
                                  }
                                }}
                              >
                                <MenuItem value="high">High</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="low">Low</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {lead.assignedTo}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="600" color="primary.main">
                              ₹{lead.estimatedValue?.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {lead.lastContact ? new Date(lead.lastContact).toLocaleDateString() : 'Never'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="View Profile">
                                <IconButton 
                                  size="small"
                                  onClick={() => setLeadProfileDialog({ open: true, lead })}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Lead">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleLeadEdit(lead)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Call">
                                <IconButton size="small" color="primary">
                                  <PhoneIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="WhatsApp">
                                <IconButton size="small" color="success">
                                  <WhatsAppIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </TableContainer>
                ) : (
                  <Grid container spacing={3}>
                    {filteredLeads.map((lead) => (
                      <Grid item xs={12} md={6} lg={4} key={lead.id}>
                        <LeadCard lead={lead} />
                      </Grid>
                    ))}
                  </Grid>
                )}

                {filteredLeads.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No leads found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your filters or add new leads
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Lead Analytics & Performance
                </Typography>
                
                {/* Performance Metrics */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Conversion Funnel</Typography>
                        <Box sx={{ mt: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Total Leads</Typography>
                            <Typography variant="body2" fontWeight="600">2,847</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={100} sx={{ mb: 2, height: 8, borderRadius: 4 }} />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Contacted</Typography>
                            <Typography variant="body2" fontWeight="600">1,823 (64%)</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={64} color="info" sx={{ mb: 2, height: 8, borderRadius: 4 }} />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Qualified</Typography>
                            <Typography variant="body2" fontWeight="600">892 (31%)</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={31} color="warning" sx={{ mb: 2, height: 8, borderRadius: 4 }} />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Converted</Typography>
                            <Typography variant="body2" fontWeight="600">234 (8.2%)</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={8.2} color="success" sx={{ height: 8, borderRadius: 4 }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Lead Quality Distribution</Typography>
                        <Box sx={{ mt: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ width: 12, height: 12, bgcolor: 'error.main', borderRadius: '50%', mr: 1 }} />
                              <Typography variant="body2">Hot Leads</Typography>
                            </Box>
                            <Typography variant="body2" fontWeight="600">{leadStats.hotLeads}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ width: 12, height: 12, bgcolor: 'warning.main', borderRadius: '50%', mr: 1 }} />
                              <Typography variant="body2">Warm Leads</Typography>
                            </Box>
                            <Typography variant="body2" fontWeight="600">{leadStats.warmLeads}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ width: 12, height: 12, bgcolor: 'info.main', borderRadius: '50%', mr: 1 }} />
                              <Typography variant="body2">Cold Leads</Typography>
                            </Box>
                            <Typography variant="body2" fontWeight="600">{leadStats.coldLeads}</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeTab === 2 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Team Performance
                </Typography>
                
                <Grid container spacing={3}>
                  {agents.map((agent) => (
                    <Grid item xs={12} md={6} lg={4} key={agent.id}>
                      <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                              {agent.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight="600">
                                {agent.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {agent.role}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">Specialization</Typography>
                            <Typography variant="body2" fontWeight="600">{agent.specialization}</Typography>
                          </Box>
                          
                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">Active Leads</Typography>
                              <Typography variant="h6" color="primary.main">{agent.activeLeads}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">Converted</Typography>
                              <Typography variant="h6" color="success.main">{agent.convertedThisMonth}</Typography>
                            </Grid>
                          </Grid>
                          
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Conversion Rate</Typography>
                              <Typography variant="body2" fontWeight="600">{agent.conversionRate}%</Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={agent.conversionRate} 
                              color="success"
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                              Avg Response: {agent.avgResponseTime}h
                            </Typography>
                            <Chip 
                              label={agent.performance} 
                              size="small" 
                              color={agent.performance === 'excellent' ? 'success' : 
                                     agent.performance === 'good' ? 'info' : 'warning'}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {activeTab === 3 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Lead Source Performance
                </Typography>
                
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><Typography fontWeight="600">Source</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Total Leads</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Converted</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Conversion Rate</Typography></TableCell>
                        <TableCell align="right"><Typography fontWeight="600">Cost per Lead</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Performance</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sourcePerformance.map((source) => (
                        <TableRow key={source.source}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="600">
                              {source.source}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">
                              {source.leads.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" color="success.main" fontWeight="600">
                              {source.converted}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography variant="body2" fontWeight="600" sx={{ mr: 1 }}>
                                {source.rate}%
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={source.rate} 
                                sx={{ width: 60, height: 4, borderRadius: 2 }}
                                color={source.rate > 12 ? 'success' : source.rate > 8 ? 'warning' : 'error'}
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="600">
                              ₹{source.cost.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={source.rate > 12 ? 'Excellent' : source.rate > 8 ? 'Good' : 'Needs Improvement'}
                              size="small"
                              color={source.rate > 12 ? 'success' : source.rate > 8 ? 'info' : 'warning'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Bulk Messaging Interface
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Create Bulk Message</Typography>
                        
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Select Recipients
                          </Typography>
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Recipient Group</InputLabel>
                            <Select defaultValue="all" label="Recipient Group">
                              <MenuItem value="all">All Leads ({leads.length})</MenuItem>
                              <MenuItem value="new">New Leads (156)</MenuItem>
                              <MenuItem value="qualified">Qualified Leads (892)</MenuItem>
                              <MenuItem value="hot">Hot Leads (67)</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Message Type
                          </Typography>
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Message Type</InputLabel>
                            <Select defaultValue="email" label="Message Type">
                              <MenuItem value="email">Email</MenuItem>
                              <MenuItem value="sms">SMS</MenuItem>
                              <MenuItem value="whatsapp">WhatsApp</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        
                        <Box sx={{ mb: 3 }}>
                          <TextField
                            fullWidth
                            label="Subject"
                            placeholder="Enter message subject"
                            sx={{ mb: 2 }}
                          />
                          <TextField
                            fullWidth
                            multiline
                            rows={6}
                            label="Message Content"
                            placeholder="Enter your message content here..."
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button variant="contained" startIcon={<SendIcon />}>
                            Send Now
                          </Button>
                          <Button variant="outlined" startIcon={<ScheduleIcon />}>
                            Schedule
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Message History</Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" fontWeight="600">Recent Campaigns</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Policy Renewal Reminder
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Sent to 1,245 leads • 2 hours ago
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" fontWeight="600">Follow-up Messages</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Welcome Series - Day 1
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Sent to 89 leads • Yesterday
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeTab === 2 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  WhatsApp Management
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', height: 500 }}>
                      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom>Chat Inbox</Typography>
                        
                        <Box sx={{ flex: 1, bgcolor: 'background.default', borderRadius: 2, p: 2, mb: 2 }}>
                          <Box sx={{ textAlign: 'center', py: 8 }}>
                            <WhatsAppIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                              WhatsApp Integration Ready
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Connect your WhatsApp Business API to start chatting with leads
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <TextField 
                            fullWidth 
                            placeholder="Type a message..." 
                            size="small"
                          />
                          <Button variant="contained" color="success">
                            Send
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Quick Templates</Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Button variant="outlined" fullWidth sx={{ mb: 1, textAlign: 'left', justifyContent: 'flex-start' }}>
                            Welcome Message
                          </Button>
                          <Button variant="outlined" fullWidth sx={{ mb: 1, textAlign: 'left', justifyContent: 'flex-start' }}>
                            Follow-up Reminder
                          </Button>
                          <Button variant="outlined" fullWidth sx={{ mb: 1, textAlign: 'left', justifyContent: 'flex-start' }}>
                            Policy Information
                          </Button>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="subtitle2" gutterBottom>Automation Settings</Typography>
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label="Auto-reply to new messages"
                        />
                        <FormControlLabel
                          control={<Switch />}
                          label="Send welcome message"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeTab === 3 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Calling Interface
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Dialer & Call Queue</Typography>
                        
                        <Box sx={{ mb: 3 }}>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            placeholder="+91-9876543210"
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><PhoneIcon /></InputAdornment>,
                            }}
                            sx={{ mb: 2 }}
                          />
                          <Button variant="contained" startIcon={<CallMadeIcon />} sx={{ mr: 2 }}>
                            Make Call
                          </Button>
                          <Button variant="outlined">
                            Add to Queue
                          </Button>
                        </Box>
                        
                        <Typography variant="subtitle1" gutterBottom>Today's Call Queue</Typography>
                        <TableContainer component={Paper} elevation={0}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Lead Name</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Scheduled</TableCell>
                                <TableCell>Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>Rajesh Kumar</TableCell>
                                <TableCell>+91-9876543210</TableCell>
                                <TableCell>2:00 PM</TableCell>
                                <TableCell>
                                  <IconButton size="small" color="primary">
                                    <PhoneIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Priya Patel</TableCell>
                                <TableCell>+91-9876543211</TableCell>
                                <TableCell>3:30 PM</TableCell>
                                <TableCell>
                                  <IconButton size="small" color="primary">
                                    <PhoneIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Call Statistics</Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">Today's Calls</Typography>
                          <Typography variant="h4" color="primary.main">12</Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">Average Duration</Typography>
                          <Typography variant="h6">8:45 min</Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">Success Rate</Typography>
                          <Typography variant="h6" color="success.main">78%</Typography>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="subtitle2" gutterBottom>Recent Call Logs</Typography>
                        <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Rajesh Kumar</strong> • 12:30 PM<br />
                            <Typography variant="caption" color="success.main">Completed • 15:30 min</Typography>
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Priya Patel</strong> • 11:45 AM<br />
                            <Typography variant="caption" color="error.main">Missed • No answer</Typography>
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeTab === 4 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Sales Pipeline
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Alert severity="info">
                    Drag and drop leads between pipeline stages to update their status
                  </Alert>
                </Box>
                
                <Grid container spacing={2}>
                  {['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed'].map((stage) => (
                    <Grid item xs={12} md={2} key={stage}>
                      <Card 
                        elevation={0} 
                        sx={{ 
                          borderRadius: 2, 
                          border: '2px solid', 
                          borderColor: dragOverStage === stage ? 'primary.main' : 'divider',
                          minHeight: 400,
                          bgcolor: dragOverStage === stage ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        onDragOver={(e) => handleDragOver(e, stage)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, stage)}
                      >
                        <CardContent>
                          <Typography variant="h6" gutterBottom textAlign="center">
                            {stage}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
                            {getStageCount(stage)} leads
                          </Typography>
                          
                          <Box sx={{ minHeight: 300, overflow: 'auto' }}>
                            {getLeadsForStage(stage).map((lead) => (
                              <Paper 
                                key={lead.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, lead)}
                                onDragEnd={handleDragEnd}
                                sx={{ 
                                  p: 2, 
                                  mb: 1, 
                                  cursor: 'grab',
                                  '&:hover': { 
                                    bgcolor: 'action.hover',
                                    transform: 'translateY(-1px)',
                                    boxShadow: 2
                                  },
                                  '&:active': { cursor: 'grabbing' },
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  transition: 'all 0.2s ease-in-out',
                                  opacity: draggedLead?.id === lead.id ? 0.5 : 1,
                                  border: draggedLead?.id === lead.id ? '2px dashed' : '1px solid transparent',
                                  borderColor: draggedLead?.id === lead.id ? 'primary.main' : 'transparent'
                                }}
                                onClick={() => setLeadProfileDialog({ open: true, lead })}
                              >
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
                                    {lead.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    {lead.designation} at {lead.company}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                    <Chip 
                                      label={lead.priority} 
                                      size="small" 
                                      color={getPriorityColor(lead.priority)}
                                      sx={{ height: 16, fontSize: '0.7rem' }}
                                    />
                                  </Box>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                  <Typography variant="caption" color="primary.main" fontWeight="600" display="block">
                                    ₹{lead.estimatedValue?.toLocaleString()}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    Score: {lead.score}
                                  </Typography>
                                  <IconButton 
                                    size="small" 
                                    sx={{ mt: 0.5 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setLeadProfileDialog({ open: true, lead });
                                    }}
                                  >
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Paper>
                            ))}
                            
                            {getLeadsForStage(stage).length === 0 && (
                              <Box sx={{ 
                                textAlign: 'center', 
                                py: 4, 
                                color: 'text.secondary',
                                border: '2px dashed',
                                borderColor: dragOverStage === stage ? 'primary.main' : 'divider',
                                borderRadius: 2,
                                bgcolor: dragOverStage === stage ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                                transition: 'all 0.2s ease-in-out'
                              }}>
                                <Typography variant="body2">
                                  {dragOverStage === stage ? 'Drop lead here' : 'No leads in this stage'}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {activeTab === 5 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Enhanced Analytics & Reports
                </Typography>
                
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Conversion Funnel</Typography>
                        <Box sx={{ mt: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Total Leads</Typography>
                            <Typography variant="body2" fontWeight="600">2,847</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={100} sx={{ mb: 2, height: 8, borderRadius: 4 }} />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Contacted</Typography>
                            <Typography variant="body2" fontWeight="600">1,823 (64%)</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={64} color="info" sx={{ mb: 2, height: 8, borderRadius: 4 }} />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Qualified</Typography>
                            <Typography variant="body2" fontWeight="600">892 (31%)</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={31} color="warning" sx={{ mb: 2, height: 8, borderRadius: 4 }} />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Converted</Typography>
                            <Typography variant="body2" fontWeight="600">234 (8.2%)</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={8.2} color="success" sx={{ height: 8, borderRadius: 4 }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Campaign Performance</Typography>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Campaign</TableCell>
                                <TableCell>Sent</TableCell>
                                <TableCell>Response</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>Email Campaign</TableCell>
                                <TableCell>1,245</TableCell>
                                <TableCell>156 (12.5%)</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>SMS Campaign</TableCell>
                                <TableCell>892</TableCell>
                                <TableCell>78 (8.7%)</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>WhatsApp</TableCell>
                                <TableCell>456</TableCell>
                                <TableCell>89 (19.5%)</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeTab === 6 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Tasks & Calendar
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Today's Tasks</Typography>
                        
                        <Box sx={{ mb: 3 }}>
                          <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }}>
                            Add New Task
                          </Button>
                        </Box>
                        
                        <Box>
                          <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography variant="body2" fontWeight="600">Follow up with Rajesh Kumar</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Call scheduled for 2:00 PM • High Priority
                              </Typography>
                            </Box>
                            <Box>
                              <IconButton size="small" color="success">
                                <CheckCircleIcon />
                              </IconButton>
                              <IconButton size="small">
                                <EditIcon />
                              </IconButton>
                            </Box>
                          </Paper>
                          
                          <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography variant="body2" fontWeight="600">Send proposal to Priya Patel</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Due today • Medium Priority
                              </Typography>
                            </Box>
                            <Box>
                              <IconButton size="small" color="success">
                                <CheckCircleIcon />
                              </IconButton>
                              <IconButton size="small">
                                <EditIcon />
                              </IconButton>
                            </Box>
                          </Paper>
                          
                          <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography variant="body2" fontWeight="600">Update lead scores</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Weekly task • Low Priority
                              </Typography>
                            </Box>
                            <Box>
                              <IconButton size="small" color="success">
                                <CheckCircleIcon />
                              </IconButton>
                              <IconButton size="small">
                                <EditIcon />
                              </IconButton>
                            </Box>
                          </Paper>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Upcoming Activities</Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" fontWeight="600">Today</Typography>
                          <Typography variant="body2" color="text.secondary">
                            5 calls scheduled
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            3 follow-ups due
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" fontWeight="600">Tomorrow</Typography>
                          <Typography variant="body2" color="text.secondary">
                            8 calls scheduled
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            2 meetings planned
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" fontWeight="600">This Week</Typography>
                          <Typography variant="body2" color="text.secondary">
                            23 follow-ups pending
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            12 proposals to send
                          </Typography>
                        </Box>
                        
                        <Button variant="outlined" fullWidth>
                          View Full Calendar
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grow>

      {/* Create/Edit Lead Dialog */}
      <Dialog
        open={leadDialog.open}
        onClose={() => setLeadDialog({ open: false, mode: 'create', data: {} })}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            {leadDialog.mode === 'create' ? 'Add New Lead' : 'Edit Lead'}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={leadDialog.data.name || ''}
                onChange={(e) => setLeadDialog(prev => ({
                  ...prev,
                  data: { ...prev.data, name: e.target.value }
                }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={leadDialog.data.email || ''}
                onChange={(e) => setLeadDialog(prev => ({
                  ...prev,
                  data: { ...prev.data, email: e.target.value }
                }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={leadDialog.data.phone || ''}
                onChange={(e) => setLeadDialog(prev => ({
                  ...prev,
                  data: { ...prev.data, phone: e.target.value }
                }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                value={leadDialog.data.company || ''}
                onChange={(e) => setLeadDialog(prev => ({
                  ...prev,
                  data: { ...prev.data, company: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Designation"
                value={leadDialog.data.designation || ''}
                onChange={(e) => setLeadDialog(prev => ({
                  ...prev,
                  data: { ...prev.data, designation: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Source</InputLabel>
                <Select
                  value={leadDialog.data.source || 'website'}
                  onChange={(e) => setLeadDialog(prev => ({
                    ...prev,
                    data: { ...prev.data, source: e.target.value }
                  }))}
                  label="Source"
                >
                  <MenuItem value="website">Website</MenuItem>
                  <MenuItem value="referral">Referral</MenuItem>
                  <MenuItem value="social media">Social Media</MenuItem>
                  <MenuItem value="cold calling">Cold Calling</MenuItem>
                  <MenuItem value="email campaign">Email Campaign</MenuItem>
                  <MenuItem value="events">Events</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={leadDialog.data.priority || 'medium'}
                  onChange={(e) => setLeadDialog(prev => ({
                    ...prev,
                    data: { ...prev.data, priority: e.target.value }
                  }))}
                  label="Priority"
                >
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Policy Interest"
                value={leadDialog.data.policyInterest || ''}
                onChange={(e) => setLeadDialog(prev => ({
                  ...prev,
                  data: { ...prev.data, policyInterest: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estimated Value"
                type="number"
                value={leadDialog.data.estimatedValue || 0}
                onChange={(e) => setLeadDialog(prev => ({
                  ...prev,
                  data: { ...prev.data, estimatedValue: parseInt(e.target.value) || 0 }
                }))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Assign To</InputLabel>
                <Select
                  value={leadDialog.data.assignedToId || ''}
                  onChange={(e) => {
                    const agent = agents.find(a => a.id === e.target.value);
                    setLeadDialog(prev => ({
                      ...prev,
                      data: { 
                        ...prev.data, 
                        assignedToId: e.target.value,
                        assignedTo: agent ? agent.name : ''
                      }
                    }));
                  }}
                  label="Assign To"
                >
                  <MenuItem value="">Unassigned</MenuItem>
                  {agents.map((agent) => (
                    <MenuItem key={agent.id} value={agent.id}>
                      {agent.name} - {agent.specialization}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={leadDialog.data.notes || ''}
                onChange={(e) => setLeadDialog(prev => ({
                  ...prev,
                  data: { ...prev.data, notes: e.target.value }
                }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setLeadDialog({ open: false, mode: 'create', data: {} })}
            variant="outlined"
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLeadSave}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            {leadDialog.mode === 'create' ? 'Create Lead' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Assignment Dialog */}
      <Dialog
        open={assignmentDialog.open}
        onClose={() => setAssignmentDialog({ open: false, leads: [], agent: null })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            Assign Leads to Agent
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Assign {assignmentDialog.leads.length} selected leads to an agent
          </Typography>
          
          <FormControl fullWidth>
            <InputLabel>Select Agent</InputLabel>
            <Select
              value={assignmentDialog.agent?.id || ''}
              onChange={(e) => {
                const agent = agents.find(a => a.id === e.target.value);
                setAssignmentDialog(prev => ({ ...prev, agent }));
              }}
              label="Select Agent"
            >
              {agents.map((agent) => (
                <MenuItem key={agent.id} value={agent.id}>
                  <Box>
                    <Typography variant="body2" fontWeight="600">
                      {agent.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {agent.specialization} • {agent.activeLeads} active leads
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setAssignmentDialog({ open: false, leads: [], agent: null })}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignmentSave}
            variant="contained"
            disabled={!assignmentDialog.agent}
          >
            Assign Leads
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lead Profile Dialog */}
      <Dialog
        open={leadProfileDialog.open}
        onClose={() => setLeadProfileDialog({ open: false, lead: null })}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, maxHeight: '90vh' } }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                {leadProfileDialog.lead?.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="700">
                  {leadProfileDialog.lead?.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  {leadProfileDialog.lead?.designation} at {leadProfileDialog.lead?.company}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip 
                    label={`Score: ${leadProfileDialog.lead?.score}/100`} 
                    color={getScoreColor(leadProfileDialog.lead?.score)}
                    size="small"
                    icon={<StarIcon />}
                  />
                  <Chip 
                    label={`Created: ${new Date(leadProfileDialog.lead?.createdAt).toLocaleDateString()}`} 
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" color="primary.main" fontWeight="600">
                ₹{leadProfileDialog.lead?.estimatedValue?.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Estimated Value
              </Typography>
            </Box>
          </Box>
          
          {/* Editable Status Row */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
            <Typography variant="body2" fontWeight="600" sx={{ minWidth: 60 }}>
              Status:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={leadProfileDialog.lead?.status || ''}
                onChange={(e) => {
                  handleLeadFieldUpdate(leadProfileDialog.lead?.id, 'status', e.target.value);
                  setLeadProfileDialog(prev => ({
                    ...prev,
                    lead: { ...prev.lead, status: e.target.value }
                  }));
                }}
                variant="outlined"
                sx={{ 
                  '& .MuiSelect-select': { 
                    py: 0.5,
                    color: getStatusColor(leadProfileDialog.lead?.status) === 'success' ? 'success.main' :
                           getStatusColor(leadProfileDialog.lead?.status) === 'warning' ? 'warning.main' :
                           getStatusColor(leadProfileDialog.lead?.status) === 'info' ? 'info.main' :
                           getStatusColor(leadProfileDialog.lead?.status) === 'error' ? 'error.main' : 'text.primary'
                  }
                }}
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Contacted">Contacted</MenuItem>
                <MenuItem value="Qualified">Qualified</MenuItem>
                <MenuItem value="Proposal">Proposal</MenuItem>
                <MenuItem value="Negotiation">Negotiation</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
                <MenuItem value="Lost">Lost</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="body2" fontWeight="600" sx={{ minWidth: 60 }}>
              Priority:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 90 }}>
              <Select
                value={leadProfileDialog.lead?.priority || ''}
                onChange={(e) => {
                  handleLeadFieldUpdate(leadProfileDialog.lead?.id, 'priority', e.target.value);
                  setLeadProfileDialog(prev => ({
                    ...prev,
                    lead: { ...prev.lead, priority: e.target.value }
                  }));
                }}
                variant="outlined"
                sx={{ 
                  '& .MuiSelect-select': { 
                    py: 0.5,
                    color: getPriorityColor(leadProfileDialog.lead?.priority) === 'error' ? 'error.main' :
                           getPriorityColor(leadProfileDialog.lead?.priority) === 'warning' ? 'warning.main' :
                           getPriorityColor(leadProfileDialog.lead?.priority) === 'info' ? 'info.main' : 'text.primary'
                  }
                }}
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="body2" fontWeight="600" sx={{ minWidth: 60 }}>
              Source:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={leadProfileDialog.lead?.source || ''}
                onChange={(e) => {
                  handleLeadFieldUpdate(leadProfileDialog.lead?.id, 'source', e.target.value);
                  setLeadProfileDialog(prev => ({
                    ...prev,
                    lead: { ...prev.lead, source: e.target.value }
                  }));
                }}
                variant="outlined"
                sx={{ 
                  '& .MuiSelect-select': { 
                    py: 0.5,
                    color: getSourceColor(leadProfileDialog.lead?.source) === 'primary' ? 'primary.main' :
                           getSourceColor(leadProfileDialog.lead?.source) === 'success' ? 'success.main' :
                           getSourceColor(leadProfileDialog.lead?.source) === 'warning' ? 'warning.main' :
                           getSourceColor(leadProfileDialog.lead?.source) === 'info' ? 'info.main' : 'text.primary'
                  }
                }}
              >
                <MenuItem value="Website">Website</MenuItem>
                <MenuItem value="Social Media">Social Media</MenuItem>
                <MenuItem value="Referral">Referral</MenuItem>
                <MenuItem value="Cold Call">Cold Call</MenuItem>
                <MenuItem value="Email Campaign">Email Campaign</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 0 }}>
          <Grid container sx={{ height: '70vh' }}>
            {/* Left Panel - Lead Information */}
            <Grid item xs={12} md={4} sx={{ borderRight: '1px solid', borderColor: 'divider', p: 3 }}>
              {/* Contact Information Card */}
              <Card elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <ContactPhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Contact Information
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, p: 1, borderRadius: 1, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
                      <EmailIcon sx={{ mr: 2, color: 'info.main' }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary">Email</Typography>
                        <Typography variant="body2" fontWeight="600">{leadProfileDialog.lead?.email}</Typography>
                      </Box>
                      <IconButton size="small" color="info">
                        <EmailIcon />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, p: 1, borderRadius: 1, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                      <PhoneIcon sx={{ mr: 2, color: 'success.main' }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary">Phone</Typography>
                        <Typography variant="body2" fontWeight="600">{leadProfileDialog.lead?.phone}</Typography>
                      </Box>
                      <IconButton size="small" color="success">
                        <PhoneIcon />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 1, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                      <LocationOnIcon sx={{ mr: 2, color: 'warning.main' }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary">Location</Typography>
                        <Typography variant="body2" fontWeight="600">{leadProfileDialog.lead?.location}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              
              {/* Lead Performance Card */}
              <Card elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Lead Performance
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Lead Score</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={leadProfileDialog.lead?.score} 
                        sx={{ 
                          flex: 1, 
                          height: 8, 
                          borderRadius: 4,
                          mr: 2,
                          bgcolor: alpha(theme.palette.grey[300], 0.3),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            bgcolor: getScoreColor(leadProfileDialog.lead?.score) === 'success' ? theme.palette.success.main :
                                     getScoreColor(leadProfileDialog.lead?.score) === 'warning' ? theme.palette.warning.main :
                                     theme.palette.error.main
                          }
                        }}
                      />
                      <Typography variant="h6" fontWeight="600" color="primary.main">
                        {leadProfileDialog.lead?.score}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="primary.main" fontWeight="600">
                          ₹{leadProfileDialog.lead?.estimatedValue?.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Estimated Value
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="success.main" fontWeight="600">
                          {leadProfileDialog.lead?.contactHistory?.length || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Interactions
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              
              {/* Business Details Card */}
              <Card elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Business Details
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Policy Interest</Typography>
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 2 }}>
                      {leadProfileDialog.lead?.policyInterest}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">Assigned Agent</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'secondary.main' }}>
                        {leadProfileDialog.lead?.assignedTo?.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" fontWeight="600">
                        {leadProfileDialog.lead?.assignedTo}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">Last Contact</Typography>
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 2 }}>
                      {leadProfileDialog.lead?.lastContact ? 
                        new Date(leadProfileDialog.lead.lastContact).toLocaleDateString() : 
                        'Never contacted'
                      }
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">Next Follow-up</Typography>
                    <Typography 
                      variant="body2" 
                      fontWeight="600" 
                      color={leadProfileDialog.lead?.nextFollowUp ? 'success.main' : 'text.secondary'}
                    >
                      {leadProfileDialog.lead?.nextFollowUp ? 
                        new Date(leadProfileDialog.lead.nextFollowUp).toLocaleString() : 
                        'Not scheduled'
                      }
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              
              {/* Tags & Notes Card */}
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalOfferIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Tags & Notes
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>Tags</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {leadProfileDialog.lead?.tags?.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" color="primary" />
                    ))}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>Notes</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    bgcolor: alpha(theme.palette.grey[100], 0.5), 
                    p: 1.5, 
                    borderRadius: 1,
                    fontStyle: leadProfileDialog.lead?.notes ? 'normal' : 'italic'
                  }}>
                    {leadProfileDialog.lead?.notes || 'No notes available'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Center Panel - Interaction Timeline */}
            <Grid item xs={12} md={5} sx={{ borderRight: '1px solid', borderColor: 'divider', p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimelineIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Interaction Timeline
                </Typography>
                <Button 
                  size="small" 
                  startIcon={<AddIcon />} 
                  variant="contained" 
                  color="primary"
                  onClick={handleAddNote}
                >
                  Add Note
                </Button>
              </Box>
              
              {/* Timeline Stats */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Typography variant="h6" color="primary.main" fontWeight="600">
                    {leadProfileDialog.lead?.contactHistory?.filter(h => h.type === 'call').length || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Calls</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Typography variant="h6" color="info.main" fontWeight="600">
                    {leadProfileDialog.lead?.contactHistory?.filter(h => h.type === 'email').length || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Emails</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Typography variant="h6" color="success.main" fontWeight="600">
                    {leadProfileDialog.lead?.contactHistory?.filter(h => h.type === 'whatsapp').length || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">WhatsApp</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Typography variant="h6" color="warning.main" fontWeight="600">
                    {leadProfileDialog.lead?.contactHistory?.filter(h => ['note', 'meeting', 'follow-up'].includes(h.type)).length || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Notes</Typography>
                </Box>
              </Box>
              
              <Box sx={{ maxHeight: '50vh', overflow: 'auto', pr: 1 }}>
                {leadProfileDialog.lead?.contactHistory?.map((interaction, index) => (
                  <Card key={index} elevation={0} sx={{ 
                    mb: 2, 
                    border: '1px solid', 
                    borderColor: 'divider', 
                    borderRadius: 2,
                    borderLeft: `4px solid ${
                      interaction.type === 'call' ? theme.palette.primary.main :
                      interaction.type === 'email' ? theme.palette.info.main :
                      theme.palette.success.main
                    }`
                  }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {interaction.type === 'call' && <CallMadeIcon sx={{ mr: 1, color: 'primary.main' }} />}
                          {interaction.type === 'email' && <EmailIcon sx={{ mr: 1, color: 'info.main' }} />}
                          {interaction.type === 'whatsapp' && <WhatsAppIcon sx={{ mr: 1, color: 'success.main' }} />}
                          {interaction.type === 'note' && <NoteIcon sx={{ mr: 1, color: 'warning.main' }} />}
                          {interaction.type === 'meeting' && <EventIcon sx={{ mr: 1, color: 'secondary.main' }} />}
                          {interaction.type === 'follow-up' && <ScheduleIcon sx={{ mr: 1, color: 'info.main' }} />}
                          {interaction.type === 'status-change' && <SwapHorizIcon sx={{ mr: 1, color: 'primary.main' }} />}
                          {interaction.type === 'follow-up-scheduled' && <EventAvailableIcon sx={{ mr: 1, color: 'success.main' }} />}
                          <Typography variant="body2" fontWeight="600" textTransform="capitalize">
                            {interaction.type === 'follow-up' ? 'Follow-up' : 
                             interaction.type === 'status-change' ? 'Status Change' :
                             interaction.type === 'follow-up-scheduled' ? 'Follow-up Scheduled' :
                             interaction.type}
                          </Typography>
                          {interaction.addedBy && (
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                              by {interaction.addedBy}
                            </Typography>
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(interaction.date).toLocaleString()}
                        </Typography>
                      </Box>
                      
                      {interaction.type === 'call' && (
                        <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), p: 1, borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            <strong>Duration:</strong> {interaction.duration} minutes
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Outcome:</strong> {interaction.outcome}
                          </Typography>
                        </Box>
                      )}
                      
                      {interaction.type === 'email' && (
                        <Box sx={{ bgcolor: alpha(theme.palette.info.main, 0.05), p: 1, borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Subject:</strong> {interaction.subject}
                          </Typography>
                        </Box>
                      )}
                      
                      {interaction.type === 'whatsapp' && (
                        <Box sx={{ bgcolor: alpha(theme.palette.success.main, 0.05), p: 1, borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Message:</strong> {interaction.message}
                          </Typography>
                        </Box>
                      )}
                      
                      {(interaction.type === 'note' || interaction.type === 'meeting' || interaction.type === 'follow-up') && (
                        <Box sx={{ 
                          bgcolor: alpha(
                            interaction.type === 'note' ? theme.palette.warning.main :
                            interaction.type === 'meeting' ? theme.palette.secondary.main :
                            theme.palette.info.main, 0.05
                          ), 
                          p: 1, 
                          borderRadius: 1 
                        }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Note:</strong> {interaction.message}
                          </Typography>
                        </Box>
                      )}
                      
                      {interaction.type === 'status-change' && (
                        <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), p: 1, borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Status Changed:</strong> {interaction.oldStatus} → {interaction.newStatus}
                          </Typography>
                        </Box>
                      )}
                      
                      {interaction.type === 'follow-up-scheduled' && (
                        <Box sx={{ bgcolor: alpha(theme.palette.success.main, 0.05), p: 1, borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Follow-up Scheduled:</strong> {new Date(interaction.scheduledFor).toLocaleString()}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {/* System Events */}
                <Card elevation={0} sx={{ 
                  mb: 2, 
                  border: '1px solid', 
                  borderColor: 'divider', 
                  borderRadius: 2,
                  borderLeft: `4px solid ${theme.palette.warning.main}`
                }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonAddIcon sx={{ mr: 1, color: 'warning.main' }} />
                        <Typography variant="body2" fontWeight="600">Lead Created</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(leadProfileDialog.lead?.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ bgcolor: alpha(theme.palette.warning.main, 0.05), p: 1, borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Lead added to system from <strong>{leadProfileDialog.lead?.source}</strong>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
                
                <Card elevation={0} sx={{ 
                  mb: 2, 
                  border: '1px solid', 
                  borderColor: 'divider', 
                  borderRadius: 2,
                  borderLeft: `4px solid ${theme.palette.info.main}`
                }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AssignmentIcon sx={{ mr: 1, color: 'info.main' }} />
                        <Typography variant="body2" fontWeight="600">Lead Assigned</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(leadProfileDialog.lead?.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ bgcolor: alpha(theme.palette.info.main, 0.05), p: 1, borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Assigned to <strong>{leadProfileDialog.lead?.assignedTo}</strong>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            
            {/* Right Panel - Communication & Actions */}
            <Grid item xs={12} md={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PhoneIcon />}
                  sx={{ mb: 1 }}
                >
                  Call Now
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EmailIcon />}
                  sx={{ mb: 1 }}
                >
                  Send Email
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<WhatsAppIcon />}
                  color="success"
                  sx={{ mb: 1 }}
                >
                  WhatsApp
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ScheduleIcon />}
                  sx={{ mb: 1 }}
                >
                  Schedule Follow-up
                </Button>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {/* WhatsApp Chat Panel */}
              <Typography variant="h6" gutterBottom>WhatsApp Chat</Typography>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 3 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ height: 200, bgcolor: 'background.default', borderRadius: 1, p: 2, mb: 2, overflow: 'auto' }}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <WhatsAppIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Start WhatsApp conversation
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField 
                      size="small" 
                      placeholder="Type message..." 
                      fullWidth
                    />
                    <IconButton color="success" size="small">
                      <SendIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
              
              {/* Call Control */}
              <Typography variant="h6" gutterBottom>Call Control</Typography>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {leadProfileDialog.lead?.phone}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton color="success" size="large">
                        <CallMadeIcon />
                      </IconButton>
                      <IconButton color="error" size="large">
                        <CallReceivedIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Call Notes
                    </Typography>
                    <TextField
                      size="small"
                      multiline
                      rows={3}
                      placeholder="Add call notes..."
                      fullWidth
                    />
                  </Box>
                  
                  <Button variant="outlined" size="small" fullWidth>
                    Save Notes
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setLeadProfileDialog({ open: false, lead: null })}
            variant="outlined"
          >
            Close
          </Button>
          <Button
            onClick={() => handleLeadEdit(leadProfileDialog.lead)}
            variant="contained"
            startIcon={<EditIcon />}
          >
            Edit Lead
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog
        open={addNoteDialog.open}
        onClose={() => setAddNoteDialog({ 
          open: false, 
          note: '', 
          type: 'note',
          changeStatus: false,
          newStatus: '',
          setFollowUp: false,
          followUpDate: null,
          followUpTime: ''
        })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            Add Note to {leadProfileDialog.lead?.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Note Type</InputLabel>
              <Select
                value={addNoteDialog.type}
                onChange={(e) => setAddNoteDialog(prev => ({ ...prev, type: e.target.value }))}
                label="Note Type"
              >
                <MenuItem value="note">General Note</MenuItem>
                <MenuItem value="call">Call Note</MenuItem>
                <MenuItem value="email">Email Note</MenuItem>
                <MenuItem value="whatsapp">WhatsApp Note</MenuItem>
                <MenuItem value="meeting">Meeting Note</MenuItem>
                <MenuItem value="follow-up">Follow-up Note</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Note Content"
              placeholder="Enter your note here..."
              value={addNoteDialog.note}
              onChange={(e) => setAddNoteDialog(prev => ({ ...prev, note: e.target.value }))}
              sx={{ mb: 3 }}
            />
            
            {/* Status Change Section */}
            <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={addNoteDialog.changeStatus}
                    onChange={(e) => setAddNoteDialog(prev => ({ 
                      ...prev, 
                      changeStatus: e.target.checked,
                      newStatus: e.target.checked ? leadProfileDialog.lead?.status || '' : ''
                    }))}
                  />
                }
                label="Change Lead Status"
                sx={{ mb: 2 }}
              />
              
              {addNoteDialog.changeStatus && (
                <FormControl fullWidth>
                  <InputLabel>New Status</InputLabel>
                  <Select
                    value={addNoteDialog.newStatus}
                    onChange={(e) => setAddNoteDialog(prev => ({ ...prev, newStatus: e.target.value }))}
                    label="New Status"
                  >
                    <MenuItem value="New">New</MenuItem>
                    <MenuItem value="Contacted">Contacted</MenuItem>
                    <MenuItem value="Qualified">Qualified</MenuItem>
                    <MenuItem value="Proposal">Proposal</MenuItem>
                    <MenuItem value="Negotiation">Negotiation</MenuItem>
                    <MenuItem value="Closed">Closed</MenuItem>
                    <MenuItem value="Lost">Lost</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
            
            {/* Follow-up Section */}
            <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={addNoteDialog.setFollowUp}
                    onChange={(e) => setAddNoteDialog(prev => ({ 
                      ...prev, 
                      setFollowUp: e.target.checked,
                      followUpDate: e.target.checked ? new Date().toISOString().split('T')[0] : null,
                      followUpTime: e.target.checked ? '09:00' : ''
                    }))}
                  />
                }
                label="Schedule Follow-up"
                sx={{ mb: 2 }}
              />
              
              {addNoteDialog.setFollowUp && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    type="date"
                    label="Follow-up Date"
                    value={addNoteDialog.followUpDate || ''}
                    onChange={(e) => setAddNoteDialog(prev => ({ ...prev, followUpDate: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    type="time"
                    label="Follow-up Time"
                    value={addNoteDialog.followUpTime}
                    onChange={(e) => setAddNoteDialog(prev => ({ ...prev, followUpTime: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: 1 }}
                  />
                </Box>
              )}
            </Box>
            
            <Alert severity="info">
              This note will be added to the lead's interaction timeline and will be visible to all team members.
              {addNoteDialog.changeStatus && (
                <Box sx={{ mt: 1 }}>
                  <strong>Status Change:</strong> {leadProfileDialog.lead?.status} → {addNoteDialog.newStatus}
                </Box>
              )}
              {addNoteDialog.setFollowUp && addNoteDialog.followUpDate && (
                <Box sx={{ mt: 1 }}>
                  <strong>Follow-up:</strong> {new Date(`${addNoteDialog.followUpDate}T${addNoteDialog.followUpTime}`).toLocaleString()}
                </Box>
              )}
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setAddNoteDialog({ 
              open: false, 
              note: '', 
              type: 'note',
              changeStatus: false,
              newStatus: '',
              setFollowUp: false,
              followUpDate: null,
              followUpTime: ''
            })}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveNote}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!addNoteDialog.note.trim()}
          >
            Save Note
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add lead"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={handleLeadCreate}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default LeadManagement;