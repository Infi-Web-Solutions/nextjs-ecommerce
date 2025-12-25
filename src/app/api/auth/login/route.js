import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/auth";
import Organization from "@/models/organization";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req) {
  try {
    await connectToDatabase();

    const { email, password, orgSlug } = await req.json();

    if (!orgSlug) {
      return NextResponse.json({ success: false, message: "Missing organization slug" }, { status: 400 });
    }

    // Find user and populate organization
    const user = await User.findOne({ email }).populate("organization");

    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    if (!user.organization) {
      return NextResponse.json({ success: false, message: "User not assigned to any organization" }, { status: 403 });
    }

    // ❗ Check if subdomain slug matches user's organization
    if (user.organization.slug !== orgSlug) {
      return NextResponse.json({
        success: false,
        message: `Access denied: User does not belong to organization '${orgSlug}'`,
      }, { status: 403 });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role || "user",
        organizationId: user.organization._id,
        organizationSlug: user.organization.slug,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("JWT created at login:", token);

    // Return response
    const response = NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        organization: {
          id: user.organization._id,
          name: user.organization.name,
          slug: user.organization.slug,
        },
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false, // set true in production
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
