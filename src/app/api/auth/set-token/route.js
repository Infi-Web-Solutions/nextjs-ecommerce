// /app/api/auth/set-token/route.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  console.log("Retrieved session token:", token);

  if (!token?.customToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const response = NextResponse.redirect(new URL("/user/products", request.url));

  response.cookies.set("token", token.customToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax", // important for local dev
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
