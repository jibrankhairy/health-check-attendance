import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 1. Buat semua role yang dibutuhkan
  const adminKlinikRole = await prisma.role.upsert({
    where: { name: "ADMINISTRASIK" },
    update: {},
    create: { name: "ADMINISTRASI" },
  });

  const petugasRole = await prisma.role.upsert({
    where: { name: "PETUGAS" },
    update: {},
    create: { name: "PETUGAS" },
  });

  const hrdRole = await prisma.role.upsert({
    where: { name: "HRD" },
    update: {},
    create: { name: "HRD" },
  });

  console.log("Roles (ADMINISTRASI, PETUGAS, HRD) created/verified.");

  const hashedPasswordAdmin = await bcrypt.hash("adminklinik123", 10);
  await prisma.user.upsert({
    where: { email: "admin@klinikym.com" },
    update: {},
    create: {
      email: "admin@klinikym.com",
      fullName: "Admin Klinik Utama",
      password: hashedPasswordAdmin,
      roleId: adminKlinikRole.id,
      // companyId dikosongkan karena dia admin klinik
    },
  });
  console.log("Admin Klinik user created.");

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
