
import connectToDatabase from "@/lib/mongodb";
import Translation from "@/models/Translation";

export async function getDictionary(lang) {
  console.log("Fetching dictionary for language:", lang);
  
  try {
    await connectToDatabase();

    const all = await Translation.find({}).lean();

    const dictionary = {};
    all.forEach((item) => {
      dictionary[item.key] = item.translations?.[lang] || item.translations?.en || "";
    });

    return dictionary;
  } catch (err) {
    console.error("getDictionary error:", err);
    // Fallback to empty object or throw
    return {};
  }
}
