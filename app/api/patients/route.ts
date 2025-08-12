// app/api/patients/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import nodemailer from "nodemailer";
import QRCode from "qrcode";

const prisma = new PrismaClient();

const createPatientSchema = z.object({
  patientId: z.string(),
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z
    .string()
    .email("Format email tidak valid")
    .optional()
    .or(z.literal("")),
  dob: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Tanggal lahir tidak valid"),
  age: z.coerce.number().min(0, "Umur harus diisi"),
  gender: z.string().min(1, "Jenis kelamin harus diisi"),
  department: z.string().min(1, "Departemen harus diisi"),
  mcuPackage: z.array(z.string()).min(1, "Pilih minimal satu paket MCU"),
  companyId: z.string(),
});

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
    const validation = createPatientSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      patientId,
      fullName,
      email,
      dob,
      age,
      gender,
      department,
      mcuPackage,
      companyId,
    } = validation.data;

    const result = await prisma.$transaction(async (tx) => {
      const newPatient = await tx.patient.create({
        data: {
          patientId,
          fullName,
          email: email || null,
          dob: new Date(dob),
          age,
          gender,
          department,
          mcuPackage,
          companyId,
          qrCode: "temp",
        },
      });

      const newMcuResult = await tx.mcuResult.create({
        data: {
          patientId: newPatient.id,
        },
      });

      // --- [PERBAIKAN UTAMA DI SINI] ---
      // 3. Buat konten yang informatif untuk QR Code
      const qrContent = `Nama Pasien: ${fullName}\nID Pasien: ${patientId}\nID Pemeriksaan: ${newMcuResult.id}`;
      
      // 4. Buat gambar QR Code sebagai Data URL dari konten di atas
      const qrCodeDataUrl = await QRCode.toDataURL(qrContent);

      // 5. Update pasien dengan Data URL QR Code yang baru
      const updatedPatient = await tx.patient.update({
        where: { id: newPatient.id },
        data: {
          qrCode: qrCodeDataUrl,
        },
      });
      // ------------------------------------

      return { patient: updatedPatient, mcuResult: newMcuResult };
    });

    if (email) {
      try {
        const qrCodeDataUrl = result.patient.qrCode; 
        const base64Data = qrCodeDataUrl.replace(
          /^data:image\/png;base64,/,
          ""
        );

        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: `QR Code Pendaftaran MCU untuk ${fullName}`,
          html: `
            <h1>Pendaftaran MCU Berhasil</h1>
            <p>Halo <strong>${fullName}</strong>,</p>
            <p>Pendaftaran Anda untuk Medical Check Up telah berhasil dengan nomor pasien <strong>${patientId}</strong>.</p>
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
              cid: "qrcode",
            },
          ],
        });
      } catch (emailError) {
        console.error("Gagal mengirim email:", emailError);
      }
    }

    return NextResponse.json(result.patient, { status: 201 });
  } catch (error) {
    console.error("Create Patient Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json(
        { message: "Company ID is required" },
        { status: 400 }
      );
    }

    const patients = await prisma.patient.findMany({
      where: { companyId },
      include: {
        mcuResults: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error("Fetch Patients Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
