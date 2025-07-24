export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import connecToDatabase from "@/lib/mongodb";
import Product from "@/models/product";
import { translateText } from "@/lib/translate";
import { writeFile } from "fs/promises";
import path from "path";
import { jwtVerify } from "jose";


export async function GET(req, { params }) {
  try {
    const id = params.id;

    await connecToDatabase();
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
//       console.log("Updating product with ID:", params.id);

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
//         await connecToDatabase();
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

//         const updatedProduct = await Product.findByIdAndUpdate(params.id, updateData, { new: true });
//         return NextResponse.json({ success: true, data: updatedProduct });
//     } catch (err) {
//         return NextResponse.json({ success: false, error: err.message }, { status: 500 });
//     }
// }

export async function PUT(req, { params }) {
  try {
    console.log("Updating product with ID:", params.id);

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const permissions = payload.permissions || [];
    if (!permissions.includes("product_update_product")) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    await connecToDatabase();
    const formData = await req.formData();
    const updateData = {};
    let nameEn = null;
    let descEn = null;

    for (const [key, value] of formData.entries()) {
      if (key === "image" && value.size > 0) {
        const filename = `${Date.now()}_${value.name}`;
        const bytes = await value.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(process.cwd(), "public", "uploads", filename);
        await writeFile(filePath, buffer);
        updateData.image = filename;
      } else if (key === "name") {
        const nameObj = JSON.parse(value);
        nameEn = nameObj.en;
      } else if (key === "description") {
        const descObj = JSON.parse(value);
        descEn = descObj.en;
      }
      else {
        updateData[key] = value;
      }
    }

    // If name or description is updated in English, auto-translate others
    if (nameEn || descEn) {
      const existing = await Product.findById(params.id).lean();

      if (nameEn) {
        updateData.name = {
          en: nameEn,
          fr: await translateText(nameEn, "fr"),
          de: await translateText(nameEn, "de"),
        };
      } else {
        updateData.name = existing.name;
      }

      if (descEn) {
        updateData.description = {
          en: descEn,
          fr: await translateText(descEn, "fr"),
          de: await translateText(descEn, "de"),
        };
      } else {
        updateData.description = existing.description;
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(params.id, updateData, { new: true });
    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    await connecToDatabase();

    const deletedProduct = await Product.findByIdAndDelete(params.id);

    if (!deletedProduct) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}