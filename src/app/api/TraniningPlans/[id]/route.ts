import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  const plan = await prisma.chuongtrinhtap.findUnique({
    where: { idChuongTrinhTap: id },
    include: { chitietmuctieu: true },
  });

  if (!plan) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  return NextResponse.json(plan);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const body = await req.json();

  const { TenCTT, MucTieu, ThoiGian, MaHV, chiTietMucTieu, TrangThai } = body;

  try {
    const existingPlan = await prisma.chuongtrinhtap.findUnique({
      where: { idChuongTrinhTap: id },
    });
    if (!existingPlan) {
      return NextResponse.json({ error: "Chương trình tập không tồn tại" }, { status: 404 });
    }

    const updatedPlan = await prisma.chuongtrinhtap.update({
      where: { idChuongTrinhTap: id },
      data: {
        TenCTT,
        MucTieu,
        ThoiGian,
        MaHV,
        TrangThai: TrangThai !== undefined ? TrangThai : existingPlan.TrangThai, // Giữ nguyên nếu không gửi
      },
      include: { chitietmuctieu: true },
    });

    if (chiTietMucTieu && Array.isArray(chiTietMucTieu)) {
      const existingDetails = await prisma.chitietmuctieu.findMany({
        where: { idChuongTrinhTap: id },
        select: { idChiTietMucTieu: true },
      });
      const existingDetailIds = existingDetails.map((d) => d.idChiTietMucTieu);

      const clientDetailIds = chiTietMucTieu
        .filter((ct: any) => ct.idChiTietMucTieu)
        .map((ct: any) => ct.idChiTietMucTieu);

      const detailsToDelete = existingDetailIds.filter((id: number) => !clientDetailIds.includes(id));
      if (detailsToDelete.length > 0) {
        await prisma.chitietmuctieu.deleteMany({
          where: {
            idChiTietMucTieu: { in: detailsToDelete },
          },
        });
      }

      for (const ct of chiTietMucTieu) {
        if (ct.idChiTietMucTieu) {
          await prisma.chitietmuctieu.update({
            where: { idChiTietMucTieu: ct.idChiTietMucTieu },
            data: {
              ThoiGian: ct.ThoiGian,
              MoTa: ct.MoTa,
            },
          });
        } else {
          await prisma.chitietmuctieu.create({
            data: {
              ThoiGian: ct.ThoiGian,
              MoTa: ct.MoTa,
              idChuongTrinhTap: id,
            },
          });
        }
      }
    }

    const updatedData = await prisma.chuongtrinhtap.findUnique({
      where: { idChuongTrinhTap: id },
      include: { chitietmuctieu: true },
    });

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error("Lỗi cập nhật chương trình tập:", error);
    return NextResponse.json({ error: "Lỗi cập nhật chương trình tập" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  try {
    const existingPlan = await prisma.chuongtrinhtap.findUnique({
      where: { idChuongTrinhTap: id },
    });
    if (!existingPlan) {
      return NextResponse.json({ error: "Chương trình tập không tồn tại" }, { status: 404 });
    }

    await prisma.chitietmuctieu.deleteMany({ where: { idChuongTrinhTap: id } });
    await prisma.chuongtrinhtap.delete({ where: { idChuongTrinhTap: id } });

    return NextResponse.json({ message: "Đã xóa chương trình tập" });
  } catch (error) {
    console.error("Lỗi xóa chương trình tập:", error);
    return NextResponse.json({ error: "Lỗi xóa chương trình tập" }, { status: 500 });
  }
}
