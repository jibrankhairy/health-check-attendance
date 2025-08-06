import * as React from 'react';
import { Html, Head, Preview, Body, Container, Heading, Text, Img } from '@react-email/components';

interface QRCodeEmailProps {
  fullName: string;
  patientId: string;
  qrCodeUrl: string;
}

export const QRCodeEmail: React.FC<Readonly<QRCodeEmailProps>> = ({
  fullName,
  patientId,
  qrCodeUrl,
}) => (
  <Html>
    <Head />
    <Preview>QR Code Pendaftaran MCU Anda</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Halo, {fullName}!</Heading>
        <Text style={paragraph}>
          Terima kasih telah terdaftar untuk Medical Check-Up. Berikut adalah detail pendaftaran Anda:
        </Text>
        <Text style={paragraph}>
          <strong>ID Pasien:</strong> {patientId}
        </Text>
        <Text style={paragraph}>
          Silakan tunjukkan QR Code di bawah ini kepada petugas saat Anda tiba di lokasi MCU.
        </Text>
        <Img
          src={qrCodeUrl}
          width="150"
          height="150"
          alt="QR Code"
          style={qrCode}
        />
        <Text style={paragraph}>
          Terima kasih,
          <br />
          Tim Klinik
        </Text>
      </Container>
    </Body>
  </Html>
);

// Gaya CSS (disederhanakan untuk Nodemailer)
const main = { backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' };
const container = { backgroundColor: '#ffffff', margin: '0 auto', padding: '20px 0 48px', border: '1px solid #f0f0f0' };
const heading = { fontSize: '24px', color: '#484848', padding: '0 40px' };
const paragraph = { fontSize: '14px', color: '#484848', padding: '0 40px' };
const qrCode = { display: 'block', margin: '20px auto' };