import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { format, subDays, startOfDay } from "date-fns";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    const { companyId } = params;

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
            progress: {
              select: {
                checkpoint: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const totalPatients = patientsInCompany.length;

    const genderCounts = patientsInCompany.reduce((acc, patient) => {
      const gender = patient.gender || "Lainnya";
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const genderDistribution = Object.entries(genderCounts).map(
      ([name, value]) => ({ name, value })
    );

    const packageCounts: { [key: string]: number } = {
      "MCU Regular": 0,
      "MCU Eksekutif": 0,
      "MCU Akhir": 0,
    };
    patientsInCompany.forEach((patient) => {
      if (patient.mcuPackage && Array.isArray(patient.mcuPackage)) {
        patient.mcuPackage.forEach((pkg) => {
          if (typeof pkg === "string" && packageCounts.hasOwnProperty(pkg)) {
            packageCounts[pkg]++;
          }
        });
      }
    });
    const packageDistribution = Object.keys(packageCounts).map((key) => ({
      name: key.replace("MCU ", ""),
      total: packageCounts[key],
    }));

    const dailyRegistrations: { [key: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");
      dailyRegistrations[date] = 0;
    }
    patientsInCompany.forEach((p) => {
      const registrationDate = format(
        startOfDay(new Date(p.createdAt)),
        "yyyy-MM-dd"
      );
      if (dailyRegistrations.hasOwnProperty(registrationDate)) {
        dailyRegistrations[registrationDate]++;
      }
    });
    const registrationByDate = Object.entries(dailyRegistrations).map(
      ([date, total]) => ({ name: format(new Date(date), "dd/MM"), total })
    );

    const progressCounts: { [key: string]: number } = {};
    patientsInCompany.forEach((patient) => {
      patient.mcuResults.forEach((result) => {
        result.progress.forEach((prog) => {
          const checkPointName = prog.checkpoint.name;
          progressCounts[checkPointName] =
            (progressCounts[checkPointName] || 0) + 1;
        });
      });
    });
    const progressDistribution = Object.entries(progressCounts)
      .map(([name, total]) => ({
        name,
        total,
      }))
      .sort((a, b) => b.total - a.total);

    const stats = {
      totalPatients,
      genderDistribution,
      packageDistribution,
      registrationByDate,
      progressDistribution,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Fetch Company Stats Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
