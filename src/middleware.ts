import { NextRequest, NextResponse } from "next/server";

import { decrypt } from "./app/lib/decrypt";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function middleware(req: NextRequest) {
	const token =  req.cookies.get("token")?.value
	if (!JWT_SECRET) {
		return null;
	  }

	  if((req.nextUrl.pathname ==="/login"||req.nextUrl.pathname ==="/sign-up")&& !token){
		return NextResponse.next()
	}
	
	  if (!token) {
		return NextResponse.redirect(new URL("/login", req.url));
	  }

	if((req.nextUrl.pathname ==="/login"||req.nextUrl.pathname ==="/sign-up")&& token){
		return NextResponse.redirect(new URL("/", req.url));
		
}

if (req.nextUrl.pathname === "/logout") {
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: -1,
      path: "/",
    });
    return response;
  }


	
	const decode:any = await decrypt(token)

		if(req.nextUrl.pathname.startsWith("/admin")){
			if( decode.VaiTro ==="admin"){
				return NextResponse.next();
			}else{
				return NextResponse.redirect(new URL("/", req.url));
			}
			
		}

		return NextResponse.next();
}

export const config = {
	matcher: [
		"/login",
		"/sign-up",
		"/admin/:path*",
		"/logout"
	  ],
}