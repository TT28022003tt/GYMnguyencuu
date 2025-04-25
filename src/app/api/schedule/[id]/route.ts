import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const schedule = await prisma.lichtap.findUnique({
      where: { MaLT: Number(id) },
      include: {
        hocvien: { include: { user: true } },
        huanluyenvien: { include: { user: true } },
        lophoc: true,
        chuongtrinhtap: true,
        goitap: true,
        baitap: true,
      },
    });

    if (!schedule) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    const formattedEvent = {
      id: schedule.MaLT.toString(),
      start: schedule.NgayGioBatDau.toISOString(),
      end: schedule.NgayGioKetThuc.toISOString(),
      title: schedule.chuongtrinhtap?.TenCTT || schedule.lophoc?.Ten || "Buổi tập",
      extendedProps: {
        studentId: schedule.MaHV, // Thêm mã học viên
        trainerId: schedule.MaHLV, // Thêm mã huấn luyện viên
        student: schedule.hocvien?.user?.Ten || "Không xác định",
        trainer: schedule.huanluyenvien?.user?.Ten || "Không xác định",
        packageId: schedule.idMaGT ?? null, // Thêm mã gói tập
        package: schedule.goitap?.Ten || null, // Giữ tên gói tập
        packageType: schedule.goitap?.Loai || null,
        programId: schedule.idMaCTT ?? null, // Thêm mã chương trình tập
        program: schedule.chuongtrinhtap?.TenCTT || null, // Thêm tên chương trình tập
        classId: schedule.idMaLH ?? null, // Thêm mã lớp học
        class: schedule.lophoc?.Ten || null, // Thêm tên lớp học
        note: schedule.GhiChu || null, // Thêm ghi chú
        exercises: schedule.baitap.map((b) => ({
          id: b.idBaiTap,
          name: b.TenBaiTap,
          muscleGroup: b.NhomCo,
          reps: b.SoRep,
          sets: b.SoSet,
          description: b.MoTa,
        })),
      },
    };

    return NextResponse.json(formattedEvent);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const {
      NgayGioBatDau,
      NgayGioKetThuc,
      MaHV,
      MaHLV,
      idMaLH,
      idMaCTT,
      idMaGT,
      GhiChu,
      baitap,
    } = body;

    // Xác thực dữ liệu đầu vào
    if (!NgayGioBatDau || !NgayGioKetThuc || !MaHLV || !MaHV) {
      return NextResponse.json({ error: "Missing required fields (NgayGioBatDau, NgayGioKetThuc, MaHLV, MaHV)" }, { status: 400 });
    }

    // Kiểm tra lịch tồn tại
    const existingSchedule = await prisma.lichtap.findUnique({
      where: { MaLT: Number(id) },
    });
    if (!existingSchedule) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    // Kiểm tra HLV
    const hlv = await prisma.huanluyenvien.findUnique({ where: { idMaHLV: MaHLV } });
    if (!hlv) {
      return NextResponse.json({ error: "Invalid trainer ID" }, { status: 400 });
    }

    // Kiểm tra học viên
    const hv = await prisma.hocvien.findUnique({ where: { idMaHV: MaHV } });
    if (!hv) {
      return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
    }

    // Cập nhật lịch tập
    const updatedSchedule = await prisma.lichtap.update({
      where: { MaLT: Number(id) },
      data: {
        NgayGioBatDau: new Date(NgayGioBatDau),
        NgayGioKetThuc: new Date(NgayGioKetThuc),
        MaHV,
        MaHLV,
        idMaLH,
        idMaCTT,
        idMaGT,
        GhiChu,
        baitap: {
          deleteMany: {}, // Xóa bài tập cũ
          create: baitap?.map((b: any) => ({
            TenBaiTap: b.name,
            NhomCo: b.muscleGroup,
            SoRep: b.reps,
            SoSet: b.sets,
            MoTa: b.description,
          })),
        },
      },
      include: {
        hocvien: { include: { user: true } },
        huanluyenvien: { include: { user: true } },
        lophoc: true,
        chuongtrinhtap: true,
        goitap: true,
        baitap: true,
      },
    });

    // Định dạng phản hồi
    const formattedEvent = {
      id: updatedSchedule.MaLT.toString(),
      start: updatedSchedule.NgayGioBatDau.toISOString(),
      end: updatedSchedule.NgayGioKetThuc.toISOString(),
      title: updatedSchedule.chuongtrinhtap?.TenCTT || updatedSchedule.lophoc?.Ten || "Buổi tập",
      extendedProps: {
        student: updatedSchedule.hocvien?.user?.Ten || "Không xác định",
        trainer: updatedSchedule.huanluyenvien?.user?.Ten || "Không xác định",
        exercises: updatedSchedule.baitap.map((b) => ({
          id: b.idBaiTap,
          name: b.TenBaiTap,
          muscleGroup: b.NhomCo,
          reps: b.SoRep,
          sets: b.SoSet,
          description: b.MoTa,
        })),
        package: updatedSchedule.goitap?.Ten,
        packageType: updatedSchedule.goitap?.Loai,
      },
    };

    return NextResponse.json(formattedEvent);
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const schedule = await prisma.lichtap.findUnique({
      where: { MaLT: Number(id) },
    });
    if (!schedule) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    await prisma.lichtap.delete({
      where: { MaLT: Number(id) },
    });

    return NextResponse.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}