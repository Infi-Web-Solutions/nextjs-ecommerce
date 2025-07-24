
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { getUserPermissions } from "@/lib/auth";
import { jwtVerify } from "jose";

export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
         console.log("Token from cookies:", token);
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        const roleId = payload.roleId;

        await connectToDatabase();
        const permissions = await getUserPermissions(roleId);
        

        return NextResponse.json({ permissions }, { status: 200 });
    } catch (err) {
        console.error("Permission fetch error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
