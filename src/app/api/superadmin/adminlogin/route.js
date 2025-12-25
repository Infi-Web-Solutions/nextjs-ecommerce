
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/createuser";
import connectToDatabase from "@/lib/mongodb";
import { getUserPermissions } from "@/lib/auth";
import Organization from "../../../../models/organization";

// export async function POST(req) {
//   try {
//     await connectToDatabase();

//     const { email, password, orgSlug} = await req.json();
//      console.log("Login attempt:", { email, orgSlug });
//     if (!orgSlug) {
//       return NextResponse.json(
//         { success: false, message: "Missing organization slug" },
//         { status: 400 }
//       );
//     }

//     // Find user and populate organization
//     const user = await User.findOne({ email }).populate("organizationId");
//      if (!user || user.password !== password) {
//       return NextResponse.json(
//         { success: false, message: "Invalid credentials" },
//         { status: 401 }
//       );
//     }
//     if (!user.organization) {
//       return NextResponse.json({ success: false, message: "User not assigned to any organization" }, { status: 403 });
//     }

//     // ❗ Check if subdomain slug matches user's organization
//     if (user.organization.slug !== orgSlug) {
//       return NextResponse.json({
//         success: false,
//         message: `Access denied: User does not belong to organization '${orgSlug}'`,
//       }, { status: 403 });
//     }


//     const permissions = await getUserPermissions(user.roleid);


//     const token = jwt.sign(
//       {
//         userId: user._id,
//         roleId: user.roleid,
//         organizationId: user.organizationId,
//         email: user.email,
//         permissions,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );
//     console.log("User login:", {
//       email: user.email,
//       organizationId: user.organizationId,
//     });


//     const response = NextResponse.json({
//       success: true,
//       user: { name: user.name, roleId: user.roleid },
//     });


//     response.cookies.set("token", token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//       maxAge: 60 * 60 * 24,
//       path: "/",
//     });

//     return response;
//   } catch (err) {
//     console.error("Login error:", err);
//     return NextResponse.json(
//       { success: false, message: "Server error" },
//       { status: 500 }
//     );
//   }
// }


export async function POST(req) {
  try {
    await connectToDatabase();

    const { email, password } = await req.json();
    console.log("Login attempt:", { email });

    // ✅ Populate organizationId
    const user = await User.findOne({ email }).populate("organizationId");

    if (!user || user.password !== password) {
      console.log("❌ Invalid credentials for:", email);
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Check populated organization
    const org = user.organizationId;

    if (!org || !org.slug) {
      console.log("❌ Organization not found or not populated:", org);
      return NextResponse.json(
        { success: false, message: "User not assigned to any organization" },
        { status: 403 }
      );
    }

    // ✅ Permissions and Token
    const permissions = await getUserPermissions(user.roleid);

    const token = jwt.sign(
      {
        userId: user._id,
        roleId: user.roleid,
        organizationId: org._id,
        organizationSlug: org.slug,
        email: user.email,
        permissions,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );


    console.log("✅ Login successful:", {
      email: user.email,
      organizationSlug: org.slug,
    });

    const response = NextResponse.json({
      success: true,
      user: { name: user.name, roleId: user.roleid },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("🔥 Login error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

