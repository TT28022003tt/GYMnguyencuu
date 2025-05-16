import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    await prisma.phanhoi.delete({
      where: { idMaPH: id },
    });
    return NextResponse.json({ message: "Feedback deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete feedback" }, { status: 500 });
  }
}