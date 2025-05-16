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
      gioiTinh: trainer.user.GioiTinh || "N/A",
      chungChi: trainer.ChungChi,
      bangCap: trainer.BangCap,
      chuyenMon: trainer.ChuyeMon,
      email: trainer.user.Email,
      luong: trainer.Luong ? parseFloat(trainer.Luong.toString()) : null,
      photo: trainer.user.Anh || "/images/default-avatar.png",
    }));

    return NextResponse.json(formattedTrainers);
  } catch (error) {
    console.error("Error fetching trainers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}