// src/app/api/translations/[lang]/route.js
import connectToDatabase from "@/lib/mongodb";
import Translation from "@/models/Translation";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { lang } = await params;
    console.log(`API: Fetching translations for ${lang}`);

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
  } catch (err) {
    console.error("Translation API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
