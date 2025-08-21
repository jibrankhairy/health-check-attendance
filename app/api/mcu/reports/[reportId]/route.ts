import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function toNullableInt(v: unknown) {
  if (v === null || v === undefined || v === "") return null;
  const n = parseInt(String(v), 10);
  return Number.isNaN(n) ? null : n;
}
function toNullableFloat(v: unknown) {
  if (v === null || v === undefined || v === "") return null;
  const n = parseFloat(String(v));
  return Number.isNaN(n) ? null : n;
}

export async function GET(_req: NextRequest, { params }: any) {
  try {
    const { reportId } = params as { reportId: string };

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
          include: { company: { select: { name: true } } },
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

export async function PUT(req: NextRequest, { params }: any) {
  try {
    const { reportId } = params as { reportId: string };
    const body = await req.json();

    if (!reportId) {
      return NextResponse.json(
        { message: "Report ID is required" },
        { status: 400 }
      );
    }

    const { patient, id, createdAt, updatedAt, ...updateData } = body ?? {};

    if (Array.isArray(updateData.saran)) {
      updateData.saran = JSON.stringify(updateData.saran);
    }

    const intFields = [
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

    const floatFields = [
      "beratBadan",
      "tinggiBadan",
      "spirometryFvc",
      "spirometryFvcPred",
      "spirometryFvcPost",
      "spirometryFev1",
      "spirometryFev1Pred",
      "spirometryFev1Post",
      "spirometryFev1Fvc",
      "spirometryFev1FvcPred",
      "spirometryFev6",
      "spirometryFev6Pred",
      "spirometryPef",
      "spirometryPefPred",
      "spirometryPefPost",
      "spirometryFef2575",
      "spirometryFef2575Pred",
      "spirometryFef25",
      "spirometryFef25Pred",
      "spirometryFef25Post",
      "spirometryFef50",
      "spirometryFef50Pred",
      "spirometryFef50Post",
      "spirometryFef75",
      "spirometryFef75Pred",
      "spirometryFef75Post",
    ];

    for (const k of intFields) {
      if (k in updateData) updateData[k] = toNullableInt(updateData[k]);
    }
    for (const k of floatFields) {
      if (k in updateData) updateData[k] = toNullableFloat(updateData[k]);
    }

    Object.keys(updateData).forEach((k) => {
      if (updateData[k] === undefined) delete updateData[k];
    });

    const dataToUpdate: any = {
      ...updateData,
      status: "COMPLETED",
      updatedAt: new Date(),
    };
    if (!dataToUpdate.fileUrl) {
      dataToUpdate.fileUrl = `/dashboard/reports/view/${reportId}`;
    }

    const updatedMcuResult = await prisma.mcuResult.update({
      where: { id: reportId },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedMcuResult);
  } catch (error: any) {
    console.error("Update MCU Report Error:", error);

    if (error?.code === "P2009") {
      return NextResponse.json(
        {
          message:
            "Validasi data gagal. Periksa kembali tipe data yang dikirim.",
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
