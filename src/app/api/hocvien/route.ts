import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/utils/Auth';
import prisma from '../../../../prisma/client';

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Vui lòng đăng nhập' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const idUser = searchParams.get('idUser');
  const idMaHV = searchParams.get('idMaHV');

  try {
    if (idMaHV) {
      // Tìm học viên theo idMaHV
      const hocvien = await prisma.hocvien.findUnique({
        where: { idMaHV: parseInt(idMaHV) },
        select: { idMaHV: true },
      });

      if (!hocvien) {
        return NextResponse.json({ error: 'Mã học viên không tồn tại' }, { status: 404 });
      }

      return NextResponse.json(hocvien);
    } else if (idUser) {
      // Tìm học viên theo idUser
      const hocvien = await prisma.hocvien.findFirst({
        where: { idUSER: parseInt(idUser) },
        select: { idMaHV: true },
      });

      if (!hocvien) {
        return NextResponse.json({ error: 'Không tìm thấy học viên' }, { status: 404 });
      }

      return NextResponse.json(hocvien);
    } else {
      // Trả về toàn bộ danh sách học viên
      const hocviens = await prisma.hocvien.findMany({
        include: { user: { select: { Ten: true } } },
      });

      return NextResponse.json(
        hocviens.map((hv) => ({
          idMaHV: hv.idMaHV,
          Ten: hv.user?.Ten || 'Không xác định',
        }))
      );
    }
  } catch (error) {
    console.error('Lỗi khi xử lý học viên:', error);
    return NextResponse.json({ error: 'Lỗi server khi lấy thông tin học viên' }, { status: 500 });
  }
}