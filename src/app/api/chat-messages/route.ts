import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/lib/decrypt';
import prisma from '../../../../prisma/client';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Vui lòng đăng nhập để lưu tin nhắn' }, { status: 401 });
  }

  try {
    const decoded: any = await decrypt(token);
    if (!decoded.idMaTK) {
      return NextResponse.json({ error: 'Token không hợp lệ' }, { status: 401 });
    }

    const { idUser, from, Text, Timestamp } = await req.json();

    if (!idUser || !from || !Text || !Timestamp) {
      return NextResponse.json({ error: 'Thiếu trường bắt buộc' }, { status: 400 });
    }

    const user = await prisma.taikhoan.findUnique({
      where: { idMaTK: decoded.idMaTK },
      select: { idUser: true },
    });
    if (!user || user.idUser !== idUser) {
      return NextResponse.json({ error: 'Không có quyền lưu tin nhắn cho người dùng này' }, { status: 403 });
    }

    const message = await prisma.chatmessage.create({
      data: {
        idUser,
        from,
        Text,
        Timestamp: new Date(Timestamp),
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Lỗi khi lưu tin nhắn:', error);
    return NextResponse.json({ error: 'Không thể lưu tin nhắn' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Vui lòng đăng nhập để xem lịch sử chat' }, { status: 401 });
  }

  try {
    const decoded: any = await decrypt(token);
    if (!decoded.idMaTK) {
      return NextResponse.json({ error: 'Token không hợp lệ' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const idUser = parseInt(searchParams.get('idUser') || '0');

    if (!idUser) {
      return NextResponse.json({ error: 'Thiếu idUser' }, { status: 400 });
    }

    const user = await prisma.taikhoan.findUnique({
      where: { idMaTK: decoded.idMaTK },
      select: { idUser: true },
    });
    if (!user || user.idUser !== idUser) {
      return NextResponse.json({ error: 'Không có quyền xem lịch sử chat của người dùng này' }, { status: 403 });
    }

    const messages = await prisma.chatmessage.findMany({
      where: { idUser },
      orderBy: { Timestamp: 'asc' },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử chat:', error);
    return NextResponse.json({ error: 'Không thể lấy lịch sử chat' }, { status: 500 });
  }
}