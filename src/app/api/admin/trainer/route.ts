import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET() {
  try {
    const trainers = await prisma.huanluyenvien.findMany({
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
      },
    });

    const formattedTrainers = trainers.map((trainer) => ({
      id: trainer.user.idUser,
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
    }));

    return NextResponse.json(formattedTrainers);
  } catch (error) {
    console.error("Error fetching trainers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { ten, ngaySinh, gioiTinh, diaChi, soDienThoai, email, chungChi, bangCap, chuyenMon, luong, photo } = data;

    // Create user first
    const user = await prisma.user.create({
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

    // Create trainer
    const trainer = await prisma.huanluyenvien.create({
      data: {
        ChungChi: chungChi,
        BangCap: bangCap,
        ChuyeMon: chuyenMon,
        Luong: luong ? parseFloat(luong) : null,
        idUser: user.idUser,
      },
    });

    return NextResponse.json({ id: user.idUser, idMaHLV: trainer.idMaHLV });
  } catch (error) {
    console.error("Error creating trainer:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

