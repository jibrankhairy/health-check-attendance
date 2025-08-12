// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diunggah." }, { status: 400 });
    }

    // Ubah nama file agar unik dengan timestamp
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
    
    // Simpan file di folder public/uploads
    const uploadPath = path.join(process.cwd(), "public/uploads", filename);
    await writeFile(uploadPath, buffer);
    console.log(`File tersimpan di: ${uploadPath}`);

    // Kembalikan URL publik dari file tersebut
    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: publicUrl });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat mengunggah file." }, { status: 500 });
  }
}