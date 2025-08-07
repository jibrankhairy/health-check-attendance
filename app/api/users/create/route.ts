import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const prisma = new PrismaClient();

// Skema validasi untuk API endpoint
const createUserSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["PETUGAS"]), // Saat ini hanya menerima PETUGAS
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Data tidak valid.", errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { fullName, email, password, role } = validation.data;

    // Cek apakah email sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar." },
        { status: 409 }
      );
    }

    // Cari ID untuk role yang diminta
    const roleData = await prisma.role.findUnique({ where: { name: role } });
    if (!roleData) {
      throw new Error(`Role '${role}' tidak ditemukan. Jalankan seeder.`);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru di database
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        roleId: roleData.id,
        // companyId akan otomatis null karena tidak disediakan
      },
    });

    // Jangan kirim password hash ke client
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Create User Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}