import { NextResponse } from "next/server";
import sharp from "sharp"; 

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

    const bytes = await file.arrayBuffer();
    const originalBuffer = Buffer.from(bytes);

    let finalBase64String = "";
    let finalMimeType = file.type;

    if (file.type.startsWith("image/")) {
      try {
        const compressedBuffer = await sharp(originalBuffer)
          .resize({ width: 1024, withoutEnlargement: true })
          .jpeg({ quality: 80, progressive: true })
          .toBuffer();

        finalBase64String = compressedBuffer.toString("base64");
        finalMimeType = "image/jpeg";
      } catch (err) {
        console.error("Gagal kompresi, fallback ke original:", err);
        finalBase64String = originalBuffer.toString("base64");
      }
    } else {
      finalBase64String = originalBuffer.toString("base64");
    }

    const dataUrl = `data:${finalMimeType};base64,${finalBase64String}`;

    return NextResponse.json({ url: dataUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengunggah file." },
      { status: 500 }
    );
  }
}