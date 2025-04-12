import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import prisma from "../../prisma/client";

const JWT_SECRET = process.env.JWT_SECRET||""
export async function getUser(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  const decoded:any = jwt.verify(token,JWT_SECRET)
  if (!decoded) return null;


  const user = await prisma.taikhoan.findUnique({ where: { idMaTK:decoded.idMaTK }, select:{
    idMaTK:true,
    token:true,
    idUser:true,
    VaiTro:true,
    MatKhau:true,user:true

  }});
  if (!user) return null;

  return user

}
