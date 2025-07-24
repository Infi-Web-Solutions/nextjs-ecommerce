import mongoose from "mongoose";

const translationSchema = new mongoose.Schema({
  en: { type: String, required: true },
  fr: { type: String },
  de: { type: String },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: translationSchema,
  description: translationSchema,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: { type: String, default: "General" },
  image: String,
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);
