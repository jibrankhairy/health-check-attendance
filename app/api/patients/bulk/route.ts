import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import nodemailer from "nodemailer";
import QRCode from "qrcode";

export const runtime = "nodejs";
export const maxDuration = 60;

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

function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const m = today.getMonth() - dateOfBirth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) age--;
  return age;
}

async function generateUniquePatientId(
  tx: PrismaClient | Prisma.TransactionClient
): Promise<string> {
  const prefix = "MCU";
  for (let i = 0; i < 100; i++) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const candidate = `${prefix}-${randomDigits}`;
    const exists = await tx.patient.findFirst({
      where: { patientId: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;
  }
  throw new Error("Gagal membuat patientId unik setelah 100 percobaan");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patients, companyId, sendEmail } = body;

    if (!Array.isArray(patients) || !companyId) {
      return NextResponse.json(
        { message: "Input tidak valid." },
        { status: 400 }
      );
    }

    let createdCount = 0;
    let skippedCount = 0;
    const createdPatients: Array<{
      id: number;
      fullName: string;
      patientId: string;
      email: string | null;
      qrCode: string | null;
    }> = [];

    for (const patientData of patients) {
      if (!patientData?.nik || !patientData?.fullName || !patientData?.dob)
        continue;

      const dob = new Date(patientData.dob);
      if (isNaN(dob.getTime())) continue;

      const existingPatient = await prisma.patient.findFirst({
        where: { nik: String(patientData.nik) },
        select: { id: true },
      });
      if (existingPatient) {
        skippedCount++;
        continue;
      }

      const updatedPatient = await prisma.$transaction(async (tx) => {
        const age = patientData.age || calculateAge(dob);
        const newPatientId = await generateUniquePatientId(tx);

        const newPatient = await tx.patient.create({
          data: {
            patientId: newPatientId,
            nik: String(patientData.nik),
            fullName: patientData.fullName,
            email: patientData.email || null,
            dob,
            age,
            gender: patientData.gender || "N/A",
            position: patientData.position || "N/A",
            division: patientData.division || "N/A",
            status: patientData.status || "N/A",
            location: patientData.location || "N/A",
            mcuPackage: patientData.mcuPackage || [],
            companyId,
            qrCode: "",
          },
          select: { id: true, fullName: true, patientId: true, email: true },
        });

        const newMcuResult = await tx.mcuResult.create({
          data: { patientId: newPatient.id },
          select: { id: true },
        });

        const qrContent = {
          mcuResultId: newMcuResult.id,
          patientId: newPatient.patientId,
          fullName: newPatient.fullName,
          mcuPackage: patientData.mcuPackage || [],
        };

        const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrContent));

        const updated = await tx.patient.update({
          where: { id: newPatient.id },
          data: { qrCode: qrCodeDataUrl },
          select: {
            id: true,
            fullName: true,
            patientId: true,
            email: true,
            qrCode: true,
          },
        });

        return updated;
      });

      createdPatients.push(updatedPatient);
      createdCount++;
    }

    if (sendEmail) {
      for (const p of createdPatients) {
        if (p.email && p.qrCode) {
          try {
            const base64Data = p.qrCode.replace(/^data:image\/png;base64,/, "");
            await transporter.sendMail({
              from: process.env.EMAIL_FROM,
              to: p.email,
              subject: `QR Code Pendaftaran MCU untuk ${p.fullName}`,
              html: `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#222">
      <h1 style="margin:0 0 12px">Pendaftaran MCU Berhasil</h1>
      <p>Halo <strong>${p.fullName}</strong>,</p>
      <p>Pendaftaran Anda untuk Medical Check Up telah berhasil dengan nomor pasien <strong>${p.patientId}</strong>.</p>

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

      <p>Silakan tunjukkan QR Code di bawah saat registrasi.</p>
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
          } catch (emailError) {
            console.error(`Gagal mengirim email ke ${p.email}:`, emailError);
          }
        }
      }
    }

    let message = `Berhasil mengimpor ${createdCount} data pasien baru.`;
    if (skippedCount > 0)
      message += ` ${skippedCount} data dilewati karena NIK sudah ada.`;
    if (createdCount === 0 && skippedCount === 0)
      message = "Tidak ada data pasien baru untuk ditambahkan.";

    return NextResponse.json(
      { message, createdCount, skippedCount },
      { status: createdCount > 0 ? 201 : 200 }
    );
  } catch (error) {
    console.error("Bulk insert failed:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
