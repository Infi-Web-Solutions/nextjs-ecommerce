import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String },
    image: { type: String },
    
  },
  
);

export default mongoose.models.Product || mongoose.model("Product", productSchema);