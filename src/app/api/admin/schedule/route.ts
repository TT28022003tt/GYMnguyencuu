import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    const schedules = await prisma.lichtap.findMany({
      where: userId ? { hocvien: { idUSER: parseInt(userId) } } : {},
      include: {
        hocvien: {
          include: {
            user: { select: { idUser: true, Ten: true } },
          },
        },
        huanluyenvien: {
          include: {
            user: { select: { Ten: true } },
          },
        },
      },
    });

    const formattedSchedules = schedules.map((schedule) => ({
      id: schedule.hocvien.idUSER,
      scheduleId: schedule.MaLT,
      customerName: schedule.hocvien.user.Ten || "N/A",
      trainerName: schedule.huanluyenvien.user.Ten || "N/A",
      programId: schedule.idMaCTT,
      startDate: schedule.NgayGioBatDau.toISOString().split("T")[0],
      endDate: schedule.NgayGioKetThuc.toISOString().split("T")[0],
      note: schedule.GhiChu,
      status: schedule.TinhTrang || "Ongoing",
    }));

    return NextResponse.json(formattedSchedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { scheduleId, status } = await request.json();

    if (!scheduleId || !["Ongoing", "Completed"].includes(status)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const updatedSchedule = await prisma.lichtap.update({
      where: { MaLT: scheduleId },
      data: { TinhTrang: status },
    });

    return NextResponse.json({
      scheduleId: updatedSchedule.MaLT,
      status: updatedSchedule.TinhTrang,
    });
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}