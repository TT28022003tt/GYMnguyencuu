import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

// Lấy chi tiết huấn luyện viên
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    const hlv = await prisma.huanluyenvien.findUnique({
      where: { idMaHLV: id },
      include: {
        user: true,
        danhgia: true,
        hocvien: true,
        lichlamviec: true,
        lichtap: true,
        loailophoc: true,
        lophoc: true,
        luong: true,
        phanhoi: true,
      },
    });

    if (!hlv) {
      return NextResponse.json({ error: "Không tìm thấy huấn luyện viên" }, { status: 404 });
    }

    return NextResponse.json(hlv);
  } catch (error) {
    console.error("Lỗi GET HLV:", error);
    return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  }
}

// Xoá huấn luyện viên
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    const existing = await prisma.huanluyenvien.findUnique({
      where: { idMaHLV: id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Huấn luyện viên không tồn tại" }, { status: 404 });
    }

    await prisma.huanluyenvien.delete({
      where: { idMaHLV: id },
    });

    return NextResponse.json({ message: "Đã xoá huấn luyện viên" });
  } catch (error) {
    console.error("Lỗi DELETE HLV:", error);
    return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  }
}
