// This file would contain all API calls to the backend
// For now, it's just a placeholder with mock implementations

// Base URL for API calls
const API_BASE_URL = 'https://api.example.com/v1';

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Dashboard API calls
export const fetchDashboardStats = async (dateRange, policyType, caseStatus) => {
  // In a real app, this would call the API
  // return apiRequest(`/dashboard/stats?dateRange=${dateRange}&policyType=${policyType}&caseStatus=${caseStatus}`);
  
  // Mock implementation
  return {
    totalCases: 1250,
    inProgress: 320,
    renewed: 780,
    pendingAction: 95,
    errors: 55
  };
};

export const fetchTrendData = async (dateRange, policyType, caseStatus) => {
  // In a real app, this would call the API
  // return apiRequest(`/dashboard/trends?dateRange=${dateRange}&policyType=${policyType}&caseStatus=${caseStatus}`);
  
  // Mock implementation
  if (dateRange === 'week') {
    return [
      { name: 'Mon', newCases: 65, renewals: 42, successRate: 0.85 },
      { name: 'Tue', newCases: 59, renewals: 38, successRate: 0.82 },
      { name: 'Wed', newCases: 80, renewals: 56, successRate: 0.88 },
      { name: 'Thu', newCases: 81, renewals: 61, successRate: 0.91 },
      { name: 'Fri', newCases: 56, renewals: 48, successRate: 0.89 },
      { name: 'Sat', newCases: 25, renewals: 20, successRate: 0.92 },
      { name: 'Sun', newCases: 15, renewals: 12, successRate: 0.90 },
    ];
  } else if (dateRange === 'month') {
    // Generate mock data for a month
    return Array.from({ length: 30 }, (_, i) => ({
      name: `Day ${i + 1}`,
      newCases: Math.floor(Math.random() * 100) + 10,
      renewals: Math.floor(Math.random() * 80) + 5,
      successRate: (Math.random() * 0.2) + 0.75,
    }));
  } else {
    // Daily data
    return Array.from({ length: 24 }, (_, i) => ({
      name: `${i}:00`,
      newCases: Math.floor(Math.random() * 20) + 1,
      renewals: Math.floor(Math.random() * 15),
      successRate: (Math.random() * 0.3) + 0.7,
    }));
  }
};

// Upload API calls
export const uploadPolicyData = async (file) => {
  // In a real app, this would use FormData to upload the file
  const formData = new FormData();
  formData.append('file', file);
  
  // return apiRequest('/upload', {
  //   method: 'POST',
  //   body: formData,
  //   headers: {} // Let the browser set the content type for FormData
  // });
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        uploadId: `upload-${Date.now()}`,
        recordCount: Math.floor(Math.random() * 200) + 50,
      });
    }, 2000);
  });
};

// Case Tracking API calls
export const fetchCases = async (page, rowsPerPage, searchTerm, statusFilter, dateFilter, agentFilter) => {
  // In a real app, this would call the API
  // return apiRequest(
  //   `/cases?page=${page}&limit=${rowsPerPage}&search=${searchTerm}&status=${statusFilter}&date=${dateFilter}&agent=${agentFilter}`
  // );
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data with more comprehensive information
      const mockCases = [
        {
          id: 'CASE-001',
          customerName: 'John Smith',
          policyNumber: 'POL-12345',
          status: 'Assigned',
          agent: 'Alice Johnson',
          uploadDate: '2025-04-08',
          isPriority: false,
          contactInfo: {
            email: 'john.smith@example.com',
            phone: '555-123-4567'
          },
          policyDetails: {
            type: 'Auto',
            expiryDate: '2025-05-15',
            premium: 1250.00
          },
          flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress']
        },
        {
          id: 'CASE-002',
          customerName: 'Sarah Williams',
          policyNumber: 'POL-23456',
          status: 'Renewed',
          agent: 'Bob Miller',
          uploadDate: '2025-04-07',
          isPriority: true,
          contactInfo: {
            email: 'sarah.w@example.com',
            phone: '555-234-5678'
          },
          policyDetails: {
            type: 'Home',
            expiryDate: '2025-05-10',
            premium: 950.00
          },
          flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Payment Processed', 'Renewed']
        },
        {
          id: 'CASE-003',
          customerName: 'Michael Johnson',
          policyNumber: 'POL-34567',
          status: 'Failed',
          agent: 'Carol Davis',
          uploadDate: '2025-04-06',
          isPriority: false,
          contactInfo: {
            email: 'michael.j@example.com',
            phone: '555-345-6789'
          },
          policyDetails: {
            type: 'Life',
            expiryDate: '2025-05-05',
            premium: 2100.00
          },
          flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Failed']
        },
        {
          id: 'CASE-004',
          customerName: 'Emily Brown',
          policyNumber: 'POL-45678',
          status: 'In Progress',
          agent: 'David Wilson',
          uploadDate: '2025-04-05',
          isPriority: false,
          contactInfo: {
            email: 'emily.b@example.com',
            phone: '555-456-7890'
          },
          policyDetails: {
            type: 'Auto',
            expiryDate: '2025-05-20',
            premium: 1450.00
          },
          flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress']
        },
        {
          id: 'CASE-005',
          customerName: 'Robert Taylor',
          policyNumber: 'POL-56789',
          status: 'Uploaded',
          agent: 'Unassigned',
          uploadDate: '2025-04-10',
          isPriority: false,
          contactInfo: {
            email: 'robert.t@example.com',
            phone: '555-567-8901'
          },
          policyDetails: {
            type: 'Home',
            expiryDate: '2025-06-01',
            premium: 1050.00
          },
          flowSteps: ['Uploaded']
        },
      ];
      
      resolve(mockCases);
    }, 500);
  });
};

