
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/auth";
import connecToDatabase from "@/lib/mongodb";

export async function POST(req) {
  try {
    await connecToDatabase();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("creaetd token while login time",token)

    const response = NextResponse.json({
      success: true,
      user: { name: user.name, role: user.role },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false, // in dev
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
