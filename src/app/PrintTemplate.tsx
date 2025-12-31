import React, { forwardRef } from 'react';

const StrukTemplate = forwardRef<HTMLDivElement, { patient: any }>(({ patient }, ref) => {
    // Validasi: Hanya tampil jika data nomor_antrian dari respon API sudah ada
    if (!patient || !patient.nomor_antrian) return null;

    const s = {
        container: {
            width: '72mm',
            backgroundColor: '#ffffff',
            color: '#000000',
            fontFamily: 'Arial, sans-serif', // Menggunakan font sans-serif agar mirip gambar
            padding: '4mm 2mm',
            margin: '0 auto',
            lineHeight: '1.2',
        },
        header: {
            textAlign: 'center' as const,
            marginBottom: '10px',
        },
        infoRow: {
            marginBottom: '4px',
            fontSize: '11px',
        },
        label: { fontWeight: 'bold' as const },
        value: { fontWeight: 'bold' as const },
        checklistTable: {
            width: '100%',
            marginTop: '10px',
            fontSize: '11px',
            borderCollapse: 'collapse' as const,
        },
        footerText: {
            textAlign: 'center' as const,
            fontSize: '10px',
            marginTop: '15px',
            borderTop: '1px solid #000',
            paddingTop: '10px',
        },
        warningBox: {
            marginTop: '15px',
            fontSize: '10px',
            textAlign: 'center' as const,
        }
    };

    return (
        <div ref={ref} style={s.container}>
            <div style={s.header}>
                <h2 style={{ fontSize: '16px', margin: 0, fontWeight: 'bold' }}>NO ANTRIAN DOKTER</h2>
                <h1 style={{ fontSize: '32px', margin: '5px 0', fontWeight: 'bold' }}>{patient.nomor_antrian}</h1>
                <h2 style={{ fontSize: '14px', margin: 0, fontWeight: 'bold' }}>NO RUANG</h2>
                <p style={{ fontSize: '11px', fontWeight: 'bold', margin: '5px 0' }}>
                    Silahkan Menuju Nurse Station (Perawat) Rawat Jalan
                </p>
                <div style={{ borderBottom: '1px solid #000', margin: '5px 0' }}></div>
            </div>

            <div style={{ padding: '0 1mm' }}>
                <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', fontSize: '12px', marginBottom: '2px' }}>
                        <span style={{ width: '60px', fontWeight: 'bold' }}>NO RM</span>
                        <span style={{ marginRight: '5px' }}>:</span>
                        <span style={{ fontWeight: 'bold' }}>{patient.no_rm}</span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px', textTransform: 'uppercase' }}>
                        {patient.nama_pasien}
                    </div>
                    <div style={{ display: 'flex', fontSize: '11px', color: '#333' }}>
                        <span>{patient.tgl_lahir}</span>
                        <span style={{ margin: '0 5px' }}>|</span>
                        <span>{patient.umur}</span>
                    </div>
                </div>

                {/* Garis pemisah tipis */}
                <div style={{ borderBottom: '1px dashed #ccc', margin: '8px 0' }}></div>

                {/* Bagian Data Kunjungan */}
                <div style={{ fontSize: '11px' }}>
                    <div style={{ display: 'flex', marginBottom: '2px' }}>
                        <span style={{ width: '60px' }}>Tujuan</span>
                        <span style={{ marginRight: '5px' }}>:</span>
                        <span style={{ fontWeight: 'bold' }}>{patient.dokter}</span>
                    </div>
                    <div style={{ display: 'flex', marginBottom: '2px' }}>
                        <span style={{ width: '60px' }}>Poli</span>
                        <span style={{ marginRight: '5px' }}>:</span>
                        <span style={{ fontWeight: 'bold' }}>{patient.poli}</span>
                    </div>
                    <div style={{ display: 'flex', marginBottom: '2px' }}>
                        <span style={{ width: '60px' }}>Penjamin</span>
                        <span style={{ marginRight: '5px' }}>:</span>
                        <span style={{ fontWeight: 'bold' }}>
                            {patient.is_bpjs ? "BPJS KESEHATAN" : "PASIEN UMUM"}
                        </span>
                    </div>
                    <div style={{ marginTop: '5px', fontSize: '10px', color: '#555', fontStyle: 'italic' }}>
                        Waktu Cetak: {new Date().toLocaleDateString('id-ID')} {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>

                <table style={s.checklistTable}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', borderBottom: '1px solid #000' }}>Dokter</th>
                            <th style={{ textAlign: 'left', borderBottom: '1px solid #000' }}>Jenis Pelayanan</th>
                            <th style={{ textAlign: 'right', borderBottom: '1px solid #000' }}>Petugas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {['Radiologi', 'Laboratorium', 'Fisioterapi', 'Tindakan', 'Farmasi/Resep', 'Poli Klinik', 'Assesment'].map((item) => (
                            <tr key={item}>
                                <td style={{ padding: '4px 0' }}>____</td>
                                <td>{item}</td>
                                <td style={{ textAlign: 'right' }}>____</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={s.footerText}>
                <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Harap dibawa pasien sampai pelayanan selesai</p>
                <p style={{ margin: 0, fontStyle: 'italic' }}>Keep this ticket until the service completed</p>
            </div>

            <div style={{ borderTop: '1px solid #000', margin: '10px 0' }}></div>

            <div style={{ fontSize: '10px', textAlign: 'center' }}>
                Saat pasien dipanggil tidak ada, maka akan dilewati minimal 3 pasien, dan melakukan registrasi ulang di nurse station
            </div>

            <div style={s.warningBox}>
                <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>Early Warning for Disaster:</p>
                <p style={{ margin: 0 }}>Apabila terjadi alarm keadaan gawat darurat, jangan panik. Ikuti arahan petugas untuk evakuasi menuju titik kumpul. Pastikan orang yang bersama dengan anda berada di titik kumpul.</p>
            </div>

            <div style={{ borderTop: '1px solid #000', marginTop: '10px', paddingTop: '10px', fontSize: '10px', textAlign: 'center' }}>
                No Antrian: {patient.nomor_antrian} No Ruang:<br />
                {patient.dokter}<br />
                No RM :{patient.no_rm}<br />
                Nama Pasien : {patient.nama_pasien}<br />
            </div>
        </div>
    );
});

StrukTemplate.displayName = "StrukTemplate";
export default StrukTemplate;