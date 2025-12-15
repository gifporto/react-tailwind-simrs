import { useRouteError, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft, Search } from "lucide-react";

interface RouteError {
  status?: number;
  statusText?: string;
  message?: string;
}

export default function ErrorPage() {
  const error = useRouteError() as RouteError;
  const navigate = useNavigate();

  const is404 = error?.status === 404 || error?.statusText === "Not Found";

  if (is404) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Card className="max-w-2xl w-full shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center">
              <Search className="h-10 w-10 text-secondary" />
            </div>
            <CardTitle className="text-4xl text-primary">Halaman Tidak Ditemukan</CardTitle>
            <p className="text-muted-foreground">
              Halaman yang Anda cari belum tersedia atau tidak ada.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>URL yang diminta:</strong>
              </p>
              <code className="text-sm text-foreground bg-background px-2 py-1 rounded">
                {window.location.pathname}
              </code>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Yang dapat Anda lakukan:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Fitur ini sedang dalam tahap pengembangan dan akan tersedia segera</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Cek menu untuk melihat modul yang tersedia</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Gunakan sidebar navigasi untuk menjelajahi fitur yang sudah aktif</span>
                </li>
              </ul>
            </div>

            <div className="bg-info/10 border border-info/30 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-info">Halaman yang Tersedia Saat Ini</p>
                  <ul className="text-xs text-info/80 space-y-1">
                    <li>• Dashboard - Statistik dan ringkasan sistem</li>
                    <li>• Manajemen Karyawan - Modul HRIS (lihat, tambah, edit)</li>
                    <li>• Theme Showcase - Referensi desain sistem</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            <Button
              asChild
              className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Link to="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Ke Dashboard
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // General error
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-destructive/5 via-background to-destructive/10">
      <Card className="max-w-2xl w-full shadow-lg border-destructive/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-4xl text-destructive">Terjadi Kesalahan</CardTitle>
          <p className="text-muted-foreground">
            Terjadi kesalahan yang tidak terduga. Jangan khawatir, kami siap membantu.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-destructive/5 p-4 rounded-lg border border-destructive/20">
            <p className="text-sm font-semibold text-destructive mb-2">Detail Kesalahan:</p>
            <p className="text-sm text-foreground">
              {error?.statusText || error?.message || "Kesalahan tidak diketahui"}
            </p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Silakan coba salah satu dari berikut:</p>
            <ul className="space-y-1 ml-4">
              <li>• Muat ulang halaman</li>
              <li>• Kembali ke halaman sebelumnya</li>
              <li>• Kembali ke dashboard</li>
              <li>• Hubungi tim IT jika masalah berlanjut</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Muat Ulang
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <Button
            asChild
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link to="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Ke Dashboard
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
