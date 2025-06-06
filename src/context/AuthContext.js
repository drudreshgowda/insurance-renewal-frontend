import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuthStatus = async () => {
      try {
        // In a real app, this would verify the token with your backend
        const token = localStorage.getItem('authToken');
        
        if (token) {
          // Mock user data
          setCurrentUser({
            id: '123',
            name: 'Rajesh Kumar',
            email: 'rajesh@client.com',
            role: 'client_admin'
          });
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

  const login = async (email, password) => {
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
        
        const userData = {
          id: '123',
          name: 'Rajesh Kumar',
          email: email,
          role: 'client_admin'
        };
        
        // For non-MFA logins, we need to set the token and user here
        const savedSettings = localStorage.getItem('userSettings');
        let mfaEnabled = false;
        
        if (savedSettings) {
          try {
            const settings = JSON.parse(savedSettings);
            mfaEnabled = settings.mfaEnabled;
          } catch (error) {
            console.error('Failed to parse saved settings:', error);
          }
        }
        
        // If MFA is not enabled, log the user in directly
        if (!mfaEnabled) {
          const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
          localStorage.setItem('authToken', mockToken);
          setCurrentUser(userData);
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
          // Here we'll create it again with the same data as in login
          const userData = {
            id: '123',
            name: 'Rajesh Kumar',
            email: 'rajesh@client.com',
            role: 'client_admin'
          };
          
          setCurrentUser(userData);
          resolve({ success: true, user: userData });
        } else {
          resolve({ success: false, message: 'Invalid OTP code. Please try again.' });
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
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