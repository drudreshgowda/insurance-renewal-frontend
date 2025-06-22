# Intelipro Renewal Management System - Backend Development Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Requirements](#architecture-requirements)
3. [Database Schema](#database-schema)
4. [API Specifications](#api-specifications)
5. [Authentication & Authorization](#authentication--authorization)
6. [Core Modules](#core-modules)
7. [Integration Requirements](#integration-requirements)
8. [Deployment Guide](#deployment-guide)
9. [Security Specifications](#security-specifications)
10. [Performance Requirements](#performance-requirements)

## System Overview

### Purpose
The Intelipro Renewal Management System is a comprehensive platform for managing insurance policy renewals, customer communications, email management, campaigns, surveys, claims processing, and AI-powered assistance.

### Technology Stack Recommendations
- **Backend Framework**: Node.js with Express.js / Python Django/FastAPI / Java Spring Boot
- **Database**: PostgreSQL (Primary) + Redis (Cache/Sessions)
- **File Storage**: AWS S3 / Azure Blob Storage
- **Real-time**: Socket.IO / WebSocket
- **Queue System**: Redis Bull Queue / RabbitMQ
- **Search Engine**: Elasticsearch (optional)
- **AI Integration**: OpenAI API / Azure OpenAI
- **Email Service**: AWS SES / SendGrid
- **SMS Service**: Twilio / AWS SNS
- **WhatsApp**: WhatsApp Business API

## Architecture Requirements

### Microservices Architecture (Recommended)
```
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (NGINX/Kong)                 │
├─────────────────────────────────────────────────────────────┤
│  Auth Service │ Renewal Service │ Email Service │ AI Service │
├─────────────────────────────────────────────────────────────┤
│ Campaign Svc  │ Survey Service  │ Claims Svc    │ File Svc   │
├─────────────────────────────────────────────────────────────┤
│           Notification Service │ Analytics Service          │
├─────────────────────────────────────────────────────────────┤
│              PostgreSQL │ Redis │ File Storage              │
└─────────────────────────────────────────────────────────────┘
```

### Core Services Required

#### 1. Authentication Service
- JWT token management
- Role-based access control (RBAC)
- Multi-factor authentication
- Session management
- Password policies

#### 2. Renewal Management Service
- Policy renewal processing
- Case tracking and status management
- Batch upload processing
- Timeline management
- Payment integration

#### 3. Email Management Service
- IMAP/SMTP integration
- Email categorization and tagging
- AI-powered sentiment analysis
- Email templates and automation
- Bulk email processing

#### 4. AI Assistant Service
- OpenAI/Azure OpenAI integration
- Context management
- Rate limiting
- Knowledge base management
- Response caching

#### 5. Communication Service
- WhatsApp Business API integration
- SMS gateway integration
- Multi-channel messaging
- Template management
- Flow builder support

#### 6. Campaign Management Service
- Campaign creation and management
- Audience segmentation
- Performance tracking
- A/B testing support

#### 7. Survey & Feedback Service
- Survey builder
- Response collection
- Analytics and reporting
- Feedback categorization

#### 8. Claims Processing Service
- Claim submission and tracking
- Document management
- Approval workflows
- Status notifications

#### 9. File Management Service
- Document upload/download
- File type validation
- Virus scanning
- Thumbnail generation
- Storage optimization

#### 10. Notification Service
- Real-time notifications
- Email notifications
- In-app notifications
- Push notifications
- Notification preferences

## Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100),
    job_title VARCHAR(100),
    role_id INTEGER REFERENCES roles(id),
    status VARCHAR(20) DEFAULT 'active',
    avatar_url VARCHAR(500),
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP
);
```

#### Roles Table
```sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Policies Table
```sql
CREATE TABLE policies (
    id SERIAL PRIMARY KEY,
    policy_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    policy_type VARCHAR(50) NOT NULL,
    premium_amount DECIMAL(12,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    renewal_date DATE,
    grace_period_days INTEGER DEFAULT 30,
    agent_id INTEGER REFERENCES users(id),
    branch_id INTEGER REFERENCES branches(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Customers Table
```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    address JSONB,
    kyc_status VARCHAR(20) DEFAULT 'pending',
    kyc_documents JSONB,
    communication_preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Renewal Cases Table
```sql
CREATE TABLE renewal_cases (
    id SERIAL PRIMARY KEY,
    case_number VARCHAR(100) UNIQUE NOT NULL,
    policy_id INTEGER REFERENCES policies(id),
    status VARCHAR(50) DEFAULT 'new',
    priority VARCHAR(20) DEFAULT 'medium',
    assigned_to INTEGER REFERENCES users(id),
    batch_id INTEGER REFERENCES upload_batches(id),
    renewal_amount DECIMAL(12,2),
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_date TIMESTAMP,
    communication_attempts INTEGER DEFAULT 0,
    last_contact_date TIMESTAMP,
    notes TEXT,
    escalated_to INTEGER REFERENCES users(id),
    escalation_reason TEXT,
    escalated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Upload Batches Table
```sql
CREATE TABLE upload_batches (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    uploaded_by INTEGER REFERENCES users(id),
    total_records INTEGER NOT NULL,
    processed_records INTEGER DEFAULT 0,
    successful_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'processing',
    file_path VARCHAR(500),
    error_log JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Emails Table
```sql
CREATE TABLE emails (
    id SERIAL PRIMARY KEY,
    message_id VARCHAR(255) UNIQUE NOT NULL,
    thread_id VARCHAR(255),
    account_id INTEGER REFERENCES email_accounts(id),
    from_email VARCHAR(255) NOT NULL,
    to_email VARCHAR(255) NOT NULL,
    cc_emails TEXT[],
    bcc_emails TEXT[],
    subject TEXT NOT NULL,
    body_text TEXT,
    body_html TEXT,
    attachments JSONB,
    category VARCHAR(50),
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'new',
    assigned_to INTEGER REFERENCES users(id),
    sentiment_score DECIMAL(3,2),
    sentiment_label VARCHAR(20),
    ai_intent JSONB,
    read_status BOOLEAN DEFAULT FALSE,
    escalated_to INTEGER REFERENCES users(id),
    escalation_reason TEXT,
    received_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Email Accounts Table
```sql
CREATE TABLE email_accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    provider VARCHAR(50) NOT NULL,
    imap_server VARCHAR(255) NOT NULL,
    imap_port INTEGER NOT NULL,
    smtp_server VARCHAR(255) NOT NULL,
    smtp_port INTEGER NOT NULL,
    username VARCHAR(255) NOT NULL,
    password_encrypted VARCHAR(500) NOT NULL,
    use_ssl BOOLEAN DEFAULT TRUE,
    auto_sync BOOLEAN DEFAULT TRUE,
    sync_interval INTEGER DEFAULT 5,
    last_sync TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Campaigns Table
```sql
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    created_by INTEGER REFERENCES users(id),
    target_audience JSONB,
    content JSONB,
    schedule_type VARCHAR(20) DEFAULT 'immediate',
    scheduled_at TIMESTAMP,
    channels VARCHAR(50)[] NOT NULL,
    budget DECIMAL(12,2),
    metrics JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Surveys Table
```sql
CREATE TABLE surveys (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'draft',
    questions JSONB NOT NULL,
    settings JSONB,
    published_at TIMESTAMP,
    expires_at TIMESTAMP,
    response_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Survey Responses Table
```sql
CREATE TABLE survey_responses (
    id SERIAL PRIMARY KEY,
    survey_id INTEGER REFERENCES surveys(id),
    customer_id INTEGER REFERENCES customers(id),
    responses JSONB NOT NULL,
    completion_time INTEGER,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Claims Table
```sql
CREATE TABLE claims (
    id SERIAL PRIMARY KEY,
    claim_number VARCHAR(100) UNIQUE NOT NULL,
    policy_id INTEGER REFERENCES policies(id),
    claim_type VARCHAR(50) NOT NULL,
    claim_amount DECIMAL(12,2) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'submitted',
    priority VARCHAR(20) DEFAULT 'medium',
    assigned_to INTEGER REFERENCES users(id),
    documents JSONB,
    incident_date DATE NOT NULL,
    reported_date DATE NOT NULL,
    settlement_amount DECIMAL(12,2),
    settlement_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### WhatsApp Templates Table
```sql
CREATE TABLE whatsapp_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    status VARCHAR(20) DEFAULT 'pending',
    template_data JSONB NOT NULL,
    created_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Files Table
```sql
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by INTEGER REFERENCES users(id),
    entity_type VARCHAR(50),
    entity_id INTEGER,
    is_public BOOLEAN DEFAULT FALSE,
    virus_scan_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Notifications Table
```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read_status BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    priority VARCHAR(20) DEFAULT 'medium',
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### AI Settings Table
```sql
CREATE TABLE ai_settings (
    id SERIAL PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,
    api_key_encrypted VARCHAR(500) NOT NULL,
    model VARCHAR(100) NOT NULL,
    temperature DECIMAL(3,2) DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 1000,
    response_timeout INTEGER DEFAULT 30,
    rate_limit_per_minute INTEGER DEFAULT 60,
    rate_limit_per_hour INTEGER DEFAULT 1000,
    features JSONB NOT NULL,
    knowledge_base JSONB,
    fallback_enabled BOOLEAN DEFAULT TRUE,
    fallback_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes and Performance Optimization

```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_status ON users(role_id, status);

-- Policy indexes
CREATE INDEX idx_policies_customer ON policies(customer_id);
CREATE INDEX idx_policies_renewal_date ON policies(renewal_date);
CREATE INDEX idx_policies_status ON policies(status);

-- Renewal cases indexes
CREATE INDEX idx_renewal_cases_policy ON renewal_cases(policy_id);
CREATE INDEX idx_renewal_cases_status ON renewal_cases(status);
CREATE INDEX idx_renewal_cases_assigned ON renewal_cases(assigned_to);
CREATE INDEX idx_renewal_cases_batch ON renewal_cases(batch_id);

-- Email indexes
CREATE INDEX idx_emails_account ON emails(account_id);
CREATE INDEX idx_emails_status ON emails(status);
CREATE INDEX idx_emails_category ON emails(category);
CREATE INDEX idx_emails_received_at ON emails(received_at);
CREATE INDEX idx_emails_thread ON emails(thread_id);

-- Campaign indexes
CREATE INDEX idx_campaigns_created_by ON campaigns(created_by);
CREATE INDEX idx_campaigns_status ON campaigns(status);

-- Notification indexes
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read_status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

## API Specifications

### Base URL Structure
```
Production: https://api.intelipro.com/v1
Staging: https://staging-api.intelipro.com/v1
Development: http://localhost:3000/api/v1
```

### Authentication Endpoints

#### POST /auth/login
```json
{
  "email": "user@company.com",
  "password": "password123",
  "remember_me": true
}
```

Response:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 3600,
    "user": {
      "id": 1,
      "email": "user@company.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "admin",
      "permissions": ["dashboard", "upload", "cases"]
    }
  }
}
```

#### POST /auth/refresh
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### POST /auth/logout
Headers: `Authorization: Bearer <token>`

#### POST /auth/forgot-password
```json
{
  "email": "user@company.com"
}
```

#### POST /auth/reset-password
```json
{
  "token": "reset_token_here",
  "password": "new_password123"
}
```

### Dashboard Endpoints

#### GET /dashboard/stats
Headers: `Authorization: Bearer <token>`
Query Parameters:
- `date_range`: week|month|custom
- `start_date`: YYYY-MM-DD (required if date_range=custom)
- `end_date`: YYYY-MM-DD (required if date_range=custom)
- `policy_type`: all|auto|health|life
- `case_status`: all|new|in_progress|resolved

Response:
```json
{
  "success": true,
  "data": {
    "totalCases": 1250,
    "inProgress": 320,
    "renewed": 780,
    "pendingAction": 95,
    "errors": 55,
    "paymentCollected": 13850000,
    "paymentPending": 3250000
  }
}
```

#### GET /dashboard/trends
Query Parameters: Same as stats endpoint

Response:
```json
{
  "success": true,
  "data": [
    {
      "name": "Mon",
      "newCases": 65,
      "renewals": 42,
      "successRate": 0.85
    }
  ]
}
```

#### GET /dashboard/batch-status
Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "fileName": "renewal_batch_2024_01.xlsx",
      "status": {
        "renewed": 150,
        "inProgress": 75,
        "pending": 25,
        "failed": 10
      },
      "payment": {
        "received": 2500000,
        "pending": 750000
      }
    }
  ]
}
```

### Upload Endpoints

#### POST /upload/batch
Headers: 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

Body:
```
file: <Excel/CSV file>
policy_type: "auto"
```

Response:
```json
{
  "success": true,
  "data": {
    "batch_id": 123,
    "file_name": "renewal_batch_2024_01.xlsx",
    "total_records": 500,
    "status": "processing"
  }
}
```

#### GET /upload/batches
Query Parameters:
- `page`: 1
- `limit`: 10
- `status`: all|processing|completed|failed

#### GET /upload/batch/:id/status
Response:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "status": "completed",
    "total_records": 500,
    "processed_records": 500,
    "successful_records": 485,
    "failed_records": 15,
    "errors": [
      {
        "row": 45,
        "error": "Invalid policy number format"
      }
    ]
  }
}
```

### Renewal Cases Endpoints

#### GET /cases
Query Parameters:
- `page`: 1
- `limit`: 10
- `status`: all|new|in_progress|renewed|failed
- `priority`: all|low|medium|high
- `assigned_to`: user_id
- `search`: search_term
- `sort_by`: created_at|renewal_date|priority
- `sort_order`: asc|desc

Response:
```json
{
  "success": true,
  "data": {
    "cases": [
      {
        "id": 1,
        "case_number": "REN-2024-001",
        "policy": {
          "policy_number": "POL-123456",
          "customer_name": "John Doe",
          "policy_type": "Auto"
        },
        "status": "in_progress",
        "priority": "high",
        "renewal_amount": 25000,
        "payment_status": "pending",
        "assigned_to": {
          "id": 5,
          "name": "Agent Smith"
        },
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 50,
      "total_records": 500,
      "per_page": 10
    }
  }
}
```

#### GET /cases/:id
Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "case_number": "REN-2024-001",
    "policy": {
      "policy_number": "POL-123456",
      "customer": {
        "id": 100,
        "name": "John Doe",
        "email": "john.doe@email.com",
        "phone": "+1-555-0123"
      },
      "policy_type": "Auto",
      "premium_amount": 25000,
      "start_date": "2023-01-15",
      "end_date": "2024-01-15"
    },
    "status": "in_progress",
    "priority": "high",
    "renewal_amount": 25000,
    "payment_status": "pending",
    "assigned_to": {
      "id": 5,
      "name": "Agent Smith",
      "email": "agent.smith@company.com"
    },
    "communication_attempts": 3,
    "last_contact_date": "2024-01-10T14:30:00Z",
    "notes": "Customer requested payment extension",
    "timeline": [
      {
        "date": "2024-01-15T10:30:00Z",
        "action": "Case created",
        "user": "System",
        "details": "Automatic case creation from batch upload"
      }
    ],
    "documents": [
      {
        "id": 1,
        "name": "renewal_notice.pdf",
        "url": "/files/download/1",
        "uploaded_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### PUT /cases/:id
```json
{
  "status": "renewed",
  "payment_status": "completed",
  "payment_method": "credit_card",
  "payment_date": "2024-01-20T15:30:00Z",
  "notes": "Payment completed successfully"
}
```

#### POST /cases/:id/assign
```json
{
  "assigned_to": 5,
  "notes": "Assigning to senior agent for follow-up"
}
```

#### POST /cases/:id/escalate
```json
{
  "escalated_to": 10,
  "reason": "Customer requesting immediate attention",
  "priority": "urgent"
}
```

### Email Management Endpoints

#### GET /emails
Query Parameters:
- `page`: 1
- `limit`: 10
- `status`: all|new|in_progress|resolved
- `category`: all|complaint|feedback|refund|appointment
- `assigned_to`: user_id
- `date_from`: YYYY-MM-DD
- `date_to`: YYYY-MM-DD
- `search`: search_term

Response:
```json
{
  "success": true,
  "data": {
    "emails": [
      {
        "id": 1,
        "message_id": "msg_123456",
        "from_email": "customer@email.com",
        "subject": "Policy renewal inquiry",
        "category": "complaint",
        "priority": "high",
        "status": "new",
        "sentiment": {
          "score": -0.65,
          "label": "negative"
        },
        "ai_intent": {
          "category": "complaint",
          "confidence": 94.5
        },
        "received_at": "2024-01-15T10:30:00Z",
        "read_status": false
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 25,
      "total_records": 250,
      "per_page": 10
    }
  }
}
```

#### GET /emails/:id
Response includes full email details with body, attachments, thread history

#### PUT /emails/:id
```json
{
  "status": "in_progress",
  "category": "complaint",
  "assigned_to": 5,
  "priority": "high"
}
```

#### POST /emails/:id/reply
```json
{
  "to": "customer@email.com",
  "subject": "Re: Policy renewal inquiry",
  "body": "Thank you for your inquiry...",
  "template_id": 5
}
```

#### POST /emails/:id/escalate
```json
{
  "escalated_to": 10,
  "reason": "Complex technical issue requiring supervisor attention"
}
```

### AI Assistant Endpoints

#### POST /ai/query
```json
{
  "query": "How can I improve renewal rates?",
  "context": {
    "page": "dashboard",
    "user_role": "manager"
  }
}
```

Response:
```json
{
  "success": true,
  "data": {
    "response": "To improve renewal rates, focus on: 1) Proactive communication...",
    "confidence": 0.95,
    "sources": ["internal_docs", "best_practices"],
    "suggestions": [
      "How to optimize the renewal process?",
      "What communication strategies work best?"
    ]
  }
}
```

#### GET /ai/settings
Response:
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "provider": "openai",
    "model": "gpt-4",
    "temperature": 0.7,
    "max_tokens": 1000,
    "features": {
      "renewalInsights": true,
      "processOptimization": true,
      "customerRetention": true
    }
  }
}
```

#### PUT /ai/settings
```json
{
  "provider": "openai",
  "model": "gpt-4",
  "temperature": 0.8,
  "max_tokens": 1500,
  "api_key": "sk-...",
  "features": {
    "renewalInsights": true,
    "processOptimization": true,
    "customerRetention": true,
    "predictiveAnalytics": false
  }
}
```

### Campaign Management Endpoints

#### GET /campaigns
Query Parameters:
- `page`: 1
- `limit`: 10
- `status`: all|draft|active|paused|completed
- `type`: all|email|sms|whatsapp

#### POST /campaigns
```json
{
  "name": "Q1 Renewal Campaign",
  "description": "Quarterly renewal reminder campaign",
  "type": "email",
  "target_audience": {
    "policy_types": ["auto", "health"],
    "renewal_window": "30_days",
    "regions": ["north", "south"]
  },
  "content": {
    "subject": "Your policy renewal is due",
    "template_id": 5,
    "personalization": true
  },
  "schedule_type": "scheduled",
  "scheduled_at": "2024-02-01T09:00:00Z",
  "channels": ["email", "sms"]
}
```

#### GET /campaigns/:id/analytics
Response:
```json
{
  "success": true,
  "data": {
    "sent": 1000,
    "delivered": 980,
    "opened": 650,
    "clicked": 320,
    "converted": 150,
    "open_rate": 66.3,
    "click_rate": 32.7,
    "conversion_rate": 15.3
  }
}
```

### File Management Endpoints

#### POST /files/upload
Headers: 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

Body:
```
file: <file>
entity_type: "case"
entity_id: 123
is_public: false
```

#### GET /files/:id/download
Headers: `Authorization: Bearer <token>`

#### DELETE /files/:id
Headers: `Authorization: Bearer <token>`

### Notification Endpoints

#### GET /notifications
Query Parameters:
- `page`: 1
- `limit`: 10
- `read_status`: all|read|unread
- `type`: all|assignment|update|system

#### PUT /notifications/:id/read
Headers: `Authorization: Bearer <token>`

#### PUT /notifications/mark-all-read
Headers: `Authorization: Bearer <token>`

## Authentication & Authorization

### JWT Token Structure
```json
{
  "sub": "user_id",
  "email": "user@company.com",
  "role": "admin",
  "permissions": ["dashboard", "upload", "cases"],
  "iat": 1642680000,
  "exp": 1642683600
}
```

### Role-Based Permissions

#### Admin Role
- Full system access
- User management
- System settings
- All module permissions

#### Manager Role
- Dashboard access
- Case management
- Email management
- Campaign management
- Team oversight
- Reports and analytics

#### Agent Role
- Assigned case access
- Email handling
- Customer communication
- Basic reporting

#### Viewer Role
- Read-only dashboard access
- View assigned cases
- Basic reporting

### Permission Matrix
```json
{
  "dashboard": ["admin", "manager", "agent", "viewer"],
  "upload": ["admin", "manager"],
  "cases": ["admin", "manager", "agent"],
  "emails": ["admin", "manager", "agent"],
  "campaigns": ["admin", "manager"],
  "settings": ["admin"],
  "users": ["admin"],
  "analytics": ["admin", "manager"]
}
```

## Security Specifications

### Data Encryption
- **At Rest**: AES-256 encryption for sensitive data
- **In Transit**: TLS 1.3 for all API communications
- **Database**: Column-level encryption for PII data
- **File Storage**: Server-side encryption with customer-managed keys

### Security Headers
```javascript
{
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}
```

### Input Validation
- Sanitize all user inputs
- Validate file uploads (type, size, content)
- SQL injection prevention
- XSS protection
- CSRF protection

### Rate Limiting
```javascript
{
  "login": "5 attempts per 15 minutes",
  "api_general": "1000 requests per hour",
  "upload": "10 uploads per hour",
  "ai_queries": "100 requests per hour"
}
```

### Audit Logging
Track all critical operations:
- User authentication events
- Data modifications
- File uploads/downloads
- Permission changes
- System configuration changes

## Performance Requirements

### Response Time Targets
- API endpoints: < 200ms (95th percentile)
- Database queries: < 100ms (average)
- File uploads: < 5 seconds for 10MB files
- Real-time notifications: < 100ms

### Scalability Requirements
- Support 1000+ concurrent users
- Handle 10,000+ renewal cases per batch
- Process 1M+ emails per month
- Store 100GB+ of files

### Caching Strategy
- Redis for session storage
- API response caching (5-60 minutes)
- Database query result caching
- File metadata caching
- CDN for static assets

## Deployment Guide

### Environment Configuration

#### Production Environment
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  api:
    image: intelipro/api:latest
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://user:pass@db:5432/intelipro
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      AI_API_KEY: ${AI_API_KEY}
    ports:
      - "3000:3000"
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: intelipro
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
```

#### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/intelipro
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d

# AI Services
OPENAI_API_KEY=sk-your-openai-key
AI_PROVIDER=openai
AI_MODEL=gpt-4

# Email Services
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@company.com
SMTP_PASS=your-app-password

# File Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=intelipro-files
AWS_REGION=us-east-1

# WhatsApp
WHATSAPP_ACCESS_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your-verify-token

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

### Database Migration Scripts

#### Initial Migration
```sql
-- migrations/001_initial_schema.sql
-- Create all tables as defined in Database Schema section
```

#### Sample Data Migration
```sql
-- migrations/002_sample_data.sql
INSERT INTO roles (name, display_name, description, permissions) VALUES
('admin', 'Administrator', 'Full system access', '["dashboard","upload","cases","emails","campaigns","settings","users","analytics"]'),
('manager', 'Manager', 'Management access', '["dashboard","upload","cases","emails","campaigns","analytics"]'),
('agent', 'Agent', 'Agent access', '["dashboard","cases","emails"]'),
('viewer', 'Viewer', 'Read-only access', '["dashboard"]');

INSERT INTO users (email, password_hash, first_name, last_name, role_id) VALUES
('admin@company.com', '$2b$12$encrypted_password_hash', 'Admin', 'User', 1);
```

### Monitoring & Logging

#### Application Monitoring
```javascript
// monitoring/health-check.js
app.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      redis: 'connected',
      ai_service: 'connected'
    },
    version: process.env.APP_VERSION
  };
  res.json(health);
});
```

#### Logging Configuration
```javascript
// config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

This comprehensive guide provides all the necessary specifications for building a robust backend system that perfectly supports the Intelipro Renewal Management frontend application. The backend should be built following these specifications to ensure seamless integration and optimal performance. 