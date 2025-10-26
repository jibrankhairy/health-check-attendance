import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import * as ExcelJS from "exceljs";

const prisma = new PrismaClient();

const flattenAnswers = (answers: any): Record<string, any> => {
  if (answers && typeof answers === "object" && !Array.isArray(answers)) {
    return answers;
  }
  return {};
};

const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return "Underweight";
  if (bmi >= 25 && bmi <= 29.9) return "Overweight (Pre-obese)";
  if (bmi >= 30) return "Obesity";
  return "NORMAL (18.5 - 24.9)";
};

type FasId =
  | "fas1"
  | "fas2"
  | "fas3"
  | "fas4"
  | "fas5"
  | "fas6"
  | "fas7"
  | "fas8"
  | "fas9"
  | "fas10";
type FasAnswers = Partial<Record<FasId, string | number>>;
type Category = "FIT" | "SLIGHTLY TIRED" | "TIRED" | "FATIGUED" | "N/A";

const fasQuestions: { id: FasId; reverse?: boolean }[] = [
  { id: "fas1" },
  { id: "fas2" },
  { id: "fas3" },
  { id: "fas4", reverse: true },
  { id: "fas5" },
  { id: "fas6" },
  { id: "fas7" },
  { id: "fas8" },
  { id: "fas9" },
  { id: "fas10", reverse: true },
];

const categoryExplanation: Record<Exclude<Category, "N/A">, string> = {
  FATIGUED:
    "Tidak dapat mengatasi kelelahan akibat aktivitas berat dimana kondisi kesehatan mengalami gangguan.",
  TIRED:
    "Rutin melakukan aktivitas yang berat dan kurang istirahat yang cukup.",
  "SLIGHTLY TIRED":
    "Mengalami sedikit kelelahan karena melakukan aktivitas yang cukup berat.",
  FIT: "Faktor terjadi lelah karena adanya aktivitas normal, hanya membutuhkan tidur yang cukup.",
};

