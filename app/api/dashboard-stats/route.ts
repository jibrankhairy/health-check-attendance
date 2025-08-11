import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { format, subDays, startOfDay } from "date-fns";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [totalPatients, totalCompanies, allPatients] = await Promise.all([
      prisma.patient.count(),
      prisma.company.count(),
      prisma.patient.findMany({
        select: {
          gender: true,
          mcuPackage: true,
          location: true,
          createdAt: true,
        },
      }),
    ]);

    const genderCounts = allPatients.reduce((acc, patient) => {
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
    allPatients.forEach((patient) => {
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
    allPatients.forEach((p) => {
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

    const locationCounts = allPatients.reduce((acc, patient) => {
      const location = patient.location || "Tidak Diketahui";
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const locationDistribution = Object.entries(locationCounts)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
    const stats = {
      totalPatients,
      totalCompanies,
      genderDistribution,
      packageDistribution,
      registrationByDate,
      locationDistribution,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Fetch Dashboard Stats Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
