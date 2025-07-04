import mongoose from "mongoose";


const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true, // e.g. "ORD123456"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: true, // in INR (₹)
    },
    paymentIntentId: {
      type: String,
      required: true, 
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "failed", "refunded"],
      default: "paid",
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled", "rejected"],
      default: "processing",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);



export default mongoose.models.Order || mongoose.model("Order", orderSchema);
