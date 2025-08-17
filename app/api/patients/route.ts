import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import nodemailer from "nodemailer";
import QRCode from "qrcode";

const prisma = new PrismaClient();

const createPatientSchema = z.object({
  patientId: z.string(),
  nik: z.string().min(1, "NIK tidak boleh kosong."),
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
  position: z.string().min(1, "Posisi harus diisi."),
  division: z.string().min(1, "Divisi harus diisi."),
  status: z.string().min(1, "Status harus diisi."),
  location: z.string().min(1, "Lokasi harus diisi."),
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

    const { nik, ...restOfData } = validation.data;

    const existingPatient = await prisma.patient.findUnique({
      where: { nik: nik },
    });

    if (existingPatient) {
      return NextResponse.json(
        { message: `Pasien dengan NIK ${nik} sudah terdaftar.` },
        { status: 409 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const newPatient = await tx.patient.create({
        data: {
          nik,
          ...restOfData,
          dob: new Date(restOfData.dob),
          email: restOfData.email || null,
          qrCode: "",
        },
      });

      const newMcuResult = await tx.mcuResult.create({
        data: {
          patientId: newPatient.id,
        },
      });

      const qrContent = {
        mcuResultId: newMcuResult.id,
        patientId: newPatient.patientId,
        fullName: newPatient.fullName,
        mcuPackage: newPatient.mcuPackage,
      };

      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrContent));

      const updatedPatient = await tx.patient.update({
        where: { id: newPatient.id },
        data: {
          qrCode: qrCodeDataUrl,
        },
      });

      return { patient: updatedPatient };
    });

    if (result.patient.email && result.patient.qrCode) {
      try {
        const base64Data = result.patient.qrCode.replace(
          /^data:image\/png;base64,/,
          ""
        );
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: result.patient.email,
          subject: `QR Code Pendaftaran MCU untuk ${result.patient.fullName}`,
          html: `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#222">
      <h1 style="margin:0 0 12px">Pendaftaran MCU Berhasil</h1>
      <p>Halo <strong>${result.patient.fullName}</strong>,</p>
      <p>Pendaftaran Anda untuk Medical Check Up telah berhasil dengan nomor pasien <strong>${result.patient.patientId}</strong>.</p>

      <p style="margin:16px 0 8px">Sebelum datang, mohon mengisi kuesioner pra-MCU melalui tautan berikut:</p>
      <p>
        <a href="https://mitralab.deltaindonesialab.com/form" target="_blank" rel="noopener noreferrer"
           style="display:inline-block; background:#01449D; color:#fff; text-decoration:none; padding:10px 16px; border-radius:6px; font-weight:600">
          Isi Kuesioner Pra-MCU
        </a>
      </p>
      <p style="font-size:12px; color:#555; margin-top:8px">
        Jika tombol tidak dapat diklik, salin dan tempel alamat ini di browser Anda:<br/>
        <span>https://mitralab.deltaindonesialab.com/form</span>
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
      } catch (emailError) {
        console.error("Gagal mengirim email:", emailError);
      }
    }

    return NextResponse.json(result.patient, { status: 201 });
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
      select: {
        id: true,
        patientId: true,
        nik: true,
        fullName: true,
        photoUrl: true,
        email: true,
        dob: true,
        age: true,
        gender: true,
        position: true,
        division: true,
        status: true,
        location: true,
        mcuPackage: true,
        qrCode: true,
        createdAt: true,
        lastProgress: true,
        mcuResults: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            fileUrl: true,
            progress: true,
          },
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
