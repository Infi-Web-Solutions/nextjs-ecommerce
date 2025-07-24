import { NextResponse } from "next/server";
import connecToDatabase from "@/lib/mongodb";
import User from "@/models/createuser";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import auth from "@/models/auth";
import "@/models/organization";
export async function POST(req) {
  try {
    await connecToDatabase();

    const body = await req.json();
    const { name, email, contact, password, roleid } = body;


    if (!name || !email || !password || !roleid) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 409 });
    }

    const newUser = await User.create({
      name,
      email,
      contact,
      password,
      roleid
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });

  } catch (error) {
    console.error("User creation error:", error);
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connecToDatabase();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("Token from cookies:", token);

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "No token found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId)
      .populate("organizationId")
      .lean();

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        organization: user.organizationId,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}