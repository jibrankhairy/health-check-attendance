import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const checkpoints = await prisma.checkpoint.findMany({
      where: {
        slug: {
          not: "tes_psikologi",
        },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(checkpoints);
  } catch (error) {
    console.error("Fetch Checkpoints Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
