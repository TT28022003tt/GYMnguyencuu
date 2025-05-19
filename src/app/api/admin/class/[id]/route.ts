import { getUser } from "@/utils/Auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";
import { z } from "zod";


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
const scheduleSchema = z.object({
  Thu: z.number().min(1).max(7, { message: "Thứ phải từ 1 đến 7" }),
  GioBatDau: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Giờ bắt đầu phải định dạng HH:mm" }),
});

const schema = z.object({
  Ten: z.string().min(1, { message: "Tên lớp là bắt buộc" }),
  Phong: z.string().optional(),
  MoTa: z.string().optional(),
  TheLoai: z.string().optional(),
  SoLuongMax: z.number().min(1, { message: "Số lượng tối đa phải lớn hơn 0" }),
  Phi: z.number().min(0, { message: "Phí không được âm" }).optional(),
  TrangThai: z.enum(["Đang mở", "Đã đóng", "Hủy"], { message: "Trạng thái không hợp lệ" }),
  ThoiLuong: z.number().min(0, { message: "Thời lượng không được âm" }).optional(),
  ThoiGianBatDau: z.string().min(1, { message: "Thời gian bắt đầu là bắt buộc" }),
  ThoiGianKetThuc: z.string().min(1, { message: "Thời gian kết thúc là bắt buộc" }),
  idMaHLV: z.number().min(1, { message: "Huấn luyện viên là bắt buộc" }),
  lichlophoc: z.array(scheduleSchema).min(1, { message: "Phải có ít nhất một lịch học" }),
});

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Kiểm tra quyền admin
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Chưa Đăng Nhập" }, { status: 401 });
    }
    if (user.VaiTro !== "admin") {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();

    // Validate dữ liệu
    const parsedData = schema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: parsedData.error.errors },
        { status: 400 }
      );
    }

    const data = parsedData.data;

    // Kiểm tra lớp học tồn tại
    const existingClass = await prisma.lophoc.findUnique({
      where: { idMaLH: parseInt(id) },
    });
    if (!existingClass) {
      return NextResponse.json({ error: "Lớp học không tồn tại" }, { status: 404 });
    }

    // Kiểm tra HLV tồn tại
    const trainer = await prisma.huanluyenvien.findUnique({
      where: { idMaHLV: data.idMaHLV },
    });
    if (!trainer) {
      return NextResponse.json({ error: "Huấn luyện viên không tồn tại" }, { status: 400 });
    }

    // Transaction để cập nhật lớp học và lịch
    const updatedClass = await prisma.$transaction(async (tx) => {
      // Cập nhật LopHoc
      const updated = await tx.lophoc.update({
        where: { idMaLH: parseInt(id) },
        data: {
          Ten: data.Ten,
          Phong: data.Phong,
          MoTa: data.MoTa,
          TheLoai: data.TheLoai,
          SoLuongMax: data.SoLuongMax,
          Phi: data.Phi,
          TrangThai: data.TrangThai,
          ThoiLuong: data.ThoiLuong,
          ThoiGianBatDau: new Date(data.ThoiGianBatDau),
          ThoiGianKetThuc: new Date(data.ThoiGianKetThuc),
          idMaHLV: data.idMaHLV,
        },
        include: {
          huanluyenvien: {
            include: { user: { select: { Ten: true, Email: true, Anh: true } } },
          },
          dangkylophoc: { select: { id: true } },
          lichlophoc: true,
        },
      });

      // Xóa lịch học cũ
      await tx.lichlophoc.deleteMany({
        where: { idMaLH: parseInt(id) },
      });

      // Tạo lịch học mới
      await tx.lichlophoc.createMany({
        data: data.lichlophoc.map((lich) => ({
          idMaLH: parseInt(id),
          Thu: lich.Thu,
          GioBatDau: lich.GioBatDau,
        })),
      });

      return updated;
    });

    // Định dạng phản hồi giống GET và POST
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
    console.error("Error in PUT /api/admin/class/[id]:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật lớp học" },
      { status: 500 }
    );
  }
}