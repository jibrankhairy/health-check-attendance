import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import path from "path";
import fs from "fs/promises";
import { put } from "@vercel/blob";

const prisma = new PrismaClient();

const IMAGE_TYPES = {
  rontgen: { type: "single", field: "rontgenImage" },
  ekg: { type: "single", field: "ekgImage1" },
  usgAbdomen: { type: "single", field: "usgAbdomenImage1" },
  usgMammae: { type: "single", field: "usgMammaeImage1" },
  treadmill: { type: "multiple", fieldPrefix: "treadmillImage", max: 4 },
} as const;

type ImageType = keyof typeof IMAGE_TYPES;

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

    const errors: string[] = [];
    let successCount = 0;
    const imageConfig = IMAGE_TYPES[imageType];

    for (const file of files) {
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
          errors.push(
            `Nama file treadmill tidak valid: ${originalFilename}. Harus diakhiri dengan -1, -2, -3, atau -4.`
          );
          continue;
        }

        identifier = parts.join("-");
        fieldToUpdate = `${imageConfig.fieldPrefix}${imageIndex}`;
      } else {
        identifier = baseFilename.split("_")[0];
        fieldToUpdate = imageConfig.field;
      }

      if (!identifier) {
        errors.push(`Gagal memproses nama file: ${originalFilename}`);
        continue;
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
          select: {
            id: true,
            isExcelDataImported: true,
            kesimpulan: true,
          },
        });

        if (!mcuResult) {
          errors.push(
            `Pasien dengan ID "${identifier}" (dari file ${originalFilename}) tidak ditemukan.`
          );
          continue;
        }

        let finalUrl = "";
        if (process.env.BLOB_READ_WRITE_TOKEN) {
          const blobPath = `mcu-images/${companyId}/${imageType}/${originalFilename}`;
          const blob = await put(blobPath, file, {
            access: "public",
            contentType: file.type,
            addRandomSuffix: false,
            allowOverwrite: true,
          });
          finalUrl = blob.url;
        } else {
          const uploadDir = path.join(
            process.cwd(),
            "public",
            "uploads",
            companyId,
            imageType
          );
          await fs.mkdir(uploadDir, { recursive: true });
          const buffer = Buffer.from(await file.arrayBuffer());
          const filePath = path.join(uploadDir, originalFilename);
          await fs.writeFile(filePath, buffer);
          finalUrl = `/uploads/${companyId}/${imageType}/${originalFilename}`;
        }

        const updatedResult = await prisma.mcuResult.update({
          where: { id: mcuResult.id },
          data: {
            [fieldToUpdate]: finalUrl,
            isImagesUploaded: true,
          },
          select: {
            isExcelDataImported: true,
            kesimpulan: true,
            id: true,
          },
        });

        if (updatedResult.isExcelDataImported && updatedResult.kesimpulan) {
          await prisma.mcuResult.update({
            where: { id: updatedResult.id },
            data: {
              status: "COMPLETED",
              completedAt: new Date(),
              fileUrl: `/dashboard/reports/view/${updatedResult.id}`,
            },
          });
        }

        successCount++;
      } catch (e) {
        const error = e as Error;
        console.error(`Gagal memproses ID "${identifier}":`, error);
        errors.push(`Error untuk ID "${identifier}": ${error.message}`);
      }
    }

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
