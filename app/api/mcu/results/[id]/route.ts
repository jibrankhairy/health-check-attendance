import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// === FUNGSI GET (Sudah Benar, tidak perlu diubah) ===
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

// === PERUBAHAN PENTING DI FUNGSI PUT ===
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // 1. Daftar semua field yang seharusnya berupa angka
    const numericFields = ["beratBadan", "tinggiBadan"];

    const cleanedData: { [key: string]: any } = {};

    // 2. Proses pembersihan data
    for (const key in body) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        if (numericFields.includes(key)) {
          // Jika field ini seharusnya angka
          const value = body[key];
          if (value === "" || value === null || value === undefined) {
            cleanedData[key] = null; // Ubah string kosong menjadi null
          } else {
            const num = parseFloat(value);
            cleanedData[key] = isNaN(num) ? null : num; // Pastikan hasilnya angka
          }
        } else {
          // Jika field ini memang string
          cleanedData[key] = body[key];
        }
      }
    }

    // 3. Gabungkan data yang sudah bersih dengan status
    const dataToUpdate = {
      ...cleanedData,
      status: "COMPLETED",
    };

    // 4. Update database dengan data yang sudah bersih
    const updatedMcuResult = await prisma.mcuResult.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedMcuResult);
  } catch (error) {
    // Error akan lebih jelas di console server
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
