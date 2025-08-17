// app/api/mcu/reports/download/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createReadStream, promises as fs } from "fs";
import path from "path";

const prisma = new PrismaClient();

// Fungsi untuk menangani permintaan GET ke endpoint ini
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params; // Mendapatkan ID laporan dari URL

    if (!id) {
      return NextResponse.json(
        { message: "Report ID is required." },
        { status: 400 }
      );
    }

    const mcuResult = await prisma.mcuResult.findUnique({
      where: {
        id: id,
      },
    });

    if (!mcuResult || !mcuResult.fileUrl) {
      return NextResponse.json(
        { message: "Report not found or PDF not available." },
        { status: 404 }
      );
    }

    // Mengambil nama file dari fileUrl
    const filename = path.basename(mcuResult.fileUrl);

    // Periksa apakah file ada sebelum mencoba membacanya
    const filePath = path.join(
      process.cwd(),
      "public",
      "mcu-reports",
      filename
    );
    const fileExists = await fs
      .stat(filePath)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      return NextResponse.json(
        { message: "PDF file does not exist on the server." },
        { status: 404 }
      );
    }

    // Gunakan ReadableStream untuk membaca file
    const fileStream = createReadStream(filePath);

    // Ubah stream dari Node.js ke ReadableStream yang kompatibel dengan Web API
    const webStream = new ReadableStream({
      start(controller) {
        fileStream.on("data", (chunk) => {
          controller.enqueue(chunk);
        });
        fileStream.on("end", () => {
          controller.close();
        });
        fileStream.on("error", (err) => {
          controller.error(err);
        });
      },
      cancel() {
        fileStream.destroy();
      },
    });

    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);

    return new NextResponse(webStream, { headers });
  } catch (error) {
    console.error("API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
