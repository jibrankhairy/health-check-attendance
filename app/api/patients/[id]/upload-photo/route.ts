import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id: patientId } = params;
  const file = request.body || "";

  if (!patientId || !file) {
    return NextResponse.json(
      { message: "Data tidak lengkap." },
      { status: 400 }
    );
  }

  const filename = `patient_${patientId}_${Date.now()}.jpg`;

  try {
    const blob = await put(filename, file, {
      access: "public",
      contentType: "image/jpeg",
    });

    const updatedPatient = await prisma.patient.update({
      where: { id: Number(patientId) },
      data: {
        photoUrl: blob.url,
      },
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Gagal mengupload foto." },
      { status: 500 }
    );
  }
}
