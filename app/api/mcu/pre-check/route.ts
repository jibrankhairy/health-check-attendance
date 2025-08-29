import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mcuResultId, formData } = body;

    if (!mcuResultId || !formData) {
      return NextResponse.json(
        { message: "Data tidak lengkap." },
        { status: 400 }
      );
    }

    const mcuResult = await prisma.mcuResult.findUnique({
      where: { id: mcuResultId },
      select: { pemeriksaanFisikForm: true },
    });

    if (!mcuResult) {
      return NextResponse.json(
        { message: "MCU Result ID tidak ditemukan." },
        { status: 404 }
      );
    }

    const existingData = (mcuResult.pemeriksaanFisikForm as any) || {};
    const mergedData = { ...existingData, ...formData };

    await prisma.mcuResult.update({
      where: { id: mcuResultId },
      data: {
        pemeriksaanFisikForm: mergedData,
      },
    });

    return NextResponse.json({
      message: "Data registrasi awal berhasil disimpan!",
    });
  } catch (error: any) {
    console.error("MCU Pre-Check Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
