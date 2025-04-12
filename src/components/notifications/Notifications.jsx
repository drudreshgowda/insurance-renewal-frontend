import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Chip,
  Button,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  Update as UpdateIcon,
  Info as InfoIcon,
  Description as DocumentIcon,
  Alarm as ReminderIcon,
  Assessment as ReportIcon,
  MarkEmailRead as MarkReadIcon,
  DoneAll as DoneAllIcon
} from '@mui/icons-material';
import { useNotifications } from '../../context/NotificationsContext';

const Notifications = ({ open, onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [tabValue, setTabValue] = useState(0);
  const [typeFilter, setTypeFilter] = useState('all');
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
  };
  
  const handleMarkAsRead = (notificationId) => {
    markAsRead(notificationId);
  };
  
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <AssignmentIcon color="primary" />;
      case 'update':
        return <UpdateIcon color="info" />;
      case 'system':
        return <InfoIcon color="warning" />;
      case 'document':
        return <DocumentIcon color="success" />;
      case 'reminder':
        return <ReminderIcon color="error" />;
      case 'report':
        return <ReportIcon color="secondary" />;
      default:
        return <InfoIcon />;
    }
  };
  
  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case 'assignment': return 'Assignment';
      case 'update': return 'Update';
      case 'system': return 'System';
      case 'document': return 'Document';
      case 'reminder': return 'Reminder';
      case 'report': return 'Report';
      default: return 'Other';
    }
  };
  
  const getNotificationTypeColor = (type) => {
    switch (type) {
      case 'assignment': return 'primary';
      case 'update': return 'info';
      case 'system': return 'warning';
      case 'document': return 'success';
      case 'reminder': return 'error';
      case 'report': return 'secondary';
      default: return 'default';
    }
  };
  
  // Filter notifications based on tab and type filter
  const filteredNotifications = notifications.filter(notification => {
    // Filter by read/unread status (tab)
    if (tabValue === 1 && notification.read) return false;
    if (tabValue === 2 && !notification.read) return false;
    
    // Filter by type
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
    
    return true;
  });
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6">Notifications</Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Box sx={{ px: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All" />
          <Tab 
            label={
              <Badge badgeContent={notifications.filter(n => !n.read).length} color="error" max={99}>
                <Box sx={{ pr: 1 }}>Unread</Box>
              </Badge>
            } 
          />
          <Tab label="Read" />
        </Tabs>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter by Type</InputLabel>
            <Select
              value={typeFilter}
              label="Filter by Type"
              onChange={handleTypeFilterChange}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="assignment">Assignment</MenuItem>
              <MenuItem value="update">Update</MenuItem>
              <MenuItem value="system">System</MenuItem>
              <MenuItem value="document">Document</MenuItem>
              <MenuItem value="reminder">Reminder</MenuItem>
              <MenuItem value="report">Report</MenuItem>
            </Select>
          </FormControl>
          
          <Tooltip title="Mark all as read">
            <Button
              variant="outlined"
              size="small"
              startIcon={<DoneAllIcon />}
              onClick={handleMarkAllAsRead}
            >
              Mark All Read
            </Button>
          </Tooltip>
        </Box>
      </Box>
      
      <DialogContent sx={{ pt: 0 }}>
        {filteredNotifications.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No notifications found
            </Typography>
          </Box>
        ) : (
          <List>
            {filteredNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                {index > 0 && <Divider />}
                <ListItem 
                  alignItems="flex-start"
                  sx={{
                    py: 2,
                    backgroundColor: notification.read ? 'transparent' : 'rgba(25, 118, 210, 0.04)',
                  }}
                >
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <Box sx={{ mr: 2, pt: 0.5 }}>
                      {getNotificationIcon(notification.type)}
                    </Box>
                    
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle1">
                            {notification.title}
                          </Typography>
                          <Chip 
                            label={getNotificationTypeLabel(notification.type)} 
                            color={getNotificationTypeColor(notification.type)}
                            size="small"
                            variant="outlined"
                          />
                          {!notification.read && (
                            <Chip 
                              label="New" 
                              color="error"
                              size="small"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(notification.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {notification.message}
                      </Typography>
                      
                      {!notification.read && (
                        <Button
                          size="small"
                          startIcon={<MarkReadIcon />}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </Box>
                  </Box>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Notifications;