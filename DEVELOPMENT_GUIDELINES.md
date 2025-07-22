# Development Guidelines

## 📋 Overview

This document outlines the development standards, best practices, and guidelines for the Renewal Frontend application. Following the comprehensive ESLint cleanup, these guidelines ensure continued code quality and maintainability.

---

## 🎯 Code Quality Standards

### **ESLint Compliance (MANDATORY)**
- ✅ **Zero warnings policy** - All code must pass ESLint without any warnings
- ✅ **Zero errors policy** - No ESLint errors allowed in production builds
- ✅ **Automatic fixing** - Use `npm run lint:fix` before committing
- ✅ **Pre-commit hooks** - Consider adding ESLint checks to git hooks

### **ESLint Rules Enforced:**
1. **no-unused-vars** - No unused variables, functions, or imports
2. **react-hooks/exhaustive-deps** - Complete and accurate dependency arrays
3. **no-use-before-define** - Functions must be defined before use
4. **no-console** - No console statements in production code

### **Code Quality Metrics:**
- **Current Status:** 0 ESLint warnings across all components
- **Target:** Maintain 0 warnings for all new code
- **Review Requirement:** All PRs must pass ESLint checks

---

## ⚛️ React Development Standards

### **Component Architecture:**
1. **Functional Components Only** - Use React Hooks instead of class components
2. **Single Responsibility** - Each component should have one clear purpose
3. **Prop Validation** - Use PropTypes or prepare for TypeScript integration
4. **Error Boundaries** - Implement error boundaries for robust error handling

### **React Hooks Best Practices:**

#### **useState:**
```javascript
// ✅ Good: Descriptive names and proper initialization
const [isLoading, setIsLoading] = useState(false);
const [userData, setUserData] = useState(null);

// ❌ Bad: Generic names and missing initialization
const [data, setData] = useState();
const [flag, setFlag] = useState();
```

#### **useEffect:**
```javascript
// ✅ Good: Complete dependency array
useEffect(() => {
  fetchUserData();
}, [userId, apiEndpoint]); // Include ALL dependencies

// ❌ Bad: Missing dependencies
useEffect(() => {
  fetchUserData();
}, []); // ESLint will warn about missing dependencies
```

#### **useCallback:**
```javascript
// ✅ Good: Memoize functions that are passed as props or used in dependencies
const handleSubmit = useCallback(async (formData) => {
  await submitForm(formData);
  setSubmitted(true);
}, [submitForm]); // Include dependencies

// ❌ Bad: Not memoizing functions that cause re-renders
const handleSubmit = (formData) => {
  // This creates a new function on every render
};
```

#### **useMemo:**
```javascript
// ✅ Good: Memoize expensive calculations or objects
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

const agentsList = useMemo(() => [
  'Priya Patel',
  'Ravi Gupta',
  'Neha Sharma'
], []); // Prevent array recreation on every render

// ❌ Bad: Creating objects/arrays in render
const agentsList = ['Priya Patel', 'Ravi Gupta']; // New array every render
```

---

## 📦 Import Management

### **Import Organization:**
```javascript
// ✅ Good: Organized imports
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { customUtility } from '../utils/helpers';

// ❌ Bad: Unused imports
import {
  Box,
  Typography,
  Button,
  Card,
  Paper, // Unused - ESLint will warn
  Tooltip // Unused - ESLint will warn
} from '@mui/material';
```

### **Import Rules:**
1. **Only import what you use** - Remove unused imports immediately
2. **Group related imports** - React hooks together, Material-UI components together
3. **Use named imports** - Prefer named imports over default imports where possible
4. **Alphabetical ordering** - Keep imports organized alphabetically within groups

---

## 🎨 UI/UX Standards

### **Material-UI Usage:**
1. **Consistent Theming** - Use the established theme colors and typography
2. **Responsive Design** - Use Grid system and breakpoints consistently
3. **Accessibility** - Follow WCAG 2.1 guidelines
4. **Performance** - Only import components that are actually used

