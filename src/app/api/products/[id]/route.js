export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/product";
import { translateText } from "@/lib/translate";
import { writeFile } from "fs/promises";
import path from "path";
import { jwtVerify } from "jose";


export async function GET(req, { params }) {
  try {
    const { id } = await params;

    await connectToDatabase();
    const product = await Product.findById(id);
    console.log("Product fetched:", product);

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


// export async function PUT(req, { params }) {
//     try {
//       const { id } = await params;
//       console.log("Updating product with ID:", id);

//         const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { payload } = await jwtVerify(
//       token,
//       new TextEncoder().encode(process.env.JWT_SECRET)
//     );

//     const permissions = payload.permissions || [];


//     if (!permissions.includes("product_update_product")) {
//       return NextResponse.json({ error: "Permission denied" }, { status: 403 });
//     }
//         await connectToDatabase();
//         const formData = await req.formData();

//         const updateData = {};
//         for (const [key, value] of formData.entries()) {
//             if (key === "image" && value.size > 0) {
//                 const filename = `${Date.now()}_${value.name}`;
//                 const bytes = await value.arrayBuffer();
//                 const buffer = Buffer.from(bytes);
//                 const filePath = path.join(process.cwd(), "public", "uploads", filename);
//                 await writeFile(filePath, buffer);
//                 updateData.image = filename;
//             } else {
//                 updateData[key] = value;
//             }
//         }

//         const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
//         return NextResponse.json({ success: true, data: updatedProduct });
//     } catch (err) {
//         return NextResponse.json({ success: false, error: err.message }, { status: 500 });
//     }
// }

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    console.log("Updating product with ID:", id);

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    // Removed permission check - all authenticated admin users can update products


    await connectToDatabase();
    const formData = await req.formData();
    const updateData = {};

    const nameEn = formData.get("nameEn");
    const descEn = formData.get("descEn");
    const price = formData.get("price");
    const stock = formData.get("stock");
    const category = formData.get("category");
    const image = formData.get("image");

    // Handle image upload
    if (image && image.size > 0) {
      const filename = `${Date.now()}_${image.name}`;
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(process.cwd(), "public", "uploads", filename);
      await writeFile(filePath, buffer);
      updateData.image = filename;
    }

    // Translate name if provided
    if (nameEn) {
      updateData.name = {
        en: nameEn,
        fr: await translateText(nameEn, "fr"),
        de: await translateText(nameEn, "de"),
      };
    }

    // Translate description if provided
    if (descEn) {
      updateData.description = {
        en: descEn,
        fr: await translateText(descEn, "fr"),
        de: await translateText(descEn, "de"),
      };
    }

    // Add other fields
    if (price) updateData.price = Number(price);
    if (stock) updateData.stock = Number(stock);
    if (category) updateData.category = category;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json({ success: true, data: updatedProduct });

  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}