import { getUser } from "@/utils/Auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser(request);
    if (!user || user.VaiTro !== "admin") {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
    }

    const idMaLH = parseInt(params.id);
    const classItem = await prisma.lophoc.findUnique({
      where: { idMaLH },
      include: {
        huanluyenvien: {
          include: { user: { select: { Ten: true, Email: true, Anh: true } } },
        },
        dangkylophoc: {
          include: {
            hocvien: {
              include: {
                user: { select: { Ten: true, Email: true, SoDienThoai: true, NgaySinh: true, GioiTinh: true, Anh: true } },
              },
            },
          },
        },
        lichlophoc: true,
      },
    });

    if (!classItem) {
      return NextResponse.json({ error: "Lớp học không tồn tại" }, { status: 404 });
    }

    const formattedClass = {
      id: classItem.idMaLH,
      className: classItem.Ten || "N/A",
      startTime: classItem.ThoiGianBatDau?.toISOString() || "N/A",
      endTime: classItem.ThoiGianKetThuc?.toISOString() || "N/A",
      sessionDuration: classItem.ThoiLuong ? `${classItem.ThoiLuong} phút` : "N/A",
      location: classItem.Phong || "N/A",
      trainerName: classItem.huanluyenvien?.user?.Ten || "N/A",
      trainerEmail: classItem.huanluyenvien?.user?.Email || "N/A",
      photo: classItem.huanluyenvien?.user?.Anh || "/images/default-avatar.png",
      currentStudents: classItem.dangkylophoc.length,
      maxStudents: classItem.SoLuongMax || 0,
      fee: classItem.Phi ? `${parseFloat(classItem.Phi.toString()).toLocaleString("vi-VN")} VND` : "N/A",
      type: classItem.TheLoai || "N/A",
      status: classItem.TrangThai || "N/A",
      description: classItem.MoTa || "N/A",
      schedules: classItem.lichlophoc.map((lich) => ({
        day: lich.Thu,
        startTime: lich.GioBatDau,
      })),
      students: classItem.dangkylophoc.map((reg) => ({
        id: reg.hocvien.idMaHV,
        name: reg.hocvien.user.Ten || "N/A",
        email: reg.hocvien.user.Email || "N/A",
        phone: reg.hocvien.user.SoDienThoai || "N/A",
        birthDate: reg.hocvien.user.NgaySinh?.toISOString() || "N/A",
        gender: reg.hocvien.user.GioiTinh === 1 ? "Nam" : reg.hocvien.user.GioiTinh === 0 ? "Nữ" : "N/A",
        photo: reg.hocvien.user.Anh || "/images/default-avatar.png",
        registrationDate: reg.NgayDangKy?.toISOString() || "N/A",
      })),
    };

    return NextResponse.json(formattedClass, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi khi lấy chi tiết lớp học" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser(request);
    if (!user || user.VaiTro !== "admin") {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
    }

    const idMaLH = parseInt(params.id);
    const classItem = await prisma.lophoc.findUnique({
      where: { idMaLH },
    });

    if (!classItem) {
      return NextResponse.json({ error: "Lớp học không tồn tại" }, { status: 404 });
    }

    await prisma.lophoc.delete({
      where: { idMaLH },
    });

    return NextResponse.json({ message: "Xóa lớp học thành công" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi khi xóa lớp học" }, { status: 500 });
  }
}