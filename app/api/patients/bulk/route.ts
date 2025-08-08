import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import QRCode from "qrcode";

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
  if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  return age;
}

async function generateUniquePatientId(): Promise<string> {
  const prefix = "MCU";
  let isUnique = false;
  let patientId = "";
  while (!isUnique) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    patientId = `${prefix}-${randomDigits}`;
    const existingPatient = await prisma.patient.findUnique({
      where: { patientId },
    });
    if (!existingPatient) {
      isUnique = true;
    }
  }
  return patientId;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patients, companyId } = body;

    if (!Array.isArray(patients) || !companyId) {
      return NextResponse.json(
        { message: "Input tidak valid." },
        { status: 400 }
      );
    }

    let createdCount = 0;
    const createdPatients = [];

    for (const patientData of patients) {
      if (!patientData.nik || !patientData.fullName || !patientData.dob)
        continue;

      const dob = new Date(patientData.dob);
      if (isNaN(dob.getTime())) continue;

      // Cek duplikasi berdasarkan NIK (yang kita simpan di qrCode sebelumnya)
      // Kita akan ganti ini, tapi untuk sementara biarkan untuk mencegah duplikat
      const existingPatientByNik = await prisma.patient.findFirst({
        where: { patientId: patientData.nik },
      });
      if (existingPatientByNik) continue;

      // --- LOGIKA BARU YANG DISINKRONKAN ---
      const result = await prisma.$transaction(async (tx) => {
        const age = calculateAge(dob);
        const newPatientId = await generateUniquePatientId();

        const newPatient = await tx.patient.create({
          data: {
            patientId: newPatientId,
            fullName: patientData.fullName,
            email: patientData.email || null,
            dob: dob,
            age: age,
            gender: patientData.gender || "N/A",
            department: patientData.department || "N/A",
            qrCode: "temp", // Nilai sementara
            mcuPackage: [], // <-- FIX: Gunakan array kosong
            companyId: companyId,
          },
        });

        const newMcuResult = await tx.mcuResult.create({
          data: {
            patientId: newPatient.id,
          },
        });

        const updatedPatient = await tx.patient.update({
          where: { id: newPatient.id },
          data: {
            qrCode: newMcuResult.id, // Gunakan ID McuResult sebagai QR Code
          },
        });

        return updatedPatient;
      });

      createdPatients.push(result);
      createdCount++;
    }

    // Kirim email untuk semua pasien yang berhasil dibuat
    for (const patient of createdPatients) {
      if (patient.email) {
        try {
          const qrCodeDataUrl = await QRCode.toDataURL(patient.qrCode);
          const base64Data = qrCodeDataUrl.replace(
            /^data:image\/png;base64,/,
            ""
          );

          await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: patient.email,
            subject: `QR Code Pendaftaran MCU untuk ${patient.fullName}`,
            html: `<p>Pendaftaran Anda berhasil. Tunjukkan QR Code ini kepada petugas.</p><br><img src="cid:qrcode"/>`,
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
          console.error(
            `Gagal mengirim email ke ${patient.email}:`,
            emailError
          );
        }
      }
    }

    if (createdCount === 0) {
      return NextResponse.json(
        { message: `Tidak ada pasien baru yang ditambahkan.` },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: `Berhasil mengimpor ${createdCount} data pasien baru.` },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bulk insert failed:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
