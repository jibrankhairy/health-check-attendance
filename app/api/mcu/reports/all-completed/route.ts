import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json({ message: "Company ID is required" }, { status: 400 });
    }

    // Ambil SEMUA mcuResult yang statusnya COMPLETED untuk companyId ini
    const reports = await prisma.mcuResult.findMany({
      where: {
        status: "COMPLETED",
        patient: {
          companyId: companyId,
        },
      },
      // Ambil semua data yang dibutuhkan untuk generate PDF
      include: {
        patient: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        completedAt: "desc",
      },
    });

    return NextResponse.json(reports);

  } catch (error) {
    console.error("Fetch All Completed MCU Reports Error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}