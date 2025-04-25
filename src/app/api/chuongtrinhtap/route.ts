import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET() {
  try {
    const chuongtrinhtap = await prisma.chuongtrinhtap.findMany({
      select: {
        idChuongTrinhTap: true,
        TenCTT: true,
      },
    });

    if (!chuongtrinhtap.length) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(
      chuongtrinhtap.map((ctt) => ({
        idMaCTT: ctt.idChuongTrinhTap,
        TenCTT: ctt.TenCTT || "Không xác định",
      }))
    );
  } catch (error) {
    console.error("Error in /api/chuongtrinhtap:", error);
    return NextResponse.json(
      { error: "Không thể lấy dữ liệu chương trình tập" },
      { status: 500 }
    );
  }
}