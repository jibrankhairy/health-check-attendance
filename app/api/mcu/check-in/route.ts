import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mcuResultId, checkpointSlug, petugasName, notes } = body;

    if (!mcuResultId || !checkpointSlug || !petugasName) {
      return NextResponse.json(
        { message: "Data tidak lengkap." },
        { status: 400 }
      );
    }

    const [mcuResult, checkpoint] = await Promise.all([
      prisma.mcuResult.findUnique({
        where: { id: mcuResultId },
        select: { patientId: true },
      }),
      prisma.checkpoint.findUnique({
        where: { slug: checkpointSlug },
      }),
    ]);

    if (!mcuResult) {
      return NextResponse.json(
        { message: "MCU Result ID tidak ditemukan." },
        { status: 404 }
      );
    }
    if (!checkpoint) {
      return NextResponse.json(
        { message: "Checkpoint tidak valid." },
        { status: 400 }
      );
    }

    const progressLog = await prisma.mcuProgress.upsert({
      where: {
        mcuResultId_checkpointId: {
          mcuResultId: mcuResultId,
          checkpointId: checkpoint.id,
        },
      },
      update: {
        status: "COMPLETED",
        petugasName: petugasName,
        completedAt: new Date(),
        notes: notes,
      },
      create: {
        mcuResultId: mcuResultId,
        checkpointId: checkpoint.id,
        status: "COMPLETED",
        petugasName: petugasName,
        completedAt: new Date(),
        notes: notes,
      },
    });

    await prisma.patient.update({
      where: {
        id: mcuResult.patientId,
      },
      data: { lastProgress: `Selesai di ${checkpoint.name}` },
    });

    return NextResponse.json({
      message: `Check-in untuk ${checkpoint.name} oleh ${petugasName} berhasil!`,
      data: progressLog,
    });
  } catch (error) {
    console.error("MCU Check-in Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
