import { NextResponse } from "next/server";
import connecToDatabase from "@/lib/mongodb";
import User from "@/models/createuser"; 
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
