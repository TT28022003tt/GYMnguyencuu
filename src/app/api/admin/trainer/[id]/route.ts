import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";

// Middleware để xử lý FormData
export const config = {
  api: {
	bodyParser: false,
  },
};

// Hàm hỗ trợ chạy middleware multer
const runMiddleware = (req: any, res: any, fn: any) => {
  return new Promise((resolve, reject) => {
	fn(req, res, (result: any) => {
	  if (result instanceof Error) {
		return reject(result);
	  }
	  return resolve(result);
	});
  });
};

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const trainerId = parseInt(params.id);

    const trainer = await prisma.huanluyenvien.findUnique({
      where: { idMaHLV: trainerId },
      include: {
        user: {
          select: {
            idUser: true,
            Ten: true,
            NgaySinh: true,
            GioiTinh: true,
            DiaChi: true,
            SoDienThoai: true,
            Email: true,
            Anh: true,
          },
        },
        lophoc: {
          include: {
            lichlophoc: {
              select: {
                Thu: true,
                GioBatDau: true,
              },
            },
          },
        },
        lichtap: {
          select: {
            MaLT: true,
            NgayGioBatDau: true,
            NgayGioKetThuc: true,
            GhiChu: true,
            TinhTrang: true,
          },
        },
      },
    });

    if (!trainer) {
      return NextResponse.json({ error: "Không tìm thấy huấn luyện viên" }, { status: 404 });
    }

    const formattedTrainer = {
      idMaHLV: trainer.idMaHLV,
      ten: trainer.user.Ten,
      ngaySinh: trainer.user.NgaySinh
        ? trainer.user.NgaySinh.toISOString().split("T")[0]
        : "N/A",
      gioiTinh: trainer.user.GioiTinh || 1,
      diaChi: trainer.user.DiaChi,
      soDienThoai: trainer.user.SoDienThoai,
      email: trainer.user.Email,
      chungChi: trainer.ChungChi,
      bangCap: trainer.BangCap,
      chuyenMon: trainer.ChuyeMon,
      luong: trainer.Luong ? parseFloat(trainer.Luong.toString()) : null,
      photo: trainer.user.Anh || "/images/default-avatar.png",
      classes: trainer.lophoc.map((classItem) => ({
        idMaLH: classItem.idMaLH,
        ten: classItem.Ten,
        phong: classItem.Phong,
        theLoai: classItem.TheLoai,
        thoiGianBatDau: classItem.ThoiGianBatDau
          ? classItem.ThoiGianBatDau.toISOString().split("T")[0]
          : "N/A",
        thoiGianKetThuc: classItem.ThoiGianKetThuc
          ? classItem.ThoiGianKetThuc.toISOString().split("T")[0]
          : "N/A",
        thoiLuong: classItem.ThoiLuong,
        soLuongMax: classItem.SoLuongMax,
        phi: classItem.Phi ? parseFloat(classItem.Phi.toString()) : null,
        trangThai: classItem.TrangThai,
        schedules: classItem.lichlophoc.map((schedule) => ({
          thu: schedule.Thu,
          gioBatDau: schedule.GioBatDau,
        })),
      })),
      schedules: trainer.lichtap.map((schedule) => ({
        maLT: schedule.MaLT,
        ngayGioBatDau: schedule.NgayGioBatDau.toISOString(),
        ngayGioKetThuc: schedule.NgayGioKetThuc.toISOString(),
        ghiChu: schedule.GhiChu,
        tinhTrang: schedule.TinhTrang,
      })),
    };

    return NextResponse.json(formattedTrainer);
  } catch (error) {
    console.error("Error fetching trainer details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const idUser = parseInt(params.id);

  try {
    const data = await request.json();
    const {
      ten, ngaySinh, gioiTinh, diaChi, soDienThoai, email,
      chungChi, bangCap, chuyenMon, luong, photo
    } = data;

    await prisma.user.update({
      where: { idUser },
      data: {
        Ten: ten,
        NgaySinh: new Date(ngaySinh),
        GioiTinh: gioiTinh,
        DiaChi: diaChi,
        SoDienThoai: soDienThoai,
        Email: email,
        Anh: photo || "/images/default-avatar.png",
      },
    });

    const trainer = await prisma.huanluyenvien.findFirst({
      where: { idUser },
      select: { idMaHLV: true },
    });

    if (!trainer) {
      return NextResponse.json({ error: "Huấn luyện viên không tồn tại" }, { status: 404 });
    }

    await prisma.huanluyenvien.update({
      where: { idMaHLV: trainer.idMaHLV },
      data: {
        ChungChi: chungChi,
        BangCap: bangCap,
        ChuyeMon: chuyenMon,
        Luong: luong ? parseFloat(luong) : null,
      },
    });

    return NextResponse.json({ message: "Cập nhật huấn luyện viên thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật huấn luyện viên:", error);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const idUser = parseInt(params.id);

  try {
    const trainer = await prisma.huanluyenvien.findFirst({
      where: { idUser },
      select: { idMaHLV: true },
    });

    if (!trainer) {
      return NextResponse.json({ error: "Huấn luyện viên không tồn tại" }, { status: 404 });
    }

    await prisma.huanluyenvien.delete({
      where: { idMaHLV: trainer.idMaHLV },
    });

    return NextResponse.json({ message: "Xóa huấn luyện viên thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa huấn luyện viên:", error);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}

