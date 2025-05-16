import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    const nutritions = await prisma.thucdon.findMany({
      where: userId ? { hocvien: { idUSER: parseInt(userId) } } : {},
      include: {
        hocvien: {
          include: {
            user: { select: { idUser: true, Ten: true } },
            huanluyenvien: {
              include: { user: { select: { Ten: true } } },
            },
          },
        },
      },
    });

    const formattedNutritions = nutritions.map((nutrition) => ({
      id: nutrition.hocvien.idUSER,
      nutritionId: nutrition.idThucDon,
      customerName: nutrition.hocvien.user.Ten || "N/A",
      trainerName: nutrition.hocvien.huanluyenvien.user.Ten || "N/A",
      goal: nutrition.TenThucDon || "N/A",
      caloricNeeds: nutrition.SoCalo,
      startDate: nutrition.NgayBatDau
        ? nutrition.NgayBatDau.toISOString().split("T")[0]
        : "N/A",
    }));

    console.log("API response:", formattedNutritions); // Debug
    return NextResponse.json(formattedNutritions);
  } catch (error) {
    console.error("Error fetching nutritions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
