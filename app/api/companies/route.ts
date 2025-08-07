import { NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const prisma = new PrismaClient();

async function generateUniqueCompanyId(
  tx: Prisma.TransactionClient
): Promise<string> {
  let isUnique = false;
  let companyId = "";

  while (!isUnique) {
    const randomId = Math.floor(1000 + Math.random() * 9000).toString();

    const existingCompany = await tx.company.findUnique({
      where: { id: randomId },
    });

    if (!existingCompany) {
      isUnique = true;
      companyId = randomId;
    }
  }
  return companyId;
}

const createCompanySchema = z.object({
  companyName: z.string().min(3, "Nama perusahaan minimal 3 karakter"),
  companyAddress: z.string().optional(),
  hrdFullName: z.string().min(3, "Nama lengkap HRD minimal 3 karakter"),
  hrdEmail: z.string().email("Format email HRD tidak valid"),
  hrdPassword: z.string().min(8, "Password HRD minimal 8 karakter"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createCompanySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { companyName, companyAddress, hrdFullName, hrdEmail, hrdPassword } =
      validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email: hrdEmail },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email HRD sudah terdaftar." },
        { status: 409 }
      );
    }

    const hrdRole = await prisma.role.findUnique({ where: { name: "HRD" } });
    if (!hrdRole) {
      throw new Error("Role 'HRD' tidak ditemukan. Jalankan seeder.");
    }

    const hashedPassword = await bcrypt.hash(hrdPassword, 10);

    const newCompanyAndUser = await prisma.$transaction(async (tx) => {
      const uniqueCompanyId = await generateUniqueCompanyId(tx);

      const newCompany = await tx.company.create({
        data: {
          id: uniqueCompanyId,
          name: companyName,
          address: companyAddress,
        },
      });

      const newUser = await tx.user.create({
        data: {
          fullName: hrdFullName,
          email: hrdEmail,
          password: hashedPassword,
          roleId: hrdRole.id,
          companyId: newCompany.id,
        },
      });

      return { newCompany, newUser };
    });

    return NextResponse.json(newCompanyAndUser, { status: 201 });
  } catch (error) {
    console.error("Create Company Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      include: {
        _count: {
          select: { patients: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(companies);
  } catch (error) {
    console.error("Fetch Companies Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
