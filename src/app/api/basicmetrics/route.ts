import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';
import { getUser } from '@/utils/Auth';

interface BasicMetricsInput {
  Height: number | null;
  Weight: number | null;
  Chest: number | null;
  Waist: number | null;
  hips: number | null;
  Arm: number | null;
  Thigh: number | null;
  Calf: number | null;
  BMI?: number | null;
  Mota: string | null;
  idMaHV: number;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Chưa Đăng Nhập' }, { status: 401 });
    }

    const metrics = await prisma.basicmetrics.findMany({
      orderBy: { idBasicMetrics: 'desc' },
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
    console.error('Lỗi khi lấy basicmetrics:', error);
    return NextResponse.json({ error: 'Lỗi khi lấy dữ liệu: ' + error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user || (user.VaiTro !== 'admin' && user.VaiTro !== 'trainer')) {
      return NextResponse.json({ error: 'Bạn Chưa Đăng Nhập hoặc Không Có Quyền' }, { status: 401 });
    }

    const body: BasicMetricsInput = await req.json();

    const errors: string[] = [];
    if (!body.Height) errors.push('Chiều cao là bắt buộc');
    if (!body.Weight) errors.push('Cân nặng là bắt buộc');
    if (!body.idMaHV) errors.push('Mã học viên là bắt buộc');
    if (body.Height && body.Height <= 0) errors.push('Chiều cao phải lớn hơn 0');
    if (body.Weight && body.Weight <= 0) errors.push('Cân nặng phải lớn hơn 0');

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

    const BMI = body.BMI || (body.Weight && body.Height
      ? body.Weight / ((body.Height / 100) ** 2)
      : null);

    const metric = await prisma.basicmetrics.create({
      data: {
        idMaHV: body.idMaHV,
        Height: body.Height,
        Weight: body.Weight,
        Chest: body.Chest,
        Waist: body.Waist,
        hips: body.hips,
        Arm: body.Arm,
        Thigh: body.Thigh,
        Calf: body.Calf,
        BMI,
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
    console.error('Lỗi khi lưu basicmetrics:', error);
    return NextResponse.json({ error: 'Lỗi khi lưu dữ liệu: ' + error.message }, { status: 500 });
  }
}