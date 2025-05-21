import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const idUser = parseInt(params.id);

    const member = await prisma.hocvien.findFirst({
      where: { idUSER: idUser },
      include: {
        user: {
          select: {
            Ten: true,
            Email: true,
            SoDienThoai: true,
            Anh: true,
            NgaySinh: true,
            GioiTinh: true,
            DiaChi: true,
          },
        },
        huanluyenvien: {
          select: {
            ChungChi: true,
            BangCap: true,
            ChuyeMon: true,
            user: {
              select: {
                Ten: true,
              },
            },
          },
        },
        goitap: {
          select: {
            Ten: true,
            Loai: true,
            Gia: true,
            chitietgoitap: {
              where: { idUser },
              select: {
                SoThang: true,
                TongTien: true,
                NgayDangKy: true,
                NgayHetHan: true,
                TinhTrang: true,
              },
            },
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Hội viên không tồn tại" }, { status: 404 });
    }

    const chitietgoitap = member.goitap?.chitietgoitap[0];

    const formattedMembership = {
      idMaHV: member.idMaHV,
      memberName: member.user?.Ten || null,
      email: member.user?.Email || null,
      phone: member.user?.SoDienThoai || null,
      photo: member.user?.Anh || null,
      registrationDate: member.NgayDangKy?.toISOString() || null,
      birthDate: member.user?.NgaySinh?.toISOString() || null,
      gender: member.user?.GioiTinh === 1 ? "Nam" : member.user?.GioiTinh === 0 ? "Nữ" : null,
      address: member.user?.DiaChi || null,
      trainerName: member.huanluyenvien?.user?.Ten || null,
      trainerCertificate: member.huanluyenvien?.ChungChi || null,
      trainerDegree: member.huanluyenvien?.BangCap || null,
      trainerSpecialization: member.huanluyenvien?.ChuyeMon || null,
      packageName: member.goitap?.Ten || null,
      packageType: member.goitap?.Loai || null,
      packagePrice: member.goitap?.Gia
        ? `${parseFloat(member.goitap.Gia.toString()).toLocaleString("vi-VN")} VND`
        : null,
      packageDuration: chitietgoitap?.SoThang || null,
      packageTotalPrice: chitietgoitap?.TongTien
        ? `${parseFloat(chitietgoitap.TongTien.toString()).toLocaleString("vi-VN")} VND`
        : null,
      packageStartDate: chitietgoitap?.NgayDangKy?.toISOString() || null,
      packageEndDate: chitietgoitap?.NgayHetHan?.toISOString() || null,
      packageStatus:
        chitietgoitap?.TinhTrang === 1
          ? "Hoạt động"
          : chitietgoitap?.TinhTrang === 0
            ? "Hết hạn"
            : "N/A",
    };

    return NextResponse.json(formattedMembership, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi khi lấy chi tiết hội viên" }, { status: 500 });
  }
}