// /middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const isMobile = /iPhone|Android|Mobile/i.test(ua);

  if (request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = isMobile ? "/mobile" : "/integrations";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"], // 루트 경로만 감시
};
