import { NextResponse } from "next/server";
import connecToDatabase from "@/lib/mongodb";
import Order from "../../../models/orders";
import Product from "@/models/product";
import { jwtVerify } from "jose";

import { getUserFromToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connecToDatabase();

    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { product, quantity = 1, paymentIntentId } = await req.json();
    const orderId = "ORD" + Date.now(); 

    const order = new Order({
      orderId,
      userId: user.userId,
      email: user.email,
      productId: product._id,
      productName: product.name,
      quantity,
      price: product.price * quantity,
      paymentIntentId,
      paymentStatus: "paid",
      orderStatus: "processing",
    });
    await order.save();

    return NextResponse.json({ success: true, message: "Order saved", order });
  } catch (err) {
    console.error("Order Save Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

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

    const permissions = payload.permissions || [];

    if (!permissions.includes("order_view")) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await connecToDatabase();

    const orders = await Order.find().populate("productId");

    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (err) {
    console.error("Order GET Error:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}