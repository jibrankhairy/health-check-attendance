// app/api/mcu/template/route.ts

import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  // Daftar semua header yang diperlukan sesuai skema
  const headers = [
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
    "hematologiValidatorQr",
    // Kimia Darah
    "gulaDarahPuasa",
    "gulaDarah2JamPP",
    "gulaDarahSewaktu",
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
    "kimiaDarahValidatorQr",
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
    "urinalisaValidatorQr",
    // Audiometry & Spirometry
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
    "kesimpulanAudiometry",
    "spirometryFvc",
    "spirometryFev1",
    "spirometryFev1Fvc",
    "kesimpulanSpirometry",
    "audiometryValidatorName",
    "audiometryValidatorQr",
    "spirometryValidatorName",
    "spirometryValidatorQr",
    // USG
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
    "usgAbdomenValidatorQr",
    "usgMammaeValidatorName",
    "usgMammaeValidatorQr",
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
    "ekgValidatorQr",
    // Refraktometri
    "refraKananSpheris",
    "refraKananChylinder",
    "refraKananAxis",
    "refraKananAdd",
    "refraKiriSpheris",
    "refraKiriChylinder",
    "refraKiriAxis",
    "refraKiriAdd",
    "refraValidatorName",
    "refraValidatorQr",
    // Rontgen
    "kesanRontgen",
    "rontgenValidatorName",
    "rontgenValidatorQr",
    // Kesimpulan & Saran
    "kesimpulan",
    "saran",
    "conclusionValidatorName",
    "conclusionValidatorQr",
  ];

  // Buat worksheet baru hanya dengan header
  const ws = XLSX.utils.aoa_to_sheet([headers]);

  // Buat workbook baru
  const wb = XLSX.utils.book_new();

  // Tambahkan worksheet ke workbook
  XLSX.utils.book_append_sheet(wb, ws, "Hasil MCU"); // Memberi nama sheet "Hasil MCU"

  // Tulis workbook ke buffer
  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

  // Kirim buffer sebagai respons
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Disposition": `attachment; filename="template-hasil-mcu.xlsx"`,
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}
