import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const { reportId } = await params;

    if (!reportId) {
      return NextResponse.json(
        { message: "Report ID is required" },
        { status: 400 }
      );
    }

    const mcuResult = await prisma.mcuResult.findUnique({
      where: { id: reportId },
      include: {
        patient: {
          include: {
            company: { select: { name: true } },
          },
        },
      },
    });

    if (!mcuResult) {
      return NextResponse.json(
        { message: `Laporan dengan ID ${reportId} tidak ditemukan.` },
        { status: 404 }
      );
    }

    return NextResponse.json(mcuResult);
  } catch (error) {
    console.error("Get MCU Report Detail Error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data detail laporan." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const { reportId } = await params;
    const body = await req.json();

    if (!reportId) {
      return NextResponse.json(
        { message: "Report ID is required" },
        { status: 400 }
      );
    }

    const { patient, id, createdAt, ...updateData } = body;

    // --- INI PERBAIKANNYA ---
    // Cek jika 'saran' ada di body dan merupakan sebuah array.
    // Jika ya, ubah menjadi JSON string. Jika tidak, biarkan apa adanya.
    if (updateData.saran && Array.isArray(updateData.saran)) {
      updateData.saran = JSON.stringify(updateData.saran);
    }
    // --- PERBAIKAN SELESAI ---

    const updatedMcuResult = await prisma.mcuResult.update({
      where: { id: reportId },
      data: {
        ...updateData,
        status: "COMPLETED",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedMcuResult);
  } catch (error) {
    console.error("Update MCU Report Error:", error);
    // Cek jika error adalah karena validasi Prisma
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2009') {
        return NextResponse.json(
            { message: "Validasi data gagal. Periksa kembali tipe data yang dikirim." },
            { status: 400 }
        );
    }
    return NextResponse.json(
      { message: "Gagal menyimpan hasil laporan MCU." },
      { status: 500 }
    );
  }
}