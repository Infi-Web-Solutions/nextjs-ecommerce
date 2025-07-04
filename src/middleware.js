import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const redirectTo = (path) => NextResponse.redirect(new URL(path, request.url));

  if (!token) {
    if (pathname.startsWith("/admin")) return redirectTo("/admin/login");
    if (pathname.startsWith("/auth")) return redirectTo("/auth/login");
    if (pathname.startsWith("/user")) return redirectTo("/auth/login");
    return redirectTo("/auth/login");
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const roleId = String(payload.roleId);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-role-id", roleId);

    // Allow only roleId 1 or 2 to access /admin
    if (pathname.startsWith("/admin") && !["1", "2"].includes(roleId)) {
      return redirectTo("/unauthorized");
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (err) {
    console.error("JWT verify failed:", err.message);
    return redirectTo("/auth/login");
  }
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path((?!login).*)",
    "/staff",
    "/staff/:path*",
    "/user",
    "/user/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/profile",
  ],
};
