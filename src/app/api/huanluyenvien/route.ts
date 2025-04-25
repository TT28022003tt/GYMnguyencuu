import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET() {
  try {
    const huanluyenvien = await prisma.huanluyenvien.findMany({
      include: { user: { select: { Ten: true } } },
    });
    return NextResponse.json(
      huanluyenvien.map((hlv) => ({
        idMaHLV: hlv.idMaHLV,
        Ten: hlv.user?.Ten || "Không xác định",
      }))
    );
  } catch (error) {
    console.error("Error in /api/huanluyenvien:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}