"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  UserCheck, 
  Bed, 
  Clock,
  Activity,
  TrendingUp
} from "lucide-react";
import Chart from "react-apexcharts";

export default function Dashboard() {
  // Dummy data untuk summary cards
  const summaryData = [
    {
      title: "Total Pasien Hari Ini",
      value: "142",
      icon: Users,
      trend: "+12%",
      trendUp: true,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pasien Rawat Jalan",
      value: "89",
      icon: UserCheck,
      trend: "+8%",
      trendUp: true,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pasien Rawat Inap",
      value: "43",
      icon: Bed,
      trend: "-3%",
      trendUp: false,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Antrian Aktif",
      value: "28",
      icon: Clock,
      trend: "+5%",
      trendUp: true,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  // Data untuk chart kunjungan pasien (7 hari terakhir)
  const patientVisitOptions = {
    chart: {
      id: "patient-visit-chart",
      toolbar: { show: false },
      fontFamily: "Inter, system-ui, sans-serif",
    },
    xaxis: {
      categories: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
    },
    stroke: {
      curve: "smooth" as const,
      width: 3,
    },
    colors: ["#2F5496"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} pasien`,
      },
    },
  };

  const patientVisitSeries = [
    {
      name: "Jumlah Pasien",
      data: [125, 138, 142, 135, 150, 128, 142],
    },
  ];

  // Data untuk service distribution (Donut chart)
  const serviceDistributionOptions = {
    chart: {
      type: "donut" as const,
      fontFamily: "Inter, system-ui, sans-serif",
    },
    labels: ["Rawat Jalan", "Rawat Inap", "IGD", "Laboratorium"],
    colors: ["#2F5496", "#EF5350", "#66BB6A", "#FFA726"],
    legend: {
      position: "bottom" as const,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} pasien`,
      },
    },
  };

  const serviceDistributionSeries = [89, 43, 32, 28];

  // Data untuk payment overview (Bar chart)
  const paymentOverviewOptions = {
    chart: {
      type: "bar" as const,
      toolbar: { show: false },
      fontFamily: "Inter, system-ui, sans-serif",
    },
    xaxis: {
      categories: ["BPJS", "Umum", "Asuransi"],
    },
    colors: ["#2F5496", "#EF5350", "#66BB6A"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: false,
        columnWidth: "60%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} transaksi`,
      },
    },
  };

  const paymentOverviewSeries = [
    {
      name: "Jumlah Transaksi",
      data: [87, 42, 28],
    },
  ];

  // Dummy data untuk recent activity
  const recentActivities = [
    {
      id: 1,
      nama: "Ahmad Fauzi",
      poli: "Poli Umum",
      dokter: "Dr. Sarah Wijaya",
      status: "Selesai",
      waktu: "09:15",
      statusColor: "text-green-600 bg-green-50",
    },
    {
      id: 2,
      nama: "Siti Nurhaliza",
      poli: "Poli Gigi",
      dokter: "Dr. Budi Santoso",
      status: "Dalam Pemeriksaan",
      waktu: "09:30",
      statusColor: "text-blue-600 bg-blue-50",
    },
    {
      id: 3,
      nama: "Joko Widodo",
      poli: "Poli Anak",
      dokter: "Dr. Ratna Sari",
      status: "Menunggu",
      waktu: "09:45",
      statusColor: "text-orange-600 bg-orange-50",
    },
    {
      id: 4,
      nama: "Dewi Lestari",
      poli: "Poli Mata",
      dokter: "Dr. Ahmad Hidayat",
      status: "Selesai",
      waktu: "10:00",
      statusColor: "text-green-600 bg-green-50",
    },
    {
      id: 5,
      nama: "Rudi Hartono",
      poli: "Poli Jantung",
      dokter: "Dr. Lina Marlina",
      status: "Dalam Pemeriksaan",
      waktu: "10:15",
      statusColor: "text-blue-600 bg-blue-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan aktivitas rumah sakit hari ini</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-foreground">
                      {item.value}
                    </h3>
                    <span
                      className={`text-xs font-medium flex items-center gap-1 ${
                        item.trendUp ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <TrendingUp
                        className={`h-3 w-3 ${
                          !item.trendUp && "rotate-180"
                        }`}
                      />
                      {item.trend}
                    </span>
                  </div>
                </div>
                <div className={`${item.bgColor} p-3 rounded-full`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Patient Visit Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Kunjungan Pasien (7 Hari Terakhir)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={patientVisitOptions}
              series={patientVisitSeries}
              type="area"
              height={300}
            />
          </CardContent>
        </Card>

        {/* Service Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Distribusi Layanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={serviceDistributionOptions}
              series={serviceDistributionSeries}
              type="donut"
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 & Recent Activity */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Payment Overview Chart */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Metode Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={paymentOverviewOptions}
              series={paymentOverviewSeries}
              type="bar"
              height={280}
            />
          </CardContent>
        </Card>

        {/* Recent Activity Table */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Aktivitas Terkini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      Nama Pasien
                    </th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      Poli
                    </th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      Dokter
                    </th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      Waktu
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((activity) => (
                    <tr
                      key={activity.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50"
                    >
                      <td className="py-3 font-medium text-foreground">
                        {activity.nama}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {activity.poli}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {activity.dokter}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activity.statusColor}`}
                        >
                          {activity.status}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {activity.waktu}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
