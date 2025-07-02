# Intelipro Insurance Policy Renewal System - Frontend

A comprehensive, modern web-based frontend for the Intelipro Insurance Policy Renewal System. This application provides advanced data management, multi-channel campaign capabilities, real-time analytics, and complete case management for insurance policy renewals.

## 🚀 Features

### 📊 Advanced Dashboard
- **Real-time Analytics**: Live KPI tracking and performance metrics
- **Interactive Charts**: Trend analysis with Recharts visualization library
- **Policy Renewal Metrics**: Comprehensive renewal tracking and forecasting
- **Customizable Widgets**: Personalized dashboard with drag-and-drop functionality
- **Multi-theme Support**: Professional dark/light theme with smooth transitions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 📤 Enhanced Upload System
- **Bulk Data Upload**: Excel (.xlsx) and CSV file support with comprehensive validation
- **Template Downloads**: Pre-configured templates for data consistency and accuracy
- **Real-time Processing**: Live progress tracking with detailed status updates and error reporting
- **Upload History**: Complete audit trail with success/failure metrics and downloadable reports
- **Campaign Integration**: Direct multi-channel campaign creation from uploaded data
- **Batch Processing**: Efficient handling of large datasets with progress monitoring

### 🎯 Multi-Channel Campaign Management
- **Email Campaigns**: Rich template library with WYSIWYG editor and personalization
- **WhatsApp Campaigns**: Business API integration with interactive flow builder
- **SMS Campaigns**: Bulk messaging with template management and personalization
- **Multi-Channel Campaigns**: Unified campaigns across email, WhatsApp, and SMS
- **Advanced Scheduling**: Immediate execution or future scheduling with timezone support
- **Real-time Analytics**: Comprehensive tracking including open rates, click rates, and conversions
- **A/B Testing**: Campaign optimization with split testing capabilities
- **Audience Segmentation**: Advanced targeting based on customer data and behavior

### 📋 Comprehensive Case Management
- **Case Tracking**: Complete lifecycle management from creation to closure
- **Policy Timeline**: Visual timeline with key milestones and automated updates
- **Status Management**: Real-time status updates with automated notifications
- **Bulk Operations**: Efficient handling of multiple cases with batch processing
- **Advanced Filtering**: Multi-criteria search and sorting with saved filter presets
- **Case Details**: Comprehensive case view with full history and communication logs
- **Priority Management**: Case prioritization with escalation workflows
- **Agent Assignment**: Intelligent case routing and workload balancing

### 📧 Advanced Email Management
- **Smart Inbox**: AI-powered email categorization and priority sorting
- **Email Analytics**: Comprehensive performance metrics and engagement tracking
- **Template Manager**: Reusable email templates with variable substitution
- **Bulk Email Tools**: Mass communication with personalization and scheduling
- **IMAP/SMTP Integration**: Support for existing email systems and accounts
- **Email Dashboard**: Centralized email performance monitoring
- **Automated Responses**: Rule-based email automation and routing

### 📋 Survey & Feedback System
- **Survey Designer**: Drag-and-drop survey builder with multiple question types
- **Response Analytics**: Real-time feedback analysis with sentiment tracking
- **Customer Satisfaction**: NPS scoring and satisfaction trend analysis
- **Automated Workflows**: Trigger-based survey distribution and follow-ups
- **Custom Branding**: Branded survey forms with company styling
- **Multi-channel Distribution**: Survey delivery via email, SMS, and WhatsApp

### 🔐 Advanced Security & User Management
- **Role-Based Access Control (RBAC)**: Granular permissions system with 20+ configurable roles
- **Multi-Factor Authentication**: Enhanced security with TOTP and SMS verification
- **Audit Logging**: Complete activity tracking with compliance reporting
- **Session Management**: Secure authentication with JWT token handling
- **Permission Guards**: Component-level access control with feature flags
- **Data Encryption**: End-to-end encryption for sensitive data

### 🎨 Modern UI/UX
- **Material-UI Design**: Professional, responsive interface with Material Design 3
- **Smooth Animations**: Enhanced user experience with Framer Motion transitions
- **Mobile Responsive**: Fully optimized for all device sizes and orientations
- **Accessibility**: WCAG 2.1 AA compliant design with screen reader support
- **Performance Optimized**: Lazy loading, code splitting, and efficient rendering
- **Progressive Web App**: PWA capabilities with offline functionality

### 🔗 Third-Party Integrations
- **WhatsApp Business API**: Official Meta integration for business messaging
- **Payment Gateways**: Razorpay, Stripe integration for policy renewals
- **Email Services**: AWS SES, SendGrid integration for reliable email delivery
- **SMS Services**: Twilio, AWS SNS integration for SMS campaigns
- **Cloud Storage**: AWS S3, Azure Blob Storage for file management
- **AI Services**: OpenAI, Azure OpenAI for intelligent assistance

## 🛠️ Technology Stack

