import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { randomUUID } from "crypto";
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
      department,
      mcuPackage,
      companyId,
    } = validation.data;

    const qrCodeId = randomUUID();

    const newPatient = await prisma.patient.create({
      data: {
        patientId,
        fullName,
        email: email || null,
        dob: new Date(dob),
        age,
        department,
        mcuPackage,
        companyId,
        qrCode: qrCodeId,
      },
    });

    if (email) {
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(qrCodeId);
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

    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    console.error("Create Patient Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error("Fetch Patients Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
