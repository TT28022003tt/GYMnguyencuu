import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../prisma/client';
import { getUser } from '@/utils/Auth';

interface AdvancedMetricsInput {
  idAdvancedMetrics: number;
  BodyFatPercent: number | null;
  MuscleMass: number | null;
  VisceralFat: number | null;
  BasalMetabolicRate: number | null;
  BoneMass: number | null;
  WaterPercent: number | null;
  Mota: string | null;
  idMaHV: number;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser(req);
    
    const role = user?.VaiTro?.toLowerCase?.();
    const allowedRoles = ['admin', 'trainer'];

    if (!user || !role || !allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Bạn Chưa Đăng Nhập hoặc Không Có Quyền' }, { status: 401 });
    }
    const idAdvancedMetrics = parseInt(params.id);
    if (isNaN(idAdvancedMetrics)) {
      return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 });
    }

    const body: AdvancedMetricsInput = await req.json();

    const existingMetric = await prisma.advancedmetrics.findUnique({
      where: { idAdvancedMetrics },
    });
    if (!existingMetric) {
      return NextResponse.json({ error: 'Chỉ số không tồn tại' }, { status: 404 });
    }

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

    const metric = await prisma.advancedmetrics.update({
      where: { idAdvancedMetrics },
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
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Lỗi khi cập nhật advancedmetrics:', error);
    return NextResponse.json({ error: 'Lỗi khi cập nhật dữ liệu: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser(req);
    if (!user || (user.VaiTro !== 'admin' && user.VaiTro !== 'trainer')) {
      return NextResponse.json({ error: 'Bạn Chưa Đăng Nhập hoặc Không Có Quyền' }, { status: 401 });
    }

    const idAdvancedMetrics = parseInt(params.id);
    if (isNaN(idAdvancedMetrics)) {
      return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 });
    }

    const existingMetric = await prisma.advancedmetrics.findUnique({
      where: { idAdvancedMetrics },
    });
    if (!existingMetric) {
      return NextResponse.json({ error: 'Chỉ số không tồn tại' }, { status: 404 });
    }

    await prisma.advancedmetrics.delete({
      where: { idAdvancedMetrics },
    });

    return NextResponse.json({ message: 'Xóa thành công' }, { status: 200 });
  } catch (error: any) {
    console.error('Lỗi khi xóa advancedmetrics:', error);
    return NextResponse.json({ error: 'Lỗi khi xóa dữ liệu: ' + error.message }, { status: 500 });
  }
}