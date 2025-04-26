import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { logDebug } from "@/app/lib/utils/logger";

export async function GET() {
  try {
    const schedules = await prisma.lichtap.findMany({
      include: {
        hocvien: { include: { user: true } },
        huanluyenvien: { include: { user: true } },
        lophoc: true,
        chuongtrinhtap: true,
        goitap: true,
        baitap: true,
      },
    });

    const formattedEvents = schedules.map((schedule) => ({
      id: schedule.MaLT.toString(),
      start: schedule.NgayGioBatDau.toISOString(),
      end: schedule.NgayGioKetThuc.toISOString(),
      title: schedule.chuongtrinhtap?.TenCTT || schedule.lophoc?.Ten || "Buổi tập",
      extendedProps: {
        studentId: schedule.MaHV,
        trainerId: schedule.MaHLV,
        student: schedule.hocvien?.user?.Ten || "Không xác định",
        trainer: schedule.huanluyenvien?.user?.Ten || "Không xác định",
        packageId: schedule.idMaGT ?? null,
        package: schedule.goitap?.Ten || null,
        packageType: schedule.goitap?.Loai || null,
        programId: schedule.idMaCTT ?? null,
        program: schedule.chuongtrinhtap?.TenCTT || null,
        classId: schedule.idMaLH ?? null,
        class: schedule.lophoc?.Ten || null,
        note: schedule.GhiChu || null,
        exercises: schedule.baitap.map((b) => ({
          id: b.idBaiTap,
          name: b.TenBaiTap,
          muscleGroup: b.NhomCo,
          reps: b.SoRep,
          sets: b.SoSet,
          description: b.MoTa,
        })),
      },
    }));

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Xử lý trường hợp body là mảng từ lichtapToSave hoặc đối tượng đơn lẻ
    const scheduleData = Array.isArray(body.lichtap) ? body.lichtap[0] : body;
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
    } = scheduleData;

    // Xác thực dữ liệu đầu vào
    if (!NgayGioBatDau || !NgayGioKetThuc || !MaHV) {
      return NextResponse.json(
        { error: 'Thiếu trường bắt buộc (NgayGioBatDau, NgayGioKetThuc, MaHV)' },
        { status: 400 }
      );
    }

    // Kiểm tra học viên
    const hv = await prisma.hocvien.findUnique({ where: { idMaHV: MaHV } });
    if (!hv) {
      return NextResponse.json({ error: 'ID học viên không hợp lệ' }, { status: 400 });
    }

    // Xử lý MaHLV: Nếu không cung cấp, lấy HLV đầu tiên từ CSDL
    let finalMaHLV = MaHLV;
    if (!finalMaHLV) {
      const hlv = await prisma.huanluyenvien.findFirst();
      if (!hlv) {
        return NextResponse.json({ error: 'Không tìm thấy huấn luyện viên' }, { status: 400 });
      }
      finalMaHLV = hlv.idMaHLV;
    } else {
      const hlv = await prisma.huanluyenvien.findUnique({ where: { idMaHLV: finalMaHLV } });
      if (!hlv) {
        return NextResponse.json({ error: 'ID huấn luyện viên không hợp lệ' }, { status: 400 });
      }
    }

    // Kiểm tra gói tập (nếu có)
    if (idMaGT) {
      const goitap = await prisma.goitap.findUnique({ where: { idMaGT } });
      if (!goitap) {
        return NextResponse.json({ error: 'ID gói tập không hợp lệ' }, { status: 400 });
      }
    }

    // Kiểm tra chương trình tập (nếu có)
    if (idMaCTT) {
      const ctt = await prisma.chuongtrinhtap.findUnique({ where: { idChuongTrinhTap: idMaCTT } });
      if (!ctt) {
        return NextResponse.json({ error: 'ID chương trình tập không hợp lệ' }, { status: 400 });
      }
    }

    // Kiểm tra lớp học (nếu có)
    if (idMaLH) {
      const lh = await prisma.lophoc.findUnique({ where: { idMaLH } });
      if (!lh) {
        return NextResponse.json({ error: 'ID lớp học không hợp lệ' }, { status: 400 });
      }
    }

    // Tạo lịch tập mới
    const newSchedule = await prisma.lichtap.create({
      data: {
        NgayGioBatDau: new Date(NgayGioBatDau),
        NgayGioKetThuc: new Date(NgayGioKetThuc),
        MaHV,
        MaHLV: finalMaHLV,
        idMaLH,
        idMaCTT,
        idMaGT,
        GhiChu,
        baitap: {
          create: baitap?.map((b: any) => ({
            TenBaiTap: b.name || b.TenBaiTap,
            NhomCo: b.muscleGroup || b.NhomCo,
            SoRep: b.reps || b.SoRep,
            SoSet: b.sets || b.SoSet,
            MoTa: b.description || b.MoTa,
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
      id: newSchedule.MaLT.toString(),
      start: newSchedule.NgayGioBatDau.toISOString(),
      end: newSchedule.NgayGioKetThuc.toISOString(),
      title: newSchedule.chuongtrinhtap?.TenCTT || newSchedule.lophoc?.Ten || 'Buổi tập',
      extendedProps: {
        student: newSchedule.hocvien?.user?.Ten || 'Không xác định',
        trainer: newSchedule.huanluyenvien?.user?.Ten || 'Không xác định',
        exercises: newSchedule.baitap.map((b) => ({
          id: b.idBaiTap,
          name: b.TenBaiTap,
          muscleGroup: b.NhomCo,
          reps: b.SoRep,
          sets: b.SoSet,
          description: b.MoTa,
        })),
        package: newSchedule.goitap?.Ten,
        packageType: newSchedule.goitap?.Loai,
      },
    };

    logDebug('Lịch tập đã lưu', formattedEvent);

    return NextResponse.json(formattedEvent, { status: 201 });
  } catch (error) {
    logDebug('Lưu lịch tập lỗi', error);

  let errorMessage = 'Không thể lưu lịch tập';
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return NextResponse.json({ error: errorMessage }, { status: 500 });
} finally {
    await prisma.$disconnect();
  }
}