// import { NextResponse } from "next/server";
// import connecToDatabase from "@/lib/mongodb";
// import User from "@/models/auth"; 

// export async function POST(req) {
//     try {
//         await connecToDatabase();

//         const { name, email, contact, password } = await req.json();

//         const newuser = await User.create({
//             name,
//             email,
//             contact,
//             password,
//         });

//         return NextResponse.json(
//             { success: true, data: newuser }, { status: 201 }
//         );
//     } catch (err) {
//         console.error("Signup error:", err);
//         return NextResponse.json(
//             { success: false, error: err.message },   { status: 500 }
//         ); 
//     }
// }

import { NextResponse } from "next/server";
import connecToDatabase from "@/lib/mongodb";
import User from "@/models/auth";
import Organization from "@/models/organization";

export async function POST(req) {
  try {
    await connecToDatabase();

    const { name, email, contact, password, orgSlug } = await req.json();
    console.log("Received orgSlug:", orgSlug);

    if (!orgSlug) {
      return NextResponse.json({ success: false, error: "Organization slug is missing." }, { status: 400 });
    }

    const organization = await Organization.findOne({ slug: orgSlug });
    if (!organization) {
      return NextResponse.json({ success: false, error: "Organization not found." }, { status: 404 });
    }

    const newuser = await User.create({
      name,
      email,
      contact,
      password,
      organization: organization._id,
      slug: organization.slug,
    });

    return NextResponse.json({ success: true, data: newuser }, { status: 201 });

  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

