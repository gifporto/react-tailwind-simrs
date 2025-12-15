# 🚀 Theme Quick Reference

## Brand Colors
```
Primary:   #1C3C6E (Structure, Navigation)
Secondary: #ED8123 (CTAs, Highlights)
```

## Common Patterns

### Buttons
```tsx
// Primary action
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  View Details
</Button>

// Important CTA (Save, Create, Submit)
<Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
  Save Record
</Button>

// Delete/Cancel
<Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
  Delete
</Button>
```

### Status Badges
```tsx
import { Badge } from "@/components/ui/badge";
import { STATUS_CLASSES } from "@/lib/theme-colors";

// Patient
<Badge className={STATUS_CLASSES.patient.admitted}>Admitted</Badge>
<Badge className={STATUS_CLASSES.patient.emergency}>Emergency</Badge>

// Payment
<Badge className={STATUS_CLASSES.payment.paid}>Paid</Badge>
<Badge className={STATUS_CLASSES.payment.pending}>Pending</Badge>

// Appointments
<Badge className={STATUS_CLASSES.appointment.scheduled}>Scheduled</Badge>
<Badge className={STATUS_CLASSES.appointment.completed}>Completed</Badge>

// Labs
<Badge className={STATUS_CLASSES.lab.pending}>Pending</Badge>
<Badge className={STATUS_CLASSES.lab.critical}>Critical</Badge>
```

### Form Inputs
```tsx
// Normal
<Input className="input-enhanced" />

// With error
<Input className="input-enhanced input-error" />
<p className="text-sm text-destructive">⚠ Error message</p>

// With success
<Input className="input-enhanced input-success" />
<p className="text-sm text-success">✓ Looks good!</p>
```

### Cards
```tsx
// Standard
<Card>
  <CardHeader>
    <CardTitle className="text-primary">Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Elevated (with shadow)
<Card className="card-elevated">...</Card>

// Interactive (clickable)
<Card className="card-interactive">...</Card>
```

### Alerts
```tsx
import { getAlertVariant } from "@/lib/theme-colors";

const alert = getAlertVariant('error');
<div className={`p-4 rounded-lg border ${alert.className}`}>
  <span>{alert.icon}</span> {message}
</div>
```

### Tables
```tsx
<Table className="table-striped">
  <TableHeader>
    <TableRow className="bg-muted/50">
      <TableHead className="font-semibold">Column</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="table-row-hover">
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Dynamic Status
```tsx
import { getPatientStatusClass, getPaymentStatusClass } from "@/lib/theme-colors";

const statusClass = getPatientStatusClass(patient.status);
<Badge className={statusClass}>{patient.status}</Badge>
```

## Page Headers
```tsx
<CardHeader>
  <div className="flex justify-between items-start">
    <div className="space-y-1">
      <CardTitle className="text-2xl text-primary">Page Title</CardTitle>
      <p className="text-sm text-muted-foreground">Description</p>
    </div>
    <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
      + Add New
    </Button>
  </div>
</CardHeader>
```

## Resources
- 🎨 Visual Reference: `/theme-showcase`
- 📖 Full Guide: `THEME_GUIDE.md`
- 📝 Implementation: `THEME_IMPLEMENTATION.md`
- 🔧 Utilities: `src/lib/theme-colors.ts`

## Rules
✅ Use primary for structure and navigation  
✅ Use secondary for important CTAs only (1-2 per page)  
✅ Always pair status colors with text/icons  
❌ Don't mix primary and secondary equally  
❌ Don't use color alone for information
