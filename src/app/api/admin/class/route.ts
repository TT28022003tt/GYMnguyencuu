import { getUser } from "@/utils/Auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";


export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Chưa Đăng Nhập" }, { status: 401 });
    }

    if (!user || user.VaiTro !== "admin") {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
    }

    const classes = await prisma.lophoc.findMany({
      include: {
        huanluyenvien: {
          include: { user: { select: { Ten: true, Email: true, Anh: true } } },
        },
        dangkylophoc: { select: { id: true } },
        lichlophoc: true,
      },
    });

    const formattedClasses = classes.map((cls) => ({
      id: cls.idMaLH,
      className: cls.Ten || "N/A",
      startTime: cls.ThoiGianBatDau?.toISOString() || "N/A",
      endTime: cls.ThoiGianKetThuc?.toISOString() || "N/A",
      sessionDuration: cls.ThoiLuong ? `${cls.ThoiLuong} phút` : "N/A",
      location: cls.Phong || "N/A",
      idMaHLV: cls.idMaHLV || 1,
      trainerName: cls.huanluyenvien?.user?.Ten || "N/A",
      trainerEmail: cls.huanluyenvien?.user?.Email || "N/A",
      photo: cls.huanluyenvien?.user?.Anh || "/images/default-avatar.png",
      currentStudents: cls.dangkylophoc.length,
      maxStudents: cls.SoLuongMax || 0,
      fee: cls.Phi ? `${parseFloat(cls.Phi.toString()).toLocaleString("vi-VN")} VND` : "N/A",
      type: cls.TheLoai || "N/A",
      status: cls.TrangThai || "N/A",
      description: cls.MoTa || "N/A",
      schedules: cls.lichlophoc.map((lich) => ({
        day: lich.Thu,
        startTime: lich.GioBatDau,
      })),
    }));

    return NextResponse.json(formattedClasses, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi khi lấy danh sách lớp học" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user || user.VaiTro !== "admin") {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
    }

    const {
      Ten,
      Phong,
      MoTa,
      TheLoai,
      SoLuongMax,
      Phi,
      TrangThai,
      ThoiLuong,
      ThoiGianBatDau,
      ThoiGianKetThuc,
      idMaHLV,
      lichlophoc,
    } = await request.json();

    const newClass = await prisma.lophoc.create({
      data: {
        Ten,
        Phong,
        MoTa,
        TheLoai,
        SoLuongMax,
        Phi,
        TrangThai,
        ThoiLuong,
        ThoiGianBatDau: ThoiGianBatDau ? new Date(ThoiGianBatDau) : undefined,
        ThoiGianKetThuc: ThoiGianKetThuc ? new Date(ThoiGianKetThuc) : undefined,
        idMaHLV,
        lichlophoc: {
          create: lichlophoc?.map((lich: { Thu: number; GioBatDau: string }) => ({
            Thu: lich.Thu,
            GioBatDau: lich.GioBatDau,
          })),
        },
      },
      include: {
        huanluyenvien: {
          include: { user: { select: { Ten: true, Email: true, Anh: true } } },
        },
        dangkylophoc: { select: { id: true } },
        lichlophoc: true,
      },
    });

    const formattedClass = {
      id: newClass.idMaLH,
      className: newClass.Ten || "N/A",
      startTime: newClass.ThoiGianBatDau?.toISOString() || "N/A",
      endTime: newClass.ThoiGianKetThuc?.toISOString() || "N/A",
      sessionDuration: newClass.ThoiLuong ? `${newClass.ThoiLuong} phút` : "N/A",
      location: newClass.Phong || "N/A",
      trainerName: newClass.huanluyenvien?.user?.Ten || "N/A",
      trainerEmail: newClass.huanluyenvien?.user?.Email || "N/A",
      photo: newClass.huanluyenvien?.user?.Anh || "/default-avatar.png",
      currentStudents: newClass.dangkylophoc.length,
      maxStudents: newClass.SoLuongMax || 0,
      fee: newClass.Phi ? `${parseFloat(newClass.Phi.toString()).toLocaleString("vi-VN")} VND` : "N/A",
      type: newClass.TheLoai || "N/A",
      status: newClass.TrangThai || "N/A",
      description: newClass.MoTa || "N/A",
      schedules: newClass.lichlophoc.map((lich) => ({
        day: lich.Thu,
        startTime: lich.GioBatDau,
      })),
    };

    return NextResponse.json(formattedClass, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi khi tạo lớp học" }, { status: 500 });
  }
}