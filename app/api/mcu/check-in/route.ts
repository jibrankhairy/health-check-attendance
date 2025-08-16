import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      mcuResultId,
      checkpointSlug,
      petugasName,
      notes,
      pemeriksaanFisikForm,
    } = body;

    if (!mcuResultId || !checkpointSlug || !petugasName) {
      return NextResponse.json(
        { message: "Data tidak lengkap." },
        { status: 400 }
      );
    }

    const [mcuResult, checkpoint, progressLog] = await prisma.$transaction(
      async (tx) => {
        const foundMcuResult = await tx.mcuResult.findUnique({
          where: { id: mcuResultId },
          select: { patientId: true },
        });

        if (!foundMcuResult) {
          throw new Error("MCU Result ID tidak ditemukan.");
        }

        const foundCheckpoint = await tx.checkpoint.findUnique({
          where: { slug: checkpointSlug },
        });

        if (!foundCheckpoint) {
          throw new Error("Checkpoint tidak valid.");
        }

        if (pemeriksaanFisikForm) {
          const now = new Date();

          const dateTimeInWIB = now.toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
            hour12: false,
          });
          await tx.mcuResult.update({
            where: { id: mcuResultId },
            data: {
              pemeriksaanFisikForm: pemeriksaanFisikForm,
              timeCheckIn: dateTimeInWIB,
            },
          });
        }

        const newProgressLog = await tx.mcuProgress.upsert({
          where: {
            mcuResultId_checkpointId: {
              mcuResultId: mcuResultId,
              checkpointId: foundCheckpoint.id,
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
            checkpointId: foundCheckpoint.id,
            status: "COMPLETED",
            petugasName: petugasName,
            completedAt: new Date(),
            notes: notes,
          },
        });

        await tx.patient.update({
          where: {
            id: foundMcuResult.patientId,
          },
          data: { lastProgress: `Selesai di ${foundCheckpoint.name}` },
        });

        return [foundMcuResult, foundCheckpoint, newProgressLog];
      }
    );

    return NextResponse.json({
      message: `Check-in untuk ${checkpoint.name} oleh ${petugasName} berhasil!`,
      data: progressLog,
    });
  } catch (error: any) {
    console.error("MCU Check-in Error:", error);

    const message = error.message || "Internal Server Error";
    const status =
      error.message.includes("tidak ditemukan") ||
      error.message.includes("tidak valid")
        ? 404
        : 500;

    return NextResponse.json({ message }, { status });
  }
}
