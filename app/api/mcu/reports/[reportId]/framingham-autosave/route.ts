import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

type Params = { params: { reportId: string } };

export async function PUT(request: Request, { params }: Params) {
  try {
    const { reportId } = params;
    const framinghamData = await request.json();

    if (!reportId) {
      return NextResponse.json(
        { message: "ID Laporan tidak ditemukan." },
        { status: 400 }
      );
    }

    const dataToUpdate = {};

    await prisma.mcuResult.update({
      where: { id: reportId },
      data: dataToUpdate,
    });

    return NextResponse.json({
      message: "Framingham data auto-saved successfully.",
    });
  } catch (error) {
    console.error("Framingham Auto-Save Error:", error);
    return NextResponse.json(
      { message: "Gagal menyimpan data Framingham secara otomatis." },
      { status: 500 }
    );
  }
}
