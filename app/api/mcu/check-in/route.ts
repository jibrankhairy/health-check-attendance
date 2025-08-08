import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getColumnNames(
  checkPoint: string
): { statusColumn: string; petugasColumn: string } | null {
  const mapping: {
    [key: string]: { statusColumn: string; petugasColumn: string };
  } = {
    pemeriksaan_fisik: {
      statusColumn: "pemeriksaanFisikStatus",
      petugasColumn: "pemeriksaanFisikPetugas",
    },
    darah_lengkap: {
      statusColumn: "darahLengkapStatus",
      petugasColumn: "darahLengkapPetugas",
    },
    kimia_darah: {
      statusColumn: "kimiaDarahStatus",
      petugasColumn: "kimiaDarahPetugas",
    },
    treadmill: {
      statusColumn: "treadmillStatus",
      petugasColumn: "treadmillPetugas",
    },
    tes_psikologi: {
      statusColumn: "tesPsikologiStatus",
      petugasColumn: "tesPsikologiPetugas",
    },
    hematologi: {
      statusColumn: "hematologiStatus",
      petugasColumn: "hematologiPetugas",
    },
    rontgen_thorax: {
      statusColumn: "rontgenThoraxStatus",
      petugasColumn: "rontgenThoraxPetugas",
    },
    audiometri: {
      statusColumn: "audiometriStatus",
      petugasColumn: "audiometriPetugas",
    },
    framingham_score: {
      statusColumn: "framinghamScoreStatus",
      petugasColumn: "framinghamScorePetugas",
    },
    urinalisa: {
      statusColumn: "urinalisaStatus",
      petugasColumn: "urinalisaPetugas",
    },
    ekg_elektrokardiogram: {
      statusColumn: "ekgStatus",
      petugasColumn: "ekgPetugas",
    },
    spirometri: {
      statusColumn: "spirometriStatus",
      petugasColumn: "spirometriPetugas",
    },
    usg_mammae: {
      statusColumn: "usgMammaeStatus",
      petugasColumn: "usgMammaePetugas",
    },
    usg_abdomen: {
      statusColumn: "usgAbdomenStatus",
      petugasColumn: "usgAbdomenPetugas",
    },
  };
  return mapping[checkPoint] || null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mcuResultId, checkPoint, petugasName } = body;

    if (!mcuResultId || !checkPoint || !petugasName) {
      return NextResponse.json(
        { message: "Data tidak lengkap (ID, Pos, Nama Petugas wajib diisi)." },
        { status: 400 }
      );
    }

    const columnNames = getColumnNames(checkPoint);

    if (!columnNames) {
      return NextResponse.json(
        { message: "Pos Pemeriksaan tidak valid." },
        { status: 400 }
      );
    }

    const mcuRecord = await prisma.mcuResult.findUnique({
      where: { id: mcuResultId },
    });

    if (!mcuRecord) {
      return NextResponse.json(
        { message: "Data Pasien MCU tidak ditemukan." },
        { status: 404 }
      );
    }

    const updateData: { [key: string]: any } = {};
    updateData[columnNames.statusColumn] = "COMPLETED";
    updateData[columnNames.petugasColumn] = petugasName;

    const updatedMcuResult = await prisma.mcuResult.update({
      where: { id: mcuResultId },
      data: updateData,
    });

    return NextResponse.json({
      message: `Check-in oleh ${petugasName} untuk ${checkPoint.replace(
        /_/g,
        " "
      )} berhasil!`,
      data: updatedMcuResult,
    });
  } catch (error) {
    console.error("MCU Check-in Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
