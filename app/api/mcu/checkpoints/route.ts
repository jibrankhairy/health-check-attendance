import { NextResponse } from "next/server";

// Daftar pos pemeriksaan diperbarui sesuai dengan screenshot
const CHECKPOINTS = [
  "Pemeriksaan Fisik",
  "Darah Lengkap",
  "Kimia Darah",
  "Treadmill",
  "Tes Psikologi",
  "Hematologi",
  "Rontgen Thorax",
  "Audiometri",
  "Framingham Score",
  "Urinalisa",
  "EKG (Elektrokardiogram)",
  "Spirometri",
];

export async function GET() {
  try {
    return NextResponse.json(CHECKPOINTS);
  } catch (error) {
    console.error("Fetch Checkpoints Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}