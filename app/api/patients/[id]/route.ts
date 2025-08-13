import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const updatePatientSchema = z.object({
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
});

function parseNumericId(idStr: string) {
  const id = Number(idStr);
  if (Number.isNaN(id)) throw new Error("ID Pasien tidak valid");
  return id;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseNumericId(idStr);

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        mcuResults: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!patient) {
      return NextResponse.json(
        { message: "Pasien tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(patient);
  } catch (error) {
    if ((error as Error).message === "ID Pasien tidak valid") {
      return NextResponse.json(
        { message: (error as Error).message },
        { status: 400 }
      );
    }
    console.error("GET Patient Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseNumericId(idStr);

    const body = await request.json();
    const validation = updatePatientSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { nik, ...restOfData } = validation.data;

    const existingPatient = await prisma.patient.findFirst({
      where: { nik: nik, NOT: { id: id } },
    });

    if (existingPatient) {
      return NextResponse.json(
        { message: `NIK ${nik} sudah digunakan oleh pasien lain.` },
        { status: 409 }
      );
    }

    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: {
        nik,
        ...restOfData,
        dob: new Date(restOfData.dob),
        email: restOfData.email || null,
      },
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseNumericId(idStr);

    await prisma.patient.delete({ where: { id } });

    return NextResponse.json(
      { message: "Pasien berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
