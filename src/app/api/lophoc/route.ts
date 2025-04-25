import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET() {
  try {
    const lophoc = await prisma.lophoc.findMany({
      select: {
        idMaLH: true,
        Ten: true,
      },
    });

    if (!lophoc.length) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(
      lophoc.map((lh) => ({
        idMaLH: lh.idMaLH,
        Ten: lh.Ten || "Không xác định",
      }))
    );
  } catch (error) {
    console.error("Error in /api/lophoc:", error);
    return NextResponse.json(
      { error: "Không thể lấy dữ liệu lớp học" },
      { status: 500 }
    );
  }
}