// models/subscription.js
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    stripeCustomerId: {
      type: String,
      required: true,
    },
    stripeSubscriptionId: {
      type: String,
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    priceId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },

features: {
  type: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      enabled: { type: Boolean, default: true },
    }
  ],
  required: true,
},


    currentPeriodStart: {
      type: Date,
    },

    currentPeriodEnd: {
      type: Date,
    }

  },
  { timestamps: true }
);

export default mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);
