import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { getUser } from "@/utils/Auth";
import { writeFile } from "fs/promises";
import path from "path";


export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const userData = await prisma.user.findUnique({
      where: { idUser: user.idUser },
      include: { taikhoan: true },
    });

    if (!userData) {
      return NextResponse.json({ error: "Người dùng không tồn tại" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        idUser: userData.idUser,
        Ten: userData.Ten,
        NgaySinh: userData.NgaySinh?.toISOString().split("T")[0],
        GioiTinh: userData.GioiTinh,
        DiaChi: userData.DiaChi,
        SoDienThoai: userData.SoDienThoai,
        Email: userData.Email,
        Anh: userData.Anh,
        VaiTro: userData.taikhoan[0]?.VaiTro,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}



export async function PUT(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const formData = await req.formData();
    const Ten = formData.get("Ten") as string;
    const NgaySinh = formData.get("NgaySinh") as string;
    const GioiTinh = formData.get("GioiTinh") as string;
    const DiaChi = formData.get("DiaChi") as string;
    const SoDienThoai = formData.get("SoDienThoai") as string;
    const Email = formData.get("Email") as string;
    const Anh = formData.get("Anh") as File | null;

    // Validate
    if (!Ten || !SoDienThoai || !Email) {
      return NextResponse.json(
        { error: "Tên, số điện thoại và email là bắt buộc" },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
      return NextResponse.json({ error: "Email không hợp lệ" }, { status: 400 });
    }
    if (!/^\d{10,11}$/.test(SoDienThoai)) {
      return NextResponse.json(
        { error: "Số điện thoại phải có 10 hoặc 11 chữ số" },
        { status: 400 }
      );
    }
    if (GioiTinh && !["0", "1"].includes(GioiTinh)) {
      return NextResponse.json(
        { error: "Giới tính phải là 0 (Nữ) hoặc 1 (Nam)" },
        { status: 400 }
      );
    }

    // Kiểm tra email trùng lặp
    const existingEmail = await prisma.user.findFirst({
      where: { Email, idUser: { not: user.idUser } },
    });
    if (existingEmail) {
      return NextResponse.json({ error: "Email đã được sử dụng" }, { status: 409 });
    }

    // Xử lý upload ảnh
    let anhPath: string | undefined;
    if (Anh && Anh.size > 0) {
      const buffer = Buffer.from(await Anh.arrayBuffer());
      const filename = `${user.idUser}-${Date.now()}${path.extname(Anh.name)}`;
      const uploadPath = path.join(process.cwd(), "public", "uploads", filename);
      await writeFile(uploadPath, buffer);
      anhPath = `/uploads/${filename}`;
    }

    // Cập nhật user
    const updatedUser = await prisma.user.update({
      where: { idUser: user.idUser },
      data: {
        Ten,
        NgaySinh: NgaySinh ? new Date(NgaySinh) : null,
        GioiTinh: GioiTinh ? Number(GioiTinh) : undefined,
        DiaChi: DiaChi || null,
        SoDienThoai,
        Email,
        Anh: anhPath || undefined,
      },
    });

    return NextResponse.json({
      message: "Cập nhật thành công",
      user: {
        idUser: updatedUser.idUser,
        Ten: updatedUser.Ten,
        NgaySinh: updatedUser.NgaySinh?.toISOString().split("T")[0],
        GioiTinh: updatedUser.GioiTinh,
        DiaChi: updatedUser.DiaChi,
        SoDienThoai: updatedUser.SoDienThoai,
        Email: updatedUser.Email,
        Anh: updatedUser.Anh,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}