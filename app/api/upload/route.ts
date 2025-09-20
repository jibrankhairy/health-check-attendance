import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada file yang diunggah." },
        { status: 400 }
      );
    }

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const filename = `mcu/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const blob = await put(filename, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: file.type, // <-- [TAMBAHAN] Baris ini ditambahkan
      });
      return NextResponse.json({ url: blob.url });
    }

    // Bagian untuk lokal development, tidak perlu diubah, sudah benar.
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;

    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });

    const uploadPath = path.join(dir, filename);
    await writeFile(uploadPath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengunggah file." },
      { status: 500 }
    );
  }
}