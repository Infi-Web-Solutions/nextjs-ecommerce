import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectToDatabase from "@/lib/mongodb";
import Subscription from "@/models/subscription";

const stripe = new Stripe(process.env.PAY_SECRET);

export async function POST(req) {
  const rawBody = await req.arrayBuffer();
  const bodyBuffer = Buffer.from(rawBody);
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      bodyBuffer,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const subscriptionId = session.subscription;


    try {

      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ["items.data"],


      });
      // console.log("Subscription raw:", JSON.stringify(subscription, null, 2));

      const periodStartUnix = subscription.items.data[0]?.current_period_start;
      const periodEndUnix = subscription.items.data[0]?.current_period_end;
      let parsedFeatures = [];
      try {
        parsedFeatures = JSON.parse(session.metadata.features || "[]");

       
        parsedFeatures = parsedFeatures.map((f) => ({
          name: f.name?.trim().toLowerCase(),
          description: f.description || `Access to ${f.name}`,
          enabled: f.enabled !== false, 
        }));
      } catch (err) {
        console.warn("Invalid features metadata format:", err.message);
        parsedFeatures = [];
      }

      await connectToDatabase();



      await Subscription.create({
        userId: session.metadata.userId,
        stripeCustomerId: subscription.customer,
        stripeSubscriptionId: subscription.id,
        planName: session.metadata.planName,
        priceId: subscription.items.data[0].price.id,
        status: subscription.status,
        features: parsedFeatures,

        currentPeriodStart: periodStartUnix ? new Date(periodStartUnix * 1000) : null,
        currentPeriodEnd: periodEndUnix ? new Date(periodEndUnix * 1000) : null,

      });
      console.log("Webhook metadata.features:", session.metadata.features);


      // console.log(" Subscription saved to database");
    } catch (error) {
      console.error("Database Save Error:", error.message);
    }
  }

  return NextResponse.json({ received: true });


}
