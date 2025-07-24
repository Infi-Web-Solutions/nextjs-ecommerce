// src/app/api/translations/[lang]/route.js
import connectToDatabase from "@/lib/mongodb";
import Translation from "@/models/Translation";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const lang = pathParts[pathParts.length - 1]; // get "en" from /api/translations/en

  if (!lang) {
    return NextResponse.json({ success: false, error: "Missing language" }, { status: 400 });
  }

  await connectToDatabase();

  const all = await Translation.find({});

  const dictionary = {};
  all.forEach((item) => {
    dictionary[item.key] = item.translations?.[lang] || item.translations?.en || "";
  });

  return NextResponse.json({ success: true, data: dictionary });
}
