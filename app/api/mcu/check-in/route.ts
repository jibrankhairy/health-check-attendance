// app/api/mcu/check-in/route.ts

import { NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mcuResultId, checkpointSlug, petugasName, pemeriksaanFisikForm, notes } = body;

    if (!mcuResultId || !checkpointSlug || !petugasName) {
      return NextResponse.json(
        { message: "Data tidak lengkap." },
        { status: 400 }
      );
    }

    // <-- 1. Minta field `examinationStartedAt` saat mengambil data
    const [mcuResult, checkpoint] = await Promise.all([
      prisma.mcuResult.findUnique({
        where: { id: mcuResultId },
        select: { 
          patientId: true,
          examinationStartedAt: true // Ambil data waktu mulai
        },
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

    // <-- 2. Gunakan Prisma Transaction untuk menjalankan beberapa perintah sekaligus
    const transactionPromises = [];

    // Perintah 1: Selalu buat/update progress di setiap pos
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

    // Perintah 2: Selalu update progress terakhir pasien
    const patientUpdatePromise = prisma.patient.update({
      where: {
        id: mcuResult.patientId,
      },
      data: { lastProgress: `Selesai di ${checkpoint.name}` },
    });
    transactionPromises.push(patientUpdatePromise);

    // <-- 3. Logika Inti: Cek dan update waktu mulai HANYA jika kosong
    const dataForMcuResult: Prisma.McuResultUpdateInput = {};

    // Jika ada form fisik, tambahkan ke data update
    if (pemeriksaanFisikForm) {
      dataForMcuResult.pemeriksaanFisikForm = pemeriksaanFisikForm;
    }

    // Cek apakah waktu mulai pemeriksaan belum tercatat
    if (!mcuResult.examinationStartedAt) {
      // Jika belum, catat waktunya sekarang
      dataForMcuResult.examinationStartedAt = new Date();
    }

    // Hanya jalankan update jika ada data yang perlu diubah
    if (Object.keys(dataForMcuResult).length > 0) {
        const mcuResultUpdatePromise = prisma.mcuResult.update({
            where: { id: mcuResultId },
            data: dataForMcuResult,
        });
        transactionPromises.push(mcuResultUpdatePromise);
    }

    // Jalankan semua perintah dalam satu transaksi
    const [progressLog] = await prisma.$transaction(transactionPromises);

    return NextResponse.json({
      message: `Check-in untuk ${checkpoint.name} oleh ${petugasName} berhasil!`,
      data: progressLog, // Mengembalikan hasil dari operasi pertama (progress log)
    });
  } catch (error) {
    console.error("MCU Check-in Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}