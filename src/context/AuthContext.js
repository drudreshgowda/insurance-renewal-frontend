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
            name: 'Client Admin',
            email: 'admin@client.com',
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
    
    // Mock successful login
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
        localStorage.setItem('authToken', mockToken);
        
        const userData = {
          id: '123',
          name: 'Client Admin',
          email: email,
          role: 'client_admin'
        };
        
        setCurrentUser(userData);
        resolve({ success: true, user: userData });
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
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};