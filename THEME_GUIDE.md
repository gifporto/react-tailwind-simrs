# 🎨 Hospital Management System - Theme Guide

## Brand Colors

### Primary: #1C3C6E (Deep Professional Blue)
**Usage:** Structure, navigation, headers, important information
- Sidebar background
- Primary buttons
- Section headers
- Key navigation elements

### Secondary: #ED8123 (Vibrant Orange)
**Usage:** Call-to-action, highlights, active states
- Important action buttons (Save, Submit, Create)
- Active sidebar items
- Key highlights and badges
- Success actions that need emphasis

## Color Palette Reference

### Base Colors (Light Mode)
```
Background:     #F9FAFB  (Soft white with blue tint)
Foreground:     #1F2937  (Dark blue-gray text)
Card:           #FFFFFF  (Pure white)
Border:         #E5E7EB  (Subtle blue-gray)
```

### Semantic Colors

#### Success (Medical Green)
- **Use for:** Completed actions, approved statuses, successful operations
- **Examples:** Discharged patients, paid invoices, completed lab tests

#### Warning (Amber)
- **Use for:** Pending actions, attention needed, non-critical alerts
- **Examples:** Pending payments, observation status, upcoming appointments

#### Destructive (Medical Red)
- **Use for:** Errors, deletions, critical alerts, emergency status
- **Examples:** Emergency patients, overdue payments, failed operations

#### Info (Blue)
- **Use for:** Informational states, in-progress items
- **Examples:** Admitted patients, scheduled appointments, in-progress labs

## Healthcare-Specific Status Colors

### Patient Status
| Status | Class | Visual |
|--------|-------|--------|
| Admitted | `.status-admitted` | Blue background, blue text |
| Discharged | `.status-discharged` | Green background, green text |
| Emergency | `.status-emergency` | Red background, red text |
| Observation | `.status-observation` | Yellow background, yellow text |

### Payment Status
| Status | Class | Visual |
|--------|-------|--------|
| Paid | `.payment-paid` | Green |
| Pending | `.payment-pending` | Yellow |
| Overdue | `.payment-overdue` | Red |
| Partial | `.payment-partial` | Orange |

### Appointment Status
| Status | Class | Visual |
|--------|-------|--------|
| Scheduled | `.appointment-scheduled` | Blue |
| Confirmed | `.appointment-confirmed` | Primary blue |
| Completed | `.appointment-completed` | Green |
| Cancelled | `.appointment-cancelled` | Gray |
| No-show | `.appointment-noshow` | Red |

### Lab Result Status
| Status | Class | Visual |
|--------|-------|--------|
| Pending | `.lab-pending` | Yellow |
| In Progress | `.lab-inprogress` | Blue |
| Completed | `.lab-completed` | Green |
| Critical | `.lab-critical` | Red |

### Queue Status
| Status | Class | Visual |
|--------|-------|--------|
| Waiting | `.queue-waiting` | Gray |
| Called | `.queue-called` | Blue |
| Serving | `.queue-serving` | Orange |
| Completed | `.queue-completed` | Green |

## Component Usage Guidelines

### Buttons

#### Primary Buttons
```tsx
// Use for main actions within a section
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  View Details
</Button>
```

#### Secondary Buttons (CTAs)
```tsx
// Use for important actions that need emphasis
<Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
  Save Patient Record
</Button>

<Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
  Create New Appointment
</Button>
```

#### Destructive Buttons
```tsx
// Use for delete or cancel actions
<Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
  Delete Record
</Button>
```

#### Outline Buttons
```tsx
// Use for secondary actions
<Button variant="outline">
  Cancel
</Button>
```

### Status Badges

```tsx
// Patient status
<Badge className="status-admitted">Admitted</Badge>
<Badge className="status-emergency">Emergency</Badge>

// Payment status
<Badge className="payment-paid">Paid</Badge>
<Badge className="payment-pending">Pending</Badge>

// Appointment status
<Badge className="appointment-scheduled">Scheduled</Badge>
<Badge className="appointment-completed">Completed</Badge>

// Lab results
<Badge className="lab-pending">Pending</Badge>
<Badge className="lab-critical">Critical</Badge>
```

### Forms

#### Standard Input
```tsx
<Input 
  className="input-enhanced" 
  placeholder="Enter patient name"
/>
```

