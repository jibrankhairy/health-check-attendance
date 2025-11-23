import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import path from "path";
import fs from "fs/promises";
import { put } from "@vercel/blob";

export const maxDuration = 60;

const prisma = new PrismaClient();

const IMAGE_TYPES = {
  rontgen: { type: "single", field: "rontgenImage" },
  ekg: { type: "single", field: "ekgImage1" },
  usgAbdomen: { type: "single", field: "usgAbdomenImage1" },
  usgMammae: { type: "single", field: "usgMammaeImage1" },
  treadmill: { type: "multiple", fieldPrefix: "treadmillImage", max: 4 },
} as const;

type ImageType = keyof typeof IMAGE_TYPES;

async function processFile(
  file: File,
  companyId: string,
  imageType: ImageType
): Promise<{ success: boolean; message: string }> {
  const imageConfig = IMAGE_TYPES[imageType];
  const originalFilename = file.name;
  const baseFilename = path.parse(originalFilename).name;

  let identifier: string;
  let fieldToUpdate: string;

  if (imageConfig.type === "multiple") {
    const parts = baseFilename.split("-");
    const imageIndexStr = parts.pop();
    const imageIndex = parseInt(imageIndexStr || "", 10);
    if (
      !imageIndexStr ||
      isNaN(imageIndex) ||
      imageIndex < 1 ||
      imageIndex > imageConfig.max
    ) {
      return {
        success: false,
        message: `Nama file treadmill tidak valid: ${originalFilename}. Harus diakhiri dengan -1, -2, -3, atau -4.`,
      };
    }
    identifier = parts.join("-");
    fieldToUpdate = `${imageConfig.fieldPrefix}${imageIndex}`;
  } else {
    identifier = baseFilename.split("_")[0];
    fieldToUpdate = imageConfig.field;
  }

  if (!identifier) {
    return {
      success: false,
      message: `Gagal memproses nama file: ${originalFilename}`,
    };
  }

  try {
    let patientWhereClause: Prisma.PatientWhereInput;
    if (/^\d+$/.test(identifier)) {
      patientWhereClause = { nik: identifier, companyId: companyId };
    } else {
      patientWhereClause = { patientId: identifier, companyId: companyId };
    }

    const mcuResult = await prisma.mcuResult.findFirst({
      where: { patient: patientWhereClause },
      select: { id: true, isExcelDataImported: true },
    });

    if (!mcuResult) {
      return {
        success: false,
        message: `Pasien dengan ID "${identifier}" (dari file ${originalFilename}) tidak ditemukan.`,
      };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    let finalUrl = `data:${file.type};base64,${base64}`;

    const updatedResult = await prisma.mcuResult.update({
      where: { id: mcuResult.id },
      data: {
        [fieldToUpdate]: finalUrl,
        isImagesUploaded: true,
      },
      select: { isExcelDataImported: true, id: true },
    });

    if (updatedResult.isExcelDataImported) {
      await prisma.mcuResult.update({
        where: { id: updatedResult.id },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
          fileUrl: `/dashboard/reports/view/${updatedResult.id}`,
        },
      });
    }
    return { success: true, message: `Berhasil mengimpor ${originalFilename}` };
  } catch (e) {
    const error = e as Error;
    console.error(`Gagal memproses ID "${identifier}":`, error);
    return {
      success: false,
      message: `Error untuk ID "${identifier}": ${error.message}`,
    };
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const companyId = formData.get("companyId") as string;
    const imageType = formData.get("imageType") as ImageType;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: "Tidak ada file yang diunggah." },
        { status: 400 }
      );
    }
    if (!companyId || !imageType || !IMAGE_TYPES[imageType]) {
      return NextResponse.json(
        { message: "Data tidak lengkap atau jenis gambar tidak valid." },
        { status: 400 }
      );
    }

    const fileProcessingPromises = files.map((file) =>
      processFile(file, companyId, imageType)
    );

    const results = await Promise.allSettled(fileProcessingPromises);

    let successCount = 0;
    const errors: string[] = [];
    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value.success) {
        successCount++;
      } else if (result.status === "fulfilled" && !result.value.success) {
        errors.push(result.value.message);
      } else if (result.status === "rejected") {
        errors.push(
          `Terjadi error tak terduga: ${(result.reason as Error).message}`
        );
      }
    });

    return NextResponse.json({
      message: "Proses impor selesai.",
      successCount,
      errors,
    });
  } catch (error) {
    console.error("Gagal mengimpor gambar:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
