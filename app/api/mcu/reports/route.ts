import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const packageToDbFieldMapping: { [key: string]: string } = {
  "Pemeriksaan Fisik": "pemeriksaanFisikStatus",
  "Darah Lengkap": "darahLengkapStatus",
  "Kimia Darah": "kimiaDarahStatus",
  Treadmill: "treadmillStatus",
  "Tes Psikologi": "tesPsikologiStatus",
  Hematologi: "hematologiStatus",
  "Rontgen Thorax": "rontgenThoraxStatus",
  Audiometri: "audiometriStatus",
  "Framingham Score": "framinghamScoreStatus",
  Urinalisa: "urinalisaStatus",
  "EKG (Elektrokardiogram)": "ekgStatus",
  Spirometri: "spirometriStatus",
  "USG Mammae": "usgMammaeStatus",
  "USG Abdomen": "usgAbdomenStatus",
};

export async function GET() {
  console.log("\n--- [API DEBUG] Memulai Fetch Laporan MCU ---");
  try {
    const allRelevantResults = await prisma.mcuResult.findMany({
      where: {
        OR: [{ status: "COMPLETED" }, { status: "IN_PROGRESS" }],
      },
      include: {
        patient: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    console.log(
      `[API DEBUG] Menemukan ${allRelevantResults.length} data dengan status IN_PROGRESS atau COMPLETED.`
    );

    const finalResults = allRelevantResults.filter((result) => {
      console.log(
        `\n[API DEBUG] Mengecek pasien: ${result.patient?.fullName} (Status Utama: ${result.status})`
      );

      if (result.status === "COMPLETED") {
        console.log("  -> Lolos: Status utama sudah COMPLETED.");
        return true;
      }

      if (!result.patient || !Array.isArray(result.patient.mcuPackage)) {
        console.log("  -> Gagal: Data pasien atau paket MCU tidak ada.");
        return false;
      }
      const patientPackage = result.patient.mcuPackage as string[];
      console.log("  -> Paket yang dimiliki pasien:", patientPackage);

      if (patientPackage.length === 0) {
        console.log("  -> Gagal: Daftar paket pasien kosong.");
        return false;
      }

      const isAllCompleted = patientPackage.every((packageName) => {
        const dbField = packageToDbFieldMapping[packageName];
        if (!dbField) {
          console.log(
            `    - GAGAL: Paket "${packageName}" tidak ada di dalam mapping sistem.`
          );
          return false;
        }

        // @ts-ignore
        const packageStatus = result[dbField];
        const check = packageStatus === "COMPLETED";

        if (check) {
          console.log(
            `    - OK: Paket "${packageName}" statusnya adalah "${packageStatus}".`
          );
        } else {
          console.log(
            `    - GAGAL: Paket "${packageName}" statusnya "${packageStatus}", seharusnya "COMPLETED".`
          );
        }
        return check;
      });

      if (isAllCompleted) {
        console.log("  -> Lolos: Semua paket pemeriksaan sudah COMPLETED.");
      } else {
        console.log("  -> Gagal: Ada paket pemeriksaan yang belum COMPLETED.");
      }

      return isAllCompleted;
    });

    console.log(
      `\n--- [API DEBUG] Selesai. Mengirim ${finalResults.length} data ke depan. ---\n`
    );
    return NextResponse.json(finalResults);
  } catch (error) {
    console.error("[API DEBUG] Terjadi error saat fetch laporan:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
