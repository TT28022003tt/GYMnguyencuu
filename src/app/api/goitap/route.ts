import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET() {
  try {
    const goitap = await prisma.goitap.findMany({
      select: {
        idMaGT: true,
        Ten: true,
      },
    });

    if (!goitap.length) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(
      goitap.map((gt) => ({
        idMaGT: gt.idMaGT,
        Ten: gt.Ten || "Không xác định",
      }))
    );
  } catch (error) {
    console.error("Error in /api/goitap:", error);
    return NextResponse.json(
      { error: "Không thể lấy dữ liệu gói tập" },
      { status: 500 }
    );
  }
}