import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    const date = searchParams.get("date"); // Format YYYY-MM-DD

    if (!companyId) {
      return NextResponse.json({ message: "Company ID harus diisi" }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ message: "Tanggal harus diisi" }, { status: 400 });
    }

    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
        return NextResponse.json({ message: "Format tanggal tidak valid" }, { status: 400 });
    }

    // Set rentang waktu dari jam 00:00:00 sampai 23:59:59
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const results = await prisma.mcuResult.findMany({
      where: {
        AND: [
          {
            completedAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          {
            patient: {
              companyId: companyId,
            },
          },
        ],
      },
      select: {
        // Pilih data yang mau kamu export
        patient: {
          select: {
            patientId: true,
            nik: true,
            fullName: true,
            dob: true,
            age: true,
            gender: true,
            position: true,
            division: true,
            mcuPackage: true, // <-- INI YANG DITAMBAHKAN
          }
        },
        completedAt: true,
      }
    });

    return NextResponse.json(results);

  } catch (error) {
    console.error("Export Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}