import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Memulai script untuk mengisi data validator...");

  const allResults = await prisma.mcuResult.findMany({
    where: {
      pemeriksaanFisikForm: {
        not: Prisma.JsonNull,
      },
    },
    include: {
      progress: {
        include: {
          checkpoint: true,
        },
      },
    },
  });

  const resultsToUpdate = allResults.filter((result) => {
    const form = result.pemeriksaanFisikForm as any;
    return (
      typeof form === "object" &&
      form !== null &&
      !form.hasOwnProperty("fisikValidatorName")
    );
  });

  if (resultsToUpdate.length === 0) {
    console.log(
      "Tidak ada data lama yang perlu di-update. Semua sudah lengkap."
    );
    return;
  }

  console.log(
    `Ditemukan ${resultsToUpdate.length} data pasien yang akan di-update...`
  );
  let updatedCount = 0;

  for (const result of resultsToUpdate as any[]) {
    let fisikForm = result.pemeriksaanFisikForm;

    const fisikProgress = result.progress.find(
      (p: any) => p.checkpoint.slug === "pemeriksaan_fisik"
    );

    const petugasName = fisikProgress?.petugasName || "Validator Sistem";

    const qrData = `Validated by: ${petugasName}`;
    const validatorQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      qrData
    )}`;

    fisikForm.fisikValidatorName = petugasName;
    fisikForm.fisikValidatorQr = validatorQrUrl;

    await prisma.mcuResult.update({
      where: { id: result.id },
      data: {
        pemeriksaanFisikForm: fisikForm,
      },
    });

    updatedCount++;
    console.log(
      `(${updatedCount}/${resultsToUpdate.length}) Berhasil update McuResult ID: ${result.id}`
    );
  }

  console.log(`Selesai! ${updatedCount} data berhasil di-update.`);
}

main()
  .catch((e) => {
    console.error("Terjadi error saat menjalankan script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
