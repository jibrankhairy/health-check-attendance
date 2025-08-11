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
    const { patients, companyId, sendEmail } = body;

    if (!Array.isArray(patients) || !companyId) {
      return NextResponse.json(
        { message: "Input tidak valid." },
        { status: 400 }
      );
    }

    let createdCount = 0;
    let skippedCount = 0;
    const createdPatients = [];

    for (const patientData of patients) {
      if (!patientData.nik || !patientData.fullName || !patientData.dob)
        continue;

      const dob = new Date(patientData.dob);
      if (isNaN(dob.getTime())) continue;

      const existingPatient = await prisma.patient.findUnique({
        where: { nik: String(patientData.nik) },
      });

      if (existingPatient) {
        skippedCount++;
        continue;
      }

      const result = await prisma.$transaction(async (tx) => {
        const age = patientData.age || calculateAge(dob);
        const newPatientId = await generateUniquePatientId();

        const newPatient = await tx.patient.create({
          data: {
            patientId: newPatientId,
            nik: String(patientData.nik),
            fullName: patientData.fullName,
            email: patientData.email || null,
            dob: dob,
            age: age,
            gender: patientData.gender || "N/A",
            position: patientData.position || "N/A",
            division: patientData.division || "N/A",
            status: patientData.status || "N/A",
            location: patientData.location || "N/A",
            mcuPackage: patientData.mcuPackage || [],
            qrCode: "temp",
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
            qrCode: newMcuResult.id,
          },
        });

        return updatedPatient;
      });

      createdPatients.push(result);
      createdCount++;
    }

    if (sendEmail) {
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
              html: `<p><h1>Pendaftaran MCU Berhasil</h1><p>Halo <strong>${patient.fullName}</strong>,</p><p>Pendaftaran Anda untuk Medical Check Up telah berhasil dengan nomor pasien <strong>${patient.patientId}</strong>.</p><p>Silakan tunjukkan QR Code di bawah ini kepada petugas saat tiba di lokasi.</p><p>Terima kasih.</p><br><img src="cid:qrcode"/>`,
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
    }

    let message = `Berhasil mengimpor ${createdCount} data pasien baru.`;
    if (skippedCount > 0) {
      message += ` ${skippedCount} data dilewati karena NIK sudah ada.`;
    }
    if (createdCount === 0 && skippedCount === 0) {
      message = "Tidak ada data pasien baru untuk ditambahkan.";
    }

    return NextResponse.json(
      { message },
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
