import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // มี token แล้วแต่จะเข้า login/register → กลับไปหน้าแรก
  if (token && req.nextUrl.pathname.startsWith("/auth/loginAndRegister")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ไม่มี token และพยายามเข้า path อื่น → บังคับไป login
  if (!token && !req.nextUrl.pathname.startsWith("/auth/loginAndRegister")) {
    return NextResponse.redirect(new URL("/auth/loginAndRegister", req.url));
  }

  // ผ่านเงื่อนไข → ให้ไปต่อ
  return NextResponse.next();
}

export const config = {
  matcher: ["/" , '/auth/loginAndRegister'], // จับทุก path ยกเว้น asset
};
