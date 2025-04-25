import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

// Lấy chi tiết 1 user
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { idUser: id },
      include: {
        hocvien: true,
        huanluyenvien: true,
        taikhoan: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Lỗi GET user:", error);
    return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  }
}

// Xoá user
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    // Kiểm tra tồn tại
    const existingUser = await prisma.user.findUnique({ where: { idUser: id } });

    if (!existingUser) {
      return NextResponse.json({ error: "Người dùng không tồn tại" }, { status: 404 });
    }

    // Xoá các quan hệ liên kết trước nếu cần (nếu không dùng `onDelete: Cascade`)
    await prisma.taikhoan.deleteMany({ where: { idMaTK: id } });
    await prisma.hocvien.deleteMany({ where: { MaHLV: id } });
    await prisma.huanluyenvien.deleteMany({ where: { idUser: id } });

    // Xoá user chính
    await prisma.user.delete({ where: { idUser: id } });

    return NextResponse.json({ message: "Đã xoá người dùng" });
  } catch (error) {
    console.error("Lỗi DELETE user:", error);
    return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  }
}
