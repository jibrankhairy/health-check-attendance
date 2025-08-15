import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const companyId = searchParams.get("companyId") || undefined;
    const search = searchParams.get("search") || undefined;
    const page = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || 10);

    if (!companyId) {
      return NextResponse.json({
        data: [],
        meta: { page: 1, pageSize, total: 0, totalPages: 1 },
      });
    }

    // --- PERBAIKAN DI BAGIAN 'where' ---
    const where = {
      patient: { companyId },
      ...(search
        ? {
            OR: [
              {
                patient: {
                  // 'mode: "insensitive"' dihapus
                  fullName: { contains: search },
                },
              },
              {
                patient: {
                  // 'mode: "insensitive"' dihapus
                  patientId: { contains: search },
                },
              },
              // 'mode: "insensitive"' dihapus
              { status: { contains: search } },
            ],
          }
        : {}),
    };

    const [total, reports] = await Promise.all([
      prisma.mcuResult.count({ where }),
      prisma.mcuResult.findMany({
        where,
        select: {
          id: true,
          updatedAt: true,
          status: true,
          patient: {
            select: {
              id: true,
              patientId: true,
              fullName: true,
              company: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return NextResponse.json({
      data: reports,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    });
  } catch (error) {
    console.error("Fetch MCU Reports Error:", error);
    const msg =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}