import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Translation from "@/models/Translation";

// Load all languages
import enJson from "../../../../lib/dictionary/en.json";
import frJson from "../../../../lib/dictionary/fr.json";
import deJson from "../../../../lib/dictionary/de.json";
import jaJson from "../../../../lib/dictionary/ja.json";
import hiJson from "../../../../lib/dictionary/hi.json";

// Helper to flatten nested JSON like { navbar: { home: "Home" } } => { "navbar.home": "Home" }
function flatten(obj, parentKey = "", sep = ".") {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    const newKey = parentKey ? `${parentKey}${sep}${key}` : key;
    if (typeof val === "object" && val !== null) {
      Object.assign(acc, flatten(val, newKey, sep));
    } else {
      acc[newKey] = val;
    }
    return acc;
  }, {});
}

export async function POST() {
  try {
    await connectToDatabase();

    const flatEN = flatten(enJson);
    const flatFR = flatten(frJson);
    const flatDE = flatten(deJson);

    // Collect all unique keys
    const allKeys = new Set([
      ...Object.keys(flatEN),
      ...Object.keys(flatFR),
      ...Object.keys(flatDE),
    ]);

    for (const key of allKeys) {
      const translations = {
        en: flatEN[key] || "",
        fr: flatFR[key] || "",
        de: flatDE[key] || "",
      };

      await Translation.findOneAndUpdate(
        { key },
        { $set: { translations } },
        { upsert: true }
      );
    }

    return NextResponse.json({ success: true, message: "Translations seeded successfully." });
  } catch (err) {
    console.error("Seed error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";
// import connectToDatabase from "@/lib/mongodb";
// import Translation from "@/models/Translation";
// import path from "path";
// import fs from "fs/promises";
// import { fileURLToPath } from "url";

// // Fix __dirname in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Flatten nested object: { a: { b: "x" } } => { "a.b": "x" }
// function flatten(obj, parentKey = "", sep = ".") {
//   return Object.entries(obj).reduce((acc, [key, val]) => {
//     const newKey = parentKey ? `${parentKey}${sep}${key}` : key;
//     if (typeof val === "object" && val !== null) {
//       Object.assign(acc, flatten(val, newKey, sep));
//     } else {
//       acc[newKey] = val;
//     }
//     return acc;
//   }, {});
// }

// export async function POST() {
//   try {
//     await connectToDatabase();

//     const dictionaryPath = path.resolve(__dirname, "../../../../lib/dictionary");
//     const files = await fs.readdir(dictionaryPath);
//     const langFiles = files.filter((file) => file.endsWith(".json"));

//     const allLangData = {};
//     const allKeys = new Set();

//     for (const file of langFiles) {
//       const langCode = file.replace(".json", "");
//       const content = await fs.readFile(path.join(dictionaryPath, file), "utf8");
//       const parsed = flatten(JSON.parse(content));
//       allLangData[langCode] = parsed;

//       Object.keys(parsed).forEach((key) => allKeys.add(key));
//     }

//     for (const key of allKeys) {
//       const translations = {};
//       for (const lang of Object.keys(allLangData)) {
//         translations[lang] = allLangData[lang][key] || "";
//       }

//       await Translation.findOneAndUpdate(
//         { key },
//         { $set: { translations } },
//         { upsert: true }
//       );
//     }

//     return NextResponse.json({ success: true, message: "All translations seeded." });
//   } catch (err) {
//     console.error("Seed error:", err);
//     return NextResponse.json({ success: false, error: err.message }, { status: 500 });
//   }
// }

