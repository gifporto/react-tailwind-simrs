"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";

export default function ThemeShowcase() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Theme Showcase</h1>
        <p className="text-muted-foreground">
          Reference of default shadcn/ui components
        </p>
      </div>

      {/* Brand Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Colors</CardTitle>
          <CardDescription>Using CSS variables from shadcn</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ColorBox label="Primary" className="bg-primary text-primary-foreground" />
          <ColorBox label="Secondary" className="bg-secondary text-secondary-foreground" />
          <ColorBox label="Muted" className="bg-muted text-muted-foreground" />
          <ColorBox label="Destructive" className="bg-destructive text-destructive-foreground" />
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Default button variants</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>Status representation</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </CardContent>
      </Card>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
          <CardDescription>Default input styling</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Default Input</Label>
            <Input placeholder="Enter value" />
          </div>

          <div className="space-y-2">
            <Label>Error Example</Label>
            <Input placeholder="Invalid input" />
            <p className="text-sm text-destructive">This field is required</p>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
          <CardDescription>shadcn Alert component</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTitle>Info</AlertTitle>
            <AlertDescription>General information message</AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Something went wrong</AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>Text hierarchy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <h1 className="text-4xl font-bold">Heading 1</h1>
          <h2 className="text-3xl font-bold">Heading 2</h2>
          <h3 className="text-2xl font-semibold">Heading 3</h3>
          <p className="text-base">Body text</p>
          <p className="text-sm text-muted-foreground">Muted text</p>
        </CardContent>
      </Card>
    </div>
  );
}

/* Helper */
function ColorBox({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <div className="space-y-2">
      <div
        className={`h-20 rounded-md flex items-center justify-center font-medium ${className}`}
      >
        {label}
      </div>
    </div>
  );
}
