// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const isMobile = /iPhone|Android|Mobile/i.test(ua);

  const { pathname } = request.nextUrl;

  // "/"로 들어오는 경우에만 모바일 체크
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = isMobile ? "/mobile" : "/integrations";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
