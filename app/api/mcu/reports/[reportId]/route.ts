import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// --- Helpers konversi ---
function toNullableFloat(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const cleaned = v.trim();
    if (cleaned === "") return null;
    // buang huruf/simbol, normalisasi koma → titik
    const normalized = cleaned.replace(/[^0-9,.\-]/g, "").replace(/,/g, ".");
    const n = Number.parseFloat(normalized);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function toNullableInt(v: unknown): number | null {
  const f = toNullableFloat(v);
  return f === null ? null : Math.round(f);
}

// Field Float? di Prisma (termasuk berat/tinggi)
const FLOAT_FIELDS: string[] = [
  "spirometriFvc",
  "spirometriFvcPred",
  "spirometriFvcPost",
  "spirometriFev1",
  "spirometriFev1Pred",
  "spirometriFev1Post",
  "spirometriFev1Fvc",
  "spirometriFev1FvcPred",
  "spirometriFev6",
  "spirometriFev6Pred",
  "spirometriPef",
  "spirometriPefPred",
  "spirometriPefPost",
  "spirometriFef2575",
  "spirometriFef2575Pred",
  "spirometriFef25",
  "spirometriFef25Pred",
  "spirometriFef25Post",
  "spirometriFef50",
  "spirometriFef50Pred",
  "spirometriFef50Post",
  "spirometriFef75",
  "spirometriFef75Pred",
  "spirometriFef75Post",
  "beratBadan",
  "tinggiBadan",
];

// Field Int? di Prisma (Audiometri)
const INT_FIELDS: string[] = [
  "audioAcKanan250",
  "audioAcKanan500",
  "audioAcKanan1000",
  "audioAcKanan2000",
  "audioAcKanan3000",
  "audioAcKanan4000",
  "audioAcKanan6000",
  "audioAcKanan8000",
  "audioAcKiri250",
  "audioAcKiri500",
  "audioAcKiri1000",
  "audioAcKiri2000",
  "audioAcKiri3000",
  "audioAcKiri4000",
  "audioAcKiri6000",
  "audioAcKiri8000",
  "audioBcKanan250",
  "audioBcKanan500",
  "audioBcKanan1000",
  "audioBcKanan2000",
  "audioBcKanan3000",
  "audioBcKanan4000",
  "audioBcKanan6000",
  "audioBcKanan8000",
  "audioBcKiri250",
  "audioBcKiri500",
  "audioBcKiri1000",
  "audioBcKiri2000",
  "audioBcKiri3000",
  "audioBcKiri4000",
  "audioBcKiri6000",
  "audioBcKiri8000",
];

export async function GET(
  _req: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const { reportId } = params;

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
  { params }: { params: { reportId: string } }
) {
  try {
    const { reportId } = params;
    const body = await req.json();

    if (!reportId) {
      return NextResponse.json(
        { message: "Report ID is required" },
        { status: 400 }
      );
    }

    // Jangan tulis balik field non-editable dari client
    const { patient, id, createdAt, updatedAt, ...updateData } = body as Record<
      string,
      unknown
    >;

    // Normalisasi tipe angka sesuai schema Prisma
    for (const key of FLOAT_FIELDS) {
      if (key in updateData)
        (updateData as any)[key] = toNullableFloat((updateData as any)[key]);
    }
    for (const key of INT_FIELDS) {
      if (key in updateData)
        (updateData as any)[key] = toNullableInt((updateData as any)[key]);
    }

    // saran: array -> string (kolom String?)
    if (Array.isArray((updateData as any).saran)) {
      (updateData as any).saran = JSON.stringify((updateData as any).saran);
    }

    const dataToUpdate: any = {
      ...updateData,
      status: "COMPLETED",
      updatedAt: new Date(),
    };

    if (dataToUpdate.status === "COMPLETED" && !dataToUpdate.fileUrl) {
      dataToUpdate.fileUrl = `/dashboard/reports/view/${reportId}`;
    }

    const updatedMcuResult = await prisma.mcuResult.update({
      where: { id: reportId },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedMcuResult);
  } catch (error: any) {
    console.error("Update MCU Report Error:", error);
    if (
      error?.code === "P2009" ||
      error?.code === "P2025" ||
      error?.name === "PrismaClientValidationError"
    ) {
      return NextResponse.json(
        {
          message:
            "Validasi data gagal. Periksa kembali format/tipe data yang dikirim.",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Gagal menyimpan hasil laporan MCU." },
      { status: 500 }
    );
  }
}
