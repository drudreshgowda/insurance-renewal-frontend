# User Management System Guide

## Overview
The User Management system provides comprehensive role-based access control (RBAC) for your application with permissions mapped to actual pages.

## Features
- Create and manage users
- Define custom roles with specific permissions  
- Control access to actual pages and features
- Assign granular permissions to individual users

## Available Pages & Permissions

### Core Pages
- **Dashboard** (`/`): View main dashboard with analytics and overview
- **Upload Data** (`/upload`): Upload policy and case data files
- **Case Tracking** (`/cases`): View and manage active cases
- **Closed Cases** (`/closed-cases`): View and manage closed cases
- **Policy Timeline** (`/policy-timeline`): View policy timeline and history
- **Case Logs** (`/logs`): View system and case logs
- **Claims Management** (`/claims`): Manage insurance claims processing

### Email Pages
- **Email Inbox** (`/emails`): Access email inbox and management
- **Email Dashboard** (`/emails/dashboard`): View email analytics and dashboard
- **Email Analytics** (`/emails/analytics`): View detailed email analytics and reports
- **Bulk Email** (`/emails/bulk`): Send bulk emails and campaigns

### Marketing Pages
- **Campaigns** (`/campaigns`): Manage marketing campaigns
- **Template Manager** (`/templates`): Manage email and document templates

### Survey Pages
- **Feedback & Surveys** (`/feedback`): Manage customer feedback and surveys
- **Survey Designer** (`/survey-designer`): Create and design custom surveys

### Admin Pages
- **Settings** (`/settings`): Access system settings and configuration
- **Billing** (`/billing`): View billing information and invoices
- **User Management** (`/users`): Manage users and permissions

### Personal Pages
- **Profile** (`/profile`): Manage personal profile and account settings

## Default User Roles

### Administrator
- **Full Access** to all 20 pages/features
- Can manage users, roles, and system settings
- **Pages**: All pages including admin functions

### Manager
- **Access to 16 pages** - most features except system administration
- Can manage campaigns, emails, and surveys
- **Pages**: All core, email, marketing, and survey pages + profile
- **Excludes**: Settings, Billing, User Management

### Agent
- **Access to 8 pages** - operational case and email management
- Limited to day-to-day operational tasks
- **Pages**: Dashboard, Cases, Closed Cases, Policy Timeline, Logs, Email Inbox, Email Dashboard, Profile

### Viewer
- **Access to 5 pages** - read-only access to basic features
- Cannot modify data or access admin features
- **Pages**: Dashboard, Cases, Closed Cases, Policy Timeline, Profile

## Usage Instructions

### Adding Users
1. Navigate to Settings → User Management tab
2. Click "Add User" button
3. Fill in user details and select role
4. User automatically gets access to pages based on role
5. Click "Create User"

### Creating Custom Roles
1. Click "Create Role" in Roles & Permissions section
2. Enter role name, ID, and description
3. Select specific pages by category
4. Click "Create Role"

### Managing Individual Page Access
1. Click permissions button for any user
2. Select/deselect specific pages by category
3. See exact page routes and descriptions
4. Changes take effect immediately
5. Click "Update Permissions"

## Permission Mapping

Each permission ID directly maps to an actual page route:

| Permission ID | Page Route | Description |
|---------------|------------|-------------|
| `dashboard` | `/` | Main dashboard |
| `upload` | `/upload` | Data upload page |
| `cases` | `/cases` | Case tracking |
| `closed-cases` | `/closed-cases` | Closed cases view |
| `policy-timeline` | `/policy-timeline` | Policy timeline |
| `logs` | `/logs` | System logs |
| `claims` | `/claims` | Claims management |
| `emails` | `/emails` | Email inbox |
| `email-dashboard` | `/emails/dashboard` | Email dashboard |
| `email-analytics` | `/emails/analytics` | Email analytics |
| `bulk-email` | `/emails/bulk` | Bulk email sender |
| `campaigns` | `/campaigns` | Marketing campaigns |
| `templates` | `/templates` | Template manager |
| `feedback` | `/feedback` | Feedback & surveys |
| `survey-designer` | `/survey-designer` | Survey designer |
| `whatsapp-flow` | `/whatsapp-flow` | WhatsApp Flow Management |
| `settings` | `/settings` | System settings |
| `billing` | `/billing` | Billing information |
| `users` | `/users` | User management |
| `profile` | `/profile` | User profile |

## Developer Integration

### Using Permission Guards
```jsx
import PermissionGuard from '../components/common/PermissionGuard';

// Protect specific pages
<PermissionGuard permission="email-dashboard">
  <EmailDashboardButton />
</PermissionGuard>
```

### Using Permission Hooks
```jsx
import { usePermissions } from '../context/PermissionsContext';

const { hasPermission, canAccessRoute } = usePermissions();

// Check if user can access specific page
if (hasPermission('survey-designer')) {
  // Show survey designer features
}
```

## Security Features
- **Page-level protection**: Each route requires specific permission
- **Real page mapping**: Permissions directly correspond to actual application pages
- **Route validation**: Users cannot access pages they don't have permission for
- **Dynamic navigation**: Menu automatically adapts to user permissions 