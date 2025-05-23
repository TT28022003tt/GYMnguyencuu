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
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  function parseSafeDate(dateStr: string | null | undefined): Date | undefined {
    if (!dateStr) return undefined;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? undefined : d;
  }
  try {


    const idchitietgoitap = parseInt(params.id);
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

    // Kiểm tra bản ghi chitietgoitap tồn tại
    const existingMembership = await prisma.chitietgoitap.findUnique({
      where: { idchitietgoitap },
    });
    if (!existingMembership) {
      return NextResponse.json({ error: "Gói tập không tồn tại" }, { status: 404 });
    }

    // Kiểm tra user tồn tại
    const existingUser = await prisma.user.findUnique({
      where: { idUser },
    });
    if (!existingUser) {
      return NextResponse.json({ error: "Người dùng không tồn tại" }, { status: 400 });
    }
    // Kiểm tra huanluyenvien tồn tại
    const existingHLV = await prisma.huanluyenvien.findUnique({
      where: { idMaHLV },
    });
    if (!existingHLV) {
      return NextResponse.json({ error: "Huấn luyện viên không tồn tại" }, { status: 400 });
    }
    const otherMembership = await prisma.chitietgoitap.findFirst({
      where: {
        idUser,
        TinhTrang: 1, // Đang hoạt động
        idchitietgoitap: { not: idMaGT }, // Loại trừ bản ghi hiện tại
      },
    });
    if (otherMembership) {
      return NextResponse.json(
        { error: "Học viên này đã đăng ký gói tập đang hoạt động khác" },
        { status: 400 }
      );
    }

    let hocvien = await prisma.hocvien.findFirst({

      where: { idUSER: idUser },

    });

    if (!hocvien) {
      hocvien = await prisma.hocvien.create({
        data: {
          idUSER: idUser,
          MaHLV: idMaHLV,
          idMaGT,
          NgayDangKy: parseSafeDate(NgayDangKy) ?? new Date(),
        },
      });
    } else {
      // Cập nhật MaHLV và idMaGT trong bảng hocvien
      await prisma.hocvien.update({
        where: { idMaHV: hocvien.idMaHV },
        data: {
          MaHLV: idMaHLV,
          idMaGT,
          NgayDangKy: parseSafeDate(NgayDangKy) ?? new Date(),
        },
      });
    }
    // Cập nhật bản ghi
    const updatedMembership = await prisma.chitietgoitap.update({
      where: { idchitietgoitap },
      data: {
        idUser,
        idMaGT,
        idMaHLV,
        SoThang: SoThang ?? undefined,
        TongTien: TongTien ? parseFloat(TongTien.toString()) : undefined,
        NgayDangKy: parseSafeDate(NgayDangKy),
        NgayHetHan: parseSafeDate(NgayHetHan),
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
      id: updatedMembership.idchitietgoitap,
      userId: updatedMembership.idUser,
      cardId: updatedMembership.idMaGT,
      memberName: updatedMembership.user?.Ten || "N/A",
      email: updatedMembership.user?.Email || "N/A",
      photo: updatedMembership.user?.Anh || "/images/default-avatar.png",
      startDate: updatedMembership.NgayDangKy
        ? new Date(updatedMembership.NgayDangKy).toLocaleDateString("vi-VN")
        : "N/A",
      endDate: updatedMembership.NgayHetHan
        ? new Date(updatedMembership.NgayHetHan).toLocaleDateString("vi-VN")
        : "N/A",
      cardType: updatedMembership.goitap?.Loai || "N/A",
      status: updatedMembership.TinhTrang === 1 ? "Ongoing" : "Completed",
      trainerId: updatedMembership.idMaHLV,
      packageDuration: updatedMembership.SoThang,
      packageTotalPrice: updatedMembership.TongTien
        ? parseFloat(updatedMembership.TongTien.toString())
        : null,
    };

    return NextResponse.json(formattedMembership, { status: 200 });
  } catch (error) {
    console.error("Error updating membership:", error);
    return NextResponse.json({ error: "Lỗi khi cập nhật gói tập" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {

    const idchitietgoitap = parseInt(params.id);

    const existingMembership = await prisma.chitietgoitap.findUnique({
      where: { idchitietgoitap },
    });

    if (!existingMembership) {
      return NextResponse.json({ error: "Gói tập không tồn tại" }, { status: 404 });
    }

    // Cập nhật hocvien để đặt MaHLV và idMaGT thành null
    const hocvien = await prisma.hocvien.findFirst({
      where: { idUSER: existingMembership.idUser },
    });

    if (hocvien) {
      await prisma.hocvien.update({
        where: { idMaHV: hocvien.idMaHV },
        data: {
          MaHLV: null,
          idMaGT: null,
          NgayDangKy: null,
        },
      });
    }

    // Xóa bản ghi chitietgoitap
    await prisma.chitietgoitap.delete({
      where: { idchitietgoitap: idchitietgoitap },
    });


    return NextResponse.json({ message: "Xóa gói tập thành công" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting membership:", error);
    return NextResponse.json({ error: "Lỗi khi xóa gói tập" }, { status: 500 });
  }
}