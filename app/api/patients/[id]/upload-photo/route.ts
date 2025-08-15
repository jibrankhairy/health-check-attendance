import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";

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

    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { message: "Ukuran file terlalu besar. Maksimal 10MB." },
        { status: 413 }
      );
    }

    const ext = file.name?.split(".").pop() ?? "";
    const keyBase = `patients/${patientId}/${Date.now()}`;
    const objectName = ext ? `${keyBase}.${ext}` : keyBase;

    const { url } = await put(objectName, file, {
      access: "public",
      contentType: file.type || undefined,
      addRandomSuffix: true,
    });

    const updated = await prisma.patient.update({
      where: { id: patientId },
      data: { photoUrl: url },
      select: { id: true, photoUrl: true },
    });

    return NextResponse.json({
      message: "Upload berhasil",
      patient: updated,
    });
  } catch (error: any) {
    console.error("Upload photo error:", error);
    return NextResponse.json(
      { message: "Gagal upload foto", error: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}
