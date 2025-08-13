import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";

const prisma = new PrismaClient();

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: mcuResultId } = params;
  try {
    const mcuResult = await prisma.mcuResult.findUnique({
      where: { id: mcuResultId },
      select: {
        id: true,
        patient: {
          select: {
            id: true,
            patientId: true,
            fullName: true,
            dob: true,
            mcuPackage: true,
          },
        },

        progress: {
          select: {
            checkpoint: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!mcuResult || !mcuResult.patient) {
      return NextResponse.json(
        { message: "Data MCU Pasien tidak ditemukan." },
        { status: 404 }
      );
    }

    const responseData = {
      mcuResultId: mcuResult.id,
      patient: {
        id: mcuResult.patient.id,
        mcuId: mcuResult.patient.patientId,
        fullName: mcuResult.patient.fullName,
        dob: format(new Date(mcuResult.patient.dob), "dd MMMM yyyy"),
        mcuPackage: mcuResult.patient.mcuPackage,
      },
      progress: mcuResult.progress,
    };

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Preview Patient Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
