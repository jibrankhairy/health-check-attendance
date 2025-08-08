import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const verifySchema = z.object({
  patientId: z.string().min(1, "ID Pasien tidak boleh kosong."),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = verifySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "ID Pasien tidak valid." },
        { status: 400 }
      );
    }

    const { patientId } = validation.data;

    const patient = await prisma.patient.findUnique({
      where: { patientId },
      include: {
        mcuResults: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!patient) {
      return NextResponse.json(
        { message: "ID Pasien tidak ditemukan." },
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
    });
  } catch (error) {
    console.error("Verify Patient ID Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
  