import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/admin", "/onboarding", "/settings"];

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  const sessionCookie = request.cookies.get("__session")?.value;
  const hasSession = !!sessionCookie;

  const pathname = request.nextUrl.pathname;
  const isProtected = protectedRoutes.some((path) => pathname.startsWith(path));

  if (isProtected && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return withSecurityHeaders(NextResponse.redirect(url));
  }

  return withSecurityHeaders(response);
}
