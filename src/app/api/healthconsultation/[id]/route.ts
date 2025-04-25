import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
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

export async function PUT(req: NextRequest) {
  try {
    const idThucDon = parseInt(req.url.split("/").pop() || "0");
    console.log("Received idThucDon from URL:", idThucDon);
    const body = await req.json();
    console.log("Received body for update:", body);

    const { TenThucDon, SoCalo, NgayBatDau, MaHV, chiTietThucDon } = body;

    if (!idThucDon) {
      return NextResponse.json(
        { error: "ID thực đơn là bắt buộc" },
        { status: 400 }
      );
    }

    const errors: string[] = [];
    if (!TenThucDon) errors.push("Tên thực đơn là bắt buộc");
    if (!MaHV) errors.push("Mã học viên là bắt buộc");
    if (!NgayBatDau) errors.push("Ngày bắt đầu là bắt buộc");

    if (errors.length > 0) {
      console.log("Validation errors:", errors);
      return NextResponse.json(
        { error: errors.join(", ") },
        { status: 400 }
      );
    }

    const existingHocVien = await prisma.hocvien.findUnique({
      where: { idMaHV: MaHV },
    });

    if (!existingHocVien) {
      return NextResponse.json(
        { error: "Mã học viên không tồn tại" },
        { status: 400 }
      );
    }

    // Kiểm tra thực đơn tồn tại
    const existingMealPlan = await prisma.thucdon.findUnique({
      where: { idThucDon: idThucDon },
    });

    if (!existingMealPlan) {
      return NextResponse.json(
        { error: "Thực đơn không tồn tại" },
        { status: 404 }
      );
    }

    // Xóa chitietthucdon và buaan cũ
    await prisma.chitietthucdon.deleteMany({
      where: { idThucDon: idThucDon },
    });

    const mealPlan = await prisma.thucdon.update({
      where: { idThucDon: idThucDon },
      data: {
        TenThucDon,
        SoCalo,
        NgayBatDau: new Date(NgayBatDau),
        hocvien: {
          connect: { idMaHV: MaHV },
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

    return NextResponse.json(mealPlan, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi cập nhật thực đơn:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật dữ liệu: " + (error as Error).message },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Kiểm tra id
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ message: "idThucDon không hợp lệ" }, { status: 400 });
    }

    // Kiểm tra thực đơn tồn tại
    const existingThucDon = await prisma.thucdon.findUnique({
      where: { idThucDon: Number(id) },
    });

    if (!existingThucDon) {
      return NextResponse.json({ message: "Thực đơn không tồn tại" }, { status: 404 });
    }

    // Xóa thực đơn
    const deletedThucDon = await prisma.thucdon.delete({
      where: { idThucDon: Number(id) },
    });

    return NextResponse.json(
      {
        message: "Xóa thực đơn thành công",
        deletedThucDon,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Lỗi khi xóa thực đơn:", error);
    return NextResponse.json(
      {
        message: "Lỗi khi xóa thực đơn",
        error: error.message || "Lỗi máy chủ",
      },
      { status: 500 }
    );
  }
}