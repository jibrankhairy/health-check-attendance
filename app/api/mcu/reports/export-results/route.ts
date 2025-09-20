import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as ExcelJS from "exceljs";

const prisma = new PrismaClient();

const flattenAnswers = (answers: any): Record<string, any> => {
  if (answers && typeof answers === "object" && !Array.isArray(answers)) {
    return answers;
  }
  return {};
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
    // FIX 1: Mengubah 'category' menjadi 'fas_category'
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
    // FIX 2: Mengubah 'category' menjadi 'fas_category'
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

  // Bagian ini sudah benar dari awal
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
        formSubmittedAt: { not: null },
      },
      select: {
        healthHistoryAnswers: true,
        dassTestAnswers: true,
        fasTestAnswers: true,
        pemeriksaanFisikForm: true,
        patient: { select: { nik: true, fullName: true } },
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

      // Data Form Lainnya
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

      worksheet.addRow({
        ...report.patient,
        ...dassResult,
        ...fasResult,
        ...healthHistory,
        ...fisik,
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
