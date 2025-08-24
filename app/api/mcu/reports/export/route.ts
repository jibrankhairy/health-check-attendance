import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";

const prisma = new PrismaClient();

const templateHeaders = [
  // Data Pasien
  "nik",
  "nama_lengkap",

  // Validator Psikologi
  "dassFasValidatorName",

  // Hematologi
  "hemoglobin",
  "leukosit",
  "trombosit",
  "hematokrit",
  "eritrosit",
  "led",
  "mcv",
  "mch",
  "mchc",
  "rdw",
  "mpv",
  "pdw",
  "hitungJenisEosinofil",
  "hitungJenisBasofil",
  "hitungJenisNeutrofilStab",
  "hitungJenisNeutrofilSegmen",
  "hitungJenisLimfosit",
  "hitungJenisMonosit",
  "hematologiValidatorName",

  // Kimia Darah
  "gulaDarahPuasa",
  "gulaDarah2JamPP",
  "hbsag",
  "sgot",
  "sgpt",
  "ureum",
  "kreatinin",
  "asamUrat",
  "kolesterolTotal",
  "trigliserida",
  "hdl",
  "ldl",
  "bilirubinTotal",
  "bilirubinDirect",
  "alkaliPhosphatase",
  "kimiaDarahValidatorName",

  "timbalDarah",
  "arsenikUrin",
  "biomonitoringValidatorName",

  // Framingham Score (Posisi Baru & Field Diperbarui)
  "framinghamGender",
  "framinghamAge",
  "framinghamTotalCholesterol",
  "framinghamHdlCholesterol",
  "framinghamSystolicBp",
  "framinghamIsOnHypertensionTreatment",
  "framinghamIsSmoker",
  "framinghamRiskPercentage",
  "framinghamRiskCategory",
  "framinghamVascularAge",
  "framinghamValidatorName",

  // Urinalisa
  "urinWarna",
  "urinKejernihan",
  "urinBau",
  "urinBeratJenis",
  "urinPh",
  "urinProtein",
  "urinBilirubin",
  "urinGlukosa",
  "urinUrobilinogen",
  "urinKeton",
  "urinNitrit",
  "urinLeukositEsterase",
  "urinBlood",
  "urinSedimenEritrosit",
  "urinSedimenLeukosit",
  "urinSedimenEpitel",
  "urinCaOxalat",
  "urinUridAcid",
  "urinGranulaCast",
  "urinalisaValidatorName",

  // Audiometry
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
  "audiometryKesimpulanTelingaKanan",
  "audiometryKesimpulanTelingaKiri",
  "audiometryKesimpulanUmum",
  "audiometrySaran",
  "audiometryValidatorName",

  // Spirometry
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
  "spirometryPostBdNote",
  "spirometryQualityAccept",
  "spirometryQualityRepeat",
  "spirometryEffortCount",
  "kesimpulanSpirometry",
  "spirometryValidatorName",

  // USG Abdomen & Mammae
  "usgAbdomenHepar",
  "usgAbdomenGallBladder",
  "usgAbdomenLien",
  "usgAbdomenPancreas",
  "usgAbdomenGinjalDekstra",
  "usgAbdomenGinjalSinistra",
  "usgAbdomenKesimpulan",
  "usgMammaeLaporan",
  "usgMammaeKesimpulan",
  "usgAbdomenValidatorName",
  "usgMammaeValidatorName",

  // EKG
  "ekgRhythm",
  "ekgQrsRate",
  "ekgAxis",
  "ekgPWave",
  "ekgPrInterval",
  "ekgQrsDuration",
  "ekgQWave",
  "ekgTWave",
  "ekgStChanges",
  "ekgOthers",
  "ekgConclusion",
  "ekgAdvice",
  "ekgValidatorName",

  // Treadmill
  "treadmillLamaLatihan",
  "treadmillKlasifikasiKebugaran",
  "treadmillKerjaFisik",
  "treadmillKelasFungsional",
  "treadmillHasilTest",
  "treadmillSaran",
  "treadmillValidatorName",

  // Rontgen
  "kesanRontgen",
  "rontgenValidatorName",

  // Kesimpulan Akhir
  "kesimpulan",
  "saran",
  "conclusionValidatorName",
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json(
        { message: "ID Perusahaan wajib diisi." },
        { status: 400 }
      );
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      return NextResponse.json(
        { message: "Perusahaan tidak ditemukan." },
        { status: 404 }
      );
    }

    const patients = await prisma.patient.findMany({
      where: { companyId },
      select: { nik: true, fullName: true },
      orderBy: { fullName: "asc" },
    });

    if (patients.length === 0) {
      return NextResponse.json(
        { message: "Tidak ada data pasien di perusahaan ini." },
        { status: 404 }
      );
    }

    const dataForExcel = patients.map((p) => {
      const row: { [key: string]: any } = {};
      for (const header of templateHeaders) {
        row[header] = "";
      }
      row.nik = p.nik;
      row.nama_lengkap = p.fullName;
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, {
      header: templateHeaders,
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hasil MCU");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileName = `Template_MCU_${company.name.replace(/\s+/g, "_")}.xlsx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Export MCU Reports Error:", error);
    const msg =
      error instanceof Error ? error.message : "Terjadi kesalahan pada server.";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
