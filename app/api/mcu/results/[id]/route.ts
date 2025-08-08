import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fungsi GET untuk mengambil data berdasarkan ID
export async function GET(
  request: NextRequest,
  // PERUBAHAN 1: Langsung destructuring 'params' dari argumen kedua
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params; // Ambil 'id' langsung dari params

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
  request: NextRequest,
  // PERUBAHAN 2: Samakan juga di fungsi PUT
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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
      // Logika ini sepertinya belum selesai, 'cleanedData' kosong.
      // Saya biarkan seperti aslinya, tapi mungkin perlu Anda periksa kembali.
      const updatedMcuResult = await prisma.mcuResult.update({
        where: { id },
        data: body, // Asumsi: memperbarui dengan data lain dari body
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
