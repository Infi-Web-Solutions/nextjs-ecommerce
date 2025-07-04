import { saveImageToUploads } from "@/lib/saveImage";
import Product from "../../../models/product";
import connecToDatabase from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const file = formData.get("image");

 
    const filename = await saveImageToUploads(file);

    await connecToDatabase();

    const newProduct = await Product.create({
      name: formData.get("name"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      category: formData.get("category"),
      image: filename || "", 
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (err) {
    console.error("Product upload error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connecToDatabase();

    const products = await Product.find();

    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}