### **Cultural Guidelines:**
1. **Indian Names** - Use Indian names in all mock data and examples
2. **Cultural Context** - Consider Indian business practices and cultural norms
3. **Language Support** - Ensure new features work with multi-language support
4. **Number Formats** - Use Indian number formatting (₹ symbol, lakhs/crores)

### **UI Text Standards:**
- Use "Email Manager" (not "Renewal Email Manager")
- Use "WhatsApp Manager" (not "Renewal WhatsApp Manager")
- Maintain consistency with established terminology

---

## 🚀 Performance Guidelines

### **Performance Best Practices:**
1. **Memoization** - Use `React.memo`, `useMemo`, and `useCallback` strategically
2. **Code Splitting** - Implement lazy loading for large components
3. **Bundle Optimization** - Regularly audit bundle size and remove unused dependencies
4. **Image Optimization** - Use appropriate image formats and lazy loading

### **Performance Monitoring:**
```javascript
// ✅ Good: Performance-conscious component
const ExpensiveComponent = React.memo(({ data, onAction }) => {
  const processedData = useMemo(() => {
    return heavyDataProcessing(data);
  }, [data]);

  const handleAction = useCallback((item) => {
    onAction(item);
  }, [onAction]);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} data={item} onClick={handleAction} />
      ))}
    </div>
  );
});
```

---

## 🔧 Development Workflow

### **Before Starting Development:**
1. **Pull latest changes** from main branch
2. **Run ESLint check** - `npm run lint`
3. **Check for warnings** - Should show 0 warnings
4. **Start development server** - `npm start`

### **During Development:**
1. **Write clean code** - Follow established patterns
2. **Test frequently** - Check functionality as you develop
3. **Run ESLint regularly** - Fix warnings immediately
4. **Use React DevTools** - Monitor performance and re-renders

### **Before Committing:**
1. **Run full ESLint check** - `npm run lint`
2. **Fix all warnings** - Use `npm run lint:fix` if needed
3. **Test functionality** - Ensure features work as expected
4. **Check console** - No console errors or warnings
5. **Review changes** - Ensure only necessary changes are included

### **Code Review Checklist:**
- [ ] No ESLint warnings or errors
- [ ] Proper React Hook usage and dependencies
- [ ] No unused imports, variables, or functions
- [ ] Performance considerations addressed
- [ ] Cultural guidelines followed (Indian names, context)
- [ ] UI text follows established conventions
- [ ] No console.log statements in production code
- [ ] Error handling implemented where needed
- [ ] Accessibility standards met

---

## 📊 Testing Standards

### **Testing Requirements:**
1. **Component Testing** - Test component rendering and interactions
2. **Hook Testing** - Test custom hooks with proper cleanup
3. **Integration Testing** - Test component interactions and data flow
4. **Accessibility Testing** - Use tools like axe-core for accessibility checks

### **Testing Best Practices:**
```javascript
// ✅ Good: Comprehensive test
import { render, screen, fireEvent } from '@testing-library/react';
import { EmailManager } from './EmailManager';

test('should filter emails when search term is entered', () => {
  render(<EmailManager />);
  
  const searchInput = screen.getByPlaceholderText('Search emails...');
  fireEvent.change(searchInput, { target: { value: 'urgent' } });
  
  expect(screen.getByText('Urgent policy renewal')).toBeInTheDocument();
});
```

---

## 🔒 Security Guidelines

### **Security Best Practices:**
1. **Input Validation** - Validate all user inputs
2. **XSS Prevention** - Sanitize HTML content and user inputs
3. **Authentication** - Implement proper JWT handling
4. **Error Handling** - Don't expose sensitive information in errors
5. **HTTPS Only** - All production deployments must use HTTPS

