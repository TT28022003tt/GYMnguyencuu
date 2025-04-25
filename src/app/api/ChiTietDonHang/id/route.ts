import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ message: "Thi?u ID" }, { status: 400 });

    const data = await prisma.chitietkhuyenmai.findUnique({ where: { idMaChiTietKM: Number(id) } });
    return data ? NextResponse.json({ data, message: "L?y d? li?u th�nh c�ng" }, { status: 200 }) 
                : NextResponse.json({ message: "Kh�ng t�m th?y d? li?u" }, { status: 404 });
}

export async function PUT(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id");
    const body = await request.json();
    if (!id) return NextResponse.json({ message: "Thi?u ID" }, { status: 400 });

    const updatedData = await prisma.chitietkhuyenmai.update({ where: { idMaChiTietKM: Number(id) }, data: body });
    return NextResponse.json({ data: updatedData, message: "C?p nh?t th�nh c�ng" }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ message: "Thi?u ID" }, { status: 400 });

    await prisma.chitietkhuyenmai.delete({ where: { idMaChiTietKM: Number(id) } });
    return NextResponse.json({ message: "X�a th�nh c�ng" }, { status: 200 });
}
