import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { transporter, mailOptions } from '@/lib/mailer'; // Pastikan file ini ada
import QRCode from 'qrcode'; // Import library qrcode

const prisma = new PrismaClient();

// --- Fungsi-fungsi helper (tidak berubah) ---
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
        const existingPatient = await prisma.patient.findUnique({ where: { patientId } });
        if (!existingPatient) {
            isUnique = true;
        }
    }
    return patientId;
}

interface PatientInput {
  nik: string;
  fullName: string;
  email?: string | null;
  dob: string;
  department: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patients, companyId } = body;

    if (!Array.isArray(patients) || !companyId) {
      return NextResponse.json({ message: "Input tidak valid." }, { status: 400 });
    }

    let createdCount = 0;

    for (const patient of patients) {
        if (!patient.nik || !patient.fullName || !patient.dob) continue;

        const dob = new Date(patient.dob);
        if (isNaN(dob.getTime())) continue;

        // Di skema lu, qrCode itu unik. Kita pakai NIK untuk ini.
        const existingPatientByNik = await prisma.patient.findUnique({ where: { qrCode: patient.nik } });
        if (existingPatientByNik) continue;

        const age = calculateAge(dob);
        const newPatientId = await generateUniquePatientId();

        const createdPatient = await prisma.patient.create({
            data: {
                patientId: newPatientId,
                fullName: patient.fullName,
                email: patient.email,
                dob: dob,
                age: age,
                department: patient.department || "N/A",
                qrCode: patient.nik, // NIK dari Excel disimpan sebagai qrCode
                mcuPackage: {},
                companyId: companyId,
            }
        });
        createdCount++;

        // **LOGIKA PENGIRIMAN EMAIL DARI FILE MANUAL DITERAPKAN DI SINI**
        if (createdPatient && createdPatient.email) {
            try {
                // Buat QR Code dari NIK (yang disimpan di field qrCode)
                const qrCodeDataUrl = await QRCode.toDataURL(createdPatient.qrCode);
                const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");

                await transporter.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: createdPatient.email,
                    subject: `QR Code Pendaftaran MCU untuk ${createdPatient.fullName}`,
                    html: `
                      <h1>Pendaftaran MCU Berhasil</h1>
                      <p>Halo <strong>${createdPatient.fullName}</strong>,</p>
                      <p>Pendaftaran Anda untuk Medical Check Up telah berhasil dengan nomor pasien <strong>${createdPatient.patientId}</strong>.</p>
                      <p>Silakan tunjukkan QR Code di bawah ini kepada petugas saat tiba di lokasi.</p>
                      <p>Terima kasih.</p>
                      <br>
                      <img src="cid:qrcode"/>
                    `,
                    attachments: [
                      {
                        filename: "qrcode.png",
                        content: base64Data,
                        encoding: "base64",
                        cid: "qrcode", // ID ini harus sama dengan src di tag img
                      },
                    ],
                });

                console.log(`Email terkirim ke ${createdPatient.email}`);
            } catch (emailError) {
                console.error(`Gagal mengirim email ke ${createdPatient.email}:`, emailError);
            }
        }
    }

    if (createdCount === 0) {
      return NextResponse.json({ message: `Tidak ada pasien baru yang ditambahkan.` }, { status: 200 });
    }

    return NextResponse.json({ message: `Berhasil mengimpor ${createdCount} data pasien baru.` }, { status: 201 });
  } catch (error) {
    console.error("Bulk insert failed:", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}