
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/createuser";
import connecToDatabase from "@/lib/mongodb";
import { getUserPermissions } from "@/lib/auth"; 

export async function POST(req) {
  try {
    await connecToDatabase();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

  
    const permissions = await getUserPermissions(user.roleid);


    const token = jwt.sign(
      {
        userId: user._id,
        roleId: user.roleid,
        permissions,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      success: true,
      user: { name: user.name, roleId: user.roleid },
    });

    
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}