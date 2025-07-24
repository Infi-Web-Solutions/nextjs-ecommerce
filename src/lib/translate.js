// lib/translate.js
export async function translateText(text, toLang, fromLang = 'en') {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.responseData?.translatedText || text;
}
