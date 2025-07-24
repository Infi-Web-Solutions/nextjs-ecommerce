import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/createuser";

export async function POST(req) {
  await connectToDatabase();
  const { token, name, password } = await req.json();

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.INVITE_SECRET);
  } catch (err) {
    return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
  }

  const { email, roleid, organizationId } = decoded;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ success: false, message: "User already exists" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    name,
    password: hashed,
    roleid,
    organizationId,
  });

  return NextResponse.json({ success: true, user: newUser }, { status: 201 });
}
