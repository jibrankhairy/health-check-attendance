// --- VERSI FINAL (Lokal + Vercel Blob, Pemotong '_') ---
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import path from "path";
import fs from "fs/promises";
import { put } from "@vercel/blob";

const prisma = new PrismaClient();

const IMAGE_TYPES = {
  rontgen: { field: "rontgenImage" },
  ekg: { field: "ekgImage1" },
  treadmill: { field: "treadmillImage1" },
  usgAbdomen: { field: "usgAbdomenImage1" },
  usgMammae: { field: "usgMammaeImage1" },
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
    const fieldToUpdate = IMAGE_TYPES[imageType].field;

    for (const file of files) {
      const originalFilename = file.name;
      
      // [LOGIKA KUNCI] Mengambil ID dari bagian sebelum underscore '_' pertama
      const baseFilename = path.parse(originalFilename).name;
      const identifier = baseFilename.split('_')[0];

      if (!identifier) {
        errors.push(`Gagal memproses nama file: ${originalFilename}`);
        continue;
      }
      
      try {
        let patientWhereClause: Prisma.PatientWhereInput;
        // Logika untuk membedakan NIK (angka) dan ID Pasien (ada huruf)
        if (/^\d+$/.test(identifier)) {
          patientWhereClause = { nik: identifier, companyId: companyId };
        } else {
          patientWhereClause = { patientId: identifier, companyId: companyId };
        }

        const mcuResult = await prisma.mcuResult.findFirst({
          where: { patient: patientWhereClause },
        });

        if (!mcuResult) {
          errors.push(`Pasien dengan ID "${identifier}" (dari file ${originalFilename}) tidak ditemukan.`);
          continue;
        }

        let finalUrl = "";

        // Logika untuk Vercel Blob (produksi) atau Simpan Lokal (tes)
        if (process.env.BLOB_READ_WRITE_TOKEN) {
          // --- Mode Produksi: Upload ke Vercel Blob ---
          const blobPath = `mcu-images/${companyId}/${imageType}/${originalFilename}`;
          const blob = await put(blobPath, file, {
            access: 'public',
            contentType: file.type,
          });
          finalUrl = blob.url;
        } else {
          // --- Mode Lokal: Simpan ke folder public/uploads ---
          const uploadDir = path.join(process.cwd(), "public", "uploads", companyId, imageType);
          await fs.mkdir(uploadDir, { recursive: true });
          const buffer = Buffer.from(await file.arrayBuffer());
          const filePath = path.join(uploadDir, originalFilename);
          await fs.writeFile(filePath, buffer);
          finalUrl = `/uploads/${companyId}/${imageType}/${originalFilename}`;
        }
        
        await prisma.mcuResult.update({
          where: { id: mcuResult.id },
          data: { [fieldToUpdate]: finalUrl },
        });

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