### **Data Privacy:**
1. **GDPR Compliance** - Implement proper data handling
2. **User Consent** - Get explicit consent for data processing
3. **Data Minimization** - Only collect necessary data
4. **Secure Storage** - Use secure methods for sensitive data

---

## 🌍 Internationalization (i18n)

### **i18n Best Practices:**
1. **Translation Keys** - Use descriptive, hierarchical keys
2. **Context Awareness** - Consider cultural context in translations
3. **Fallback System** - Always provide English fallback
4. **Professional Translation** - Use native speakers for translation review

### **i18n Implementation:**
```javascript
// ✅ Good: Proper i18n usage
import { useTranslation } from 'react-i18next';

const EmailManager = () => {
  const { t } = useTranslation();
  
  return (
    <Typography variant="h4">
      {t('email.manager.title')} {/* Use translation keys */}
    </Typography>
  );
};
```

---

## 📝 Documentation Standards

### **Code Documentation:**
1. **Inline Comments** - Document complex logic and business rules
2. **Function Documentation** - Document function purpose, parameters, and return values
3. **Component Documentation** - Document props, usage, and examples
4. **README Updates** - Keep documentation up to date with changes

### **Documentation Example:**
```javascript
/**
 * Filters emails based on search criteria and user preferences
 * @param {Array} emails - Array of email objects to filter
 * @param {string} searchTerm - Search term to match against email content
 * @param {string} statusFilter - Filter by email status (new, in-progress, resolved)
 * @param {string} categoryFilter - Filter by email category
 * @returns {Array} Filtered array of emails
 */
const filterEmails = useCallback((emails, searchTerm, statusFilter, categoryFilter) => {
  // Implementation with proper filtering logic
}, []);
```

---

## 🚨 Error Handling

### **Error Handling Standards:**
1. **Error Boundaries** - Implement at appropriate component levels
2. **User-Friendly Messages** - Show meaningful error messages to users
3. **Logging** - Log errors for debugging (development only)
4. **Graceful Degradation** - Provide fallback UI when components fail

### **Error Handling Example:**
```javascript
// ✅ Good: Proper error handling
const EmailManager = () => {
  const [error, setError] = useState(null);
  
  const handleEmailAction = async (action) => {
    try {
      setError(null);
      await performEmailAction(action);
    } catch (err) {
      setError('Failed to perform action. Please try again.');
      // In development only:
      if (process.env.NODE_ENV === 'development') {
        console.error('Email action error:', err);
      }
    }
  };
  
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  
  // Component JSX
};
```

---

## 🔄 Version Control

### **Git Workflow:**
1. **Feature Branches** - Create feature branches for new development
2. **Meaningful Commits** - Write descriptive commit messages
3. **Small Commits** - Make frequent, small commits
4. **Code Review** - All changes must be reviewed before merging

### **Commit Message Format:**
```
feat: add email filtering with search functionality
fix: resolve ESLint warnings in TemplateManager component
refactor: optimize React hooks in Email component
docs: update development guidelines with ESLint standards
```

---

## 📈 Continuous Improvement

### **Regular Maintenance:**
1. **ESLint Audits** - Weekly ESLint checks to prevent warning accumulation
2. **Performance Reviews** - Monthly performance analysis and optimization
3. **Dependency Updates** - Regular updates with security patches
4. **Code Reviews** - Continuous peer review and knowledge sharing

### **Quality Metrics Tracking:**
- **ESLint Warnings:** Target = 0 (currently achieved)
- **Bundle Size:** Monitor and optimize regularly
- **Performance Score:** Maintain 90+ Lighthouse score
- **Accessibility Score:** Maintain 95+ accessibility score

---

## ✅ Conclusion

These guidelines ensure that the Renewal Frontend application maintains its high code quality standards and continues to be a maintainable, performant, and user-friendly application. All developers should follow these guidelines to contribute effectively to the project.

**Remember:** The goal is to maintain the current **zero ESLint warnings** status while building new features that are performant, accessible, and culturally appropriate for the Indian market. 