export const updateCase = async (caseId, caseData) => {
  // In a real app, this would call the API
  // return apiRequest(`/cases/${caseId}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(caseData)
  // });
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        caseId,
        message: 'Case updated successfully'
      });
    }, 500);
  });
};

// Logs API calls
export const fetchLogs = async (searchType, searchValue) => {
  // In a real app, this would call the API
  // return apiRequest(`/logs?type=${searchType}&value=${searchValue}`);
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      if (searchType === 'caseId' && searchValue === 'CASE-001') {
        resolve([
          {
            id: 'log-001',
            timestamp: '2025-04-08T09:15:30',
            action: 'Case Created',
            details: 'Case uploaded via bulk upload',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-002',
            timestamp: '2025-04-08T09:15:35',
            action: 'Validation',
            details: 'All required fields present and valid',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-003',
            timestamp: '2025-04-08T10:30:12',
            action: 'Assignment',
            details: 'Case assigned to agent Alice Johnson',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-004',
            timestamp: '2025-04-09T11:45:22',
            action: 'Contact Update',
            details: 'Customer phone number updated from 555-123-4567 to 555-123-9876',
            user: 'Alice Johnson',
            level: 'warning'
          },
          {
            id: 'log-005',
            timestamp: '2025-04-09T14:20:05',
            action: 'Processing',
            details: 'Agent has begun renewal processing',
            user: 'Alice Johnson',
            level: 'info'
          },
          {
            id: 'log-006',
            timestamp: '2025-04-10T09:05:18',
            action: 'Comment Added',
            details: 'Customer requested additional coverage options. Will follow up tomorrow.',
            user: 'Alice Johnson',
            level: 'info'
          }
        ]);
      } else if (searchType === 'policyNumber' && searchValue === 'POL-12345') {
        resolve([
          {
            id: 'log-001',
            timestamp: '2025-04-08T09:15:30',
            action: 'Case Created',
            details: 'Case uploaded via bulk upload',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-002',
            timestamp: '2025-04-08T09:15:35',
            action: 'Validation',
            details: 'All required fields present and valid',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-003',
            timestamp: '2025-04-08T10:30:12',
            action: 'Assignment',
            details: 'Case assigned to agent Alice Johnson',
            user: 'System',
            level: 'info'
          }
        ]);
      } else {
        resolve([]);
      }
    }, 1000);
  });
};

// Notifications API calls
export const fetchNotifications = async () => {
  // In a real app, this would call the API
  // return apiRequest('/notifications');
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'notif-001',
          title: 'New case assigned',
          message: 'Case CASE-006 has been assigned to you',
          timestamp: '2025-04-10T14:30:00',
          read: false,
          type: 'assignment'
        },
        {
          id: 'notif-002',
          title: 'Priority case update',
          message: 'Case CASE-003 has been marked as priority',
          timestamp: '2025-04-10T11:45:00',
          read: false,
          type: 'update'
        },
        {
          id: 'notif-003',
          title: 'System update',
          message: 'The system will be under maintenance tonight',
          timestamp: '2025-04-10T09:15:00',
          read: false,
          type: 'system'
        },
        {
          id: 'notif-004',
          title: 'Case status changed',
          message: 'Case CASE-002 status changed to "In Review"',
          timestamp: '2025-04-09T16:22:00',
          read: true,
          type: 'update'
        },
        {
          id: 'notif-005',
          title: 'Document uploaded',
          message: 'New document uploaded for case CASE-005',
          timestamp: '2025-04-09T14:10:00',
          read: true,
          type: 'document'
        }
      ]);
    }, 800);
  });
};

export const markNotificationAsRead = async (notificationId) => {
  // In a real app, this would call the API
  // return apiRequest(`/notifications/${notificationId}/read`, { method: 'PUT' });
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        notificationId,
        message: 'Notification marked as read'
      });
    }, 300);
  });
};

export const markAllNotificationsAsRead = async () => {
  // In a real app, this would call the API
  // return apiRequest('/notifications/read-all', { method: 'PUT' });
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'All notifications marked as read'
      });
    }, 500);
  });
};

// Case Priority Management
export const updateCasePriority = async (caseId, isPriority) => {
  // In a real app, this would call the API
  // return apiRequest(`/cases/${caseId}/priority`, {
  //   method: 'PUT',
  //   body: JSON.stringify({ isPriority })
  // });
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        caseId,
        isPriority,
        message: `Case priority ${isPriority ? 'set' : 'removed'} successfully`
      });
    }, 400);
  });
};

// Password Management
export const changePassword = async (currentPassword, newPassword) => {
  // In a real app, this would call the API
  // return apiRequest('/user/change-password', {
  //   method: 'PUT',
  //   body: JSON.stringify({ currentPassword, newPassword })
  // });
  
  // Mock implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate password validation
      if (currentPassword === 'password123') {
        resolve({
          success: true,
          message: 'Password changed successfully'
        });
      } else {
        reject(new Error('Current password is incorrect'));
      }
    }, 800);
  });
};

// Export functionality
export const exportCases = async (format, filters) => {
  // In a real app, this would call the API to generate and download a file
  // return apiRequest('/export/cases', {
  //   method: 'POST',
  //   body: JSON.stringify({ format, filters })
  // });
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        downloadUrl: `https://api.example.com/v1/download/cases-export-${Date.now()}.${format}`,
        message: `Cases exported to ${format.toUpperCase()} successfully`
      });
    }, 1500);
  });
};

// User Settings
export const saveUserSettings = async (settings) => {
  // In a real app, this would call the API
  // return apiRequest('/user/settings', {
  //   method: 'PUT',
  //   body: JSON.stringify(settings)
  // });
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        settings,
        message: 'Settings saved successfully'
      });
    }, 600);
  });
};