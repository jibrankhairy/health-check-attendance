import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Params = Promise<{ resultId: string }>;

export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const { resultId } = await params;
    const body = await request.json();

    if (body.formAnswers) {
      const { healthHistoryAnswers, dassTestAnswers, fasTestAnswers } =
        body.formAnswers;

      const updatedResult = await prisma.$transaction(async (tx) => {
        const result = await tx.mcuResult.update({
          where: { id: resultId },
          data: {
            healthHistoryAnswers,
            dassTestAnswers,
            fasTestAnswers,
            formSubmittedAt: new Date(),
          },
        });

        const psychologyCheckpoint = await tx.checkpoint.findUnique({
          where: { slug: "tes_psikologi" },
        });

        if (psychologyCheckpoint) {
          await tx.mcuProgress.upsert({
            where: {
              mcuResultId_checkpointId: {
                mcuResultId: resultId,
                checkpointId: psychologyCheckpoint.id,
              },
            },
            update: {
              status: "COMPLETED",
              petugasName: "Pasien (Online Form)",
              completedAt: new Date(),
            },
            create: {
              mcuResultId: resultId,
              checkpointId: psychologyCheckpoint.id,
              status: "COMPLETED",
              petugasName: "Pasien (Online Form)",
              completedAt: new Date(),
            },
          });
        }
        return result;
      });

      return NextResponse.json(updatedResult);
    }

    const { patient, id, createdAt, updatedAt, ...validData } = body;

    if (Array.isArray(validData.saran)) {
      validData.saran = JSON.stringify(validData.saran);
    }

    const isReportFinal = !!validData.kesimpulan;

    const dataToUpdate: any = {
      ...validData,
      status: isReportFinal ? "COMPLETED" : "IN_PROGRESS",
    };

    if (isReportFinal) {
      const pdfUrl = `/dashboard/reports/view/${resultId}`;
      dataToUpdate.fileUrl = pdfUrl;
    }

    const updatedResult = await prisma.mcuResult.update({
      where: { id: resultId },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedResult);
  } catch (error) {
    console.error("Update MCU Result Error:", error);
    let errorMessage = "Gagal menyimpan hasil MCU.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { message: "Gagal menyimpan hasil MCU.", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { resultId } = await params;
    const result = await prisma.mcuResult.findUnique({
      where: { id: resultId },
      include: {
        patient: { select: { fullName: true } },
        progress: { include: { checkpoint: { select: { slug: true } } } },
      },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch MCU Result Detail Error:", error);
    return NextResponse.json(
      { message: "Gagal memuat detail progres" },
      { status: 500 }
    );
  }
}