const calculateFasResult = (
  answers?: FasAnswers | null
): {
  fas_raw_total: number | null;
  fas_score_1_to_10: number | null;
  fas_category: Category;
  fas_explanation?: string;
} => {
  if (!answers || Object.keys(answers).length === 0)
    return {
      fas_raw_total: null,
      fas_score_1_to_10: null,
      fas_category: "N/A",
    };

  let total = 0;
  let answered = 0;

  fasQuestions.forEach((q) => {
    const raw = answers[q.id];
    const base = Number(raw);
    if (Number.isFinite(base) && base >= 1 && base <= 5) {
      answered++;
      const v = q.reverse ? 6 - base : base;
      total += v;
    }
  });

  if (answered < fasQuestions.length)
    return {
      fas_raw_total: null,
      fas_score_1_to_10: null,
      fas_category: "N/A",
    };

  const clamped = Math.max(10, Math.min(50, total));
  const score1to10 = Math.round(((clamped - 10) / 40) * 9 + 1);

  let category: Category = "N/A";
  if (score1to10 >= 10) category = "FATIGUED";
  else if (score1to10 >= 7) category = "TIRED";
  else if (score1to10 >= 4) category = "SLIGHTLY TIRED";
  else if (score1to10 >= 1) category = "FIT";

  const explanation =
    category === "N/A" ? undefined : categoryExplanation[category];

  return {
    fas_raw_total: total,
    fas_score_1_to_10: score1to10,
    fas_category: category,
    fas_explanation: explanation,
  };
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json(
        { message: "Company ID wajib diisi" },
        { status: 400 }
      );
    }

    const reports = await prisma.mcuResult.findMany({
      where: {
        patient: { companyId: companyId },
        pemeriksaanFisikForm: { not: Prisma.DbNull },
      },
      select: {
        healthHistoryAnswers: true,
        dassTestAnswers: true,
        fasTestAnswers: true,
        pemeriksaanFisikForm: true,
        kesimpulan: true,
        saran: true,
        conclusionValidatorName: true,
        dassFasValidatorName: true,
        hematologiValidatorName: true,
        kimiaDarahValidatorName: true,
        hepatitisValidatorName: true,
        biomonitoringValidatorName: true,
        framinghamValidatorName: true,
        urinalisaValidatorName: true,
        audiometryValidatorName: true,
        spirometryValidatorName: true,
        refraValidatorName: true,
        usgAbdomenValidatorName: true,
        usgMammaeValidatorName: true,
        ekgValidatorName: true,
        treadmillValidatorName: true,
        rontgenValidatorName: true,
        patient: { select: { nik: true, fullName: true, patientId: true } },
        golonganDarah: true,
        hemoglobin: true,
        leukosit: true,
        trombosit: true,
        hematokrit: true,
        eritrosit: true,
        led: true,
        mcv: true,
        mch: true,
        mchc: true,
        rdw: true,
        mpv: true,
        pdw: true,
        hitungJenisEosinofil: true,
        hitungJenisBasofil: true,
        hitungJenisNeutrofilStab: true,
        hitungJenisNeutrofilSegmen: true,
        hitungJenisLimfosit: true,
        hitungJenisMonosit: true,
        gulaDarahPuasa: true,
        gulaDarah2JamPP: true,
        hbsag: true,
        antiHbs: true,
        sgot: true,
        sgpt: true,
        ureum: true,
        kreatinin: true,
        asamUrat: true,
        kolesterolTotal: true,
        trigliserida: true,
        hdl: true,
        ldl: true,
        bilirubinTotal: true,
        bilirubinDirect: true,
        alkaliPhosphatase: true,
        timbalDarah: true,
        arsenikUrin: true,
        framinghamGender: true,
        framinghamAge: true,
        framinghamTotalCholesterol: true,
        framinghamHdlCholesterol: true,
        framinghamSystolicBp: true,
        framinghamIsOnHypertensionTreatment: true,
        framinghamIsSmoker: true,
        framinghamRiskPercentage: true,
        framinghamRiskCategory: true,
        framinghamVascularAge: true,
        urinWarna: true,
        urinKejernihan: true,
        urinBau: true,
        urinBeratJenis: true,
        urinPh: true,
        urinProtein: true,
        urinBilirubin: true,
        urinGlukosa: true,
        urinUrobilinogen: true,
        urinKeton: true,
        urinNitrit: true,
        urinLeukositEsterase: true,
        urinBlood: true,
        urinSedimenEritrosit: true,
        urinSedimenLeukosit: true,
        urinSedimenEpitel: true,
        urinCaOxalat: true,
        urinUridAcid: true,
        urinGranulaCast: true,
        audioAcKanan250: true,
        audioAcKanan500: true,
        audioAcKanan1000: true,
        audioAcKanan2000: true,
        audioAcKanan3000: true,
        audioAcKanan4000: true,
        audioAcKanan6000: true,
        audioAcKanan8000: true,
        audioAcKiri250: true,
        audioAcKiri500: true,
        audioAcKiri1000: true,
        audioAcKiri2000: true,
        audioAcKiri3000: true,
        audioAcKiri4000: true,
        audioAcKiri6000: true,
        audioAcKiri8000: true,
        audioBcKanan250: true,
        audioBcKanan500: true,
        audioBcKanan1000: true,
        audioBcKanan2000: true,
        audioBcKanan3000: true,
        audioBcKanan4000: true,
        audioBcKanan6000: true,
        audioBcKanan8000: true,
        audioBcKiri250: true,
        audioBcKiri500: true,
        audioBcKiri1000: true,
        audioBcKiri2000: true,
        audioBcKiri3000: true,
        audioBcKiri4000: true,
        audioBcKiri6000: true,
        audioBcKiri8000: true,
        audiometryKesimpulanTelingaKanan: true,
        audiometryKesimpulanTelingaKiri: true,
        audiometryKesimpulanUmum: true,
        audiometrySaran: true,
        spirometryFvc: true,
        spirometryFvcPred: true,
        spirometryFvcPost: true,
        spirometryFev1: true,
        spirometryFev1Pred: true,
        spirometryFev1Post: true,
        spirometryFev1Fvc: true,
        spirometryFev1FvcPred: true,
        spirometryFev6: true,
        spirometryFev6Pred: true,
        spirometryPef: true,
        spirometryPefPred: true,
        spirometryPefPost: true,
        spirometryFef2575: true,
        spirometryFef2575Pred: true,
        spirometryFef25: true,
        spirometryFef25Pred: true,
        spirometryFef25Post: true,
        spirometryFef50: true,
        spirometryFef50Pred: true,
        spirometryFef50Post: true,
        spirometryFef75: true,
        spirometryFef75Pred: true,
        spirometryFef75Post: true,
        spirometryPostBdNote: true,
        spirometryQualityAccept: true,
        spirometryQualityRepeat: true,
        spirometryEffortCount: true,
        kesimpulanSpirometry: true,
        refraKananSpheris: true,
        refraKananChylinder: true,
        refraKananAxis: true,
        refraKananAdd: true,
        refraKiriSpheris: true,
        refraKiriChylinder: true,
        refraKiriAxis: true,
        refraKiriAdd: true,
        refraValidatorQr: true,
        usgAbdomenHepar: true,
        usgAbdomenGallBladder: true,
        usgAbdomenLien: true,
        usgAbdomenPancreas: true,
        usgAbdomenGinjalDekstra: true,
        usgAbdomenGinjalSinistra: true,
        usgAbdomenKesimpulan: true,
        usgMammaeLaporan: true,
        usgMammaeKesimpulan: true,
        ekgRhythm: true,
        ekgQrsRate: true,
        ekgAxis: true,
        ekgPWave: true,
        ekgPrInterval: true,
        ekgQrsDuration: true,
        ekgQWave: true,
        ekgTWave: true,
        ekgStChanges: true,
        ekgOthers: true,
        ekgConclusion: true,
        ekgAdvice: true,
        treadmillLamaLatihan: true,
        treadmillKlasifikasiKebugaran: true,
        treadmillKerjaFisik: true,
        treadmillKelasFungsional: true,
        treadmillHasilTest: true,
        treadmillSaran: true,
        kesanRontgen: true,
      },
    });

    if (reports.length === 0) {
      return NextResponse.json(
        {
          message:
            "Tidak ada data form yang bisa diekspor untuk perusahaan ini.",
        },
        { status: 404 }
      );
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Hasil MCU");

    worksheet.columns = [
      { header: "nik", key: "nik", width: 20 },
      { header: "fullName", key: "fullName", width: 30 },
      { header: "patientId", key: "patientId", width: 15 },

      // Hasil DASS
      {
        header: "dass_depression_score",
        key: "dass_depression_score",
        width: 22,
      },
      {
        header: "dass_depression_level",
        key: "dass_depression_level",
        width: 22,
      },
      { header: "dass_anxiety_score", key: "dass_anxiety_score", width: 22 },
      { header: "dass_anxiety_level", key: "dass_anxiety_level", width: 22 },
      { header: "dass_stress_score", key: "dass_stress_score", width: 22 },
      { header: "dass_stress_level", key: "dass_stress_level", width: 22 },
      // Hasil FAS
      { header: "fas_raw_total", key: "fas_raw_total", width: 22 },
      { header: "fas_score_1_to_10", key: "fas_score_1_to_10", width: 22 },
      { header: "fas_category", key: "fas_category", width: 22 },
      { header: "fas_explanation", key: "fas_explanation", width: 40 },
      // Health History
      { header: "merasaSehat", key: "merasaSehat", width: 25 },
      { header: "keluhanKesehatan", key: "keluhanKesehatan", width: 25 },
      { header: "keluhanDetail", key: "keluhanDetail", width: 35 },
      { header: "riwayatPenyakit", key: "riwayatPenyakit", width: 25 },
      { header: "dirawatDiRS", key: "dirawatDiRS", width: 25 },
      {
        header: "memilikiRiwayatPenyakit",
        key: "memilikiRiwayatPenyakit",
        width: 25,
      },
      {
        header: "riwayatPenyakitDetail",
        key: "riwayatPenyakitDetail",
        width: 35,
      },
      { header: "pernahDioperasi", key: "pernahDioperasi", width: 25 },
      {
        header: "riwayatPenyakitKeluarga",
        key: "riwayatPenyakitKeluarga",
        width: 25,
      },
      {
        header: "riwayatPenyakitKeluargaDetail",
        key: "riwayatPenyakitKeluargaDetail",
        width: 35,
      },
      { header: "makanTeratur", key: "makanTeratur", width: 25 },
      { header: "alkohol", key: "alkohol", width: 25 },
      { header: "rokok", key: "rokok", width: 25 },
      { header: "rokokDetail", key: "rokokDetail", width: 25 },
      { header: "olahraga", key: "olahraga", width: 25 },
      { header: "obatDiabetes", key: "obatDiabetes", width: 25 },
      { header: "obatHipertensi", key: "obatHipertensi", width: 25 },
      { header: "suplemen", key: "suplemen", width: 25 },
      { header: "obatLainnya", key: "obatLainnya", width: 25 },
      { header: "kondisiKesehatan", key: "kondisiKesehatan", width: 20 },
      { header: "kesadaran", key: "kesadaran", width: 20 },
      { header: "beratBadanKg", key: "beratBadanKg", width: 20 },
      { header: "tinggiBadanCm", key: "tinggiBadanCm", width: 20 },
      { header: "bmi", key: "bmi", width: 15 },
      { header: "bmi_category", key: "bmi_category", width: 25 },
      { header: "lingkarPerutCm", key: "lingkarPerutCm", width: 20 },
      { header: "suhuC", key: "suhuC", width: 15 },
      { header: "tensiSistol", key: "tensiSistol", width: 15 },
      { header: "tensiDiastol", key: "tensiDiastol", width: 15 },
      { header: "nadiPerMenit", key: "nadiPerMenit", width: 15 },
      { header: "pernapasanPerMenit", key: "pernapasanPerMenit", width: 20 },
      { header: "hipoHiperpigmentasi", key: "hipoHiperpigmentasi", width: 20 },
      { header: "rash", key: "rash", width: 15 },
      { header: "deviasiSeptum", key: "deviasiSeptum", width: 20 },
      { header: "pembesaranKonka", key: "pembesaranKonka", width: 20 },
      { header: "tonsilUkuran", key: "tonsilUkuran", width: 20 },
      { header: "pharingHipermis", key: "pharingHipermis", width: 20 },
      { header: "lidah", key: "lidah", width: 15 },
      { header: "gigiKaries", key: "gigiKaries", width: 15 },
      { header: "gigiHilang", key: "gigiHilang", width: 15 },
      { header: "gigiPalsu", key: "gigiPalsu", width: 15 },
      { header: "leherKondisi", key: "leherKondisi", width: 20 },
      { header: "tiroid", key: "tiroid", width: 15 },
      { header: "kelenjarLymp", key: "kelenjarLymp", width: 20 },
      { header: "butaWarna", key: "butaWarna", width: 15 },
      { header: "anemiaOD", key: "anemiaOD", width: 15 },
      { header: "anemiaOS", key: "anemiaOS", width: 15 },
      { header: "ikterikOD", key: "ikterikOD", width: 15 },
      { header: "ikterikOS", key: "ikterikOS", width: 15 },
      { header: "pupilOD", key: "pupilOD", width: 15 },
      { header: "pupilOS", key: "pupilOS", width: 15 },
      { header: "refleksOD", key: "refleksOD", width: 15 },
      { header: "refleksOS", key: "refleksOS", width: 15 },
      { header: "pupilDistance", key: "pupilDistance", width: 15 },
      { header: "kacamata", key: "kacamata", width: 15 },
      { header: "ukuranOD", key: "ukuranOD", width: 15 },
      { header: "ukuranOS", key: "ukuranOS", width: 15 },
      { header: "visusOD", key: "visusOD", width: 15 },
      { header: "visusOS", key: "visusOS", width: 15 },
      { header: "lapangPandang", key: "lapangPandang", width: 20 },
      { header: "ketajaman", key: "ketajaman", width: 15 },
      {
        header: "kemampuanPendengaranAD",
        key: "kemampuanPendengaranAD",
        width: 20,
      },
      {
        header: "kemampuanPendengaranAS",
        key: "kemampuanPendengaranAS",
        width: 20,
      },
      { header: "telingaLuarAD", key: "telingaLuarAD", width: 20 },
      { header: "telingaLuarAS", key: "telingaLuarAS", width: 20 },
      { header: "nyeriTekanAD", key: "nyeriTekanAD", width: 20 },
      { header: "nyeriTekanAS", key: "nyeriTekanAS", width: 20 },
      { header: "serumenAD", key: "serumenAD", width: 15 },
      { header: "serumenAS", key: "serumenAS", width: 15 },
      { header: "gendangAD", key: "gendangAD", width: 20 },
      { header: "gendangAS", key: "gendangAS", width: 20 },
      { header: "ictusInspeksi", key: "ictusInspeksi", width: 20 },
      { header: "ictusPalpasi", key: "ictusPalpasi", width: 20 },
      { header: "batasJantung", key: "batasJantung", width: 20 },
      { header: "bisingJantung", key: "bisingJantung", width: 20 },
      { header: "paruInspeksi", key: "paruInspeksi", width: 20 },
      { header: "paruPalpasi", key: "paruPalpasi", width: 20 },
      { header: "paruPerkusi", key: "paruPerkusi", width: 20 },
      { header: "paruAuskultasi", key: "paruAuskultasi", width: 20 },
      { header: "cernaInspeksi", key: "cernaInspeksi", width: 20 },
      { header: "hepar", key: "hepar", width: 20 },
      { header: "lien", key: "lien", width: 20 },
      { header: "cernaPerkusi", key: "cernaPerkusi", width: 20 },
      { header: "peristaltik", key: "peristaltik", width: 20 },
      { header: "deformitas", key: "deformitas", width: 20 },
      { header: "oedema", key: "oedema", width: 20 },
      { header: "functioLaesa", key: "functioLaesa", width: 20 },
      { header: "refleksFisiologis", key: "refleksFisiologis", width: 20 },
      { header: "refleksPatologis", key: "refleksPatologis", width: 20 },
      { header: "tulangBelakang", key: "tulangBelakang", width: 20 },
      { header: "psikis", key: "psikis", width: 20 },
      { header: "sikap", key: "sikap", width: 20 },
      { header: "dayaIngat", key: "dayaIngat", width: 20 },
      { header: "orientasi", key: "orientasi", width: 20 },

      // HASIL LAB & PENUNJANG DARI MCU RESULT (SESUAI TEMPLATE REPORT)
      // Hematologi
      { header: "golonganDarah", key: "golonganDarah", width: 20 },
      { header: "hemoglobin", key: "hemoglobin", width: 20 },
      { header: "leukosit", key: "leukosit", width: 20 },
      { header: "trombosit", key: "trombosit", width: 20 },
      { header: "hematokrit", key: "hematokrit", width: 20 },
      { header: "eritrosit", key: "eritrosit", width: 20 },
      { header: "led", key: "led", width: 20 },
      { header: "mcv", key: "mcv", width: 20 },
      { header: "mch", key: "mch", width: 20 },
      { header: "mchc", key: "mchc", width: 20 },
      { header: "rdw", key: "rdw", width: 20 },
      { header: "mpv", key: "mpv", width: 20 },
      { header: "pdw", key: "pdw", width: 20 },
      {
        header: "hitungJenisEosinofil",
        key: "hitungJenisEosinofil",
        width: 20,
      },
      { header: "hitungJenisBasofil", key: "hitungJenisBasofil", width: 20 },
      {
        header: "hitungJenisNeutrofilStab",
        key: "hitungJenisNeutrofilStab",
        width: 25,
      },
      {
        header: "hitungJenisNeutrofilSegmen",
        key: "hitungJenisNeutrofilSegmen",
        width: 25,
      },
      { header: "hitungJenisLimfosit", key: "hitungJenisLimfosit", width: 20 },
      { header: "hitungJenisMonosit", key: "hitungJenisMonosit", width: 20 },
      {
        header: "hematologiValidatorName",
        key: "hematologiValidatorName",
        width: 25,
      },

      // Kimia Darah
      { header: "gulaDarahPuasa", key: "gulaDarahPuasa", width: 20 },
      { header: "gulaDarah2JamPP", key: "gulaDarah2JamPP", width: 20 },
      { header: "hbsag", key: "hbsag", width: 20 },
      { header: "antiHbs", key: "antiHbs", width: 20 },
      { header: "sgot", key: "sgot", width: 20 },
      { header: "sgpt", key: "sgpt", width: 20 },
      { header: "ureum", key: "ureum", width: 20 },
      { header: "kreatinin", key: "kreatinin", width: 20 },
      { header: "asamUrat", key: "asamUrat", width: 20 },
      { header: "kolesterolTotal", key: "kolesterolTotal", width: 20 },
      { header: "trigliserida", key: "trigliserida", width: 20 },
      { header: "hdl", key: "hdl", width: 20 },
      { header: "ldl", key: "ldl", width: 20 },
      { header: "bilirubinTotal", key: "bilirubinTotal", width: 20 },
      { header: "bilirubinDirect", key: "bilirubinDirect", width: 20 },
      { header: "alkaliPhosphatase", key: "alkaliPhosphatase", width: 20 },
      {
        header: "kimiaDarahValidatorName",
        key: "kimiaDarahValidatorName",
        width: 25,
      },
      {
        header: "hepatitisValidatorName",
        key: "hepatitisValidatorName",
        width: 25,
      },

      // Biomonitoring
      { header: "timbalDarah", key: "timbalDarah", width: 20 },
      { header: "arsenikUrin", key: "arsenikUrin", width: 20 },
      {
        header: "biomonitoringValidatorName",
        key: "biomonitoringValidatorName",
        width: 25,
      },

      // Framingham Score
      { header: "framinghamGender", key: "framinghamGender", width: 20 },
      { header: "framinghamAge", key: "framinghamAge", width: 20 },
      {
        header: "framinghamTotalCholesterol",
        key: "framinghamTotalCholesterol",
        width: 25,
      },
      {
        header: "framinghamHdlCholesterol",
        key: "framinghamHdlCholesterol",
        width: 25,
      },
      {
        header: "framinghamSystolicBp",
        key: "framinghamSystolicBp",
        width: 20,
      },
      {
        header: "framinghamIsOnHypertensionTreatment",
        key: "framinghamIsOnHypertensionTreatment",
        width: 30,
      },
      { header: "framinghamIsSmoker", key: "framinghamIsSmoker", width: 20 },
      {
        header: "framinghamRiskPercentage",
        key: "framinghamRiskPercentage",
        width: 25,
      },
      {
        header: "framinghamRiskCategory",
        key: "framinghamRiskCategory",
        width: 25,
      },
      {
        header: "framinghamVascularAge",
        key: "framinghamVascularAge",
        width: 20,
      },
      {
        header: "framinghamValidatorName",
        key: "framinghamValidatorName",
        width: 25,
      },

      // Urinalisa
      { header: "urinWarna", key: "urinWarna", width: 20 },
      { header: "urinKejernihan", key: "urinKejernihan", width: 20 },
      { header: "urinBau", key: "urinBau", width: 20 },
      { header: "urinBeratJenis", key: "urinBeratJenis", width: 20 },
      { header: "urinPh", key: "urinPh", width: 20 },
      { header: "urinProtein", key: "urinProtein", width: 20 },
      { header: "urinBilirubin", key: "urinBilirubin", width: 20 },
      { header: "urinGlukosa", key: "urinGlukosa", width: 20 },
      { header: "urinUrobilinogen", key: "urinUrobilinogen", width: 20 },
      { header: "urinKeton", key: "urinKeton", width: 20 },
      { header: "urinNitrit", key: "urinNitrit", width: 20 },
      {
        header: "urinLeukositEsterase",
        key: "urinLeukositEsterase",
        width: 20,
      },
      { header: "urinBlood", key: "urinBlood", width: 20 },
      {
        header: "urinSedimenEritrosit",
        key: "urinSedimenEritrosit",
        width: 20,
      },
      { header: "urinSedimenLeukosit", key: "urinSedimenLeukosit", width: 20 },
      { header: "urinSedimenEpitel", key: "urinSedimenEpitel", width: 20 },
      { header: "urinCaOxalat", key: "urinCaOxalat", width: 20 },
      { header: "urinUridAcid", key: "urinUridAcid", width: 20 },
      { header: "urinGranulaCast", key: "urinGranulaCast", width: 20 },
      {
        header: "urinalisaValidatorName",
        key: "urinalisaValidatorName",
        width: 25,
      },

      // Audiometry
      { header: "audioAcKanan250", key: "audioAcKanan250", width: 20 },
      { header: "audioAcKanan500", key: "audioAcKanan500", width: 20 },
      { header: "audioAcKanan1000", key: "audioAcKanan1000", width: 20 },
      { header: "audioAcKanan2000", key: "audioAcKanan2000", width: 20 },
      { header: "audioAcKanan3000", key: "audioAcKanan3000", width: 20 },
      { header: "audioAcKanan4000", key: "audioAcKanan4000", width: 20 },
      { header: "audioAcKanan6000", key: "audioAcKanan6000", width: 20 },
      { header: "audioAcKanan8000", key: "audioAcKanan8000", width: 20 },
      { header: "audioAcKiri250", key: "audioAcKiri250", width: 20 },
      { header: "audioAcKiri500", key: "audioAcKiri500", width: 20 },
      { header: "audioAcKiri1000", key: "audioAcKiri1000", width: 20 },
      { header: "audioAcKiri2000", key: "audioAcKiri2000", width: 20 },
      { header: "audioAcKiri3000", key: "audioAcKiri3000", width: 20 },
      { header: "audioAcKiri4000", key: "audioAcKiri4000", width: 20 },
      { header: "audioAcKiri6000", key: "audioAcKiri6000", width: 20 },
      { header: "audioAcKiri8000", key: "audioAcKiri8000", width: 20 },
      { header: "audioBcKanan250", key: "audioBcKanan250", width: 20 },
      { header: "audioBcKanan500", key: "audioBcKanan500", width: 20 },
      { header: "audioBcKanan1000", key: "audioBcKanan1000", width: 20 },
      { header: "audioBcKanan2000", key: "audioBcKanan2000", width: 20 },
      { header: "audioBcKanan3000", key: "audioBcKanan3000", width: 20 },
      { header: "audioBcKanan4000", key: "audioBcKanan4000", width: 20 },
      { header: "audioBcKanan6000", key: "audioBcKanan6000", width: 20 },
      { header: "audioBcKanan8000", key: "audioBcKanan8000", width: 20 },
      { header: "audioBcKiri250", key: "audioBcKiri250", width: 20 },
      { header: "audioBcKiri500", key: "audioBcKiri500", width: 20 },
      { header: "audioBcKiri1000", key: "audioBcKiri1000", width: 20 },
      { header: "audioBcKiri2000", key: "audioBcKiri2000", width: 20 },
      { header: "audioBcKiri3000", key: "audioBcKiri3000", width: 20 },
      { header: "audioBcKiri4000", key: "audioBcKiri4000", width: 20 },
      { header: "audioBcKiri6000", key: "audioBcKiri6000", width: 20 },
      { header: "audioBcKiri8000", key: "audioBcKiri8000", width: 20 },
      {
        header: "audiometryKesimpulanTelingaKanan",
        key: "audiometryKesimpulanTelingaKanan",
        width: 30,
      },
      {
        header: "audiometryKesimpulanTelingaKiri",
        key: "audiometryKesimpulanTelingaKiri",
        width: 30,
      },
      {
        header: "audiometryKesimpulanUmum",
        key: "audiometryKesimpulanUmum",
        width: 30,
      },
      { header: "audiometrySaran", key: "audiometrySaran", width: 40 },
      {
        header: "audiometryValidatorName",
        key: "audiometryValidatorName",
        width: 25,
      },

      // Spirometry
      { header: "spirometryFvc", key: "spirometryFvc", width: 15 },
      { header: "spirometryFvcPred", key: "spirometryFvcPred", width: 15 },
      { header: "spirometryFvcPost", key: "spirometryFvcPost", width: 15 },
      { header: "spirometryFev1", key: "spirometryFev1", width: 15 },
      { header: "spirometryFev1Pred", key: "spirometryFev1Pred", width: 15 },
      { header: "spirometryFev1Post", key: "spirometryFev1Post", width: 15 },
      { header: "spirometryFev1Fvc", key: "spirometryFev1Fvc", width: 15 },
      {
        header: "spirometryFev1FvcPred",
        key: "spirometryFev1FvcPred",
        width: 15,
      },
      { header: "spirometryFev6", key: "spirometryFev6", width: 15 },
      { header: "spirometryFev6Pred", key: "spirometryFev6Pred", width: 15 },
      { header: "spirometryPef", key: "spirometryPef", width: 15 },
      { header: "spirometryPefPred", key: "spirometryPefPred", width: 15 },
      { header: "spirometryPefPost", key: "spirometryPefPost", width: 15 },
      { header: "spirometryFef2575", key: "spirometryFef2575", width: 15 },
      {
        header: "spirometryFef2575Pred",
        key: "spirometryFef2575Pred",
        width: 15,
      },
      { header: "spirometryFef25", key: "spirometryFef25", width: 15 },
      { header: "spirometryFef25Pred", key: "spirometryFef25Pred", width: 15 },
      { header: "spirometryFef25Post", key: "spirometryFef25Post", width: 15 },
      { header: "spirometryFef50", key: "spirometryFef50", width: 15 },
      { header: "spirometryFef50Pred", key: "spirometryFef50Pred", width: 15 },
      { header: "spirometryFef50Post", key: "spirometryFef50Post", width: 15 },
      { header: "spirometryFef75", key: "spirometryFef75", width: 15 },
      { header: "spirometryFef75Pred", key: "spirometryFef75Pred", width: 15 },
      { header: "spirometryFef75Post", key: "spirometryFef75Post", width: 15 },
      {
        header: "spirometryPostBdNote",
        key: "spirometryPostBdNote",
        width: 25,
      },
      {
        header: "spirometryQualityAccept",
        key: "spirometryQualityAccept",
        width: 20,
      },
      {
        header: "spirometryQualityRepeat",
        key: "spirometryQualityRepeat",
        width: 20,
      },
      {
        header: "spirometryEffortCount",
        key: "spirometryEffortCount",
        width: 20,
      },
      {
        header: "kesimpulanSpirometry",
        key: "kesimpulanSpirometry",
        width: 30,
      },
      {
        header: "spirometryValidatorName",
        key: "spirometryValidatorName",
        width: 25,
      },

      // Refraktometri
      { header: "refraKananSpheris", key: "refraKananSpheris", width: 15 },
      { header: "refraKananChylinder", key: "refraKananChylinder", width: 15 },
      { header: "refraKananAxis", key: "refraKananAxis", width: 15 },
      { header: "refraKananAdd", key: "refraKananAdd", width: 15 },
      { header: "refraKiriSpheris", key: "refraKiriSpheris", width: 15 },
      { header: "refraKiriChylinder", key: "refraKiriChylinder", width: 15 },
      { header: "refraKiriAxis", key: "refraKiriAxis", width: 15 },
      { header: "refraKiriAdd", key: "refraKiriAdd", width: 15 },
      { header: "refraValidatorName", key: "refraValidatorName", width: 25 },
      { header: "refraValidatorQr", key: "refraValidatorQr", width: 20 },

      // USG Abdomen & Mammae
      { header: "usgAbdomenHepar", key: "usgAbdomenHepar", width: 25 },
      {
        header: "usgAbdomenGallBladder",
        key: "usgAbdomenGallBladder",
        width: 25,
      },
      { header: "usgAbdomenLien", key: "usgAbdomenLien", width: 25 },
      { header: "usgAbdomenPancreas", key: "usgAbdomenPancreas", width: 25 },
      {
        header: "usgAbdomenGinjalDekstra",
        key: "usgAbdomenGinjalDekstra",
        width: 25,
      },
      {
        header: "usgAbdomenGinjalSinistra",
        key: "usgAbdomenGinjalSinistra",
        width: 25,
      },
      {
        header: "usgAbdomenKesimpulan",
        key: "usgAbdomenKesimpulan",
        width: 40,
      },
      { header: "usgMammaeLaporan", key: "usgMammaeLaporan", width: 40 },
      { header: "usgMammaeKesimpulan", key: "usgMammaeKesimpulan", width: 40 },
      {
        header: "usgAbdomenValidatorName",
        key: "usgAbdomenValidatorName",
        width: 25,
      },
      {
        header: "usgMammaeValidatorName",
        key: "usgMammaeValidatorName",
        width: 25,
      },

      // EKG
      { header: "ekgRhythm", key: "ekgRhythm", width: 20 },
      { header: "ekgQrsRate", key: "ekgQrsRate", width: 20 },
      { header: "ekgAxis", key: "ekgAxis", width: 20 },
      { header: "ekgPWave", key: "ekgPWave", width: 20 },
      { header: "ekgPrInterval", key: "ekgPrInterval", width: 20 },
      { header: "ekgQrsDuration", key: "ekgQrsDuration", width: 20 },
      { header: "ekgQWave", key: "ekgQWave", width: 20 },
      { header: "ekgTWave", key: "ekgTWave", width: 20 },
      { header: "ekgStChanges", key: "ekgStChanges", width: 20 },
      { header: "ekgOthers", key: "ekgOthers", width: 30 },
      { header: "ekgConclusion", key: "ekgConclusion", width: 30 },
      { header: "ekgAdvice", key: "ekgAdvice", width: 30 },
      { header: "ekgValidatorName", key: "ekgValidatorName", width: 25 },

      // Treadmill
      {
        header: "treadmillLamaLatihan",
        key: "treadmillLamaLatihan",
        width: 20,
      },
      {
        header: "treadmillKlasifikasiKebugaran",
        key: "treadmillKlasifikasiKebugaran",
        width: 25,
      },
      { header: "treadmillKerjaFisik", key: "treadmillKerjaFisik", width: 20 },
      {
        header: "treadmillKelasFungsional",
        key: "treadmillKelasFungsional",
        width: 25,
      },
      { header: "treadmillHasilTest", key: "treadmillHasilTest", width: 30 },
      { header: "treadmillSaran", key: "treadmillSaran", width: 30 },
      {
        header: "treadmillValidatorName",
        key: "treadmillValidatorName",
        width: 25,
      },

      // Rontgen
      { header: "kesanRontgen", key: "kesanRontgen", width: 40 },
      {
        header: "rontgenValidatorName",
        key: "rontgenValidatorName",
        width: 25,
      },

      // Kesimpulan Akhir
      { header: "kesimpulan", key: "kesimpulan", width: 40 },
      { header: "saran", key: "saran", width: 40 },
      {
        header: "conclusionValidatorName",
        key: "conclusionValidatorName",
        width: 25,
      },
    ];

    worksheet.getRow(1).font = { bold: true };

    reports.forEach((report) => {
      const healthHistory = flattenAnswers(report.healthHistoryAnswers);
      const dassResult =
        report.dassTestAnswers && (report.dassTestAnswers as any).result
          ? (report.dassTestAnswers as any).result
          : {};

      const fasRawAnswers = report.fasTestAnswers
        ? (report.fasTestAnswers as any)
        : {};
      const fasResult = calculateFasResult(fasRawAnswers);

      const fisik = flattenAnswers(report.pemeriksaanFisikForm);

      let bmiCategory = "";
      const bmiValue = Number(fisik.bmi);

      if (!isNaN(bmiValue) && bmiValue > 0) {
        bmiCategory = getBMICategory(bmiValue);
      }

      const { nik, fullName, patientId } = report.patient;

      const reportData = (({
        healthHistoryAnswers,
        dassTestAnswers,
        fasTestAnswers,
        pemeriksaanFisikForm,
        // patient,
        ...rest
      }) => rest)(report);

      worksheet.addRow({
        nik,
        fullName,
        patientId,
        ...reportData,
        ...dassResult,
        ...fasResult,
        ...healthHistory,
        ...fisik,
        bmi_category: bmiCategory,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `hasil-mcu-${companyId}-${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Gagal melakukan ekspor:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
