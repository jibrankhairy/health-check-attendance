import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const updatePatientSchema = z.object({
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
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "ID Pasien tidak valid" },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      return NextResponse.json(
        { message: "Pasien tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(patient);
  } catch (error) {
    console.error("GET Patient Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "ID Pasien tidak valid" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = updatePatientSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { fullName, email, dob, age, department, mcuPackage } =
      validation.data;

    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: {
        fullName,
        email: email || null,
        dob: new Date(dob),
        age,
        department,
        mcuPackage,
      },
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error("PUT Patient Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "ID Pasien tidak valid" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.mcuResult.deleteMany({
        where: { patientId: id },
      });

      await tx.patient.delete({
        where: { id },
      });
    });

    return NextResponse.json(
      { message: "Pasien berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Pasien tidak ditemukan untuk dihapus" },
        { status: 404 }
      );
    }
    console.error("Delete Patient Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
