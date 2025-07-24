// app/api/organization/route.js
import { NextResponse } from "next/server";
import Organization from "@/models/organization";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request) {
  await connectToDatabase();

  const orgId = request.headers.get("x-org-id");
  if (!orgId) {
    return NextResponse.json({ organization: null });
  }

  const org = await Organization.findById(orgId).lean();
  return NextResponse.json({ organization: org });
}
