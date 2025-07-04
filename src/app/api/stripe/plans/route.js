import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth"; 

const stripe = new Stripe(process.env.PAY_SECRET);

export async function POST(req) {
  try {
    const { priceId } = await req.json();
    const user = await getUserFromToken(req);

    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const price = await stripe.prices.retrieve(priceId, {
      expand: ["product"],
    });

    const product = price.product
    const planName = price.product.metadata?.planName || "custom";

    const features = Object.entries(product.metadata || {})
      .filter(([key]) => key.startsWith("feature"))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => {
        const name = value.trim().toLowerCase();
        return {
          name,
          description: `Access to ${name}`,
          enabled: true,
        };
      });

    console.log("Extracted Features from product.metadata:", features);


    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.userId,        
        planName: planName,         
        email: user.email,
        features: JSON.stringify(features),        
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/plans`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/plans`,
    });

    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error("Stripe Subscribe Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}



export async function GET() {
  try {
    const prices = await stripe.prices.list({
      expand: ["data.product"],
      active: true,
      recurring: { interval: "month" },
    });

    const plansWithFeatures = prices.data.map((price) => {
      const product = price.product;
      const metadata = product.metadata || {};
      const planName = metadata.planName || "custom";

      const features = Object.entries(metadata)
        .filter(([key]) => key.startsWith("feature"))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, value]) => value);

      return {
        id: price.id,
        name: product.name,
        description: product.description,
        price: price.unit_amount,
        features,
        planName
      };
    });

    return NextResponse.json({ success: true, plans: plansWithFeatures });
  } catch (err) {
    console.error("Stripe Fetch Plans Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

