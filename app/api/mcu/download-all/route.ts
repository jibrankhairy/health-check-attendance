import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import archiver from "archiver"; // Library untuk membuat file ZIP
import { Readable } from "stream";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    const patientIdsString = searchParams.get("patientIds");

    if (!companyId || !patientIdsString) {
      return NextResponse.json(
        { message: "Company ID or specific patient IDs are required" },
        { status: 400 }
      );
    }

    const patientIds = patientIdsString
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    if (patientIds.length === 0) {
      return NextResponse.json(
        { message: "No valid patient IDs were found." },
        { status: 400 }
      );
    }

    let whereCondition: any = {};
    if (companyId) {
      whereCondition.patient = { companyId: companyId };
    }
    whereCondition.patientId = { in: patientIds };

    const mcuResults = await prisma.mcuResult.findMany({
      where: {
        ...whereCondition,
        fileUrl: {
          not: null,
        },
      },
      include: {
        patient: {
          select: {
            patientId: true,
            fullName: true,
            nik: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (mcuResults.length === 0) {
      return NextResponse.json(
        {
          message:
            "Tidak ada laporan MCU yang bisa diunduh (PDF belum tersedia).",
        },
        { status: 404 }
      );
    }

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    archive.on("data", (chunk) => writer.write(chunk));
    archive.on("end", () => writer.close());
    archive.on("error", (err) => writer.abort(err));

    const origin = request.nextUrl.origin;

    for (const result of mcuResults) {
      if (result.fileUrl) {
        try {
          // Menggunakan fileUrl yang sudah ada di database sebagai path
          // dan menggabungkannya dengan origin untuk membuat URL lengkap
          const pdfFetchUrl = `${origin}${result.fileUrl}`;
          console.log(`Fetching PDF from: ${pdfFetchUrl}`);
          const pdfResponse = await fetch(pdfFetchUrl);

          if (pdfResponse.ok) {
            const pdfBuffer = await pdfResponse.arrayBuffer();
            const filename = `Laporan_MCU_${
              result.patient?.fullName || "Pasien"
            }_${result.patient?.nik || result.id}.pdf`;
            archive.append(Buffer.from(pdfBuffer), { name: filename });
          } else {
            console.warn(
              `Failed to fetch PDF from ${pdfFetchUrl}: ${pdfResponse.statusText}`
            );
          }
        } catch (pdfFetchError) {
          console.error(
            `Error fetching PDF for MCU Result ID ${result.id}:`,
            pdfFetchError
          );
          // Tambahkan logika untuk mengirim pesan error ke console
          console.error(`URL yang Gagal: ${origin}${result.fileUrl}`);
        }
      }
    }

    archive.finalize();

    const headers = new Headers();
    headers.set("Content-Type", "application/zip");
    headers.set(
      "Content-Disposition",
      'attachment; filename="hasil_mcu_lengkap.zip"'
    );

    return new NextResponse(readable, { headers });
  } catch (error) {
    console.error("Download All Results Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
