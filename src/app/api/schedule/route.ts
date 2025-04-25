import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

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

export async function POST(req: NextRequest) {
  try {
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

    // Kiểm tra HLV tồn tại
    const hlv = await prisma.huanluyenvien.findUnique({ where: { idMaHLV: MaHLV } });
    if (!hlv) {
      return NextResponse.json({ error: "Invalid trainer ID" }, { status: 400 });
    }

    // Kiểm tra học viên
    const hv = await prisma.hocvien.findUnique({ where: { idMaHV: MaHV } });
    if (!hv) {
      return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
    }
    if (idMaGT) {
        const goitap = await prisma.goitap.findUnique({ where: { idMaGT } });
        if (!goitap) {
          return NextResponse.json({ error: "Invalid package ID (idMaGT)" }, { status: 400 });
        }
      }
    // Tạo lịch tập mới
    const newSchedule = await prisma.lichtap.create({
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
      id: newSchedule.MaLT.toString(),
      start: newSchedule.NgayGioBatDau.toISOString(),
      end: newSchedule.NgayGioKetThuc.toISOString(),
      title: newSchedule.chuongtrinhtap?.TenCTT || newSchedule.lophoc?.Ten || "Buổi tập",
      extendedProps: {
        student: newSchedule.hocvien?.user?.Ten || "Không xác định",
        trainer: newSchedule.huanluyenvien?.user?.Ten || "Không xác định",
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

    return NextResponse.json(formattedEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}