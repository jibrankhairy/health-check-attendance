import { NextResponse, NextRequest } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { format, subDays, startOfDay } from "date-fns";

const prisma = new PrismaClient();

type RouteContext = { params: Promise<{ companyId: string }> };

type DassTestAnswers = {
  result: {
    dass_depression_level: string;
    dass_anxiety_level: string;
    dass_stress_level: string;
  };
};

type PemeriksaanFisikForm = {
  bmi?: number | string;
  tensiSistol?: number | string;
  tensiDiastol?: number | string;
  butaWarna?: "NORMAL" | "ABNORMAL";
};

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { companyId } = await params;

    if (!companyId) {
      return NextResponse.json(
        { message: "Company ID is required" },
        { status: 400 }
      );
    }

    const patientsInCompany = await prisma.patient.findMany({
      where: { companyId },
      include: {
        mcuResults: {
          include: {
            progress: {
              include: {
                checkpoint: true,
              },
            },
          },
        },
      },
    });

    const totalPatients = patientsInCompany.length;

    const genderCounts = patientsInCompany.reduce((acc, p) => {
      const g = p.gender || "Lainnya";
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const genderDistribution = Object.entries(genderCounts).map(
      ([name, value]) => ({ name, value })
    );

    const packageCounts: Record<string, number> = {
      "MCU Regular": 0,
      "MCU Eksekutif": 0,
      "MCU Akhir": 0,
    };
    patientsInCompany.forEach((p) => {
      if (Array.isArray(p.mcuPackage)) {
        p.mcuPackage.forEach((pkg) => {
          if (typeof pkg === "string" && pkg in packageCounts)
            packageCounts[pkg]++;
        });
      }
    });
    const packageDistribution = Object.keys(packageCounts).map((key) => ({
      name: key.replace("MCU ", ""),
      total: packageCounts[key],
    }));

    const dailyRegistrations: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");
      dailyRegistrations[date] = 0;
    }
    patientsInCompany.forEach((p) => {
      const d = format(startOfDay(new Date(p.createdAt)), "yyyy-MM-dd");
      if (d in dailyRegistrations) dailyRegistrations[d]++;
    });
    const registrationByDate = Object.entries(dailyRegistrations).map(
      ([date, total]) => ({ name: format(new Date(date), "dd/MM"), total })
    );

    const dassLevels = ["Normal", "Ringan", "Sedang", "Parah", "Sangat Parah"];
    const dassResultTemplate = () => ({ Depresi: 0, Cemas: 0, Stres: 0 });
    const dassCountsByLevel: Record<
      string,
      { Depresi: number; Cemas: number; Stres: number }
    > = Object.fromEntries(
      dassLevels.map((level) => [level, dassResultTemplate()])
    );

    const healthIssuesCounts = {
      "Kolesterol Tinggi": 0,
      "Gula Darah Tinggi": 0,
      "Asam Urat Tinggi": 0,
      Obesitas: 0,
      Hipertensi: 0,
      "Buta Warna": 0,
      Anemia: 0,
    };

    const progressCounts: Record<string, number> = {};

    for (const patient of patientsInCompany) {
      for (const result of patient.mcuResults) {
        result.progress?.forEach((prog) => {
          const checkpoint = prog.checkpoint?.name ?? "Unknown";
          progressCounts[checkpoint] = (progressCounts[checkpoint] || 0) + 1;
        });

        const dassAnswers = result.dassTestAnswers as DassTestAnswers | null;
        if (dassAnswers && dassAnswers.result) {
          const {
            dass_depression_level,
            dass_anxiety_level,
            dass_stress_level,
          } = dassAnswers.result;
          if (dass_depression_level && dassCountsByLevel[dass_depression_level])
            dassCountsByLevel[dass_depression_level].Depresi++;
          if (dass_anxiety_level && dassCountsByLevel[dass_anxiety_level])
            dassCountsByLevel[dass_anxiety_level].Cemas++;
          if (dass_stress_level && dassCountsByLevel[dass_stress_level])
            dassCountsByLevel[dass_stress_level].Stres++;
        }

        const fisikForm =
          result.pemeriksaanFisikForm as unknown as PemeriksaanFisikForm | null;

        if (fisikForm) {
          if (fisikForm.bmi && Number(fisikForm.bmi) >= 30) {
            healthIssuesCounts["Obesitas"]++;
          }
          if (
            fisikForm.tensiSistol &&
            fisikForm.tensiDiastol &&
            (Number(fisikForm.tensiSistol) >= 140 ||
              Number(fisikForm.tensiDiastol) >= 90)
          ) {
            healthIssuesCounts["Hipertensi"]++;
          }
          if (fisikForm.butaWarna === "ABNORMAL") {
            healthIssuesCounts["Buta Warna"]++;
          }
        }

        if (Number(result.kolesterolTotal) > 200)
          healthIssuesCounts["Kolesterol Tinggi"]++;
        if (Number(result.gulaDarahPuasa) > 115)
          healthIssuesCounts["Gula Darah Tinggi"]++;
        const asamUrat = Number(result.asamUrat);
        const gender = patient.gender?.toUpperCase();
        if (gender === "LAKI-LAKI" && asamUrat > 7.0)
          healthIssuesCounts["Asam Urat Tinggi"]++;
        if (gender === "PEREMPUAN" && asamUrat > 5.7)
          healthIssuesCounts["Asam Urat Tinggi"]++;
        const hemoglobin = Number(result.hemoglobin);
        if (gender === "LAKI-LAKI" && hemoglobin < 14.0)
          healthIssuesCounts["Anemia"]++;
        if (gender === "PEREMPUAN" && hemoglobin < 12.0)
          healthIssuesCounts["Anemia"]++;
      }
    }

    const dassDistribution = dassLevels.map((level) => ({
      name: level,
      ...dassCountsByLevel[level],
    }));
    const healthIssuesDistribution = Object.entries(healthIssuesCounts)
      .map(([name, total]) => ({ name, total }))
      .filter((item) => item.total > 0)
      .sort((a, b) => b.total - a.total);
    const progressDistribution = Object.entries(progressCounts)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);

    return NextResponse.json({
      totalPatients,
      genderDistribution,
      packageDistribution,
      registrationByDate,
      progressDistribution,
      dassDistribution,
      healthIssuesDistribution,
    });
  } catch (error) {
    console.error("Fetch Company Stats Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
