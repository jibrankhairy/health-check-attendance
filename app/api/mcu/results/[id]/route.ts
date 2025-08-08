import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fungsi GET untuk mengambil data berdasarkan ID
export async function GET(
  request: Request,
  // PERUBAHAN: Menggunakan 'any' sebagai tipe untuk argumen kedua.
  // Ini adalah workaround untuk masalah tipe yang kemungkinan disebabkan oleh
  // bug atau perubahan pada Next.js v15 (versi eksperimental).
  // Tipe yang benar ({ params }: { params: { id: string } }) terus ditolak oleh proses build.
  { params }: any
) {
  try {
    // Kita tetap pastikan tipe 'id' di dalam fungsi dengan type assertion
    const { id } = params as { id: string };

    const mcuResult = await prisma.mcuResult.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!mcuResult) {
      return NextResponse.json(
        { message: "Data MCU Pasien tidak ditemukan." },
        { status: 404 }
      );
    }
    return NextResponse.json(mcuResult);
  } catch (error) {
    console.error("Fetch MCU Result Detail Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Fungsi PUT untuk memperbarui data berdasarkan ID
export async function PUT(
  request: Request,
  // PERUBAHAN: Samakan juga di fungsi PUT
  { params }: any
) {
  try {
    const { id } = params as { id: string };
    const body = await request.json();

    // Cek jika ada 'formAnswers' di body untuk pembaruan form
    if (body.formAnswers) {
      const { healthHistoryAnswers, dassTestAnswers, fasTestAnswers } =
        body.formAnswers;

      const updatedResult = await prisma.mcuResult.update({
        where: { id },
        data: {
          healthHistoryAnswers,
          dassTestAnswers,
          fasTestAnswers,
          formSubmittedAt: new Date(),
        },
      });
      return NextResponse.json(updatedResult);
    } else {
      // Memperbarui dengan data lain dari body
      const updatedMcuResult = await prisma.mcuResult.update({
        where: { id },
        data: body,
      });
      return NextResponse.json(updatedMcuResult);
    }
  } catch (error) {
    console.error("Update MCU Result Error:", error);
    return NextResponse.json(
      {
        message: "Gagal menyimpan data ke database.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
