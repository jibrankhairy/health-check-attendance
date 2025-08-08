import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const mcuResult = await prisma.mcuResult.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!mcuResult) {
      return NextResponse.json(
        { message: "Data MCU Pasien tidak ditemukan." },
        { status: 404 }
      );
    }
    return NextResponse.json(mcuResult);
  } catch (error) {
    console.error("Fetch MCU Result Detail Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (body.formAnswers) {
      const { healthHistoryAnswers, dassTestAnswers, fasTestAnswers } =
        body.formAnswers;

      const updatedResult = await prisma.mcuResult.update({
        where: { id },
        data: {
          healthHistoryAnswers,
          dassTestAnswers,
          fasTestAnswers,
          formSubmittedAt: new Date(),
        },
      });
      return NextResponse.json(updatedResult);
    } else {
      const cleanedData: { [key: string]: any } = {};

      const dataToUpdate = {
        ...cleanedData,
      };

      const updatedMcuResult = await prisma.mcuResult.update({
        where: { id },
        data: dataToUpdate,
      });
      return NextResponse.json(updatedMcuResult);
    }
  } catch (error) {
    console.error("Update MCU Result Error:", error);
    return NextResponse.json(
      {
        message: "Gagal menyimpan data ke database.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
