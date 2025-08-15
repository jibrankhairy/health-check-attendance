// app/api/mcu/kartu-kontrol/[mcuResultId]/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import QRCode from 'qrcode';
import { KartuKontrolDocument } from "@/components/mcu/report/KartuKontrolDocument";

const prisma = new PrismaClient();

type RouteParams = { mcuResultId: string };

export async function GET(
  request: Request,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { mcuResultId } = await params;

    if (!mcuResultId) {
      return new NextResponse("MCU Result ID tidak ditemukan.", { status: 400 });
    }

    const mcuResult = await prisma.mcuResult.findUnique({
      where: { id: mcuResultId },
      include: {
        patient: true,
      },
    });

    if (!mcuResult || !mcuResult.patient) {
      return new NextResponse("Data MCU atau Pasien tidak ditemukan.", { status: 404 });
    }
    
    // ======================================================================
    // === TAMBAHAN DEBUGGING DI SINI ===
    // Kita akan print isi data mcuResult ke terminal untuk diperiksa
    console.log("DATA DARI DATABASE:", JSON.stringify(mcuResult, null, 2));
    // ======================================================================

    const qrCodeData = JSON.stringify({ mcuResultId: mcuResult.id });
    const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

    const safePatientData = {
      fullName: mcuResult.patient.fullName || "N/A",
      patientId: mcuResult.patient.patientId || "N/A",
      location: mcuResult.patient.location || "", 
      mcuPackage: Array.isArray(mcuResult.patient.mcuPackage) ? mcuResult.patient.mcuPackage : [],
    };

    const pdfData = {
      patient: safePatientData,
      qrCodeUrl: qrCodeUrl,
    };

    const stream = await renderToStream(
      React.createElement(KartuKontrolDocument, { data: pdfData })
    );

    const fileName = `kartu_kontrol_${safePatientData.fullName.replace(/\s/g, '_')}.pdf`;

    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error("Gagal generate Kartu Kontrol:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}