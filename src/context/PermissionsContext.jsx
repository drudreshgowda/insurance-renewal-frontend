import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PermissionsContext = createContext();

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};

export const PermissionsProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock user permissions - in a real app, this would come from your backend
  const mockUserPermissions = {
    'admin': [
      // Core Pages
      'dashboard', 'upload', 'cases', 'closed-cases', 'policy-timeline', 'logs', 'claims',
      // Email Pages  
      'emails', 'email-dashboard', 'email-analytics', 'bulk-email',
      // Marketing Pages
      'campaigns', 'templates',
      // Survey Pages
      'feedback', 'survey-designer',
      // WhatsApp Pages
      'whatsapp-flow',
      // Admin Pages
      'settings', 'billing', 'users',
      // Personal Pages
      'profile'
    ],
    'client_admin': [
      // Core Pages
      'dashboard', 'upload', 'cases', 'closed-cases', 'policy-timeline', 'logs', 'claims',
      // Email Pages  
      'emails', 'email-dashboard', 'email-analytics', 'bulk-email',
      // Marketing Pages
      'campaigns', 'templates',
      // Survey Pages
      'feedback', 'survey-designer',
      // WhatsApp Pages
      'whatsapp-flow',
      // Admin Pages
      'settings', 'billing', 'users',
      // Personal Pages
      'profile'
    ],
    'manager': [
      // Core Pages
      'dashboard', 'upload', 'cases', 'closed-cases', 'policy-timeline', 'logs', 'claims',
      // Email Pages
      'emails', 'email-dashboard', 'email-analytics', 'bulk-email',
      // Marketing Pages
      'campaigns', 'templates',
      // Survey Pages
      'feedback', 'survey-designer',
      // WhatsApp Pages
      'whatsapp-flow',
      // Personal Pages
      'profile'
    ],
    'agent': [
      // Core Pages
      'dashboard', 'cases', 'closed-cases', 'policy-timeline', 'logs',
      // Email Pages
      'emails', 'email-dashboard',
      // WhatsApp Pages
      'whatsapp-flow',
      // Personal Pages
      'profile'
    ],
    'viewer': [
      // Core Pages (read-only)
      'dashboard', 'cases', 'closed-cases', 'policy-timeline',
      // Personal Pages
      'profile'
    ]
  };

  useEffect(() => {
    if (currentUser) {
      // In a real app, you would fetch user permissions from your backend
      const permissions = mockUserPermissions[currentUser.role] || [];
      setUserPermissions(permissions);
    } else {
      setUserPermissions([]);
    }
    setLoading(false);
  }, [currentUser]);

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions) => {
    if (!currentUser) return false;
    return permissions.some(permission => userPermissions.includes(permission));
  };

  const hasAllPermissions = (permissions) => {
    if (!currentUser) return false;
    return permissions.every(permission => userPermissions.includes(permission));
  };

  const canAccessRoute = (routePath) => {
    // Map routes to required permissions
    const routePermissions = {
      '/': 'dashboard',
      '/upload': 'upload',
      '/cases': 'cases',
      '/closed-cases': 'closed-cases',
      '/policy-timeline': 'policy-timeline',
      '/logs': 'logs',
      '/profile': 'profile',
      '/settings': 'settings',
      '/billing': 'billing',
      '/users': 'users',
      '/emails': 'emails',
      '/emails/dashboard': 'email-dashboard',
      '/emails/analytics': 'email-analytics',
      '/emails/bulk': 'bulk-email',
      '/campaigns': 'campaigns',
      '/templates': 'templates',
      '/feedback': 'feedback',
      '/survey-designer': 'survey-designer',
      '/claims': 'claims',
      '/whatsapp-flow': 'whatsapp-flow'
    };

    const requiredPermission = routePermissions[routePath];
    if (!requiredPermission) return true; // Allow access to routes without specific permissions
    
    return hasPermission(requiredPermission);
  };

  const getAccessibleRoutes = () => {
    const allRoutes = [
      // Core Pages
      { path: '/', permission: 'dashboard', name: 'Dashboard' },
      { path: '/upload', permission: 'upload', name: 'Upload Data' },
      { path: '/cases', permission: 'cases', name: 'Case Tracking' },
      { path: '/closed-cases', permission: 'closed-cases', name: 'Closed Cases' },
      { path: '/policy-timeline', permission: 'policy-timeline', name: 'Policy Timeline' },
      { path: '/logs', permission: 'logs', name: 'Case Logs' },
      { path: '/claims', permission: 'claims', name: 'Claims Management' },
      
      // Email Pages
      { path: '/emails', permission: 'emails', name: 'Email Inbox' },
      { path: '/emails/dashboard', permission: 'email-dashboard', name: 'Email Dashboard' },
      { path: '/emails/analytics', permission: 'email-analytics', name: 'Email Analytics' },
      { path: '/emails/bulk', permission: 'bulk-email', name: 'Bulk Email' },
      
      // Marketing Pages
      { path: '/campaigns', permission: 'campaigns', name: 'Campaigns' },
      { path: '/templates', permission: 'templates', name: 'Template Manager' },
      
      // Survey Pages
      { path: '/feedback', permission: 'feedback', name: 'Feedback & Surveys' },
      { path: '/survey-designer', permission: 'survey-designer', name: 'Survey Designer' },
      
      // WhatsApp Pages
      { path: '/whatsapp-flow', permission: 'whatsapp-flow', name: 'WhatsApp Flow' },
      
      // Admin Pages
      { path: '/settings', permission: 'settings', name: 'Settings' },
      { path: '/billing', permission: 'billing', name: 'Billing' },
      { path: '/users', permission: 'users', name: 'User Management' },
      
      // Personal Pages
      { path: '/profile', permission: 'profile', name: 'Profile' }
    ];

    return allRoutes.filter(route => hasPermission(route.permission));
  };

  const isAdmin = () => {
    return currentUser?.role === 'admin' || currentUser?.role === 'client_admin';
  };

  const isManager = () => {
    return currentUser?.role === 'manager' || isAdmin();
  };

  const value = {
    userPermissions,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
    getAccessibleRoutes,
    isAdmin,
    isManager
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

export default PermissionsProvider; 