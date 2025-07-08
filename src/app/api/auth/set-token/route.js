import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session?.customToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url)); // ✅ protected route

  // ✅ Set secure token cookie
  response.cookies.set("token", session.customToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return response;
}
