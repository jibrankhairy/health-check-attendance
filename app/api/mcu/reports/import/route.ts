import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import QRCode from "qrcode";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

function mapExcelToPrisma(row: any): { [key: string]: any } {
  const mappedData: { [key: string]: any } = {};
  const allKeys = Object.keys(row);

  const integerFields = new Set([
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
  ]);

  const floatFields = new Set(["beratBadan", "tinggiBadan"]);

  for (const key of allKeys) {
    if (key === "nik" || key === "nama_lengkap") continue;

    let value = row[key];

    if (value !== null && value !== undefined && value !== "") {
      if (integerFields.has(key)) {
        const num = parseInt(value, 10);
        mappedData[key] = isNaN(num) ? null : num;
      } else if (floatFields.has(key)) {
        const num = parseFloat(value);
        mappedData[key] = isNaN(num) ? null : num;
      } else {
        mappedData[key] = String(value);
      }
    }
  }
  mappedData.status = "COMPLETED";
  return mappedData;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const companyId = formData.get("companyId") as string | null;

    if (!file) {
      return NextResponse.json(
        { message: "File tidak ditemukan." },
        { status: 400 }
      );
    }
    if (!companyId) {
      return NextResponse.json(
        { message: "ID Perusahaan tidak ditemukan." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const workbook = XLSX.read(bytes, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      return NextResponse.json(
        { message: "File Excel kosong." },
        { status: 400 }
      );
    }

    if (!jsonData[0].hasOwnProperty("nik")) {
      return NextResponse.json(
        { message: "Kolom 'nik' wajib ada di dalam file Excel." },
        { status: 400 }
      );
    }

    let updatedCount = 0;
    const errors: string[] = [];

    const validatorMap: { [key: string]: string } = {
      hematologiValidatorName: "hematologiValidatorQr",
      kimiaDarahValidatorName: "kimiaDarahValidatorQr",
      biomonitoringValidatorName: "biomonitoringValidatorQr",
      urinalisaValidatorName: "urinalisaValidatorQr",
      audiometriValidatorName: "audiometriValidatorQr",
      spirometriValidatorName: "spirometriValidatorQr",
      usgAbdomenValidatorName: "usgAbdomenValidatorQr",
      usgMammaeValidatorName: "usgMammaeValidatorQr",
      ekgValidatorName: "ekgValidatorQr",
      rontgenValidatorName: "rontgenValidatorQr",
      conclusionValidatorName: "conclusionValidatorQr",
      dassFasValidatorName: "dassFasValidatorQr",
      framinghamValidatorName: "framinghamValidatorQr",
    };

    for (const [index, row] of jsonData.entries()) {
      const nik = row.nik ? String(row.nik).trim() : null;
      const rowNum = index + 2;

      try {
        if (!nik) {
          errors.push(`Baris ${rowNum}: NIK kosong.`);
          continue;
        }

        const patient = await prisma.patient.findUnique({
          where: { nik, companyId },
          include: { mcuResults: { take: 1, orderBy: { createdAt: "desc" } } },
        });

        if (!patient) {
          errors.push(
            `Baris ${rowNum}: Pasien dengan NIK ${nik} tidak ditemukan.`
          );
          continue;
        }

        const mcuResult = patient.mcuResults[0];
        if (!mcuResult) {
          errors.push(
            `Baris ${rowNum}: Laporan MCU untuk pasien NIK ${nik} tidak ditemukan.`
          );
          continue;
        }

        const dataToUpdate = mapExcelToPrisma(row);

        for (const nameField in validatorMap) {
          if (dataToUpdate[nameField]) {
            const qrField = validatorMap[nameField];
            const validatorName = dataToUpdate[nameField];

            const qrCodeDataUrl = await QRCode.toDataURL(validatorName);

            dataToUpdate[qrField] = qrCodeDataUrl;
          }
        }

        await prisma.mcuResult.update({
          where: { id: mcuResult.id },
          data: dataToUpdate,
        });

        updatedCount++;
      } catch (e: any) {
        const errorMessage = e.message || "Operasi database gagal.";
        errors.push(
          `Baris ${rowNum} (NIK: ${nik}): Gagal diproses. ${errorMessage}`
        );
      }
    }

    const totalRows = jsonData.length;
    let message = `Berhasil memperbarui ${updatedCount} dari ${totalRows} data laporan.`;
    if (errors.length > 0) {
      message += ` Gagal memperbarui ${errors.length} data.`;
    }

    return NextResponse.json({ message, errors });
  } catch (error) {
    console.error("Import MCU Reports Error (Outer):", error);
    const msg =
      error instanceof Error ? error.message : "Terjadi kesalahan pada server.";
    return NextResponse.json(
      { message: "Gagal mengimpor data.", errors: [msg] },
      { status: 500 }
    );
  }
}
