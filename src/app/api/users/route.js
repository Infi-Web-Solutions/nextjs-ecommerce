export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import connecToDatabase from "@/lib/mongodb";
import User from "@/models/auth";
import { parse } from "url";

export async function GET(req) {
  try {
    await connecToDatabase();

    // Parse query parameters from the request URL
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("orgId");

    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: "Missing organizationId in query" },
        { status: 400 }
      );
    }

    // Optional: validate that the ID is a valid MongoDB ObjectId
    if (!organizationId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, error: "Invalid organizationId" },
        { status: 400 }
      );
    }

    // Find all users matching the organization ID
    const users = await User.find({ organization: organizationId });

    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (err) {
    console.error("Get users error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
 