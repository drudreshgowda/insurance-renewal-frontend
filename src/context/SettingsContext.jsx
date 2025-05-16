import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the Settings context
const SettingsContext = createContext();

// Custom hook to use the Settings context
export const useSettings = () => useContext(SettingsContext);

// Provider component
export const SettingsProvider = ({ children }) => {
  // Initialize settings state with default values
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    language: 'en',
    timezone: 'UTC-5',
    autoRefresh: true,
    showEditCaseButton: true
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  // Function to update settings
  const updateSettings = (newSettings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;