import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldX, Home, ArrowLeft } from "lucide-react";

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full shadow-lg border-destructive/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldX className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-4xl text-destructive">403 - Akses Ditolak</CardTitle>
          <p className="text-muted-foreground">
            Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-destructive/5 p-4 rounded-lg border border-destructive/20">
            <p className="text-sm text-muted-foreground mb-3">
              <strong className="text-destructive">Akses Terbatas</strong>
            </p>
            <p className="text-sm text-foreground">
              Halaman atau fitur ini memerlukan hak akses khusus yang tidak Anda miliki saat ini.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Kemungkinan Penyebab:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                <span>Role atau jabatan Anda tidak memiliki akses ke fitur ini</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                <span>Anda belum diberikan permission yang diperlukan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                <span>Akses dibatasi untuk departemen atau unit tertentu</span>
              </li>
            </ul>
          </div>

          <div className="bg-info/10 border border-info/30 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-info">Butuh Akses?</p>
                <p className="text-xs text-info/80">
                  Silakan hubungi Administrator atau bagian IT untuk meminta hak akses yang sesuai dengan tugas dan tanggung jawab Anda.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-warning">Catatan Keamanan</p>
                <p className="text-xs text-warning/80">
                  Semua percobaan akses tidak sah dicatat dalam sistem untuk keperluan audit keamanan.
                </p>
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
