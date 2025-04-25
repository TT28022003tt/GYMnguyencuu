import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';
import { getUser } from '@/utils/Auth';

interface AdvancedMetricsInput {
  BodyFatPercent: number | null;
  MuscleMass: number | null;
  VisceralFat: number | null;
  BasalMetabolicRate: number | null;
  BoneMass: number | null;
  WaterPercent: number | null;
  Mota: string | null;
  idMaHV: number;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Bạn Chưa Đăng Nhập' }, { status: 401 });
    }

    const metrics = await prisma.advancedmetrics.findMany({
      orderBy: { idAdvancedMetrics: 'desc' },
      include: {
        hocvien: {
          include: {
            user: {
              select: { Ten: true },
            },
          },
        },
      },
    });

    const formattedMetrics = metrics.map(metric => ({
      ...metric,
      Ten: metric.hocvien?.user?.Ten || 'Không xác định',
    }));

    return NextResponse.json(formattedMetrics, { status: 200 });
  } catch (error: any) {
    console.error('Lỗi khi lấy advancedmetrics:', error);
    return NextResponse.json({ error: 'Lỗi khi lấy dữ liệu: ' + error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user || (user.VaiTro !== 'admin' && user.VaiTro !== 'trainer')) {
      return NextResponse.json({ error: 'Bạn Chưa Đăng Nhập hoặc Không Có Quyền' }, { status: 401 });
    }

    const body: AdvancedMetricsInput = await req.json();

    const errors: string[] = [];
    if (!body.idMaHV) errors.push('Mã học viên là bắt buộc');
    const hasAdvancedData = [
      body.BodyFatPercent,
      body.MuscleMass,
      body.VisceralFat,
      body.BasalMetabolicRate,
      body.BoneMass,
      body.WaterPercent,
    ].some((value) => value !== null && value !== undefined && value >= 0);
    if (!hasAdvancedData) {
      errors.push('Vui lòng cung cấp ít nhất một chỉ số nâng cao');
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
    }

    const existingHocVien = await prisma.hocvien.findUnique({
      where: { idMaHV: body.idMaHV },
      include: { user: { select: { Ten: true } } },
    });
    if (!existingHocVien) {
      return NextResponse.json({ error: 'Mã học viên không tồn tại' }, { status: 400 });
    }

    const metric = await prisma.advancedmetrics.create({
      data: {
        idMaHV: body.idMaHV,
        BodyFatPercent: body.BodyFatPercent,
        MuscleMass: body.MuscleMass,
        VisceralFat: body.VisceralFat,
        BasalMetabolicRate: body.BasalMetabolicRate,
        BoneMass: body.BoneMass,
        WaterPercent: body.WaterPercent,
        Mota: body.Mota,
      },
      include: {
        hocvien: {
          include: {
            user: {
              select: { Ten: true },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { ...metric, Ten: metric.hocvien?.user?.Ten || 'Không xác định' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Lỗi khi lưu advancedmetrics:', error);
    return NextResponse.json({ error: 'Lỗi khi lưu dữ liệu: ' + error.message }, { status: 500 });
  }
}