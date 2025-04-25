import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET() {
  try {
    const hocvien = await prisma.hocvien.findMany({
      include: { user: { select: { Ten: true } } },
    });
    return NextResponse.json(
      hocvien.map((hv) => ({
        idMaHV: hv.idMaHV,
        Ten: hv.user?.Ten || "Không xác định",
      }))
    );
  } catch (error) {
    console.error("Error in /api/hocvien:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}