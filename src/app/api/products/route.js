// import { saveImageToUploads } from "@/lib/saveImage";
// import Product from "@/models/product";
// import connecToDatabase from "@/lib/mongodb";
// import { NextResponse } from "next/server";
// import { translateText } from "../../../lib/translate"; // ✅ import your reusable translation logic

// export async function POST(req) {
//   try {
//     const formData = await req.formData();

//     const nameEn = formData.get("name");
//     const descEn = formData.get("description");

//     const [nameFr, nameDe, descFr, descDe] = await Promise.all([
//       translateText(nameEn, "fr"),
//       translateText(nameEn, "de"),
//       translateText(descEn, "fr"),
//       translateText(descEn, "de"),
//     ]);

//     const file = formData.get("image");
//     const filename = file ? await saveImageToUploads(file) : null;

//     await connecToDatabase();

//     const newProduct = await Product.create({
//       name: {
//         en: nameEn,
//         fr: nameFr,
//         de: nameDe,
//       },
//       description: {
//         en: descEn,
//         fr: descFr,
//         de: descDe,
//       },
//       price: Number(formData.get("price")),
//       stock: Number(formData.get("stock")),
//       category: formData.get("category") || "General",
//       image: filename || "",
//     });

//     return NextResponse.json({ success: true, data: newProduct }, { status: 201 });

//   } catch (err) {
//     console.error("Product POST error:", err);
//     return NextResponse.json({ success: false, error: err.message }, { status: 500 });
//   }
// }

// app/api/products/route.js
import { saveImageToUploads } from "@/lib/saveImage";
import connecToDatabase from "@/lib/mongodb";
import Product from "@/models/product";
import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { translateText } from "@/lib/translate";
import Organization from "../../../models/organization";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const nameEn = formData.get("nameEn");
    const descEn = formData.get("descEn");
    const price = formData.get("price");
    const stock = formData.get("stock");
    const category = formData.get("category") || "General";
    const image = formData.get("image");

    const user = await getUserFromToken(req);
    await connecToDatabase();

    // Translate
    const name = {
      en: nameEn,
      fr: await translateText(nameEn, "fr"),
      de: await translateText(nameEn, "de"),
    };

    const description = {
      en: descEn,
      fr: await translateText(descEn, "fr"),
      de: await translateText(descEn, "de"),
    };

    const filename = image ? await saveImageToUploads(image) : "";

    const newProduct = await Product.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      image: filename,
      organizationId: user.organizationId,
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (err) {
    console.error("Product POST error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connecToDatabase();

    // Step 1: Get slug from custom header
    const slug = req.headers.get("x-org-slug");
    console.log("slugslug",slug)
    if (!slug) {
      return NextResponse.json({ success: false, error: "Missing organization slug in headers" }, { status: 400 });
    }

    // Step 2: Find organization by slug
    const organization = await Organization.findOne({ slug });
    if (!organization) {
      return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 });
    }

    // Step 3: Fetch products for this organization
    const products = await Product.find({ organizationId: organization._id });

    // Step 4: Log the result
    console.log(`Fetched ${products.length} products for org: ${organization.name} (${slug})`);
    console.log(products);

    // Step 5: Return
    return NextResponse.json({ success: true, data: products }, { status: 200 });

  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}
