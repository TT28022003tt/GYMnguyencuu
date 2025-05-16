import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET() {
  try {
    const feedbacks = await prisma.phanhoi.findMany({
      include: {
        user: {
          select: {
            idUser: true,
            Ten: true,
            Email: true,
            SoDienThoai: true,
            Anh: true,
          },
        },
      },
      orderBy: { NgayTao: "desc" },
    });

    const formattedFeedbacks = feedbacks.map((fb) => ({
      idMaPH: fb.idMaPH,
      customerName: fb.user.Ten || "Ẩn danh",
      email: fb.user.Email,
      phone: fb.user.SoDienThoai,
      sentDate: fb.NgayTao?.toISOString() || "",
      rating: fb.SoSao,
      feedbackType: fb.LoaiPhanHoi,
      content: fb.NoiDung, 
      photo: fb.user.Anh,
    }));

    return NextResponse.json(formattedFeedbacks);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch feedbacks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { noiDung, soSao, loaiPhanHoi, idUser } = await request.json();

    const feedback = await prisma.phanhoi.create({
      data: {
        NoiDung: noiDung,
        SoSao: soSao,
        LoaiPhanHoi: loaiPhanHoi,
        idUser,
        NgayTao: new Date(),
      },
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create feedback" }, { status: 500 });
  }
}