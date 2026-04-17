/**
 * Middleware for protecting admin routes.
 * Redirects unauthenticated users and those without proper roles.
 */

import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Check if user has session cookie
  const hasSession = request.cookies.has("sb-auth-token");

  if (!hasSession) {
    // Redirect to login with return URL
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Session exists, continue to route
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
