import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Subscription from "@/models/subscription";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req) {
  try {
    // Extract user from JWT in cookies
    const user = await getUserFromToken(req);

    if (!user || !user.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const subscription = await Subscription.findOne({
      userId: user.userId,
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: {
        planName: subscription?.planName || "free",
        features: subscription?.features || [],
      },
    });
  } catch (err) {
    console.error("Error in /api/plans:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
