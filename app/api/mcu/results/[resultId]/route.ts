import { NextResponse } from "next/server";
import { PrismaClient, McuResult } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { resultId: string } }
) {
  try {
    const { resultId } = params;
    const body = await request.json();

    if (body.formAnswers) {
      const { healthHistoryAnswers, dassTestAnswers, fasTestAnswers } =
        body.formAnswers;
      const dataToUpdate = {
        healthHistoryAnswers: healthHistoryAnswers,
        dassTestAnswers: dassTestAnswers,
        fasTestAnswers: fasTestAnswers,
        formSubmittedAt: new Date(),
        status: "COMPLETED",
      };

      const updatedResult = await prisma.mcuResult.update({
        where: { id: resultId },
        data: dataToUpdate,
      });
      return NextResponse.json(updatedResult);
    }

    const { patient, id, createdAt, updatedAt, ...validData } = body;

    if (Array.isArray(validData.saran)) {
      validData.saran = JSON.stringify(validData.saran);
    }

    const dataToUpdate = {
      ...validData,
      status: "COMPLETED",
    };

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

export async function GET(
  request: Request,
  { params }: { params: { resultId: string } }
) {
  try {
    const { resultId } = params;
    const result = await prisma.mcuResult.findUnique({
      where: { id: resultId },
      include: {
        patient: true,
      },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    let saranAsArray: any[] = [];
    if (result.saran && typeof result.saran === "string") {
      try {
        saranAsArray = JSON.parse(result.saran);
      } catch (e) {
        console.error("Gagal parse JSON untuk field saran:", e);
      }
    }

    const responseData = {
      ...result,
      saran: saranAsArray,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Fetch MCU Result Detail Error:", error);
    return NextResponse.json(
      { message: "Gagal memuat detail progres" },
      { status: 500 }
    );
  }
}
