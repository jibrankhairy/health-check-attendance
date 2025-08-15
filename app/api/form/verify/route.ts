import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const verifySchema = z
  .object({
    nik: z.string().optional(),
    patientId: z.string().optional(),
  })
  .refine((data) => data.nik || data.patientId, {
    message: "NIK atau ID Pasien harus diisi.",
  });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = verifySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message:
            validation.error.flatten().formErrors[0] || "Input tidak valid.",
        },
        { status: 400 }
      );
    }

    const { nik, patientId } = validation.data;

    const patient = await prisma.patient.findFirst({
      where: {
        OR: [{ nik: nik }, { patientId: patientId }],
      },
      include: {
        mcuResults: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!patient) {
      return NextResponse.json(
        {
          message:
            "Data pasien tidak ditemukan. Periksa kembali NIK atau ID Anda.",
        },
        { status: 404 }
      );
    }

    const latestMcuResult = patient.mcuResults[0];

    if (!latestMcuResult) {
      return NextResponse.json(
        { message: "Data MCU untuk pasien ini belum dibuat oleh admin." },
        { status: 404 }
      );
    }

    if (latestMcuResult.formSubmittedAt) {
      return NextResponse.json(
        { message: "Anda sudah pernah mengisi kuesioner ini." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      fullName: patient.fullName,
      mcuResultId: latestMcuResult.id,
      nik: patient.nik,
      patientId: patient.patientId,
    });
  } catch (error) {
    console.error("Verify Patient Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
