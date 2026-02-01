import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 🚨 수정된 부분: 'export default'를 사용하여 명시적으로 내보냅니다.
export default function middleware(request: NextRequest) {
  // 1. 쿠키에서 accessToken을 가져옵니다.
  const token = request.cookies.get("accessToken")?.value;

  // 2. 비로그인 상태로 메인 접근 시 -> 로그인 페이지로 튕겨냅니다.
  // (로그인 페이지가 아닌 곳에 접근하려고 할 때만 동작)
  if (!token && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. 로그인 상태로 로그인 페이지 접근 시 -> 메인 페이지로 보냅니다.
  if (token && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// 미들웨어가 적용될 경로 설정 (이미지, API, 정적 파일 등은 제외)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
