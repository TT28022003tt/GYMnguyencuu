import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET() {
  try {
    const memberships = await prisma.chitietgoitap.findMany({
      include: {
        goitap: { select: { idMaGT: true, Ten: true } },
        user: { select: { idUser: true, Ten: true } },
      },
    });

    const formattedMemberships = memberships.map((membership) => ({
      id: membership.idchitietgoitap,
      cardId: membership.idMaGT,
      accountId: membership.idchitietgoitap.toString(),
      memberName: membership.user.Ten || "N/A",
      startDate: membership.NgayDangKy
        ? membership.NgayDangKy.toISOString().split("T")[0]
        : "N/A",
      endDate: membership.NgayHetHan
        ? membership.NgayHetHan.toISOString().split("T")[0]
        : "N/A",
      cardType: membership.goitap.Ten || "N/A",
      status: membership.TinhTrang === 1 ? "Ongoing" : "Completed",
    }));

    console.log("API response:", formattedMemberships); 
    return NextResponse.json(formattedMemberships);
  } catch (error) {
    console.error("Error fetching memberships:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { membershipId, status } = await request.json();

    if (!membershipId || !["Ongoing", "Completed"].includes(status)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const updatedMembership = await prisma.chitietgoitap.update({
      where: { idchitietgoitap: membershipId },
      data: { TinhTrang: status === "Ongoing" ? 1 : 0 },
    });

    console.log("Updated membership:", updatedMembership); 
    return NextResponse.json({
      membershipId: updatedMembership.idchitietgoitap,
      status: updatedMembership.TinhTrang === 1 ? "Ongoing" : "Completed",
    });
  } catch (error) {
    console.error("Error updating membership:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}