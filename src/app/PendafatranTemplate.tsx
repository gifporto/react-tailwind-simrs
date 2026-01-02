import React, { forwardRef } from 'react';

// Interface disesuaikan agar sesuai dengan key dari Response API
interface PrintData {
  nomor_antrian: string;
  poli: string;
  nama_pasien: string;
  is_bpjs: boolean;
  // Field tambahan jika Anda ingin tetap menampilkan waktu secara dinamis
  waktu?: string; 
}

export const PrintTemplate = forwardRef<HTMLDivElement, { data: PrintData }>((props, ref) => {
  const { data } = props;

  // Jika data belum siap, jangan render apapun
  if (!data || !data.nomor_antrian) return null;

  // Fallback untuk waktu jika tidak dikirim dari parent
  const waktuCetak = data.waktu || new Date().toLocaleString('id-ID', { 
    dateStyle: 'medium', 
    timeStyle: 'short' 
  });

  return (
    /* Container luar disembunyikan di layar, hanya muncul saat proses print */
    <div style={{ display: 'none' }}>
      <div ref={ref} style={styles.printArea}>
        <div style={styles.container}>
          {/* Mapping Instansi (Statis atau bisa dari data.nama_pasien jika perlu context) */}
          <h1 style={styles.header}>RUMAH SAKIT UAD</h1> 
          
          <p style={styles.subheader}>
            PENDAFTARAN<br />
            NO ANTRIAN
          </p>
          
          {/* Mapping nomor_antrian dari API */}
          <div style={styles.queueNumber}>{data.nomor_antrian}</div>

          {/* Barcode Murni CSS */}
          <div style={styles.barcodeContainer}>
            <div style={styles.barcodeStripes}></div>
          </div>
          
          <div style={styles.timestamp}>
             {waktuCetak}
          </div>

          <hr style={styles.hr} />

          <div style={styles.disasterWarning}>
            <div style={styles.warningTitle}>Early Warning for Disaster:</div>
            Apabila terjadi alarm keadaan gawat darurat, jangan panik. 
            Ikuti arahan petugas untuk evakuasi menuju titik kumpul. 
            Pastikan orang yang bersama anda berada di titik kumpul.
          </div>
        </div>
      </div>
    </div>
  );
});

const styles: { [key: string]: React.CSSProperties } = {
  printArea: {
    width: '75mm',
    padding: '6mm',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
    color: '#000',
  },
  container: {
    textAlign: 'center',
    width: '100%',
  },
  header: {
    fontSize: '18pt',
    fontWeight: 'bold',
    margin: '0 0 2px 0',
    textTransform: 'uppercase',
  },
  subheader: {
    fontSize: '11pt',
    margin: '0 0 10px 0',
    lineHeight: 1.2,
    fontWeight: 'normal',
  },
  queueNumber: {
    fontSize: '72pt',
    fontWeight: 'bold',
    margin: '5px 0',
    lineHeight: 1,
  },
  barcodeContainer: {
    width: '80%',
    height: '50px',
    margin: '15px auto',
  },
  barcodeStripes: {
    width: '100%',
    height: '100%',
    background: `repeating-linear-gradient(
      90deg,
      #000,
      #000 1px,
      #fff 1px,
      #fff 3px,
      #000 3px,
      #000 4px,
      #fff 4px,
      #fff 5px,
      #000 5px,
      #000 7px,
      #fff 7px,
      #fff 8px
    )`,
    backgroundSize: '30px 100%',
  },
  timestamp: {
    fontSize: '10pt',
    marginBottom: '10px',
    textTransform: 'uppercase'
  },
  hr: {
    border: '0',
    borderTop: '1px solid #000',
    margin: '12px 0',
  },
  disasterWarning: {
    textAlign: 'left',
    fontSize: '12pt',
    lineHeight: 1.4,
  },
  warningTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '4px',
  }
};