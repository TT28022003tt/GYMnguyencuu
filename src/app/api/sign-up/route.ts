import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../../../prisma/client";

// Khóa bí mật cho JWT (nên lưu trong .env)
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "your-secret-key";

export async function POST(req: NextRequest) {
  try {
    const {
      TenDangNhap,
      MatKhau,
      Ten,
      NgaySinh,
      GioiTinh,
      DiaChi,
      SoDienThoai,
      Email,
    } = await req.json();

    // Kiểm tra các trường bắt buộc
    if (!TenDangNhap || !MatKhau || !Ten || !Email || !SoDienThoai) {
      return NextResponse.json(
        { error: "Tên đăng nhập, mật khẩu, họ tên, email và số điện thoại là bắt buộc" },
        { status: 400 }
      );
    }

    // Validate định dạng
    if (TenDangNhap.length < 3 || MatKhau.length < 6) {
      return NextResponse.json(
        { error: "Tên đăng nhập phải có ít nhất 3 ký tự và mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
      return NextResponse.json(
        { error: "Email không hợp lệ" },
        { status: 400 }
      );
    }
    if (!/^\d{10,11}$/.test(SoDienThoai)) {
      return NextResponse.json(
        { error: "Số điện thoại phải có 10 hoặc 11 chữ số" },
        { status: 400 }
      );
    }
    if (GioiTinh !== undefined && ![0, 1].includes(Number(GioiTinh))) {
      return NextResponse.json(
        { error: "Giới tính phải là 0 (Nữ) hoặc 1 (Nam)" },
        { status: 400 }
      );
    }

    // Kiểm tra trùng lặp
    const existingAccount = await prisma.taikhoan.findUnique({
      where: { TenDangNhap },
    });
    if (existingAccount) {
      return NextResponse.json(
        { error: "Tên đăng nhập đã tồn tại" },
        { status: 409 }
      );
    }
    const existingEmail = await prisma.user.findFirst({
      where: { Email },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email đã được sử dụng" },
        { status: 409 }
      );
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(MatKhau, 10);

    // Tạo bản ghi user và taikhoan
    const newUser = await prisma.user.create({
      data: {
        Ten,
        NgaySinh: NgaySinh ? new Date(NgaySinh) : null,
        GioiTinh: GioiTinh !== undefined ? Number(GioiTinh) : 1,
        DiaChi: DiaChi || null,
        SoDienThoai,
        Email,
        taikhoan: {
          create: {
            TenDangNhap,
            MatKhau: hashedPassword,
            VaiTro: "HocVien",
          },
        },
      },
      include: {
        taikhoan: true,
      },
    });

    console.log("Creating hocvien with data:", {
      idUSER: newUser.idUser,
      NgayDangKy: new Date(),
      MaHLV: 1,
    });
    const newHocVien = await prisma.hocvien.create({
      data: {
        idUSER: newUser.idUser,
        NgayDangKy: new Date(),
      },
    });
    console.log("HocVien created:", newHocVien);

    // Tạo JWT token
    const token = jwt.sign(
      {
        idMaTK: newUser.taikhoan[0].idMaTK,
        idUser: newUser.idUser,
        VaiTro: newUser.taikhoan[0].VaiTro,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Cập nhật token vào bảng taikhoan
    await prisma.taikhoan.update({
      where: {
        idMaTK: newUser.taikhoan[0].idMaTK,
      },
      data: {
        token,
      },
    });

    // Trả về phản hồi
    const response = NextResponse.json(
      {
        token,
        message: "Đăng ký thành công",
        user: {
          idUser: newUser.idUser,
          Ten: newUser.Ten,
          Email: newUser.Email,
          VaiTro: newUser.taikhoan[0].VaiTro,
        },
      },
      { status: 201 }
    );

    // Thiết lập cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60,
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Error during signup:", error);
    if (error instanceof Error && error.message.includes("Prisma")) {
      return NextResponse.json(
        { error: "Lỗi cơ sở dữ liệu, vui lòng thử lại sau" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Đã xảy ra lỗi trong quá trình đăng ký" },
      { status: 500 }
    );
  }
}