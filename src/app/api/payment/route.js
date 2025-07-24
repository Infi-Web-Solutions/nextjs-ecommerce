import Stripe from "stripe";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { getUserFromToken } from "../../../lib/auth";

const stripe = new Stripe(process.env.PAY_SECRET);


export async function POST(req) {
  try {
    const { product } = await req.json();
    const lang = req.headers.get("x-language") || "en";
    console.log("Product in payment route:", req);

    const user = await getUserFromToken(req);
    console.log("User from token in payment route:", user);
    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }



    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: product.name?.[lang] || product.name?.en || "Product",
              description: product.description?.[lang] || product.description?.en || "",
            },
            unit_amount: product.price * 100,
          },
          quantity: 1, 
        },

      ],
      metadata: {
        productId: product._id,
        productName: product.name?.[lang] || product.name?.en,
        price: product.price,
        userId: user.userId,
        email: user.email,
      },

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/user/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/user/products`,
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (err) {
    console.error("Stripe Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}