import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  const adminKlinikRole = await prisma.role.upsert({
    where: { name: "ADMINISTRASI" },
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
      fullName: "Super Admin Klinik",
      password: hashedPasswordAdmin,
      roleId: adminKlinikRole.id,
    },
  });
  console.log("Admin Klinik user created.");

  const checkpointsData = [
    { name: "Pemeriksaan Fisik", slug: "pemeriksaan_fisik" },
    { name: "Pemeriksaan Lab", slug: "pemeriksaan_lab" },
    { name: "Pemeriksaan Radiologi", slug: "pemeriksaan_radiologi" },
    { name: "Pemeriksaan Spirometry", slug: "pemeriksaan_spirometry" },
    { name: "Pemeriksaan Audiometry", slug: "pemeriksaan_audiometry" },
    { name: "Pemeriksaan EKG", slug: "pemeriksaan_ekg" },
    { name: "Pemeriksaan Treadmill", slug: "pemeriksaan_treadmill" },
    { name: "Pemeriksaan Urin", slug: "pemeriksaan_urin" },
    { name: "Pemeriksaan Psikologi", slug: "tes_psikologi" },
  ];

  for (const cp of checkpointsData) {
    await prisma.checkpoint.upsert({
      where: { slug: cp.slug },
      update: {},
      create: cp,
    });
  }
  console.log("Checkpoints created/verified.");

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
