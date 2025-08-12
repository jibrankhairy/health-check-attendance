// app/api/mcu/results/[resultId]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// --- API UNTUK MENYIMPAN HASIL (PUT) ---
export async function PUT(
  request: Request,
  { params }: { params: { resultId: string } }
) {
  try {
    const { resultId } = params;
    const body = await request.json();

    // Cek apakah ini submit dari form kuesioner (health history, dass, fas)
    if (body.formAnswers) {
      const { healthHistoryAnswers, dassTestAnswers, fasTestAnswers } = body.formAnswers;
      const dataToUpdate = {
        healthHistoryAnswers: healthHistoryAnswers,
        dassTestAnswers: dassTestAnswers,
        fasTestAnswers: fasTestAnswers,
        formSubmittedAt: new Date(),
        status: 'COMPLETED',
      };
      
      const updatedResult = await prisma.mcuResult.update({
        where: { id: resultId },
        data: dataToUpdate,
      });
      return NextResponse.json(updatedResult);
    } 
    
    // --- [PERBAIKAN LOGIKA UNTUK FORM INPUT UTAMA] ---
    // Ini adalah submit dari form input hasil MCU.
    // Kita destructure untuk membuang field yang tidak relevan.
    const {
      patient, id, createdAt, updatedAt, ...validData
    } = body;

    // Handle konversi 'saran' dari array ke string JSON
    if (Array.isArray(validData.saran)) {
      validData.saran = JSON.stringify(validData.saran);
    }

    // Gabungkan data yang valid dengan status
    const dataToUpdate = {
      ...validData,
      status: 'COMPLETED',
    };

    const updatedResult = await prisma.mcuResult.update({
      where: { id: resultId },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedResult);

  } catch (error) {
    console.error("Update MCU Result Error:", error);
    return NextResponse.json(
      { message: "Gagal menyimpan hasil MCU.", error: error.message },
      { status: 500 }
    );
  }
}

// --- API UNTUK MENGAMBIL DETAIL PROGRES (GET) ---
export async function GET(
  request: Request,
  { params }: { params: { resultId: string } }
) {
    try {
        const { resultId } = params;
        const result = await prisma.mcuResult.findUnique({
            where: { id: resultId },
            include: {
                patient: true
            }
        });

        if (!result) {
            return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
        }

        // Ubah string JSON 'saran' dari DB kembali menjadi array untuk frontend
        if (result.saran && typeof result.saran === 'string') {
            try {
                result.saran = JSON.parse(result.saran);
            } catch (e) {
                console.error("Gagal parse JSON untuk field saran:", e);
                result.saran = [];
            }
        } else {
            result.saran = [];
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error("Fetch MCU Result Detail Error:", error);
        return NextResponse.json({ message: "Gagal memuat detail progres" }, { status: 500 });
    }
}
