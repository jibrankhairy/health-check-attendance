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
