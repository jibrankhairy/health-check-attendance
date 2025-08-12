// app/api/mcu/reports/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Di aplikasi nyata, sebaiknya ada filter berdasarkan companyId
    // const { searchParams } = new URL(request.url);
    // const companyId = searchParams.get("companyId");
    // if (!companyId) throw new Error("Company ID is required");

    const reports = await prisma.mcuResult.findMany({
      // where: { patient: { companyId } }, // Filter berdasarkan company
      select: {
        id: true,
        updatedAt: true,
        status: true,
        patient: {
          select: {
            id: true,
            patientId: true,
            fullName: true,
            company: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc", // Urutkan dari yang terbaru
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Fetch All MCU Reports Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}