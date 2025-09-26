import React, { createContext, useState, useContext, useEffect } from 'react';
import { emailProviderAPI } from '../api/Settings_Emailprovider';

// Create the Providers context
const ProvidersContext = createContext();

// Custom hook to use the Providers context
export const useProviders = () => useContext(ProvidersContext);

// Provider component
export const ProvidersProvider = ({ children }) => {
  // Initialize providers state with default configurations
  const [providers, setProviders] = useState({
    email: [
      {
        id: 'email-1',
        name: 'SendGrid Primary',
        type: 'sendgrid',
        isActive: true,
        isDefault: true,
        status: 'connected',
        config: {
          apiKey: '',
          fromEmail: 'noreply@company.com',
          fromName: 'Company Name',
          replyTo: 'support@company.com'
        },
        limits: {
          dailyLimit: 10000,
          monthlyLimit: 100000,
          rateLimit: 100 // per minute
        },
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      },
      {
        id: 'email-2',
        name: 'AWS SES Backup',
        type: 'aws-ses',
        isActive: false,
        isDefault: false,
        status: 'disconnected',
        config: {
          region: 'us-east-1',
          accessKeyId: '',
          secretAccessKey: '',
          fromEmail: 'noreply@company.com',
          fromName: 'Company Name'
        },
        limits: {
          dailyLimit: 50000,
          monthlyLimit: 1000000,
          rateLimit: 200
        },
        createdAt: new Date().toISOString(),
        lastUsed: null
      }
    ],
    sms: [
      {
        id: 'sms-1',
        name: 'Twilio Primary',
        type: 'twilio',
        isActive: true,
        isDefault: true,
        status: 'connected',
        config: {
          accountSid: '',
          authToken: '',
          fromNumber: '+1234567890',
          messagingServiceSid: ''
        },
        limits: {
          dailyLimit: 1000,
          monthlyLimit: 10000,
          rateLimit: 10
        },
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      },
      {
        id: 'sms-2',
        name: 'MSG91 India',
        type: 'msg91',
        isActive: false,
        isDefault: false,
        status: 'disconnected',
        config: {
          apiKey: '',
          senderId: 'INTPRO',
          route: '4',
          country: 'IN'
        },
        limits: {
          dailyLimit: 5000,
          monthlyLimit: 50000,
          rateLimit: 20
        },
        createdAt: new Date().toISOString(),
        lastUsed: null
      }
    ],
    whatsapp: [
      {
        id: 'whatsapp-1',
        name: 'Meta Business API',
        type: 'meta',
        isActive: true,
        isDefault: true,
        status: 'connected',
        config: {
          accessToken: '',
          phoneNumberId: '',
          businessAccountId: '',
          webhookToken: '',
          apiVersion: 'v17.0'
        },
        limits: {
          dailyLimit: 1000,
          monthlyLimit: 10000,
          rateLimit: 80
        },
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      },
      {
        id: 'whatsapp-2',
        name: 'Gupshup WhatsApp',
        type: 'gupshup',
        isActive: false,
        isDefault: false,
        status: 'disconnected',
        config: {
          apiKey: '',
          appName: '',
          sourceNumber: '',
          apiUrl: 'https://api.gupshup.io/sm/api/v1'
        },
        limits: {
          dailyLimit: 2000,
          monthlyLimit: 20000,
          rateLimit: 60
        },
        createdAt: new Date().toISOString(),
        lastUsed: null
      }
    ],
    call: [
      {
        id: 'call-1',
        name: 'Twilio Voice',
        type: 'twilio-voice',
        isActive: true,
        isDefault: true,
        status: 'connected',
        config: {
          accountSid: '',
          authToken: '',
          fromNumber: '+1234567890',
          voiceUrl: '',
          statusCallback: ''
        },
        limits: {
          dailyLimit: 500,
          monthlyLimit: 5000,
          rateLimit: 5
        },
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      },
      {
        id: 'call-2',
        name: 'Exotel Voice',
        type: 'exotel',
        isActive: false,
        isDefault: false,
        status: 'disconnected',
        config: {
          apiKey: '',
          apiToken: '',
          accountSid: '',
          subdomain: '',
          callerId: ''
        },
        limits: {
          dailyLimit: 1000,
          monthlyLimit: 10000,
          rateLimit: 10
        },
        createdAt: new Date().toISOString(),
        lastUsed: null
      }
    ]
  });

  // Provider templates for different types
  const providerTemplates = {
    email: {
      sendgrid: {
        name: 'SendGrid',
        fields: [
          { key: 'apiKey', label: 'API Key', type: 'password', required: true },
          { key: 'fromEmail', label: 'From Email', type: 'email', required: true },
          { key: 'fromName', label: 'From Name', type: 'text', required: true },
          { key: 'replyTo', label: 'Reply To', type: 'email', required: false }
        ]
      },
      'aws-ses': {
        name: 'Amazon SES',
        fields: [
          { key: 'region', label: 'AWS Region', type: 'text', required: true },
          { key: 'accessKeyId', label: 'Access Key ID', type: 'password', required: true },
          { key: 'secretAccessKey', label: 'Secret Access Key', type: 'password', required: true },
          { key: 'fromEmail', label: 'From Email', type: 'email', required: true },
          { key: 'fromName', label: 'From Name', type: 'text', required: true }
        ]
      },
      mailgun: {
        name: 'Mailgun',
        fields: [
          { key: 'apiKey', label: 'API Key', type: 'password', required: true },
          { key: 'domain', label: 'Domain', type: 'text', required: true },
          { key: 'fromEmail', label: 'From Email', type: 'email', required: true },
          { key: 'fromName', label: 'From Name', type: 'text', required: true }
        ]
      },
      smtp: {
        name: 'Custom SMTP',
        fields: [
          { key: 'host', label: 'SMTP Host', type: 'text', required: true },
          { key: 'port', label: 'Port', type: 'number', required: true },
          { key: 'username', label: 'Username', type: 'text', required: true },
          { key: 'password', label: 'Password', type: 'password', required: true },
          { key: 'fromEmail', label: 'From Email', type: 'email', required: true },
          { key: 'fromName', label: 'From Name', type: 'text', required: true }
        ]
      }
    },
    sms: {
      twilio: {
        name: 'Twilio SMS',
        fields: [
          { key: 'accountSid', label: 'Account SID', type: 'password', required: true },
          { key: 'authToken', label: 'Auth Token', type: 'password', required: true },
          { key: 'fromNumber', label: 'From Number', type: 'tel', required: true },
          { key: 'messagingServiceSid', label: 'Messaging Service SID', type: 'text', required: false }
        ]
      },
      msg91: {
        name: 'MSG91',
        fields: [
          { key: 'apiKey', label: 'API Key', type: 'password', required: true },
          { key: 'senderId', label: 'Sender ID', type: 'text', required: true },
          { key: 'route', label: 'Route', type: 'text', required: true },
          { key: 'country', label: 'Country Code', type: 'text', required: true }
        ]
      },
      'aws-sns': {
        name: 'AWS SNS',
        fields: [
          { key: 'region', label: 'AWS Region', type: 'text', required: true },
          { key: 'accessKeyId', label: 'Access Key ID', type: 'password', required: true },
          { key: 'secretAccessKey', label: 'Secret Access Key', type: 'password', required: true }
        ]
      },
      textlocal: {
        name: 'TextLocal',
        fields: [
          { key: 'apiKey', label: 'API Key', type: 'password', required: true },
          { key: 'username', label: 'Username', type: 'text', required: true },
          { key: 'hash', label: 'Hash', type: 'password', required: true },
          { key: 'sender', label: 'Sender', type: 'text', required: true }
        ]
      }
    },
    whatsapp: {
      meta: {
        name: 'Meta Business API',
        fields: [
          { key: 'accessToken', label: 'Access Token', type: 'password', required: true },
          { key: 'phoneNumberId', label: 'Phone Number ID', type: 'text', required: true },
          { key: 'businessAccountId', label: 'Business Account ID', type: 'text', required: true },
          { key: 'webhookToken', label: 'Webhook Token', type: 'password', required: false },
          { key: 'apiVersion', label: 'API Version', type: 'text', required: false }
        ]
      },
      gupshup: {
        name: 'Gupshup',
        fields: [
          { key: 'apiKey', label: 'API Key', type: 'password', required: true },
          { key: 'appName', label: 'App Name', type: 'text', required: true },
          { key: 'sourceNumber', label: 'Source Number', type: 'tel', required: true },
          { key: 'apiUrl', label: 'API URL', type: 'url', required: true }
        ]
      },
      '360dialog': {
        name: '360Dialog',
        fields: [
          { key: 'apiKey', label: 'API Key', type: 'password', required: true },
          { key: 'partnerId', label: 'Partner ID', type: 'text', required: true },
          { key: 'channelId', label: 'Channel ID', type: 'text', required: true }
        ]
      }
    },
    call: {
      'twilio-voice': {
        name: 'Twilio Voice',
        fields: [
          { key: 'accountSid', label: 'Account SID', type: 'password', required: true },
          { key: 'authToken', label: 'Auth Token', type: 'password', required: true },
          { key: 'fromNumber', label: 'From Number', type: 'tel', required: true },
          { key: 'voiceUrl', label: 'Voice URL', type: 'url', required: false },
          { key: 'statusCallback', label: 'Status Callback URL', type: 'url', required: false }
        ]
      },
      exotel: {
        name: 'Exotel',
        fields: [
          { key: 'apiKey', label: 'API Key', type: 'password', required: true },
          { key: 'apiToken', label: 'API Token', type: 'password', required: true },
          { key: 'accountSid', label: 'Account SID', type: 'text', required: true },
          { key: 'subdomain', label: 'Subdomain', type: 'text', required: true },
          { key: 'callerId', label: 'Caller ID', type: 'tel', required: true }
        ]
      },
      ubona: {
        name: 'Ubona',
        fields: [
          { key: 'apiKey', label: 'API Key', type: 'password', required: true },
          { key: 'accountSid', label: 'Account SID', type: 'text', required: true },
          { key: 'apiUrl', label: 'API URL', type: 'url', required: true },
          { key: 'callerId', label: 'Caller ID', type: 'tel', required: true }
        ]
      }
    }
  };

  // Load providers from localStorage on component mount
  useEffect(() => {
    const savedProviders = localStorage.getItem('communicationProviders');
    if (savedProviders) {
      try {
        setProviders(JSON.parse(savedProviders));
      } catch (error) {
        console.error('Failed to parse saved providers:', error);
      }
    }
  }, []);

  // Save providers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('communicationProviders', JSON.stringify(providers));
  }, [providers]);

  // Add new provider
  const addProvider = async (channel, providerData) => {
    try {
      // For email providers, make API call
      if (channel === 'email') {
        // Map provider type to backend format
        const providerTypeMapping = {
          'sendgrid': 'sendgrid',
          'aws-ses': 'aws_ses',
          'aws_ses': 'aws_ses',
          'mailgun': 'mailgun',
          'smtp': 'smtp'
        };

        // Transform the provider data to match API format
        const apiPayload = {
          name: providerData.name,
          provider_type: providerTypeMapping[providerData.type] || providerData.type,
          from_email: providerData.config.fromEmail || providerData.config.from_email || '',
          from_name: providerData.config.fromName || providerData.config.from_name || '',
          reply_to: providerData.config.replyTo || providerData.config.reply_to || '',
          daily_limit: providerData.limits.dailyLimit,
          monthly_limit: providerData.limits.monthlyLimit,
          rate_limit_per_minute: providerData.limits.rateLimit,
          priority: 1,
          is_default: providerData.isDefault,
          is_active: providerData.isActive,
          // Include API keys and credentials at top level based on provider type
          ...(providerData.type === 'sendgrid' && {
            api_key: providerData.config.apiKey || providerData.config.api_key || ''
          }),
          ...((providerData.type === 'aws-ses' || providerData.type === 'aws_ses') && {
            access_key_id: providerData.config.accessKeyId || '',
            secret_access_key: providerData.config.secretAccessKey || '',
            region: providerData.config.region || ''
          }),
          ...(providerData.type === 'mailgun' && {
            api_key: providerData.config.apiKey || '',
            domain: providerData.config.domain || ''
          }),
          ...(providerData.type === 'smtp' && {
            host: providerData.config.host || '',
            port: providerData.config.port || '',
            username: providerData.config.username || '',
            password: providerData.config.password || ''
          })
        };

        console.log('Provider data received:', JSON.stringify(providerData, null, 2));
        console.log('Config object:', JSON.stringify(providerData.config, null, 2));
        console.log('API Key from config (apiKey):', providerData.config.apiKey);
        console.log('API Key from config (api_key):', providerData.config.api_key);
        console.log('All config keys:', Object.keys(providerData.config || {}));
        console.log('Sending API payload:', JSON.stringify(apiPayload, null, 2));
        
        try {
          const result = await emailProviderAPI.CreateProvider(apiPayload);
          console.log('API Response:', JSON.stringify(result, null, 2));
          
          if (result.success) {
            // Add the provider to local state with the API response data
            const newProvider = {
              id: result.data.id || `${channel}-${Date.now()}`,
              ...providerData, // Keep the original form data including config
              ...result.data, // Override with API response data
              createdAt: new Date().toISOString(),
              lastUsed: null,
              status: 'connected'
            };

            setProviders(prev => ({
              ...prev,
              [channel]: [...prev[channel], newProvider]
            }));

            return { success: true, providerId: newProvider.id };
          } else {
            console.error('API call failed:', result.message);
            return { success: false, message: result.message || 'API call failed' };
          }
        } catch (apiError) {
          console.error('API call error:', apiError);
          // Fallback to local storage if API fails
          console.log('API failed, falling back to local storage');
          const newProvider = {
            id: `${channel}-${Date.now()}`,
            ...providerData,
            createdAt: new Date().toISOString(),
            lastUsed: null,
            status: 'disconnected'
          };

          setProviders(prev => ({
            ...prev,
            [channel]: [...prev[channel], newProvider]
          }));

          return { success: true, providerId: newProvider.id, message: 'Provider added locally (API unavailable)' };
        }
      } else {
        // For other channels, use local storage (existing behavior)
        const newProvider = {
          id: `${channel}-${Date.now()}`,
          ...providerData,
          createdAt: new Date().toISOString(),
          lastUsed: null,
          status: 'disconnected'
        };

        setProviders(prev => ({
          ...prev,
          [channel]: [...prev[channel], newProvider]
        }));

        return { success: true, providerId: newProvider.id };
      }
    } catch (error) {
      console.error('Error adding provider:', error);
      return { success: false, message: error.message || 'Failed to add provider' };
    }
  };

  // Update existing provider
  const updateProvider = (channel, providerId, updates) => {
    setProviders(prev => ({
      ...prev,
      [channel]: prev[channel].map(provider => 
        provider.id === providerId 
          ? { ...provider, ...updates, updatedAt: new Date().toISOString() }
          : provider
      )
    }));
  };

  // Delete provider
  const deleteProvider = (channel, providerId) => {
    setProviders(prev => ({
      ...prev,
      [channel]: prev[channel].filter(provider => provider.id !== providerId)
    }));
  };

  // Set active provider
  const setActiveProvider = (channel, providerId) => {
    setProviders(prev => ({
      ...prev,
      [channel]: prev[channel].map(provider => ({
        ...provider,
        isActive: provider.id === providerId
      }))
    }));
  };

  // Set default provider
  const setDefaultProvider = (channel, providerId) => {
    setProviders(prev => ({
      ...prev,
      [channel]: prev[channel].map(provider => ({
        ...provider,
        isDefault: provider.id === providerId
      }))
    }));
  };

  // Test provider connection
  const testProvider = async (channel, providerId) => {
    // This would make an actual API call to test the provider
    // For now, we'll simulate the test
    updateProvider(channel, providerId, { status: 'testing' });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate random success/failure
    const success = Math.random() > 0.3;
    updateProvider(channel, providerId, { 
      status: success ? 'connected' : 'error',
      lastTested: new Date().toISOString()
    });
    
    return success;
  };

  // Get active provider for a channel
  const getActiveProvider = (channel) => {
    return providers[channel]?.find(provider => provider.isActive);
  };

  // Get default provider for a channel
  const getDefaultProvider = (channel) => {
    return providers[channel]?.find(provider => provider.isDefault);
  };

  // Get all providers for a channel
  const getProviders = (channel) => {
    return providers[channel] || [];
  };

  // Get provider statistics
  const getProviderStats = () => {
    const stats = {};
    Object.keys(providers).forEach(channel => {
      const channelProviders = providers[channel];
      stats[channel] = {
        total: channelProviders.length,
        active: channelProviders.filter(p => p.isActive).length,
        connected: channelProviders.filter(p => p.status === 'connected').length,
        disconnected: channelProviders.filter(p => p.status === 'disconnected').length,
        error: channelProviders.filter(p => p.status === 'error').length
      };
    });
    return stats;
  };

  const value = {
    providers,
    providerTemplates,
    addProvider,
    updateProvider,
    deleteProvider,
    setActiveProvider,
    setDefaultProvider,
    testProvider,
    getActiveProvider,
    getDefaultProvider,
    getProviders,
    getProviderStats
  };

  return (
    <ProvidersContext.Provider value={value}>
      {children}
    </ProvidersContext.Provider>
  );
};

export default ProvidersProvider; 