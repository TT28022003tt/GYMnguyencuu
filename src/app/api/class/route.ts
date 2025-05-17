import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { getUser } from "@/utils/Auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    if (userId) {
      const hocVien = await prisma.hocvien.findFirst({
        where: { idUSER: parseInt(userId) },
      });

      if (!hocVien) {
        return NextResponse.json({ error: "Học viên không tồn tại" }, { status: 404 });
      }

      const registeredClasses = await prisma.dangkylophoc.findMany({
        where: { idHocVien: hocVien.idMaHV },
        include: {
          lophoc: {
            include: {
              huanluyenvien: {
                select: { user: { select: { Ten: true } } },
              },
              lichlophoc: true,
              dangkylophoc:true,
            },
          },
        },
      });

      const formattedClasses = registeredClasses.map((reg) => ({
        idMaLH: reg.lophoc.idMaLH,
        Ten: reg.lophoc.Ten,
        TheLoai: reg.lophoc.TheLoai,
        Phong: reg.lophoc.Phong,
        ThoiGianBatDau: reg.lophoc.ThoiGianBatDau?.toISOString(),
        ThoiGianKetThuc: reg.lophoc.ThoiGianKetThuc?.toISOString(),
        Phi: reg.lophoc.Phi ? parseFloat(reg.lophoc.Phi.toString()) : null,
        SoLuong: reg.lophoc.dangkylophoc.length,
        SoLuongMax: reg.lophoc.SoLuongMax,
        TrangThai: reg.lophoc.TrangThai,
        huanluyenvien: reg.lophoc.huanluyenvien,
        lichlophoc: reg.lophoc.lichlophoc,
      }));

      return NextResponse.json(formattedClasses);
    } else {
      const classes = await prisma.lophoc.findMany({
        where: { TrangThai: "Đang mở" },
        include: {
          huanluyenvien: {
            select: { user: { select: { Ten: true } } },
          },
          lichlophoc: true,
          dangkylophoc: { select: { id: true } },
        },
      });

      const formattedClasses = classes.map((cls) => ({
        idMaLH: cls.idMaLH,
        Ten: cls.Ten,
        TheLoai: cls.TheLoai,
        Phong: cls.Phong,
        ThoiGianBatDau: cls.ThoiGianBatDau?.toISOString(),
        ThoiGianKetThuc: cls.ThoiGianKetThuc?.toISOString(),
        Phi: cls.Phi ? parseFloat(cls.Phi.toString()) : null,
        SoLuong: cls.dangkylophoc.length,
        SoLuongMax: cls.SoLuongMax,
        TrangThai: cls.TrangThai,
        huanluyenvien: cls.huanluyenvien,
        lichlophoc: cls.lichlophoc,
      }));

      return NextResponse.json(formattedClasses);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { idLopHoc } = await request.json();

    // Truy xuất idHocVien từ idUser
    const hocVien = await prisma.hocvien.findFirst({
      where: { idUSER: user.idUser },
    });

    if (!hocVien) {
      return NextResponse.json({ error: "Học viên không tồn tại" }, { status: 404 });
    }

    const idHocVien = hocVien.idMaHV;

    const classItem = await prisma.lophoc.findUnique({
      where: { idMaLH: idLopHoc },
      include: { dangkylophoc: { select: { id: true } } },
    });

    if (!classItem || classItem.TrangThai !== "Đang mở") {
      return NextResponse.json({ error: "Lớp học không tồn tại hoặc đã đóng" }, { status: 400 });
    }

    const soLuong = classItem.dangkylophoc.length;
    if (soLuong >= classItem.SoLuongMax!) {
      return NextResponse.json({ error: "Lớp học đã đầy" }, { status: 400 });
    }

    const existingRegistration = await prisma.dangkylophoc.findFirst({
      where: { idHocVien, idLopHoc },
    });

    if (existingRegistration) {
      return NextResponse.json({ error: "Bạn đã đăng ký lớp học này" }, { status: 400 });
    }

    const registration = await prisma.dangkylophoc.create({
      data: {
        idHocVien,
        idLopHoc,
        NgayDangKy: new Date(),
      },
    });

    const updatedClasses = await prisma.lophoc.findMany({
      where: { TrangThai: "Đang mở" },
      include: {
        huanluyenvien: {
          select: { user: { select: { Ten: true } } },
        },
        lichlophoc: true,
        dangkylophoc: { select: { id: true } },
      },
    });

    const formattedClasses = updatedClasses.map((cls) => ({
      idMaLH: cls.idMaLH,
      Ten: cls.Ten,
      TheLoai: cls.TheLoai,
      Phong: cls.Phong,
      ThoiGianBatDau: cls.ThoiGianBatDau?.toISOString(),
      ThoiGianKetThuc: cls.ThoiGianKetThuc?.toISOString(),
      Phi: cls.Phi ? parseFloat(cls.Phi.toString()) : null,
      SoLuong: cls.dangkylophoc.length,
      SoLuongMax: cls.SoLuongMax,
      TrangThai: cls.TrangThai || "Đang mở",
      huanluyenvien: cls.huanluyenvien,
      lichlophoc: cls.lichlophoc,
    }));

    const updatedRegisteredClasses = await prisma.dangkylophoc.findMany({
      where: { idHocVien },
      include: {
        lophoc: {
          include: {
            huanluyenvien: {
              select: { user: { select: { Ten: true } } },
            },
            lichlophoc: true,
            dangkylophoc: { select: { id: true } },
          },
        },
      },
    });

    const formattedRegisteredClasses = updatedRegisteredClasses.map((reg) => ({
      idMaLH: reg.lophoc.idMaLH,
      Ten: reg.lophoc.Ten,
      TheLoai: reg.lophoc.TheLoai,
      Phong: reg.lophoc.Phong,
      ThoiGianBatDau: reg.lophoc.ThoiGianBatDau?.toISOString(),
      ThoiGianKetThuc: reg.lophoc.ThoiGianKetThuc?.toISOString(),
      Phi: reg.lophoc.Phi ? parseFloat(reg.lophoc.Phi.toString()) : null,
      SoLuong: reg.lophoc.dangkylophoc.length,
      SoLuongMax: reg.lophoc.SoLuongMax,
      TrangThai: reg.lophoc.TrangThai || "Đang mở",
      huanluyenvien: reg.lophoc.huanluyenvien,
      lichlophoc: reg.lophoc.lichlophoc,
    }));

    return NextResponse.json(
      {
        registration,
        updatedClasses: formattedClasses,
        updatedRegisteredClasses: formattedRegisteredClasses,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to register class" }, { status: 500 });
  }
}