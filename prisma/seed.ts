import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  const prisma = new PrismaClient();

  console.log("Start seeding...");

  const adminAdministrasiRole = await prisma.role.upsert({
    where: { name: "ADMINISTRASI" },
    update: {},
    create: { name: "ADMINISTRASI" },
  });

  console.log("Roles created/verified.");

  const hashedPasswordAdministrasi = await bcrypt.hash("adminsimklinik", 10);
  await prisma.user.upsert({
    where: { email: "admin@simklinik.com" },
    update: {},
    create: {
      email: "admin@simklinik.com",
      fullName: "Admin Administrasi",
      password: hashedPasswordAdministrasi,
      roleId: adminAdministrasiRole.id,
    },
  });
  console.log("Admin created.");

  console.log("Seeding finished.");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
