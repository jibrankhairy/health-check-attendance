import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId } = body;

    if (!patientId) {
      return NextResponse.json(
        { message: "ID Pasien dibutuhkan." },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { id: Number(patientId) },
    });

    if (!patient) {
      return NextResponse.json(
        { message: "Pasien tidak ditemukan." },
        { status: 404 }
      );
    }
    if (!patient.email) {
      return NextResponse.json(
        { message: "Pasien tidak memiliki alamat email." },
        { status: 400 }
      );
    }
    if (!patient.qrCode) {
      return NextResponse.json(
        { message: "Pasien ini tidak memiliki QR Code." },
        { status: 400 }
      );
    }

    const base64Data = patient.qrCode.replace(/^data:image\/png;base64,/, "");

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: patient.email,
      subject: `QR Code Pendaftaran MCU untuk ${patient.fullName}`,
      html: `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#222">
      <h1 style="margin:0 0 12px">Pendaftaran MCU Berhasil</h1>
      <p>Halo <strong>${patient.fullName}</strong>,</p>
      <p>Pendaftaran Anda untuk Medical Check Up telah berhasil dengan nomor pasien <strong>${patient.patientId}</strong>.</p>

      <p style="margin:16px 0 8px">Sebelum datang, mohon mengisi kuesioner pra-MCU melalui tautan berikut:</p>
      <p>
        <a href="https://mcu.mitralab.my.id/form" target="_blank" rel="noopener noreferrer"
           style="display:inline-block; background:#01449D; color:#fff; text-decoration:none; padding:10px 16px; border-radius:6px; font-weight:600">
          Isi Kuesioner Pra-MCU
        </a>
      </p>
      <p style="font-size:12px; color:#555; margin-top:8px">
        Jika tombol tidak bisa diklik, salin alamat ini ke browser Anda:<br/>
        <span>https://mcu.mitralab.my.id/form</span>
      </p>

      <p>Silakan tunjukkan QR Code di bawah ini kepada petugas saat tiba di lokasi.</p>
      <br/>
      <img src="cid:qrcode" alt="QR Code" style="display:block; width:160px; height:160px;"/>
      <p style="margin-top:16px">Terima kasih.</p>
    </div>
  `,
      attachments: [
        {
          filename: "qrcode.png",
          content: base64Data,
          encoding: "base64",
          cid: "qrcode",
        },
      ],
    });

    return NextResponse.json({
      message: `Email berhasil dikirim ke ${patient.email}`,
    });
  } catch (error) {
    console.error("Gagal mengirim email manual:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
