/**
 * Theme Showcase Component
 * 
 * This component demonstrates all available theme colors, states, and components.
 * Use this as a reference when building new features.
 * 
 * To view: Navigate to /theme-showcase in your browser
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { STATUS_CLASSES, getAlertVariant } from "@/lib/theme-colors";

export default function ThemeShowcase() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Hospital Management System - Theme Showcase</h1>
        <p className="text-muted-foreground">Complete visual reference for all theme components and colors</p>
      </div>

      {/* Brand Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Brand Colors</CardTitle>
          <CardDescription>Primary and secondary color palette</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">Primary</span>
              </div>
              <p className="text-sm text-muted-foreground">#1C3C6E</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-secondary flex items-center justify-center">
                <span className="text-secondary-foreground font-semibold">Secondary</span>
              </div>
              <p className="text-sm text-muted-foreground">#ED8123</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-destructive flex items-center justify-center">
                <span className="text-destructive-foreground font-semibold">Destructive</span>
              </div>
              <p className="text-sm text-muted-foreground">For errors</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-success flex items-center justify-center">
                <span className="text-success-foreground font-semibold">Success</span>
              </div>
              <p className="text-sm text-muted-foreground">For completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Buttons</CardTitle>
          <CardDescription>All button variants and states</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Primary Button
            </Button>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Secondary CTA
            </Button>
            <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </Button>
            <Button variant="outline">
              Outline
            </Button>
            <Button variant="ghost">
              Ghost
            </Button>
            <Button disabled>
              Disabled
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Small
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Default
            </Button>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Large
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Status Indicators</CardTitle>
          <CardDescription>Healthcare-specific status badges</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Patient Status */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground">Patient Status</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className={STATUS_CLASSES.patient.admitted}>Admitted</Badge>
              <Badge className={STATUS_CLASSES.patient.discharged}>Discharged</Badge>
              <Badge className={STATUS_CLASSES.patient.emergency}>Emergency</Badge>
              <Badge className={STATUS_CLASSES.patient.observation}>Observation</Badge>
            </div>
          </div>

          {/* Payment Status */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground">Payment Status</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className={STATUS_CLASSES.payment.paid}>Paid</Badge>
              <Badge className={STATUS_CLASSES.payment.pending}>Pending</Badge>
              <Badge className={STATUS_CLASSES.payment.overdue}>Overdue</Badge>
              <Badge className={STATUS_CLASSES.payment.partial}>Partial Payment</Badge>
            </div>
          </div>

          {/* Appointment Status */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground">Appointment Status</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className={STATUS_CLASSES.appointment.scheduled}>Scheduled</Badge>
              <Badge className={STATUS_CLASSES.appointment.confirmed}>Confirmed</Badge>
              <Badge className={STATUS_CLASSES.appointment.completed}>Completed</Badge>
              <Badge className={STATUS_CLASSES.appointment.cancelled}>Cancelled</Badge>
              <Badge className={STATUS_CLASSES.appointment.noshow}>No-show</Badge>
            </div>
          </div>

          {/* Lab Results */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground">Lab Results</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className={STATUS_CLASSES.lab.pending}>Pending</Badge>
              <Badge className={STATUS_CLASSES.lab.inProgress}>In Progress</Badge>
              <Badge className={STATUS_CLASSES.lab.completed}>Completed</Badge>
              <Badge className={STATUS_CLASSES.lab.critical}>Critical</Badge>
            </div>
          </div>

          {/* Queue Status */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground">Queue Status</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className={STATUS_CLASSES.queue.waiting}>Waiting</Badge>
              <Badge className={STATUS_CLASSES.queue.called}>Called</Badge>
              <Badge className={STATUS_CLASSES.queue.serving}>Serving</Badge>
              <Badge className={STATUS_CLASSES.queue.completed}>Completed</Badge>
            </div>
          </div>

          {/* Priority */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground">Priority Levels</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className={STATUS_CLASSES.priority.high}>High Priority</Badge>
              <Badge className={STATUS_CLASSES.priority.medium}>Medium Priority</Badge>
              <Badge className={STATUS_CLASSES.priority.low}>Low Priority</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Elements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Form Elements</CardTitle>
          <CardDescription>Inputs with validation states</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Default Input</Label>
              <Input placeholder="Enter text" className="input-enhanced" />
            </div>

            <div className="space-y-2">
              <Label>Error State</Label>
              <Input placeholder="Invalid input" className="input-enhanced input-error" />
              <p className="text-sm text-destructive">This field is required</p>
            </div>

            <div className="space-y-2">
              <Label>Success State</Label>
              <Input placeholder="Valid input" className="input-enhanced input-success" />
              <p className="text-sm text-success">Looks good!</p>
            </div>

            <div className="space-y-2">
              <Label>Warning State</Label>
              <Input placeholder="Warning input" className="input-enhanced input-warning" />
              <p className="text-sm text-warning">Please verify this field</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Alerts & Notifications</CardTitle>
          <CardDescription>Semantic alert messages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`p-4 rounded-lg border ${getAlertVariant('success').className}`}>
            <p className="font-medium flex items-center gap-2">
              <span>{getAlertVariant('success').icon}</span>
              Success: Operation completed successfully
            </p>
          </div>

          <div className={`p-4 rounded-lg border ${getAlertVariant('info').className}`}>
            <p className="font-medium flex items-center gap-2">
              <span>{getAlertVariant('info').icon}</span>
              Info: Patient record updated
            </p>
          </div>

          <div className={`p-4 rounded-lg border ${getAlertVariant('warning').className}`}>
            <p className="font-medium flex items-center gap-2">
              <span>{getAlertVariant('warning').icon}</span>
              Warning: Appointment pending confirmation
            </p>
          </div>

          <div className={`p-4 rounded-lg border ${getAlertVariant('error').className}`}>
            <p className="font-medium flex items-center gap-2">
              <span>{getAlertVariant('error').icon}</span>
              Error: Failed to save record
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Card Variations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Card Variations</CardTitle>
          <CardDescription>Different card styles for emphasis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Standard Card</p>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Elevated Card (with shadow)</p>
            </CardContent>
          </Card>

          <Card className="card-interactive">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Interactive Card (clickable, hover effect)</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Typography</CardTitle>
          <CardDescription>Text styles and hierarchy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Heading 1</h1>
          <h2 className="text-3xl font-bold text-foreground">Heading 2</h2>
          <h3 className="text-2xl font-semibold text-foreground">Heading 3</h3>
          <h4 className="text-xl font-semibold text-foreground">Heading 4</h4>
          <p className="text-base text-foreground">Body text - Regular paragraph content</p>
          <p className="text-sm text-muted-foreground">Muted text - Secondary information</p>
          <p className="text-xs text-muted-foreground">Small text - Captions and footnotes</p>
        </CardContent>
      </Card>
    </div>
  );
}
