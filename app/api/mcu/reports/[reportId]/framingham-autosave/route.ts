import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

type Params = Promise<{ reportId: string }>;

export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const { reportId } = await params;
    const framinghamData = await request.json();

    if (!reportId) {
      return NextResponse.json(
        { message: "ID Laporan tidak ditemukan." },
        { status: 400 }
      );
    }

    const dataToUpdate = {
      framinghamAge: framinghamData.framinghamAge || null,
      framinghamGender: framinghamData.framinghamGender || null,
      framinghamTotalCholesterol:
        framinghamData.framinghamTotalCholesterol || null,
      framinghamHdlCholesterol: framinghamData.framinghamHdlCholesterol || null,
      framinghamSystolicBp: framinghamData.framinghamSystolicBp || null,
      framinghamIsOnHypertensionTreatment:
        framinghamData.framinghamIsOnHypertensionTreatment || null,
      framinghamIsSmoker: framinghamData.framinghamIsSmoker || null,
      framinghamRiskPercentage: framinghamData.framinghamRiskPercentage || null,
      framinghamRiskCategory: framinghamData.framinghamRiskCategory || null,
      framinghamVascularAge: framinghamData.framinghamVascularAge || null,
      framinghamValidatorName: framinghamData.framinghamValidatorName || null,
      framinghamValidatorQr: framinghamData.framinghamValidatorQr || null,
    };

    await prisma.mcuResult.update({
      where: { id: reportId },
      data: dataToUpdate,
    });

    return NextResponse.json({
      message: "Framingham data auto-saved successfully.",
    });
  } catch (error) {
    console.error("Framingham Auto-Save Error:", error);
    return NextResponse.json(
      { message: "Gagal menyimpan data Framingham secara otomatis." },
      { status: 500 }
    );
  }
}
