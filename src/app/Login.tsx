"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import RsuadLogo from "@/assets/img/rsuad_logo_4.png";

interface FieldErrors {
  [key: string]: string[];
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setSubmitting(true);

    try {
      await login(name, password);
      navigate("/");
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err?.response?.data?.error) {
        setGeneralError(err.response.data.error);
      } else {
        setGeneralError("Username atau password salah!");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getFieldError = (field: string) => errors[field]?.[0] || "";

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 from-primary/5 via-background to-secondary/5">
      <div className="max-w-sm w-full">
        <Card className="shadow-lg">
          <CardHeader className="space-y-4">
            <div className="w-full flex items-center justify-center">
              <img
                src={RsuadLogo}
                alt="RSUAD Logo"
                className="w-32 object-contain"
              />
            </div>


            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-foreground">
                Welcome Back
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to access the system
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* USERNAME */}
              <div>
                <Label htmlFor="name">Username</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`mt-1.5 ${getFieldError("name") ? "input-error" : ""
                    }`}
                  placeholder="wahjujaya"
                />
                {getFieldError("name") && (
                  <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {getFieldError("name")}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <Label htmlFor="password">Password</Label>

                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pr-10 ${getFieldError("password") ? "input-error" : ""
                      }`}
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

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
                type="submit"
                variant="default"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <p className="text-xs text-center text-muted-foreground w-full">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
