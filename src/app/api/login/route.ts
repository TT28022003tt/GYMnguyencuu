import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../../../prisma/client";

// Khóa bí mật cho JWT (nên lưu trong .env)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: NextRequest) {
  try {
    const { TenDangNhap, MatKhau } = await req.json();

    // Kiểm tra các trường bắt buộc và định dạng
    if (!TenDangNhap || !MatKhau) {
      return NextResponse.json(
        { error: "Tên đăng nhập và mật khẩu là bắt buộc" },
        { status: 400 }
      );
    }
    if (TenDangNhap.length < 3 || MatKhau.length < 6) {
      return NextResponse.json(
        { error: "Tên đăng nhập phải có ít nhất 3 ký tự và mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    // Tìm tài khoản dựa trên TenDangNhap
    const taikhoan = await prisma.taikhoan.findFirst({
      where: {
        TenDangNhap,
      },
      include: {
        user: true,
      },
    });

    // Nếu không tìm thấy tài khoản
    if (!taikhoan) {
      return NextResponse.json(
        { error: "Tên đăng nhập hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(MatKhau, taikhoan.MatKhau!);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Tên đăng nhập hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        idMaTK: taikhoan.idMaTK,
        idUser: taikhoan.idUser,
        VaiTro: taikhoan.VaiTro,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Cập nhật token vào bảng taikhoan
    await prisma.taikhoan.update({
      where: {
        idMaTK: taikhoan.idMaTK,
      },
      data: {
        token,
      },
    });

    // Trả về phản hồi với thông tin user cơ bản
    const response = NextResponse.json(
      {
        token,
        message: "Đăng nhập thành công",
        user: {
          idUser: taikhoan.user.idUser,
          Ten: taikhoan.user.Ten,
          Email: taikhoan.user.Email,
          VaiTro: taikhoan.VaiTro,
        },
      },
      { status: 200 }
    );

    // Thiết lập cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 giờ
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Error during signin:", error);
    // Phân loại lỗi cụ thể hơn
    if (error instanceof Error && error.message.includes("Prisma")) {
      return NextResponse.json(
        { error: "Lỗi cơ sở dữ liệu, vui lòng thử lại sau" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Đã xảy ra lỗi trong quá trình đăng nhập" },
      { status: 500 }
    );
  }
}