import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function formatDobDDMMYYYY(input: Date | string | null | undefined) {
  if (!input) return null;
  const iso =
    typeof input === "string"
      ? /^\d{4}-\d{2}-\d{2}/.test(input)
        ? input.slice(0, 10)
        : new Date(input).toISOString().slice(0, 10)
      : input.toISOString().slice(0, 10);
  const [yyyy, mm, dd] = iso.split("-");
  return `${dd}-${mm}-${yyyy}`;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const mcuResult = await prisma.mcuResult.findUnique({
      where: { id },
      select: {
        id: true,
        patient: {
          select: {
            id: true,
            patientId: true,
            fullName: true,
            dob: true,
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

    return NextResponse.json(
      {
        mcuResultId: mcuResult.id,
        patient: {
          id: mcuResult.patient.id,
          mcuId: mcuResult.patient.patientId,
          fullName: mcuResult.patient.fullName,
          dob: formatDobDDMMYYYY(mcuResult.patient.dob),
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Preview Patient Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
