import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { getUser } from "@/utils/Auth";
import { logDebug } from "@/app/lib/utils/logger";

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  try {
    const mealPlans = await prisma.thucdon.findMany({
      where: user?.VaiTro === 'admin' ? {} : {
        hocvien: {
          idUSER: user?.idUser,
        },
      },
      include: {
        chitietthucdon: {
          include: {
            buaan: true,
          },
        },
      },
    });
    return NextResponse.json(mealPlans, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thực đơn:", error);
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu" }, { status: 500 });
  }
}


// POST /api/healthconsultation
export async function POST(req: Request | NextRequest) {
  try {
    const body = await req.json();

    const { TenThucDon, SoCalo, NgayBatDau, MaHV, chiTietThucDon } = body;

    logDebug("Dữ liệu nhận được tại /api/healthconsultation", {
      TenThucDon,
      SoCalo,
      NgayBatDau,
      MaHV,
      chiTietThucDon,
    });

    // Kiểm tra thông tin bắt buộc
    if (!TenThucDon || !SoCalo || !NgayBatDau || !MaHV || !chiTietThucDon) {
      return NextResponse.json(
        { error: "Thiếu thông tin cơ bản" },
        { status: 400 }
      );
    }

    // Kiểm tra chi tiết thực đơn
    if (!Array.isArray(chiTietThucDon) || chiTietThucDon.length === 0) {
      logDebug("chiTietThucDon rỗng hoặc không phải mảng", chiTietThucDon);
      return NextResponse.json(
        { error: "chiTietThucDon rỗng hoặc không hợp lệ" },
        { status: 400 }
      );
    }

    // Kiểm tra học viên tồn tại
    const existingHocVien = await prisma.hocvien.findUnique({
      where: { idMaHV: MaHV },
    });

    if (!existingHocVien) {
      return NextResponse.json(
        { error: "Mã học viên không tồn tại" },
        { status: 400 }
      );
    }

    // Tạo thực đơn cùng chi tiết và bữa ăn
    const createdThucDon = await prisma.thucdon.create({
      data: {
        TenThucDon,
        SoCalo,
        NgayBatDau: new Date(NgayBatDau),
        hocvien: {
          connect: { idMaHV: MaHV },
        },
        chitietthucdon: {
          create: chiTietThucDon.map((detail: any, index: number) => ({
            Ngay: detail.Ngay
              ? new Date(detail.Ngay)
              : new Date(new Date(NgayBatDau).getTime() + index * 86400000), // fallback ngày
            buaan: {
              create: (detail.buaan || detail.buaAn || []).map((bua: any) => ({
                TenBua: bua.TenBua,
                MoTa: bua.MoTa,
              })),
            },
          })),
        },
      },
      include: {
        chitietthucdon: {
          include: {
            buaan: true,
          },
        },
      },
    });

    logDebug("Thực đơn đã được lưu thành công", createdThucDon);

    return NextResponse.json(
      { message: "Lưu thực đơn thành công", data: createdThucDon },
      { status: 201 }
    );
  } catch (err) {
    logDebug("Lỗi khi tạo thực đơn", err);
    const errorMessage =
      err instanceof Error ? err.message : "Lỗi không xác định";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
