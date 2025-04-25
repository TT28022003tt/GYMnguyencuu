import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET() {
    const data = await prisma.chitietkhuyenmai.findMany();
    return NextResponse.json({ data, message: "Lấy Danh Sách Thành Công" }, { status: 200 });
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const newData = await prisma.chitietkhuyenmai.create({ data: body });
    return NextResponse.json({ data: newData, message: "Thêm Danh Sách Thành Công" }, { status: 201 });
}

export async function DELETE() {
    await prisma.chitietkhuyenmai.deleteMany();
    return NextResponse.json({ message: "Xóa Danh Sách Thành Công" }, { status: 200 });
}
