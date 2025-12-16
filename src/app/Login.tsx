"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface FieldErrors {
  [key: string]: string[];
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err?.response?.data?.error) {
        setGeneralError(err.response.data.error);
      } else {
        setGeneralError("Email atau password salah!");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getFieldError = (field: string) => errors[field]?.[0] || "";

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-md w-full">
        <Card className="shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex gap-2 items-center justify-center">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-xl font-bold">H</span>
              </div>
              <h1 className="text-xl font-semibold text-primary">Hospital Management</h1>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
              <p className="text-sm text-muted-foreground">Enter your credentials to access the system</p>
            </div>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* EMAIL */}
              <div>
                <Label htmlFor="email" className="text-foreground">Username</Label>
                <Input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-1.5 ${getFieldError("email") ? "input-error" : ""}`}
                  placeholder="wahjujaya"
                />
                {getFieldError("email") && (
                  <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {getFieldError("email")}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`mt-1.5 ${getFieldError("password") ? "input-error" : ""}`}
                  placeholder="••••••••"
                />
                {getFieldError("password") && (
                  <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {getFieldError("password")}
                  </p>
                )}
              </div>

              {/* GENERAL ERROR */}
              {generalError && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30">
                  <p className="text-sm text-destructive flex items-center gap-2">
                    <span>⚠</span> {generalError}
                  </p>
                </div>
              )}

              <Button 
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-11 font-medium" 
                type="submit" 
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Signing in...
                  </span>
                ) : "Sign In"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <p className="text-xs text-center text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}