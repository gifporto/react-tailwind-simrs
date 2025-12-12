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
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <div className="max-w-md">
        <Card>
          <CardHeader>
            <div className="flex gap-2 items-center cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-6 h-6 text-primary" />
              <h1 className="text-lg font-semibold text-gray-800">Attenda</h1>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-4">Silahkan Login</h2>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* EMAIL */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={getFieldError("email") ? "border-red-500" : ""}
                />
                {getFieldError("email") && (
                  <p className="text-sm text-red-500 mt-1">{getFieldError("email")}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={getFieldError("password") ? "border-red-500" : ""}
                />
                {getFieldError("password") && (
                  <p className="text-sm text-red-500 mt-1">{getFieldError("password")}</p>
                )}
              </div>

              {/* GENERAL ERROR */}
              {generalError && (
                <p className="text-sm text-red-500">{generalError}</p>
              )}

              <Button className="w-full" type="submit" disabled={submitting}>
                {submitting ? "Memproses..." : "Login"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-xs text-muted-foreground text-center">
            Masukkan email & password yang terdaftar.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
