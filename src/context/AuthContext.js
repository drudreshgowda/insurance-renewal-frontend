import React, { createContext, useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  // Function to apply user language preference
  const applyUserLanguage = (user) => {
    if (user && user.portalLanguage) {
      i18n.changeLanguage(user.portalLanguage);
      localStorage.setItem('userLanguagePreference', user.portalLanguage);
    }
  };

  // Mock function to get user data from backend (including language preference)
  const getUserData = (email) => {
    // In a real app, this would fetch user data from your backend
    // For demo purposes, we'll simulate different users with different language preferences
    const mockUsers = {
      'rajesh@client.com': {
        id: '1',
        name: 'Rajesh Kumar',
        email: 'rajesh@client.com',
        role: 'renewals_specialist',
        portalLanguage: 'en', // English preference
        permissions: [
          // Renewals Module Only
          'dashboard', 'cases', 'closed-cases', 'policy-timeline', 'logs',
          // Personal Pages
          'profile'
        ]
      },
      'priya@client.com': {
        id: '2',
        name: 'Priya Sharma',
        email: 'priya@client.com',
        role: 'all_modules_manager',
        portalLanguage: 'en', // English preference
        permissions: [
          // Core Pages (excluding Renewals module - no cases, closed-cases, policy-timeline, logs)
          'dashboard', 'upload', 'claims',
          'policy-servicing', 'new-business', 'medical-management',
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
        ]
      },
      'admin@client.com': {
        id: '3',
        name: 'Admin User',
        email: 'admin@client.com',
        role: 'admin',
        portalLanguage: 'en', // English preference
        permissions: [
          // Full access to all modules
          'dashboard', 'upload', 'cases', 'closed-cases', 'policy-timeline', 'logs', 'claims',
          'emails', 'email-dashboard', 'email-analytics', 'bulk-email',
          'campaigns', 'templates', 'feedback', 'survey-designer', 'whatsapp-flow',
          'settings', 'billing', 'users', 'profile'
        ]
      }
    };
    
    return mockUsers[email] || {
      id: '1',
      name: 'Demo User',
      email: email,
      role: 'user',
      portalLanguage: 'en' // Default to English
    };
  };

  useEffect(() => {
    // Check for existing session
    const checkAuthStatus = async () => {
      try {
        // In a real app, this would verify the token with your backend
        const token = localStorage.getItem('authToken');
        
        if (token) {
          // In a real app, you would decode the token to get user email/id
          // For demo, we'll use a stored email or default
          const storedEmail = localStorage.getItem('userEmail') || 'admin@client.com';
          const userData = getUserData(storedEmail);
          setCurrentUser(userData);
          applyUserLanguage(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear any invalid tokens
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  const login = async (email, _password) => {
    // In a real app, this would call your authentication API
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // });
    // const data = await response.json();
    
    // Mock successful login - just validate credentials
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, you would validate credentials here
        // For demo, we'll just consider any login attempt successful
        
        const userData = getUserData(email);
        
        // For non-MFA logins, we need to set the token and user here
        const savedSettings = localStorage.getItem('userSettings');
        let mfaEnabled = false;
        
        if (savedSettings) {
          try {
            const settings = JSON.parse(savedSettings);
            mfaEnabled = settings.mfaEnabled;
                  } catch (error) {
          // Failed to parse saved settings, using defaults
        }
        }
        
        // If MFA is not enabled, log the user in directly
        if (!mfaEnabled) {
          const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
          localStorage.setItem('authToken', mockToken);
          localStorage.setItem('userEmail', email); // Store email for session persistence
          setCurrentUser(userData);
          applyUserLanguage(userData);
        }
        
        resolve({ success: true, user: userData });
      }, 1000);
    });
  };

  // Function to verify MFA OTP
  const verifyMfaOtp = async (otp) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would validate the OTP with your backend
        // Here we just accept any 6-digit code as valid
        if (otp && otp.length === 6 && /^\d+$/.test(otp)) {
          // OTP is valid, log the user in now
          const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
          localStorage.setItem('authToken', mockToken);
          
          // Note: userData would come from your backend in a real app
          // Here we'll get it from the stored email
          const storedEmail = localStorage.getItem('userEmail') || 'admin@client.com';
          const userData = getUserData(storedEmail);
          
          setCurrentUser(userData);
          applyUserLanguage(userData);
          resolve({ success: true, user: userData });
        } else {
          resolve({ success: false, message: 'Invalid OTP code. Please try again.' });
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userLanguagePreference');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    verifyMfaOtp
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};