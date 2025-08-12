import { NextResponse } from "next/server";

const CHECKPOINTS = [
  "Pemeriksaan Fisik",
  "Pemeriksaan Lab",
  "Pemeriksaan Radiologi",
  "Pemeriksaan Spirometry",
  "Pemeriksaan Audiometry",
  "Pemeriksaan EKG",
  "Pemeriksaan Treadmill",
  "Pemeriksaan Urin",
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
