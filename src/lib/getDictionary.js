
export async function getDictionary(lang) {
  console.log("Fetching dictionary for language:", lang);
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/translations/${lang}`);
  const json = await res.json();
  if (!json.success) throw new Error("Failed to fetch translations");

  return json.data; // returns the flat object: { "navbar.home": "Home", ... }
}



