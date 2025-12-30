import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import {
  QrCode, User, IdCard, Hospital, CalendarCheck, Stethoscope,
  CheckCircle2, XCircle, Loader2, Info, HandHelping,
  UserCheck, X, RefreshCw, Barcode, ScanText, ArrowRight
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LogoRSUAD from '@/assets/img/rsuad_logo_3.png';
import Logo2RSUAD from '@/assets/img/rsuad_logo_4.png';
import step3 from '@/assets/step3.svg';
import step1 from '@/assets/step1.png';
import step2 from '@/assets/step2.png';
import step4 from '@/assets/step4.png';
import { ApmAPI } from '@/lib/api';

const AnjunganMandiri = () => {
  const [qrInput, setQrInput] = useState("");
  const [status, setStatus] = useState<'welcome' | 'loading' | 'success' | 'error'>('welcome');
  const [patient, setPatient] = useState<any>(null);
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [faceStatus, setFaceStatus] = useState<'scanning' | 'success' | 'error'>('scanning');

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const detectionInterval = useRef<any>(null);

  // Logika Timer dan Verifikasi Otomatis
  useEffect(() => {
    let timer: any;

    if (isFaceModalOpen && faceStatus === 'scanning') {
      setCountdown(5); // Reset timer ke 3

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleCapture(); // Panggil fungsi capture saat 0
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isFaceModalOpen, faceStatus]);

  // Reset status saat modal ditutup/dibuka
  const handleRetryFace = () => {
    setFaceStatus('scanning');
    setCountdown(5);
  };

  // Fungsi untuk membuka kamera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 400, height: 400 }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Gagal mengakses kamera:", err);
      alert("Mohon izinkan akses kamera pada browser Anda.");
    }
  };

  // Fungsi untuk mematikan kamera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Trigger kamera saat modal dibuka/ditutup
  useEffect(() => {
    if (isFaceModalOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera(); // Cleanup saat komponen unmount
  }, [isFaceModalOpen]);

  // Efek untuk menjalankan animasi urutan langkah
  useEffect(() => {
    if (status === 'welcome') {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev < 3 ? prev + 1 : 0));
      }, 1500); // Saya set ke 1.5 detik agar pasien sempat melihat ikon sebelum ganti ke angka
      return () => clearInterval(interval);
    }
  }, [status]);

  // Auto-focus logic yang lebih kuat
  useEffect(() => {
    const keepFocus = () => {
      if (status === 'welcome' || status === 'error') {
        inputRef.current?.focus();
      }
    };
    keepFocus();
    window.addEventListener('click', keepFocus);
    return () => window.removeEventListener('click', keepFocus);
  }, [status]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput) return;

    setStatus('loading');

    try {
      const response = await ApmAPI.create({ value: qrInput });

      if (response.meta?.code === 200 && response.data) {
        const p = response.data;
        setPatient({
          nama: p.nama,
          nik: p.nik, // Disimpan untuk payload verifikasi wajah
          tgl_lahir: p.tanggal_lahir,
          penjamin: p.penjamin,
          unit: p.unit,
          dokter: p.dokter, // Data Baru
          no_bpjs: p.no_bpjs,
          no_rujukan: p.no_rujukan_bpjs,
          tgl_periksa: p.tanggal_periksa, // Data Baru
          is_frista: p.is_frista
        });
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Kesalahan API:", error);
      setStatus('error');
    } finally {
      setQrInput("");
    }
  };

  const resetForm = () => {
    setStatus('welcome');
    setQrInput("");
    setPatient(null);
  };

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL), // Deteksi wajah
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL), // Cari titik wajah
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL), // Buat encoding/descriptor
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Gagal memuat model AI", err);
      }
    };
    loadModels();
  }, []);

  const startFaceDetection = () => {
    detectionInterval.current = setInterval(async () => {
      if (videoRef.current && modelsLoaded && faceStatus === 'scanning') {
        const detection = await faceapi.detectSingleFace(
          videoRef.current,
          new faceapi.SsdMobilenetv1Options({ minConfidence: 0.6 }) // Ambang batas 60%
        );
        // Update state apakah ada wajah yang terdeteksi
        setIsFaceDetected(!!detection);
      }
    }, 500);
  };

  // 3. Modifikasi Timer Logic
  useEffect(() => {
    let timer: any;
    if (isFaceModalOpen && faceStatus === 'scanning') {
      // Mulai deteksi wajah saat modal buka
      startFaceDetection();

      timer = setInterval(() => {
        setCountdown((prev) => {
          // Timer hanya berkurang jika wajah terdeteksi
          if (isFaceDetected) {
            if (prev <= 1) {
              clearInterval(timer);
              handleCapture();
              return 0;
            }
            return prev - 1;
          }
          return prev; // Pause timer jika wajah hilang
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
      if (detectionInterval.current) clearInterval(detectionInterval.current);
    };
  }, [isFaceModalOpen, faceStatus, isFaceDetected, modelsLoaded]);

  const handleCapture = async () => {
    if (!videoRef.current || !patient) return;

    // Set status ke loading agar user tahu proses sedang berjalan
    setFaceStatus('scanning');

    try {
      // 1. Ekstrak deskriptor dari frame video saat ini
      const detection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setFaceStatus('error');
        return;
      }

      // 2. Siapkan payload: NIK dan Descriptor (Array 128 Float)
      // Kita gunakan Array.from() karena descriptor aslinya adalah Float32Array
      const payload = {
        nik: patient.nik,
        encoding: Array.from(detection.descriptor)
      };

      // 3. Kirim ke backend untuk verifikasi/pendaftaran
      const response = await ApmAPI.submit(payload);

      if (response.meta?.code === 200 || response.status === 'success') {
        setFaceStatus('success');

        // Jeda 2.5 detik agar user bisa melihat status sukses sebelum modal tutup
        setTimeout(() => {
          setIsFaceModalOpen(false);
          resetForm();
          alert("Verifikasi Berhasil! Silakan ambil struk pendaftaran Anda.");
        }, 2500);
      } else {
        setFaceStatus('error');
      }
    } catch (error) {
      console.error("Gagal mengirim payload wajah:", error);
      setFaceStatus('error');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#1B3C6E] overflow-hidden relative font-sans text-slate-900">
      <style>
        {`
          @keyframes scanning {
            0%, 100% { top: 5%; opacity: 1; }
            50% { top: 90%; opacity: 0.8; }
          }
          @keyframes scanPulse {
            0%, 100% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.02); filter: brightness(1.2); }
          }
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #ED8124; border-radius: 10px; }
        `}
      </style>

      {/* Dekorasi Latar Belakang yang lebih halus */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40vw] h-[40vw] bg-[#ED8124] rounded-full blur-[120px] opacity-10 animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[30vw] h-[30vw] bg-blue-400 rounded-full blur-[100px] opacity-10" />
      </div>

      {/* --- PANEL KIRI: SCANNER (Sisi Interaksi) --- */}
      <div className="w-full lg:w-[40%] bg-white/5 backdrop-blur-lg p-6 lg:p-12 flex flex-col justify-center items-center relative z-10 border-r border-white/10 shadow-2xl">
        <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-3xl mx-auto flex items-center justify-center border-4 border-[#ED8124] shadow-[0_20px_50px_rgba(237,129,36,0.3)] transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <img src={LogoRSUAD} alt="Logo RS" className="w-[70%] h-[70%] object-contain" />
          </div>
          <div>
            <h1 className="text-white text-3xl lg:text-4xl font-black tracking-tight leading-none">ANJUNGAN MANDIRI</h1>
            <p className="text-orange-400 text-lg lg:text-xl font-medium mt-2">RS Universitas Ahmad Dahlan</p>
          </div>
        </div>

        <Card className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.4)] border-0 relative overflow-hidden group">
          <CardContent className="p-0 space-y-8">
            <div className="text-center space-y-6">
              {/* Pengkondisian antara Loading dan Area Scanner */}
              {status === 'loading' ? (
                <div className="relative w-40 h-40 mx-auto flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-500">
                  <div className="relative">
                    {/* Spinner utama */}
                    <Loader2 className="w-16 h-16 text-[#ED8124] animate-spin" />
                    {/* Pulsing ring di luar spinner untuk kesan lebih profesional */}
                    <div className="absolute inset-0 w-16 h-16 border-4 border-orange-500/20 rounded-full" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[#1B3C6E] font-black text-3xl italic tracking-tight">Memproses...</p>
                    <div className="flex gap-1 justify-center">
                      <span className="w-2 h-2 bg-[#ED8124] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-[#ED8124] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-[#ED8124] rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>

                  <div className="relative w-40 h-40 mx-auto group animate-in fade-in zoom-in duration-500">
                    {/* Background Dark Icon */}
                    <div className="w-full h-full bg-slate-900 rounded-[30px] flex items-center justify-center shadow-inner animate-[scanPulse_3s_infinite]">
                      <QrCode className="w-20 h-20 text-white opacity-90" />
                    </div>

                    {/* Garis Scan yang diperbarui */}
                    <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ED8124] to-transparent shadow-[0_0_20px_#ED8124] z-20 animate-[scanning_2.5s_ease-in-out_infinite]" />

                    {/* Frame corners */}
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-[#ED8124] rounded-tl-xl" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-[#ED8124] rounded-tr-xl" />
                    <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-[#ED8124] rounded-bl-xl" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-[#ED8124] rounded-br-xl" />
                  </div>
                  {/* Teks panduan di bawah ikon/loading */}
                  <div className="space-y-2 mt-8">
                    <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                      Pindai QR Code
                    </h3>
                    <p className="text-slate-500 text-sm font-medium px-4">
                      Tempelkan kode pada kartu BPJS atau surat kontrol Anda
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Input tetap ada di bawah untuk menangkap input scanner meskipun loading */}
            <form onSubmit={handleScan} className="relative">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Barcode className={`w-6 h-6 ${status === 'loading' ? 'text-slate-300' : 'text-[#ED8124]'}`} />
              </div>
              <input
                ref={inputRef}
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                disabled={status === 'loading'}
                placeholder={status === 'loading' ? "SEDANG PROSES..." : "SCAN DI SINI"}
                className="w-full h-16 pl-14 pr-6 text-xl font-bold tracking-[0.2em] text-center border-2 border-slate-100 bg-slate-50 rounded-2xl focus-visible:ring-4 focus-visible:ring-orange-500/10 transition-all"
              />
            </form>
          </CardContent>
        </Card>
      </div>

      {/* --- PANEL KANAN: KONTEN (Sisi Informasi) --- */}
      <div className="flex-1 bg-slate-50/95 backdrop-blur-sm p-6 lg:p-12 flex flex-col justify-center items-center overflow-y-auto custom-scrollbar z-10">
        <div className="w-full max-w-3xl mx-auto">

          {/* STATE: WELCOME (Lebih Friendly) */}
          {status === 'welcome' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-12 duration-1000">
              <div className="text-center space-y-4">
                <div className="w-fit p-2  rounded-3xl flex items-center justify-center mx-auto mb-6">
                  {/* <HandHelping className="w-10 h-10" /> */}
                  <img src={Logo2RSUAD} alt="Logo RS" className="w-[200px] object-contain" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-[#1B3C6E]">Halo, Selamat Datang!</h2>
                <p className="text-slate-500 text-lg lg:text-xl font-medium max-w-xl mx-auto">
                  Kami siap membantu Anda melakukan pendaftaran mandiri dengan lebih cepat dan mudah.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { img: step1, text: "Siapkan Kode QR / Nomor Antrean", icon: <ScanText /> },
                  { img: step2, text: "Pindai pada alat di sebelah kiri", icon: <QrCode /> },
                  { img: step3, text: "Konfirmasi data diri Anda", icon: <UserCheck /> },
                  { img: step4, text: "Lakukan Verifikasi Wajah", icon: <User /> }
                ].map((step, i) => (
                  <div key={i} className={'flex flex-col items-center w-full bg-white rounded-2xl shadow-sm border ${activeStep === i ? "border-[#ED8124] ring-4 ring-orange-500/10 scale-[1.02]" : "border-slate-100"}'}>
                    <img src={step.img} className='h-24 mt-4' alt="" />
                    <div
                      className={`flex w-full items-center gap-4 p-5  transition-all duration-500 group`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shrink-0 transition-all duration-500 ${activeStep === i
                        ? "bg-[#ED8124] text-white"
                        : "bg-slate-50 text-[#ED8124]"
                        }`}>
                        {/* Logika Ganti Ikon ke Angka */}
                        {activeStep === i ? (
                          <span className="animate-in zoom-in duration-300">{i + 1}</span>
                        ) : (
                          <div className="animate-in fade-in duration-300">{step.icon}</div>
                        )}
                      </div>
                      <p className={`font-bold transition-colors duration-300 ${activeStep === i ? "text-[#ED8124]" : "text-[#1B3C6E]"
                        }`}>
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STATE: SUCCESS (Lebih Profesional) */}
          {status === 'success' && patient && (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              <div className="bg-[#28a745] text-white p-8 rounded-[32px] shadow-2xl flex items-center gap-6 relative overflow-hidden">
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                  <CheckCircle2 size={150} />
                </div>
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-3xl font-black">Data Ditemukan!</h3>
                  <p className="text-emerald-50 text-lg font-medium">Silakan periksa kembali data pendaftaran Anda di bawah ini.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Baris 1: Identitas Utama */}
                <InfoBox icon={<User size={18} />} label="Nama Pasien" value={patient.nama} compact />
                <InfoBox icon={<IdCard size={18} />} label="NIK (KTP)" value={patient.nik} compact />

                {/* Baris 2: Detail Klinis */}
                <InfoBox icon={<Hospital size={18} />} label="Unit / Klinik" value={patient.unit} compact />
                <InfoBox icon={<Stethoscope size={18} />} label="Dokter" value={patient.dokter} compact />

                {/* Baris 3: Jadwal & Administrasi */}
                <InfoBox icon={<CalendarCheck size={18} />} label="Tanggal Periksa" value={patient.tgl_periksa} compact />
                <InfoBox icon={<HandHelping size={18} />} label="Penjamin" value={patient.penjamin} compact />

                {/* Baris 4: BPJS Detail */}
                <InfoBox icon={<IdCard size={18} />} label="No. BPJS" value={patient.no_bpjs} compact />
                <InfoBox icon={<Barcode size={18} />} label="No. Rujukan" value={patient.no_rujukan} compact />

                {/* Informasi Tambahan: Tanggal Lahir (Full Width / Secondary) */}
                <div className="md:col-span-2">
                  <InfoBox icon={<Info size={18} />} label="Tanggal Lahir" value={patient.tgl_lahir} compact />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="flex-1 h-20 text-xl font-bold rounded-2xl border-2 hover:bg-slate-100 text-slate-600"
                >
                  BATAL
                </Button>
                <Button
                  onClick={() => setIsFaceModalOpen(true)}
                  className="flex-[2] h-20 bg-[#ED8124] hover:bg-[#d6721d] text-white text-2xl font-black rounded-2xl shadow-[0_15px_30px_rgba(237,129,36,0.3)] transition-all hover:scale-[1.02] active:scale-95"
                >
                  LANJUT VERIFIKASI <ArrowRight className="ml-3 w-8 h-8" />
                </Button>
              </div>
            </div>
          )}

          {/* STATE: ERROR (Lebih Empati) */}
          {status === 'error' && (
            <div className="text-center space-y-8 animate-in shake-in duration-500">
              <div className="w-32 h-32 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <XCircle className="w-16 h-16" />
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-black text-slate-800">Mohon Maaf...</h3>
                <p className="text-slate-500 text-xl font-medium">Data pendaftaran tidak ditemukan atau sudah kadaluarsa.</p>
              </div>
              <Button
                onClick={resetForm}
                className="w-full max-w-sm h-16 bg-slate-900 text-white text-xl font-bold rounded-2xl shadow-xl"
              >
                COBA LAGI
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isFaceModalOpen} onOpenChange={(val) => {
        setIsFaceModalOpen(val);
        if (!val) setFaceStatus('scanning'); // reset saat tutup
      }}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-[40px] border-0 shadow-2xl">
          <div className="p-10 space-y-8 text-center bg-white">

            {/* Header: Ditambahkan kondisi Loading Models */}
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-[#1B3C6E]">
                {!modelsLoaded ? "Memuat AI..." :
                  faceStatus === 'scanning' ? (isFaceDetected ? "Wajah Terdeteksi" : "Mencari Wajah...") :
                    faceStatus === 'success' ? "Verifikasi Berhasil!" : "Verifikasi Gagal"}
              </h2>
              <p className="text-slate-500 font-medium">
                {!modelsLoaded ? "Mohon tunggu sebentar..." :
                  faceStatus === 'scanning' ? (isFaceDetected ? "Mohon diam, sedang memproses..." : "Posisikan wajah Anda di tengah lingkaran") :
                    faceStatus === 'success' ? "Identitas Anda telah terverifikasi" : "Wajah tidak dikenali atau posisi tidak tepat"}
              </p>
            </div>

            {/* Container Video: Border berubah warna sesuai deteksi AI */}
            <div className={`relative aspect-square max-w-[350px] mx-auto bg-slate-900 rounded-full overflow-hidden shadow-2xl border-[12px] transition-colors duration-300 group ${faceStatus === 'scanning'
              ? (isFaceDetected ? 'border-emerald-400' : 'border-slate-200')
              : 'border-slate-50'
              }`}>

              {faceStatus === 'scanning' ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                  />

                  {/* Scanning Line: Hanya muncul jika AI mendeteksi wajah */}
                  {isFaceDetected && (
                    <div className="absolute left-0 w-full h-2 bg-[#ED8124] shadow-[0_0_20px_#ED8124] z-30 animate-[scanning_2s_infinite]" />
                  )}

                  {/* Feedback Visual: Frame target di tengah */}
                  <div className={`absolute inset-0 flex items-center justify-center z-10 opacity-30 ${isFaceDetected ? 'text-emerald-400' : 'text-white'}`}>
                    <div className="w-64 h-64 border-2 border-dashed rounded-full border-current" />
                  </div>
                </>
              ) : (
                <div className={`absolute inset-0 rounded-full flex items-center justify-center z-40 animate-in zoom-in duration-500 ${faceStatus === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                  {faceStatus === 'success' ? <CheckCircle2 size={120} className="text-white" /> : <XCircle size={120} className="text-white" />}
                </div>
              )}

              <div className="absolute inset-0 border-[30px] border-white/40 rounded-full z-20 pointer-events-none" />
            </div>

            {/* Footer: Timer hanya berjalan/aktif jika wajah terdeteksi */}
            <div className="flex flex-col gap-4">
              {faceStatus === 'scanning' && (
                <div className={`inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl transition-colors ${isFaceDetected ? 'bg-emerald-50' : 'bg-orange-50'
                  }`}>
                  {isFaceDetected ? (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-emerald-600 font-black text-2xl uppercase">
                        Mengunci: 0{countdown}s
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                      <span className="text-orange-500 font-bold uppercase">
                        Menunggu Wajah...
                      </span>
                    </div>
                  )}
                </div>
              )}

              {faceStatus === 'error' && (
                <Button onClick={handleRetryFace} className="h-16 bg-[#ED8124] text-white text-xl font-black rounded-2xl shadow-lg">
                  <RefreshCw className="mr-2" /> COBA LAGI
                </Button>
              )}

              <Button
                variant="ghost"
                onClick={() => setIsFaceModalOpen(false)}
                className="text-slate-400 hover:text-red-500 transition-colors font-bold"
              >
                {faceStatus === 'success' ? "MENYELESAIKAN..." : "BATALKAN PROSES"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const InfoBox = ({ icon, label, value, compact, isAddress }: {
  icon: any,
  label: string,
  value: string,
  compact?: boolean,
  isAddress?: boolean
}) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 transition-colors ${compact ? 'p-3' : 'p-4'}`}>
    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
      <div className="text-[#ED8124] shrink-0">{icon}</div>
      <span className="truncate">{label}</span>
    </div>
    <div
      className={`
        ${compact ? 'text-base' : 'text-lg'} 
        font-black text-slate-800 uppercase leading-tight
        ${isAddress ? 'line-clamp-2' : 'truncate'}
      `}
      title={value} // Munculkan teks lengkap saat kursor diarahkan (hover)
    >
      {value || "-"}
    </div>
  </div>
);

export default AnjunganMandiri;