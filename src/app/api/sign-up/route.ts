import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
export async function POST(req:NextRequest){
	const {TenDangNhap,MatKhau,Ten,GioiTinh,DiaChi,SoDienThoai,Email}= await req.json();

	const existingUser = await prisma.taikhoan.findFirst({
		where: { TenDangNhap },
	  });
	  if (existingUser) {
		return NextResponse.json(
		  { error: "Tên đăng nhập đã tồn tại" },
		  { status: 409 }
		);
	  }


	const hashPassword = await bcrypt.hash(MatKhau,10)
	const user = await prisma.user.create({
		data:{
			Ten,
			DiaChi,
			Email,
			GioiTinh: GioiTinh ? parseInt(GioiTinh) : null,
			SoDienThoai,
			taikhoan:{
				create:{
					TenDangNhap,
					MatKhau:hashPassword,
					VaiTro:"hocvien"
				}
			}
			
			
		},
		include:{
			taikhoan:true,
		}
	})

	const token = jwt.sign(
		{
		  userId: user.idUser,
		  VaiTro: user.taikhoan[0].VaiTro,
		},
		JWT_SECRET,
		{ expiresIn: "1h" } // Token hết hạn sau 1 giờ
	  );

	  await prisma.taikhoan.update({
		where:{
			idMaTK:user.taikhoan[0].idMaTK
		},
		data:{
			token:token
		}
	  })
	return NextResponse.json({token},{status:201})
}