#### Input with Validation States
```tsx
// Error state
<Input className="input-enhanced input-error" />
<p className="text-destructive text-sm">This field is required</p>

// Success state
<Input className="input-enhanced input-success" />

// Warning state
<Input className="input-enhanced input-warning" />
```

### Tables

#### Standard Table
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Patient Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="table-row-hover">
      <TableCell>John Doe</TableCell>
      <TableCell>
        <Badge className="status-admitted">Admitted</Badge>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### Striped Table (for long data lists)
```tsx
<Table className="table-striped">
  {/* ... */}
</Table>
```

### Cards

#### Standard Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Patient Information</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

#### Elevated Card (for emphasis)
```tsx
<Card className="card-elevated">
  <CardHeader>
    <CardTitle>Critical Alerts</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

#### Interactive Card (clickable)
```tsx
<Card className="card-interactive" onClick={() => navigate('/patient/123')}>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

## Accessibility Standards

All color combinations meet **WCAG AA** standards:
- Normal text: 4.5:1 contrast ratio minimum
- Large text: 3:1 contrast ratio minimum
- Interactive elements: Clear focus states with 2px ring

### Focus States
All interactive elements have visible focus indicators:
```tsx
// Standard focus
focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2

// High contrast focus (for critical actions)
className="focus-high-contrast"
```

## Design Principles

### 1. Calm & Professional
- Use primary blue for structure and stability
- Reserve secondary orange for important actions only
- Maintain generous white space

### 2. Clear Hierarchy
- Primary color: Navigation and structure
- Secondary color: Important actions (max 1-2 per screen)
- Neutral: Content and less important actions

### 3. Consistent States
- Hover: Slight darkening (90% opacity)
- Focus: 2px ring with primary color
- Active: Slight scale down (95%)
- Disabled: 50% opacity

### 4. Status Clarity
- Use semantic colors consistently
- Always pair color with icon or text
- Ensure colorblind-friendly combinations

## Implementation Examples

### Dashboard Card with CTA
```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-primary">Today's Appointments</CardTitle>
    <CardDescription>12 patients scheduled</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Appointment list */}
  </CardContent>
  <CardFooter>
    <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
      Add New Appointment
    </Button>
  </CardFooter>
</Card>
```

### Status Overview
```tsx
<div className="grid grid-cols-4 gap-4">
  <Card>
    <CardContent className="pt-6">
      <div className="text-2xl font-bold text-primary">24</div>
      <p className="text-muted-foreground">Patients Admitted</p>
    </CardContent>
  </Card>
  
  <Card>
    <CardContent className="pt-6">
      <div className="text-2xl font-bold text-secondary">8</div>
      <p className="text-muted-foreground">Emergency Cases</p>
    </CardContent>
  </Card>
</div>
```

### Patient Status Timeline
```tsx
<div className="space-y-2">
  <div className="flex items-center gap-2">
    <Badge className="status-admitted">Admitted</Badge>
    <span className="text-sm text-muted-foreground">2 hours ago</span>
  </div>
  <div className="flex items-center gap-2">
    <Badge className="lab-completed">Lab Test Complete</Badge>
    <span className="text-sm text-muted-foreground">1 hour ago</span>
  </div>
  <div className="flex items-center gap-2">
    <Badge className="appointment-scheduled">Doctor Visit</Badge>
    <span className="text-sm text-muted-foreground">In 30 minutes</span>
  </div>
</div>
```

## Dark Mode Support

All colors have been optimized for dark mode:
- Primary and secondary colors are lightened for better contrast
- Background is dark blue-gray instead of pure black
- All status colors are adjusted for dark backgrounds
- Maintains same semantic meaning across themes

## Quick Reference

### When to Use Primary (#1C3C6E)
✅ Sidebar and navigation  
✅ Section headers  
✅ Primary buttons (View, Details, Edit)  
✅ Links and navigation items  

### When to Use Secondary (#ED8123)
✅ Create/Add new items  
✅ Save/Submit buttons  
✅ Important CTAs (max 1-2 per view)  
✅ Active state in sidebar  

### When to Avoid
❌ Don't use both primary and secondary equally - creates visual noise  
❌ Don't use secondary for destructive actions (use destructive color)  
❌ Don't mix too many status colors in one view  
❌ Don't rely on color alone (always add icons/text)  

---

**Last Updated:** December 2025  
**Version:** 1.0.0
