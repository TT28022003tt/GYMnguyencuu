import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(request: NextRequest) {
  try {


    const memberships = await prisma.chitietgoitap.findMany({
      include: {
        user: {
          select: {
            idUser: true,
            Ten: true,
            Email: true,
            Anh: true,
          },
        },
        goitap: {
          select: {
            idMaGT: true,
            Ten: true,
            Loai: true,
          },
        },
        huanluyenvien: {
          include: {
            user: {
              select: {
                Ten: true,
              },
            },
          },
        },
      },
    });


    const formattedMemberships = memberships.map((membership) => ({
      id: membership.idchitietgoitap,
      userId: membership.idUser,
      cardId: membership.idMaGT,
      memberName: membership.user?.Ten || "N/A",
      email: membership.user?.Email || "N/A",
      photo: membership.user?.Anh || "/images/default-avatar.png",
      startDate: membership.NgayDangKy
        ? new Date(membership.NgayDangKy).toLocaleDateString("vi-VN")
        : "N/A",
      endDate: membership.NgayHetHan
        ? new Date(membership.NgayHetHan).toLocaleDateString("vi-VN")
        : "N/A",
      cardType: membership.goitap?.Loai || "N/A",
      status: membership.TinhTrang === 1 ? "Ongoing" : "Completed",
    }));

    // Sắp xếp theo tên hội viên
    const sortedMemberships = formattedMemberships.sort((a, b) =>
      a.memberName.localeCompare(b.memberName)
    );

    return NextResponse.json(sortedMemberships, { status: 200 });
  } catch (error) {
    console.error("Error fetching memberships:", error);
    return NextResponse.json({ error: "Lỗi khi lấy danh sách hội viên" }, { status: 500 });
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