import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { format, subDays, startOfDay } from "date-fns";

const prisma = new PrismaClient();

type RouteContext = { params: Promise<{ companyId: string }> };

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
      select: {
        gender: true,
        mcuPackage: true,
        createdAt: true,
        mcuResults: {
          select: {
            progress: { select: { checkpoint: { select: { name: true } } } },
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

    const progressCounts: Record<string, number> = {};
    patientsInCompany.forEach((p) => {
      p.mcuResults?.forEach((r) => {
        r.progress?.forEach((prog) => {
          const checkpoint = prog.checkpoint?.name ?? "Unknown";
          progressCounts[checkpoint] = (progressCounts[checkpoint] || 0) + 1;
        });
      });
    });
    const progressDistribution = Object.entries(progressCounts)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);

    return NextResponse.json({
      totalPatients,
      genderDistribution,
      packageDistribution,
      registrationByDate,
      progressDistribution,
    });
  } catch (error) {
    console.error("Fetch Company Stats Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
