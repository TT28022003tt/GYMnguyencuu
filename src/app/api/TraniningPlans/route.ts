import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { getUser } from "@/utils/Auth";

// Lấy danh sách chương trình tập
export async function GET(req: NextRequest) {
  const user = await getUser(req);
  try {
    if (!user) {
      return NextResponse.json({ error: "Chưa Đăng Nhập" }, { status: 401 });
    }

    let trainingPlans;
    if (user.VaiTro === "admin") {
      // Admin: Xem tất cả chương trình tập
      trainingPlans = await prisma.chuongtrinhtap.findMany({
        include: { chitietmuctieu: true },
      });
    } else if (user.VaiTro === "trainer") {
      // Trainer: Xem chương trình tập của học viên mà họ phụ trách
      trainingPlans = await prisma.chuongtrinhtap.findMany({
        where: {
          hocvien: {
            MaHLV: user.idUser, // Giả sử MaHLV là idUser của HLV
          },
        },
        include: { chitietmuctieu: true },
      });
    } else {
      // Học viên: Xem chương trình tập của chính mình
      trainingPlans = await prisma.chuongtrinhtap.findMany({
        where: {
          hocvien: {
            idUSER: user.idUser,
          },
        },
        include: { chitietmuctieu: true },
      });
    }

    return NextResponse.json(trainingPlans, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chương trình tập:", error);
    return NextResponse.json({ error: "Lỗi khi lấy dữ liệu" }, { status: 500 });
  }
}
// Tạo chương trình tập mới
export async function POST(req: NextRequest) {
  try {
    const { TenCTT, MucTieu, ThoiGian, MaHV, chiTietMucTieu, TrangThai } = await req.json();

    if (!TenCTT || !MaHV) {
      return NextResponse.json(
        { error: "Tên chương trình và mã học viên là bắt buộc" },
        { status: 400 }
      );
    }

    const chuongTrinhTap = await prisma.chuongtrinhtap.create({
      data: {
        TenCTT,
        MucTieu,
        ThoiGian,
        MaHV,
        TrangThai: 0, // Mặc định "not-started"
        chitietmuctieu: {
          create: chiTietMucTieu?.map((item: any) => ({
            ThoiGian: item.ThoiGian,
            MoTa: item.MoTa,
          })) || [],
        },
      },
      include: { chitietmuctieu: true },
    });

    return NextResponse.json(chuongTrinhTap, { status: 201 });
  } catch (error) {
    console.error("Error creating chuongtrinhtap:", error);
    return NextResponse.json({ error: "Lỗi khi tạo dữ liệu" }, { status: 500 });
  }
}
