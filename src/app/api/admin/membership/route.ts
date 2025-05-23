import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { getUser } from "@/utils/Auth";

interface MembershipCreateInput {
  idUser: number;
  idMaGT: number;
  idMaHLV: number;
  SoThang?: number;
  TongTien?: number;
  NgayDangKy?: string;
  NgayHetHan?: string;
  TinhTrang?: number;
}

export async function GET(request: NextRequest) {
  try {


    const memberships = await prisma.chitietgoitap.findMany({
      include: {
        user: {
          select: {
            idUser: true,
            Ten: true,
            Email: true,
            Anh: true,
          },
        },
        goitap: {
          select: {
            idMaGT: true,
            Ten: true,
            Loai: true,
          },
        },
        huanluyenvien: {
          select: {
            idMaHLV: true,
            ChungChi: true,
            BangCap: true,
            ChuyeMon: true,
            user: {
              select: { Ten: true },
            },
          },
        },
      },
    });

    const formattedMemberships = memberships.map((membership) => ({
      id: membership.idchitietgoitap,
      userId: membership.idUser,
      cardId: membership.idMaGT,
      idMaHLV:membership.idMaHLV,
      memberName: membership.user?.Ten || "N/A",
      email: membership.user?.Email || "N/A",
      photo: membership.user?.Anh || "/images/default-avatar.png",
      startDate: membership.NgayDangKy
        ? new Date(membership.NgayDangKy).toLocaleDateString("vi-VN")
        : "N/A",
      endDate: membership.NgayHetHan
        ? new Date(membership.NgayHetHan).toLocaleDateString("vi-VN")
        : "N/A",
      cardType: membership.goitap?.Loai || "N/A",
      SoThang: membership.SoThang,
      TongTien: membership.TongTien,
      status: membership.TinhTrang === 1 ? "Ongoing" : "Completed",
    }));

    const sortedMemberships = formattedMemberships.sort((a, b) =>
      a.memberName.localeCompare(b.memberName)
    );

    return NextResponse.json(sortedMemberships, { status: 200 });
  } catch (error) {
    console.error("Error fetching memberships:", error);
    return NextResponse.json({ error: "Lỗi khi lấy danh sách hội viên" }, { status: 500 });
  }
}

// Cập nhập lại tình trạng Ongoing và Completed
export async function PATCH(request: Request) {
  try {
    const { membershipId, status } = await request.json();

    if (!membershipId || !["Ongoing", "Completed"].includes(status)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const updatedMembership = await prisma.chitietgoitap.update({
      where: { idchitietgoitap: membershipId },
      data: { TinhTrang: status === "Ongoing" ? 1 : 0 },
    });

    console.log("Updated membership:", updatedMembership);
    return NextResponse.json({
      membershipId: updatedMembership.idchitietgoitap,
      status: updatedMembership.TinhTrang === 1 ? "Ongoing" : "Completed",
    });
  } catch (error) {
    console.error("Error updating membership:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user || user.VaiTro !== "admin") {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
    }

    const {
      idUser,
      idMaGT,
      idMaHLV,
      SoThang,
      TongTien,
      NgayDangKy,
      NgayHetHan,
      TinhTrang,
    } = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { idUser },
    });
    if (!existingUser) {
      return NextResponse.json({ error: "Người dùng không tồn tại" }, { status: 400 });
    }

    const existingGoitap = await prisma.goitap.findUnique({
      where: { idMaGT },
    });
    if (!existingGoitap) {
      return NextResponse.json({ error: "Gói tập không tồn tại" }, { status: 400 });
    }

    const existingHLV = await prisma.huanluyenvien.findUnique({
      where: { idMaHLV },
    });
    if (!existingHLV) {
      return NextResponse.json({ error: "Huấn luyện viên không tồn tại" }, { status: 400 });
    }

    const existingMembership = await prisma.chitietgoitap.findFirst({
      where: {
        idUser,
        TinhTrang: 1, // Đang hoạt động
      },
    });
    if (existingMembership) {
      return NextResponse.json(
        { error: "Học viên này đã đăng ký gói tập và gói tập đang hoạt động" },
        { status: 400 }
      );
    }

    // Kiểm tra học viên tồn tại, nếu không thì tạo mới
    let hocvien = await prisma.hocvien.findFirst({
      where: { idUSER: idUser },
    });

    if (!hocvien) {
      hocvien = await prisma.hocvien.create({
        data: {
          idUSER: idUser,
          MaHLV: idMaHLV,
          idMaGT,
          NgayDangKy: NgayDangKy ? new Date(NgayDangKy) : new Date(),
        },
      });
    } else {
      await prisma.hocvien.update({
        where: { idMaHV: hocvien.idMaHV },
        data: {
          MaHLV: idMaHLV,
          idMaGT,
          NgayDangKy: NgayDangKy ? new Date(NgayDangKy) : new Date(),
        },
      });
    }

    // Tạo bản ghi chitietgoitap
    const newMembership = await prisma.chitietgoitap.create({
      data: {
        idUser,
        idMaGT,
        idMaHLV,
        SoThang: SoThang ?? undefined,
        TongTien: TongTien ? parseFloat(TongTien.toString()) : undefined,
        NgayDangKy: NgayDangKy ? new Date(NgayDangKy) : undefined,
        NgayHetHan: NgayHetHan ? new Date(NgayHetHan) : undefined,
        TinhTrang: TinhTrang ?? 1,
      },
      include: {
        user: {
          select: { idUser: true, Ten: true, Email: true, Anh: true },
        },
        goitap: {
          select: { idMaGT: true, Ten: true, Loai: true },
        },
        huanluyenvien: {
          select: {
            idMaHLV: true,
            user: { select: { Ten: true } },
          },
        },
      },
    });

    const formattedMembership = {
      id: newMembership.idchitietgoitap,
      userId: newMembership.idUser,
      cardId: newMembership.idMaGT,
      memberName: newMembership.user?.Ten || "N/A",
      email: newMembership.user?.Email || "N/A",
      photo: newMembership.user?.Anh || "/images/default-avatar.png",
      startDate: newMembership.NgayDangKy
        ? new Date(newMembership.NgayDangKy).toLocaleDateString("vi-VN")
        : "N/A",
      endDate: newMembership.NgayHetHan
        ? new Date(newMembership.NgayHetHan).toLocaleDateString("vi-VN")
        : "N/A",
      cardType: newMembership.goitap?.Loai || "N/A",
      status: newMembership.TinhTrang === 1 ? "Ongoing" : "Completed",
      trainerId: newMembership.idMaHLV,
      packageDuration: newMembership.SoThang,
      packageTotalPrice: newMembership.TongTien
        ? parseFloat(newMembership.TongTien.toString())
        : null,
    };

    return NextResponse.json(formattedMembership, { status: 201 });
  } catch (error) {
    console.error("Error creating membership:", error);
    return NextResponse.json({ error: "Lỗi khi tạo gói tập" }, { status: 500 });
  }
}