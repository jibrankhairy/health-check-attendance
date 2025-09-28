import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const allSaranTemplates = await prisma.mcuSaranTemplate.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const saranList = allSaranTemplates.map((item) => item.text);

    return NextResponse.json(saranList);
  } catch (error) {
    console.error("Failed to fetch mcu saran templates:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== "string" || text.trim() === "") {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const trimmedText = text.trim();

    const existingSaran = await prisma.mcuSaranTemplate.findFirst({
      where: { text: { equals: trimmedText } },
    });

    if (existingSaran) {
      return NextResponse.json(
        { message: "Saran already exists" },
        { status: 200 }
      );
    }

    const newSaran = await prisma.mcuSaranTemplate.create({
      data: {
        text: trimmedText,
      },
    });

    return NextResponse.json(newSaran, { status: 201 });
  } catch (error) {
    console.error("Failed to create mcu saran template:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}