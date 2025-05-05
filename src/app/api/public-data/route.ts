import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export async function GET(req: NextRequest) {
  try {
    const [goitap, chuongtrinhtap, thucdon, huanluyenvien, lophoc, thehoivien] = await Promise.all([
      prisma.goitap.findMany({
        select: {
          idMaGT: true,
          Ten: true,
          Loai: true,
          Gia: true,
          NgayBatDau: true,
          NgayKetThuc: true,
        },
      }),
      prisma.chuongtrinhtap.findMany({
        select: {
          idChuongTrinhTap: true,
          TenCTT: true,
          MucTieu: true,
          ThoiGian: true,
        },
      }),
      prisma.thucdon.findMany({
        select: {
          idThucDon: true,
          TenThucDon: true,
          SoCalo: true,
          NgayBatDau: true,
        },
      }),
      prisma.huanluyenvien.findMany({
        include: {
          user: {
            select: {
              Ten: true,
              SoDienThoai: true,
              GioiTinh: true,
            },
          },
        },
      }),
      prisma.lophoc.findMany({
        select: {
          idMaLH: true,
          Ten: true,
          TheLoai: true,
          MoTa: true,
          ThoiGianBatDau: true,
          SoLuong: true,
        },
      }),
      prisma.thehoivien.findMany({
        select: {
          idMaThe: true,
          NgayCap: true,
          NgayHetHan: true,
          TinhTrang: true,
          MaHV: true,
        },
      }),
    ]);

    // Định dạng dữ liệu trả về
    const publicData = {
      goitap: goitap.map((gt) => ({
        idMaGT: gt.idMaGT,
        Ten: gt.Ten,
        Loai: gt.Loai,
        Gia: gt.Gia,
        NgayBatDau: gt.NgayBatDau?.toISOString(),
        NgayKetThuc: gt.NgayKetThuc?.toISOString(),
      })),
      chuongtrinhtap: chuongtrinhtap.map((ct) => ({
        idChuongTrinhTap: ct.idChuongTrinhTap,
        TenCTT: ct.TenCTT,
        MucTieu: ct.MucTieu,
        ThoiGian: ct.ThoiGian,
      })),
      thucdon: thucdon.map((td) => ({
        idThucDon: td.idThucDon,
        TenThucDon: td.TenThucDon,
        SoCalo: td.SoCalo,
        NgayBatDau: td.NgayBatDau?.toISOString(),
      })),
      huanluyenvien: huanluyenvien.map((hlv) => ({
        idMaHLV: hlv.idMaHLV,
        Ten: hlv.user?.Ten || 'Không xác định',
        ChuyenMon: hlv.ChuyeMon,
        ChungChi: hlv.ChungChi,
        BangCap: hlv.BangCap,
        GioiTinh: hlv.user?.GioiTinh === 1 ? 'Nam' : 'Nữ',
        SoDienThoai: hlv.user?.SoDienThoai,
      })),
      lophoc: lophoc.map((lh) => ({
        idMaLH: lh.idMaLH,
        Ten: lh.Ten,
        TheLoai: lh.TheLoai,
        MoTa: lh.MoTa,
        ThoiGianBatDau: lh.ThoiGianBatDau?.toISOString(),
        SoLuong: lh.SoLuong,
      })),
      thehoivien: thehoivien.map((thv) => ({
        idMaThe: thv.idMaThe,
        NgayCap: thv.NgayCap?.toISOString(),
        NgayHetHan: thv.NgayHetHan?.toISOString(),
        TinhTrang: thv.TinhTrang,
        MaHV: thv.MaHV,
      })),
    };

    return NextResponse.json(publicData, { status: 200 });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu công khai:', error);
    return NextResponse.json({ error: 'Lỗi server khi lấy dữ liệu công khai' }, { status: 500 });
  }
}