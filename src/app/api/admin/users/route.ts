import { NextResponse } from "next/server";
import { Readable } from "stream";
import prisma from "../../../../../prisma/client";
import cloudinary from "@/app/lib/cloudinary";

async function parseFormData(req: Request) {
  const formData = await req.formData();
  const data: { [key: string]: any } = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  return data;
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        taikhoan: { select: { TenDangNhap: true, VaiTro: true } },
        huanluyenvien: true,
        hocvien: true,
      },
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await parseFormData(req);
    const {
      TenDangNhap,
      password,
      fullName,
      email,
      phone,
      address,
      birthDate,
      role,
      sex,
      photo,
    } = formData;

    let photoUrl = "/images/default-avatar.png";
    if (photo instanceof File) {
      const buffer = Buffer.from(await photo.arrayBuffer());
      const stream = Readable.from(buffer);
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "users" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.pipe(uploadStream);
      });
      photoUrl = (uploadResult as any).secure_url;
    } else if (typeof photo === "string") {
      photoUrl = photo;
    }

    const user = await prisma.user.create({
      data: {
        Ten: fullName as string,
        NgaySinh: birthDate ? new Date(birthDate as string) : null,
        GioiTinh: sex === "male" ? 1 : 0,
        DiaChi: address as string | null,
        SoDienThoai: phone as string | null,
        Email: email as string,
        Anh: photoUrl,
      },
    });

    await prisma.taikhoan.create({
      data: {
        TenDangNhap: TenDangNhap as string,
        MatKhau: password as string,
        VaiTro: role as string,
        idUser: user.idUser,
      },
    });

    if (role === "trainer") {
      await prisma.huanluyenvien.create({
        data: { idUser: user.idUser },
      });
    } else if (role === "HocVien") {
      await prisma.hocvien.create({
        data: { idUSER: user.idUser },
      });
    }

    return NextResponse.json({ id: user.idUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}