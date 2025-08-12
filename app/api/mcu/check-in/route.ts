import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs";

const prisma = new PrismaClient();

type MapVal = {
  statusColumn: string;
  petugasColumn: string;
  formColumn?: string;
};

const COLUMN_MAP: Record<string, MapVal> = {
  pemeriksaan_fisik: {
    statusColumn: "pemeriksaanFisikStatus",
    petugasColumn: "pemeriksaanFisikPetugas",
    formColumn: "pemeriksaanFisikForm",
  },
  pemeriksaan_lab: {
    statusColumn: "pemeriksaanLabStatus",
    petugasColumn: "pemeriksaanLabPetugas",
  },
  pemeriksaan_radiologi: {
    statusColumn: "pemeriksaanRadiologiStatus",
    petugasColumn: "pemeriksaanRadiologiPetugas",
  },
  pemeriksaan_spirometry: {
    statusColumn: "pemeriksaanSpirometryStatus",
    petugasColumn: "pemeriksaanSpirometryPetugas",
  },
  pemeriksaan_audiometry: {
    statusColumn: "pemeriksaanAudiometryStatus",
    petugasColumn: "pemeriksaanAudiometryPetugas",
  },
  pemeriksaan_ekg: {
    statusColumn: "pemeriksaanEkgStatus",
    petugasColumn: "pemeriksaanEkgPetugas",
  },
  pemeriksaan_treadmill: {
    statusColumn: "pemeriksaanTreadmillStatus",
    petugasColumn: "pemeriksaanTreadmillPetugas",
  },
  pemeriksaan_urin: {
    statusColumn: "pemeriksaanUrinStatus",
    petugasColumn: "pemeriksaanUrinPetugas",
  },
};

function humanizeSlug(s: string) {
  return s
    .split("_")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { mcuResultId, checkPoint, petugasName, pemeriksaanFisikForm } =
      body ?? {};

    if (!mcuResultId || !checkPoint || !petugasName) {
      return NextResponse.json(
        {
          message:
            "Data tidak lengkap (mcuResultId, checkPoint, petugasName wajib diisi).",
        },
        { status: 400 }
      );
    }

    const slug = String(checkPoint).trim().toLowerCase();
    const columns = COLUMN_MAP[slug];
    if (!columns) {
      return NextResponse.json(
        { message: "Checkpoint tidak valid." },
        { status: 400 }
      );
    }

    const rec = await prisma.mcuResult.findUnique({
      where: { id: String(mcuResultId) },
      select: { id: true },
    });
    if (!rec) {
      return NextResponse.json(
        { message: "Data Pasien MCU tidak ditemukan." },
        { status: 404 }
      );
    }

    if (columns.formColumn) {
      if (!pemeriksaanFisikForm || typeof pemeriksaanFisikForm !== "object") {
        return NextResponse.json(
          { message: "Form Pemeriksaan Fisik wajib diisi." },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, any> = {
      [columns.statusColumn]: "COMPLETED",
      [columns.petugasColumn]: String(petugasName),
    };
    if (columns.formColumn) {
      updateData[columns.formColumn] = pemeriksaanFisikForm;
    }

    const updated = await prisma.mcuResult.update({
      where: { id: String(mcuResultId) },
      data: updateData,
    });

    return NextResponse.json({
      message: `Check-in oleh ${petugasName} untuk ${humanizeSlug(
        slug
      )} berhasil!`,
      data: updated,
    });
  } catch (error) {
    console.error("MCU Check-in Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
