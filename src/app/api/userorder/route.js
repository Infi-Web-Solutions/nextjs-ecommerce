import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import mongoose from "mongoose";
import connecToDatabase from "@/lib/mongodb";
import Order from "@/models/orders";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const userId = payload.userId;

    await connecToDatabase();

    const orders = await Order.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).populate("productId");

    return NextResponse.json({ success: true, data: orders });
  } catch (err) {
    console.error("UserOrders GET Error:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
