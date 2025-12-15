# Error Handling & Placeholder Pages Guide

This guide explains the improved error handling and placeholder page system implemented in the Hospital Management System.

## Overview

Instead of showing React Router's default 404 error page, the system now provides:
- **Custom 404 Error Page** - Professional, branded error page
- **Placeholder Pages** - Coming soon pages for features under development
- **Error Boundaries** - Graceful error handling throughout the app

## Components Created

### 1. ErrorPage Component
**Location:** `src/app/ErrorPage.tsx`

A comprehensive error handler that displays:
- **404 Not Found:** When a route doesn't exist
  - Shows requested path
  - Lists available features
  - Provides navigation options
- **General Errors:** For unexpected application errors
  - Shows error details
  - Offers recovery options
  - User-friendly messaging

**Features:**
- Brand-consistent design with theme colors
- Clear action buttons (Go Back, Dashboard)
- Helpful suggestions for users
- Responsive layout

### 2. PlaceholderPage Component
**Location:** `src/components/PlaceholderPage.tsx`

A reusable component for modules under development.

**Props:**
```typescript
interface PlaceholderPageProps {
  title: string;              // Module name
  description?: string;       // Module description
  module?: string;            // Module ID
  features?: string[];        // Planned features list
  estimatedDate?: string;     // Release estimate
}
```

**Features:**
- Coming soon badge
- Planned features list
- Estimated release date
- Currently available modules
- Navigation options

## Router Configuration

All routes now include error handling:

```tsx
{
  path: "/",
  element: <LoginPage />,
  errorElement: <ErrorPage />,  // Error boundary
}
```

### Placeholder Routes Added

The following modules have placeholder pages:

1. **Patient Registration** (`/pendaftaran`)
   - Patient registration (IGD, Outpatient, Inpatient)
   - Patient data management
   - Medical record number generation
   - Insurance verification

2. **Medical Examination** (`/pemeriksaan`)
   - IGD/Emergency Room
   - Outpatient services
   - Inpatient services
   - Electronic Medical Records

3. **Pharmacy** (`/farmasi`)
   - Prescription processing
   - Drug inventory
   - Stock management

4. **Billing & Cashier** (`/billing`)
   - Invoice generation
   - Payment processing
   - Insurance claims

5. **Finance** (`/keuangan`)
   - Service rates
   - Revenue/Expense tracking
   - Financial reports

6. **Inventory** (`/inventory`)
   - Purchase orders
   - Stock management
   - Supplier management

7. **Reports** (`/laporan`)
   - Revenue/Expense reports
   - Patient statistics
   - Performance metrics

8. **Medical Records** (`/laporan-rm`)
   - Patient history
   - Treatment summaries
   - Clinical statistics

9. **BPJS Integration** (`/bpjs`)
   - Eligibility verification
   - Claim submission
   - VClaim integration

10. **Settings** (`/setting`)
    - Master data
    - User management
    - System parameters

## Usage Examples

### Using PlaceholderPage in Router

```tsx
{ 
  path: "pendaftaran", 
  element: <PlaceholderPage 
    title="Patient Registration" 
    description="Comprehensive patient registration system"
    module="PENDAFTARAN"
    features={[
      "Patient registration",
      "Medical record generation",
      "Insurance verification"
    ]}
    estimatedDate="Q1 2026"
  />,
}
```

### Creating Dynamic Routes

For routes with parameters:
```tsx
{ 
  path: "pemeriksaan/:type", 
  element: <PlaceholderPage 
    title="Medical Examination" 
    description="Module under development"
    module="PEMERIKSAAN"
  />,
}
```

### Catch-All Route

```tsx
{ 
  path: "*", 
  element: <ErrorPage />,  // Catches all undefined routes
}
```

## User Experience

### Before (Default React Router Error)
```
Unexpected Application Error!
404 Not Found
💿 Hey developer 👋
You can provide a way better UX...
```

### After (Custom Error Page)
- Professional branded design
- Clear messaging
- Helpful navigation options
- List of available features
- Responsive and accessible

## Testing

Test the error handling by visiting:

1. **404 Page:** http://localhost:5174/nonexistent-route
2. **Placeholder Pages:**
   - http://localhost:5174/pendaftaran
   - http://localhost:5174/farmasi
   - http://localhost:5174/billing

## Customization

### Modifying ErrorPage

Edit `src/app/ErrorPage.tsx` to customize:
- Error messages
- Available features list
- Design and layout
- Action buttons

### Modifying PlaceholderPage

Edit `src/components/PlaceholderPage.tsx` to customize:
- Layout and design
- Feature display
- Call-to-action buttons
- Status badges

### Adding New Placeholder Routes

1. Open `src/router/index.tsx`
2. Add a new route:
```tsx
{ 
  path: "your-module", 
  element: <PlaceholderPage 
    title="Your Module" 
    description="Description"
    module="MODULE_ID"
    features={["Feature 1", "Feature 2"]}
    estimatedDate="Q1 2026"
  />,
}
```

## Best Practices

1. **Always Add Error Boundaries:** Include `errorElement` for all routes
2. **Consistent Messaging:** Use similar descriptions across placeholder pages
3. **Provide Context:** List planned features to set expectations
4. **Easy Navigation:** Always provide way to go back or return to dashboard
5. **Brand Consistency:** Use theme colors and design system

## Benefits

✅ **Better UX** - Professional error pages instead of developer messages
✅ **Clear Communication** - Users know what's available and what's coming
✅ **Brand Consistency** - Error pages match overall design system
✅ **Easy Navigation** - Clear paths to working features
✅ **Reduced Confusion** - Explains when features are under development
✅ **Professional Appearance** - Hospital-grade application look and feel

## Next Steps

As you implement new features:

1. Replace placeholder routes with actual components
2. Remove the PlaceholderPage element
3. Add the new feature to the "Currently Available" section
4. Update navigation and documentation

Example:
```tsx
// Before (placeholder)
{ path: "farmasi", element: <PlaceholderPage ... /> }

// After (implemented)
{ path: "farmasi", element: <PharmacyPage /> }
```

## Support

If you encounter any issues with error handling:
1. Check browser console for errors
2. Verify route configuration in `router/index.tsx`
3. Ensure ErrorPage and PlaceholderPage components are imported correctly
4. Test navigation flow from various entry points

---

**Created:** December 15, 2025
**Project:** React Tailwind Hospital Management System
