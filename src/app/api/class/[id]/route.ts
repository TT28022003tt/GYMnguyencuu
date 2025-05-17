import { getUser } from "@/utils/Auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser(request);
    if (!user || user.VaiTro !== "admin") {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
    }

    const idMaLH = parseInt(params.id);
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

    // Xóa lịch cũ
    await prisma.lichlophoc.deleteMany({
      where: { idMaLH },
    });

    // Cập nhật lớp học
    const updatedClass = await prisma.lophoc.update({
      where: { idMaLH },
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
      id: updatedClass.idMaLH,
      className: updatedClass.Ten || "N/A",
      startTime: updatedClass.ThoiGianBatDau?.toISOString() || "N/A",
      endTime: updatedClass.ThoiGianKetThuc?.toISOString() || "N/A",
      sessionDuration: updatedClass.ThoiLuong ? `${updatedClass.ThoiLuong} phút` : "N/A",
      location: updatedClass.Phong || "N/A",
      trainerName: updatedClass.huanluyenvien?.user?.Ten || "N/A",
      trainerEmail: updatedClass.huanluyenvien?.user?.Email || "N/A",
      photo: updatedClass.huanluyenvien?.user?.Anh || "/default-avatar.png",
      currentStudents: updatedClass.dangkylophoc.length,
      maxStudents: updatedClass.SoLuongMax || 0,
      fee: updatedClass.Phi ? `${parseFloat(updatedClass.Phi.toString()).toLocaleString("vi-VN")} VND` : "N/A",
      type: updatedClass.TheLoai || "N/A",
      status: updatedClass.TrangThai || "N/A",
      description: updatedClass.MoTa || "N/A",
      schedules: updatedClass.lichlophoc.map((lich) => ({
        day: lich.Thu,
        startTime: lich.GioBatDau,
      })),
    };

    return NextResponse.json(formattedClass, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi khi cập nhật lớp học" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const idLopHoc = parseInt(params.id);
    const idHocVien = (await prisma.hocvien.findFirst({
      where: { idUSER: user.idUser },
    }))?.idMaHV;

    if (!idHocVien) {
      return NextResponse.json({ error: "Học viên không tồn tại" }, { status: 404 });
    }

    const registration = await prisma.dangkylophoc.findFirst({
      where: { idLopHoc, idHocVien },
    });

    if (!registration) {
      return NextResponse.json({ error: "Bạn chưa đăng ký lớp học này" }, { status: 404 });
    }

    await prisma.dangkylophoc.delete({
      where: { id: registration.id },
    });

    // Fetch updated classes
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
      TrangThai: cls.TrangThai,
      huanluyenvien: cls.huanluyenvien,
      lichlophoc: cls.lichlophoc,
    }));

    // Fetch updated registered classes
    const updatedRegisteredClasses = await prisma.dangkylophoc.findMany({
      where: { idHocVien },
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
      TrangThai: reg.lophoc.TrangThai,
      huanluyenvien: reg.lophoc.huanluyenvien,
      lichlophoc: reg.lophoc.lichlophoc,
    }));

    return NextResponse.json(
      {
        message: "Hủy đăng ký thành công",
        updatedClasses: formattedClasses,
        updatedRegisteredClasses: formattedRegisteredClasses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to cancel registration" }, { status: 500 });
  }
}