### Frontend Core
- **React 18** - Modern React with hooks, context, and concurrent features
- **Material-UI (MUI) 5** - Professional component library with Material Design 3
- **React Router 6** - Client-side routing with nested routes and lazy loading
- **Recharts 2.6** - Data visualization and analytics with responsive charts
- **Emotion** - CSS-in-JS styling solution with theme support

### Key Dependencies
```json
{
  "@mui/material": "^5.13.0",
  "@mui/icons-material": "^5.11.16",
  "@mui/x-date-pickers": "^7.28.3",
  "react": "^18.2.0",
  "react-router-dom": "^6.11.1",
  "recharts": "^2.6.2",
  "date-fns": "^2.30.0"
}
```

### Development Tools
- **React Scripts 5** - Build tooling and development server
- **Testing Library** - Comprehensive testing utilities
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v8 or higher) or **yarn**
- Modern web browser with ES6+ support

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-organization/intelipro-renewal-frontend.git
cd intelipro-renewal-frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Create environment configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the development server**
```bash
npm start
# or
yarn start
```

5. **Open your browser**
```
http://localhost:3000
```

### Build for Production
```bash
npm run build
# or
yarn build
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── campaign/        # Campaign-specific components
│   ├── common/          # Shared components (Layout, Guards, etc.)
│   │   ├── Layout.jsx           # Main application layout
│   │   ├── PermissionGuard.jsx  # Access control component
│   │   ├── ProtectedRoute.jsx   # Route protection
│   │   ├── ErrorBoundary.jsx    # Error handling
│   │   └── WelcomeModal.jsx     # Onboarding modal
│   ├── notifications/   # Notification system
│   └── whatsapp/       # WhatsApp integration components
├── context/             # React Context providers
│   ├── AuthContext.js           # Authentication state management
│   ├── PermissionsContext.jsx   # RBAC permissions management
│   ├── SettingsContext.jsx      # Application settings
│   ├── NotificationsContext.js  # Real-time notifications
│   └── ThemeModeContext.js      # Theme management
├── pages/               # Main application pages (30+ pages)
│   ├── Dashboard.jsx            # Main dashboard with analytics
│   ├── Upload.jsx               # Enhanced upload system
│   ├── Campaigns.jsx            # Campaign management
│   ├── CaseTracking.jsx         # Case management
│   ├── Email.jsx                # Email inbox
│   ├── EmailDashboard.jsx       # Email analytics
│   ├── EmailAnalytics.jsx       # Detailed email reports
│   ├── BulkEmail.jsx            # Bulk email sender
│   ├── WhatsappFlow.jsx         # WhatsApp flow builder
│   ├── Feedback.jsx             # Survey and feedback
│   ├── SurveyDesigner.jsx       # Survey creation tool
│   ├── Settings.jsx             # System configuration
│   ├── Users.jsx                # User management
│   └── [25+ other pages]        # Additional functionality
├── services/            # API and external services
│   └── api.js          # Comprehensive API integration layer
└── styles/             # Global styles and themes
    └── index.css       # Main stylesheet with custom properties
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Core Application
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0

# File Upload Configuration
REACT_APP_UPLOAD_MAX_SIZE=10485760
REACT_APP_SUPPORTED_FILE_TYPES=.xlsx,.csv,.pdf
REACT_APP_MAX_FILES_PER_UPLOAD=5

# Third-Party Service URLs
REACT_APP_WHATSAPP_API_URL=https://graph.facebook.com/v17.0
REACT_APP_EMAIL_SERVICE_URL=https://api.emailservice.com
REACT_APP_SMS_SERVICE_URL=https://api.twilio.com
REACT_APP_PAYMENT_GATEWAY_URL=https://api.razorpay.com

# Feature Flags
REACT_APP_ENABLE_WHATSAPP_CAMPAIGNS=true
REACT_APP_ENABLE_SMS_CAMPAIGNS=true
REACT_APP_ENABLE_AI_ASSISTANT=true
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_PWA=true

# Analytics & Monitoring
REACT_APP_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
REACT_APP_ENABLE_PERFORMANCE_MONITORING=true
REACT_APP_ENABLE_ERROR_TRACKING=true

# Authentication
REACT_APP_AUTH_PROVIDER=jwt
REACT_APP_AUTH0_DOMAIN=your-domain.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your_client_id
REACT_APP_JWT_SECRET=your_jwt_secret

# UI Configuration
REACT_APP_DEFAULT_THEME=light
REACT_APP_ENABLE_DARK_MODE=true
REACT_APP_COMPANY_NAME=Intelipro Insurance
REACT_APP_SUPPORT_EMAIL=support@intelipro.com
REACT_APP_SUPPORT_PHONE=+1-800-123-4567

# Security
REACT_APP_ENABLE_CSP=true
REACT_APP_ENABLE_HTTPS_ONLY=true
REACT_APP_SESSION_TIMEOUT=3600
```

