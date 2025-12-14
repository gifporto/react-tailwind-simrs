import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Construction, ArrowLeft, Calendar, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PlaceholderPageProps {
  title: string;
  description?: string;
  module?: string;
  features?: string[];
  estimatedDate?: string;
}

export default function PlaceholderPage({
  title,
  description = "Modul ini sedang dalam tahap pengembangan",
  module,
  features = [],
  estimatedDate,
}: PlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <Card className="shadow-sm border-dashed border-2 border-muted-foreground/20">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-secondary/10 to-primary/10 flex items-center justify-center">
            <Construction className="h-12 w-12 text-primary" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <CardTitle className="text-3xl text-primary">{title}</CardTitle>
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                Segera Hadir
              </Badge>
            </div>
            
            <CardDescription className="text-base max-w-2xl mx-auto">
              {description}
            </CardDescription>

            {module && (
              <p className="text-xs text-muted-foreground">
                ID Modul: <code className="bg-muted px-2 py-1 rounded">{module}</code>
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Planned Features */}
          {features.length > 0 && (
            <div className="bg-muted/30 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-info" />
                <h3 className="font-semibold text-foreground">Fitur yang Direncanakan</h3>
              </div>
              <ul className="grid sm:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-1">✓</span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Estimated Date */}
          {estimatedDate && (
            <div className="bg-info/5 border border-info/20 rounded-lg p-4 flex items-center gap-3">
              <Calendar className="h-5 w-5 text-info" />
              <div>
                <p className="text-sm font-medium text-info">Perkiraan Rilis</p>
                <p className="text-xs text-info/80">{estimatedDate}</p>
              </div>
            </div>
          )}

          {/* Current Status */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Yang Sudah Tersedia</h4>
            <div className="grid sm:grid-cols-3 gap-3">
              <Card className="bg-background">
                <CardContent className="pt-4 text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">Dashboard</div>
                  <p className="text-xs text-muted-foreground">Ringkasan & statistik</p>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardContent className="pt-4 text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">HRIS</div>
                  <p className="text-xs text-muted-foreground">Manajemen karyawan</p>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardContent className="pt-4 text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">Pengaturan</div>
                  <p className="text-xs text-muted-foreground">Konfigurasi sistem</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Ke Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-lg">💡</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Butuh fitur ini segera?</h4>
              <p className="text-sm text-muted-foreground">
                Hubungi tim pengembangan untuk memprioritaskan modul ini. Kami terus menambahkan fitur baru berdasarkan kebutuhan pengguna.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
