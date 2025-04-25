import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../../../prisma/client";


// Khóa bí mật cho JWT (nên lưu trong .env)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: NextRequest) {
  try {
    const { TenDangNhap, MatKhau } = await req.json();

    // Kiểm tra nếu thiếu thông tin đăng nhập
    if (!TenDangNhap || !MatKhau) {
      return NextResponse.json(
        { error: "Tên đăng nhập và mật khẩu là bắt buộc" },
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
    const isPasswordValid = await bcrypt.compare(MatKhau, taikhoan.MatKhau! );
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
        VaiTro: taikhoan.VaiTro,
       
      },
      JWT_SECRET,
      { expiresIn: "1h" } // Token hết hạn sau 1 giờ
    );
	

    // Cập nhật token vào bảng taikhoan
    await prisma.taikhoan.update({
      where: {
        idMaTK: taikhoan.idMaTK,
      },
      data: {
        token, // Lưu token vào cột token
      },
    });

	const response = NextResponse.json(
		{
		  
		  token: token,
		  message: "Đăng nhập thành công",
		},
		{ status: 200 }
	  );
	
  
	  response.cookies.set("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60,
		path: "/",
		sameSite: "strict",
	  });
  
	  return response;

  } catch (error) {
    console.error("Error during signin:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi trong quá trình đăng nhập" },
      { status: 500 }
    );
  }
}