import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { getUser } from "@/utils/Auth";

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  try {
    const mealPlans = await prisma.thucdon.findMany({
      where: {
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received body:", body); // Debug dữ liệu nhận được

    const { TenThucDon, SoCalo, NgayBatDau, MaHV, chiTietThucDon } = body;

    // Kiểm tra trường bắt buộc
    const errors: string[] = [];
    if (!TenThucDon) errors.push("Tên thực đơn là bắt buộc");
    if (!MaHV) errors.push("Mã học viên là bắt buộc");
    if (!NgayBatDau) errors.push("Ngày bắt đầu là bắt buộc");

    if (errors.length > 0) {
      console.log("Validation errors:", errors); // Debug lỗi
      return NextResponse.json(
        { error: errors.join(", ") },
        { status: 400 }
      );
    }

    // Kiểm tra MaHV tồn tại
    const existingHocVien = await prisma.hocvien.findUnique({
      where: { idMaHV: MaHV },
    });

    if (!existingHocVien) {
      return NextResponse.json(
        { error: "Mã học viên không tồn tại" },
        { status: 400 }
      );
    }

    const mealPlan = await prisma.thucdon.create({
      data: {
        TenThucDon,
        SoCalo,
        NgayBatDau: new Date(NgayBatDau),
        hocvien: {
          connect: { idMaHV: MaHV }, // Kết nối với hocvien
        },
        chitietthucdon: {
          create: chiTietThucDon?.map((item: any, index: number) => ({
            Ngay: new Date(new Date(NgayBatDau).getTime() + index * 24 * 60 * 60 * 1000),
            buaan: {
              create: item.buaAn?.map((meal: any) => ({
                TenBua: meal.TenBua,
                MoTa: meal.MoTa,
              })) || [],
            },
          })) || [],
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

    return NextResponse.json(mealPlan, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo thực đơn:", error);
    return NextResponse.json({ error: "Lỗi khi tạo dữ liệu" }, { status: 500 });
  }
}