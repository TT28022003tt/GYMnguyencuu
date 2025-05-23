import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";
import { getUser } from "@/utils/Auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user || user.VaiTro !== "admin") {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
    }

    const url = new URL(request.url);
    const idUser = parseInt(url.searchParams.get("idUser") || "0");

    if (!idUser) {
      return NextResponse.json({ error: "ID người dùng không hợp lệ" }, { status: 400 });
    }

    const existingMembership = await prisma.chitietgoitap.findFirst({
      where: {
        idUser,
        TinhTrang: 1, // Đang hoạt động
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: "Học viên này đã đăng ký gói tập và gói tập đang hoạt động" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Người dùng hợp lệ" }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi kiểm tra người dùng:", error);
    return NextResponse.json({ error: "Lỗi khi kiểm tra người dùng" }, { status: 500 });
  }
}