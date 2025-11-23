import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp"; 

export const runtime = "nodejs"; 
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const prisma = new PrismaClient();

type Params = Promise<{ id: string }>;

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;

    const patientId = Number(id);
    if (!Number.isFinite(patientId)) {
      return NextResponse.json(
        { message: "ID pasien tidak valid." },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const maybeFile = formData.get("photo") ?? formData.get("file");

    if (!(maybeFile instanceof File)) {
      return NextResponse.json(
        {
          message:
            'File tidak ditemukan. Kirim field bernama "photo" (atau "file").',
        },
        { status: 400 }
      );
    }

    const file = maybeFile as File;
    const bytes = await file.arrayBuffer();
    const originalBuffer = Buffer.from(bytes);

    const compressedBuffer = await sharp(originalBuffer)
      .resize({ width: 500, withoutEnlargement: true }) 
      .jpeg({ quality: 80, progressive: true }) 
      .toBuffer();

    const base64 = compressedBuffer.toString("base64");
    
    const url = `data:image/jpeg;base64,${base64}`;

    const latestMcuResult = await prisma.mcuResult.findFirst({
      where: { patientId: patientId },
      orderBy: { createdAt: "desc" },
    });

    if (!latestMcuResult) {
      return NextResponse.json(
        { message: "Sesi MCU untuk pasien ini tidak ditemukan." },
        { status: 404 }
      );
    }

    const [updatedPatient] = await prisma.$transaction([
      prisma.patient.update({
        where: { id: patientId },
        data: { photoUrl: url },
        select: { id: true, photoUrl: true },
      }),
      prisma.mcuResult.update({
        where: { id: latestMcuResult.id },
        data: { completedAt: new Date() },
      }),
    ]);

    return NextResponse.json({
      message: "Upload berhasil (dikompresi) dan MCU ditandai selesai",
      patient: updatedPatient,
    });
  } catch (error: any) {
    console.error("Upload photo error:", error);
    return NextResponse.json(
      { message: "Gagal upload foto", error: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}