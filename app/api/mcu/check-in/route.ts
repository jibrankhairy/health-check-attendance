import { NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      mcuResultId,
      checkpointSlug,
      petugasName,
      pemeriksaanFisikForm,
      notes,
    } = body;

    if (!mcuResultId || !checkpointSlug || !petugasName) {
      return NextResponse.json(
        { message: "Data tidak lengkap." },
        { status: 400 }
      );
    }

    const [mcuResult, checkpoint] = await Promise.all([
      prisma.mcuResult.findUnique({
        where: { id: mcuResultId },
        select: {
          patientId: true,
          examinationStartedAt: true,
          pemeriksaanFisikForm: true,
        },
      }),
      prisma.checkpoint.findUnique({
        where: { slug: checkpointSlug },
      }),
    ]);

    if (!mcuResult || !checkpoint) {
      const notFoundResource = !mcuResult ? "MCU Result ID" : "Checkpoint Slug";
      throw new Error(`${notFoundResource} tidak ditemukan.`);
    }

    const transactionPromises = [];

    const progressLogPromise = prisma.mcuProgress.upsert({
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
    transactionPromises.push(progressLogPromise);

    const patientUpdatePromise = prisma.patient.update({
      where: {
        id: mcuResult.patientId,
      },
      data: { lastProgress: `Selesai di ${checkpoint.name}` },
    });
    transactionPromises.push(patientUpdatePromise);

    const dataForMcuResult: Prisma.McuResultUpdateInput = {};

    if (pemeriksaanFisikForm) {
      // Mengubah data QR agar hanya berisi nama petugas
      const qrData = `Validated by: ${petugasName}`;

      const validatorQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
        qrData
      )}`;

      pemeriksaanFisikForm.fisikValidatorName = petugasName;
      pemeriksaanFisikForm.fisikValidatorQr = validatorQrUrl;

      const existingData = (mcuResult.pemeriksaanFisikForm as any) || {};
      const mergedData = { ...existingData, ...pemeriksaanFisikForm };
      dataForMcuResult.pemeriksaanFisikForm = mergedData;
    }

    if (!mcuResult.examinationStartedAt) {
      dataForMcuResult.examinationStartedAt = new Date();
    }

    if (Object.keys(dataForMcuResult).length > 0) {
      const mcuResultUpdatePromise = prisma.mcuResult.update({
        where: { id: mcuResultId },
        data: dataForMcuResult,
      });
      transactionPromises.push(mcuResultUpdatePromise);
    }

    const [progressLog] = await prisma.$transaction(transactionPromises);

    // revalidateTag dihapus karena tidak lagi diperlukan untuk solusi Client Component
    
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