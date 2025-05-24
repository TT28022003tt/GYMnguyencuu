import { Readable } from "stream";
import prisma from "../../../../../../prisma/client";
import cloudinary from "@/app/lib/cloudinary";
import { NextResponse } from "next/server";

interface TrainerInfo {
  idMaHLV: number;
  chungChi?: string;
  bangCap?: string;
  chuyenMon?: string;
  luong?: number ;
}

interface StudentInfo {
  idMaHV: number;
  ngayDangKy?: string ;
  maHLV?: number;
}

interface AccountInfo {
  TenDangNhap: string;
  vaiTro: string;
}

interface UserDetail {
  idUser: number;
  ten: string;
  ngaySinh: string;
  gioiTinh: number;
  diaChi?: string;
  soDienThoai?: string;
  email?: string;
  anh: string;
  role: string;
  status: string;
  trainerInfo?: TrainerInfo;
  studentInfo?: StudentInfo;
  accountInfo?: AccountInfo;
}

async function parseFormData(req: Request) {
  const formData = await req.formData();
  const data: { [key: string]: any } = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  return data;
}
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id);

    const user = await prisma.user.findUnique({
      where: { idUser: userId },
      include: {
        taikhoan: { select: { TenDangNhap: true, VaiTro: true } },
        huanluyenvien: {
          select: { idMaHLV: true, ChungChi: true, BangCap: true, ChuyeMon: true, Luong: true },
        },
        hocvien: { select: { idMaHV: true, NgayDangKy: true, MaHLV: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
    }

    const formattedUser: UserDetail = {
      idUser: user.idUser,
      ten: user.Ten || "N/A",
      ngaySinh: user.NgaySinh ? user.NgaySinh.toISOString().split("T")[0] : "N/AA",
      gioiTinh: user.GioiTinh||1,
      diaChi: user.DiaChi||"N/A",
      soDienThoai: user.SoDienThoai||"N/A",
      email: user.Email||"N/A",
      anh: user.Anh || "/images/default-avatar.png",
      role: user.taikhoan[0]?.VaiTro || (user.huanluyenvien.length > 0 ? "trainer" : user.hocvien.length > 0 ? "HocVien" : "admin"),
      status: user.taikhoan[0]?.VaiTro ? "Active" : "Inactive",
      trainerInfo: user.huanluyenvien.length > 0
        ? {
            idMaHLV: user.huanluyenvien[0].idMaHLV,
            chungChi: user.huanluyenvien[0].ChungChi?? undefined,
            bangCap: user.huanluyenvien[0].BangCap?? undefined,
            chuyenMon: user.huanluyenvien[0].ChuyeMon?? undefined,
            luong: user.huanluyenvien[0].Luong ? parseFloat(user.huanluyenvien[0].Luong.toString()) : undefined,
          }
        : undefined,
      studentInfo: user.hocvien.length > 0
        ? {
            idMaHV: user.hocvien[0].idMaHV,
            ngayDangKy: user.hocvien[0].NgayDangKy
              ? user.hocvien[0].NgayDangKy.toISOString().split("T")[0]
              :undefined,
            maHLV: user.hocvien[0].MaHLV ?? undefined,
          }
        : undefined,
      accountInfo: user.taikhoan[0]
        ? {
            TenDangNhap: user.taikhoan[0].TenDangNhap ?? "",
            vaiTro: user.taikhoan[0].VaiTro?? "HocVien",
          }
        :undefined,
    };

    return NextResponse.json(formattedUser);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await parseFormData(req);
    const {
      id,
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

    let photoUrl = photo as string;
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

      const existingUser = await prisma.user.findUnique({ where: { idUser: parseInt(id as string) } });
      if (existingUser?.Anh && !existingUser.Anh.includes("default-avatar")) {
        const publicId = existingUser.Anh.split("/").pop()?.split(".")[0];
        await cloudinary.uploader.destroy(`users/${publicId}`);
      }
    }

    await prisma.user.update({
      where: { idUser: parseInt(id as string) },
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

    const existingAccount = await prisma.taikhoan.findFirst({
      where: { idUser: parseInt(id as string) },
    });

    if (existingAccount) {
      await prisma.taikhoan.update({
        where: { idMaTK: existingAccount.idMaTK },
        data: {
          TenDangNhap: TenDangNhap as string,
          MatKhau: password ? (password as string) : existingAccount.MatKhau,
          VaiTro: role as string,
        },
      });
    } else {
      await prisma.taikhoan.create({
        data: {
          TenDangNhap: TenDangNhap as string,
          MatKhau: password as string,
          VaiTro: role as string,
          idUser: parseInt(id as string),
        },
      });
    }

    const existingTrainer = await prisma.huanluyenvien.findFirst({
      where: { idUser: parseInt(id as string) },
    });
    const existingStudent = await prisma.hocvien.findFirst({
      where: { idUSER: parseInt(id as string) },
    });

    if (role === "trainer" && !existingTrainer) {
      await prisma.huanluyenvien.create({
        data: { idUser: parseInt(id as string) },
      });
      if (existingStudent) {
        await prisma.hocvien.delete({
          where: { idMaHV: existingStudent.idMaHV },
        });
      }
    } else if (role === "HocVien" && !existingStudent) {
      await prisma.hocvien.create({
        data: { idUSER: parseInt(id as string) },
      });
      if (existingTrainer) {
        await prisma.huanluyenvien.delete({
          where: { idMaHLV: existingTrainer.idMaHLV },
        });
      }
    } else if (role === "admin") {
      if (existingTrainer) {
        await prisma.huanluyenvien.delete({
          where: { idMaHLV: existingTrainer.idMaHLV },
        });
      }
      if (existingStudent) {
        await prisma.hocvien.delete({
          where: { idMaHV: existingStudent.idMaHV },
        });
      }
    }

    return NextResponse.json({ message: "Cập nhật người dùng thành công" });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.user.delete({
      where: { idUser: id },
    });
    return NextResponse.json({ message: "Xóa người dùng thành công" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}