### API Integration
The application integrates with a comprehensive RESTful backend API:

#### Core Endpoints
- `/api/auth/*` - Authentication and authorization
- `/api/upload/*` - File upload and processing
- `/api/campaigns/*` - Multi-channel campaign management
- `/api/cases/*` - Case tracking and management
- `/api/emails/*` - Email management and analytics
- `/api/surveys/*` - Survey and feedback management
- `/api/users/*` - User and role management
- `/api/templates/*` - Template management
- `/api/analytics/*` - Performance analytics
- `/api/notifications/*` - Real-time notifications

#### Third-Party API Integrations
- **WhatsApp Business API** - Meta/Facebook integration
- **Email Services** - AWS SES, SendGrid integration
- **SMS Services** - Twilio, AWS SNS integration
- **Payment Gateways** - Razorpay, Stripe integration
- **AI Services** - OpenAI, Azure OpenAI integration
- **Cloud Storage** - AWS S3, Azure Blob Storage

## 📊 Key Features in Detail

### Enhanced Upload System
- **File Validation**: Comprehensive validation of file format, size, and content
- **Progress Tracking**: Real-time upload progress with detailed feedback and ETA
- **Error Handling**: Intelligent error reporting with recovery suggestions
- **History Management**: Complete audit trail with downloadable reports
- **Campaign Integration**: One-click multi-channel campaign creation
- **Batch Processing**: Efficient handling of large datasets with memory optimization

### Advanced Campaign Management
- **Multi-Channel Support**: Unified campaigns across email, WhatsApp, and SMS
- **Template Library**: 50+ pre-built templates with customization options
- **Scheduling Options**: Immediate execution or future scheduling with timezone support
- **Performance Analytics**: Real-time tracking with detailed engagement metrics
- **Audience Segmentation**: Advanced targeting with 20+ criteria options
- **A/B Testing**: Split testing with statistical significance analysis

### Comprehensive Case Management
- **Lifecycle Tracking**: Complete case journey from creation to resolution
- **Automated Workflows**: Rule-based automation with custom triggers
- **Bulk Operations**: Efficient handling of thousands of cases simultaneously
- **Integration Ready**: API-first design for external system integration
- **SLA Management**: Service level agreement tracking with escalation alerts

### Advanced Analytics
- **Real-time Dashboards**: Live performance monitoring with auto-refresh
- **Custom Reports**: Drag-and-drop report builder with 30+ metrics
- **Trend Analysis**: Historical data analysis with predictive insights
- **Export Capabilities**: PDF, Excel, CSV export with scheduling
- **Performance Benchmarking**: Industry comparison and goal tracking

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API integration and workflow testing
- **E2E Tests**: Complete user journey testing
- **Performance Tests**: Load testing and optimization

```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Production Build
```bash
# Create optimized production build
npm run build

# Analyze bundle size
npm run analyze

# Test production build locally
npm run serve
```

### Docker Deployment
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment-Specific Configurations
- **Development**: Hot reloading, debug tools, mock APIs
- **Staging**: Production-like environment with test data
- **Production**: Optimized build, CDN integration, monitoring

## 📚 Documentation

- [Development Guidelines](DEVELOPMENT_GUIDELINES.md) - Code quality standards and best practices
- [User Management Guide](USER_MANAGEMENT_GUIDE.md) - RBAC system and user administration
- [Backend Development Guide](BACKEND_DEVELOPMENT_GUIDE.md) - API specifications and backend requirements
- [API Integration Summary](API_INTEGRATION_SUMMARY.md) - Third-party service integration guide

## 🔒 Security Features

### Application Security
- **Input Validation**: Comprehensive client and server-side validation
- **XSS Protection**: Content Security Policy and input sanitization
- **CSRF Protection**: Token-based request validation
- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control with feature flags
- **Data Encryption**: End-to-end encryption for sensitive data

### Compliance
- **GDPR Compliance**: Data protection and privacy controls
- **SOX Compliance**: Financial data access controls
- **Industry Standards**: Insurance industry-specific compliance
- **Audit Trails**: Complete activity logging for compliance reporting

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow development guidelines and coding standards
4. Write comprehensive tests for new features
5. Commit changes with conventional commit messages
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request with detailed description

### Code Quality Standards
- **ESLint**: Enforced code quality rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality checks
- **Conventional Commits**: Standardized commit messages
- **Code Reviews**: Mandatory peer review process

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Maintenance

### Support Channels
- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: Comprehensive guides and API documentation
- **Email Support**: support@intelipro.com
- **Phone Support**: +1-800-123-4567

### Maintenance Schedule
- **Regular Updates**: Monthly feature releases
- **Security Patches**: Immediate security updates
- **Dependency Updates**: Quarterly dependency reviews
- **Performance Optimization**: Ongoing performance monitoring

---

**Built with ❤️ for efficient insurance policy renewal management**
**© 2024 Intelipro Insurance Solutions. All rights reserved.**
