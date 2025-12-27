"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Building2
} from "lucide-react";
import RsuadLogo from "@/assets/img/rsuad_logo_4.png";

interface FieldErrors {
  [key: string]: string[];
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // States
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
      } else {
        setGeneralError(err?.response?.data?.error || "Username atau password salah!");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getFieldError = (field: string) => errors[field]?.[0] || "";

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-background">
      {/* SISI KIRI: FORM LOGIN */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            RSUAD <span className="text-muted-foreground font-normal">SIMRS</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm space-y-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <img src={RsuadLogo} alt="Logo" className="h-16 w-auto mb-2 drop-shadow-sm" />
              <h1 className="text-2xl font-semibold tracking-tight">Selamat Datang</h1>
              <p className="text-muted-foreground text-sm">
                Silakan masuk untuk mengelola data operasional rumah sakit.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="grid gap-4">
                {/* Username Field */}
                <div className="grid gap-2">
                  <Label
                    htmlFor="name"
                    className={cn(getFieldError("name") && "text-destructive")}
                  >
                    Username
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Masukkan username Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={submitting}
                    className={cn(
                      "h-11",
                      getFieldError("name") && "border-destructive focus-visible:ring-destructive"
                    )}
                    required
                  />
                  {getFieldError("name") && (
                    <p className="text-xs font-medium text-destructive flex items-center gap-1 mt-0.5">
                      <AlertCircle className="size-3" /> {getFieldError("name")}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className={cn(getFieldError("password") && "text-destructive")}
                    >
                      Password
                    </Label>
                    {/* <a href="#" className="text-xs text-primary hover:underline underline-offset-4">
                      Lupa password?
                    </a> */}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={submitting}
                      className={cn(
                        "h-11 pr-10",
                        getFieldError("password") && "border-destructive focus-visible:ring-destructive"
                      )}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {getFieldError("password") && (
                    <p className="text-xs font-medium text-destructive flex items-center gap-1 mt-0.5">
                      <AlertCircle className="size-3" /> {getFieldError("password")}
                    </p>
                  )}
                </div>
              </div>

              {/* General Error Message */}
              {generalError && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive animate-in fade-in slide-in-from-top-1 duration-300">
                  <AlertCircle className="size-4 shrink-0" />
                  <p className="text-sm font-medium">{generalError}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 font-semibold text-base transition-all active:scale-[0.98]"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Masuk Ke Sistem"
                )}
              </Button>

              <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                <ShieldCheck className="size-3" />
                Sistem Terenkripsi & Terpantau
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* SISI KANAN: VISUAL/BACKGROUND */}
      <div className="relative hidden lg:flex flex-col items-center justify-center overflow-hidden">
        {/* Gambar Background Utama */}
        <img
          src="/rsuad.png"
          alt="Gedung RSUAD"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Overlay: Memberikan kontras agar teks terbaca jelas */}
        {/* Anda bisa menyesuaikan opacity (bg-black/40) sesuai kebutuhan */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Konten di Atas Background */}
        <div className="pt-[500px] z-10 p-12 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight text-white italic leading-tight drop-shadow-lg">
              "Menolong Dengan Ramah"
            </h2>
            <p className="text-slate-200 font-medium text-lg drop-shadow-md">
              Sistem Informasi Manajemen Rumah Sakit
            </p>
            <div className="h-1.5 w-20 bg-orange-500 mx-auto rounded-full shadow-lg" />
          </div>

          <div className="inline-flex p-1 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl mb-4 animate-in fade-in zoom-in duration-700">
            <img
              src={RsuadLogo}
              alt="RSUAD Large"
              className="h-16 w-auto brightness-0 invert" // Menjadikan logo putih agar kontras dengan foto
            />
          </div>
        </div>

        {/* Footer Kecil di Bagian Bawah Gambar */}
        <div className="absolute bottom-8 left-8 right-8 z-10 flex justify-between text-white/60 text-xs">
          <span>© {new Date().getFullYear()} RSUAD Digital Team</span>
        </div>
      </div>
    </div>
  );
}