
// scripts/extractAndTranslate.mjs
import fs from 'fs/promises';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import { translateText } from "@/lib/translate";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
  
// Settings
const languages = ['fr', 'de', 'hi', 'es','ja'];
const baseLang = 'en';
const basePath = path.resolve(__dirname, '../src/lib/dictionary');
const EN_JSON_PATH = path.join(basePath, `${baseLang}.json`);

// ✅ FLATTEN NESTED OBJECTS: Convert { a: { b: "x" } } → { "a.b": "x" }
function flatten(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];
    if (typeof val === 'object' && val !== null) {
      Object.assign(acc, flatten(val, newKey));
    } else {
      acc[newKey] = val;
    }
    return acc;
  }, {});
}

// ✅ UNFLATTEN BACK: Convert { "a.b": "x" } → { a: { b: "x" } }
function unflatten(data) {
  const result = {};
  for (const key in data) {
    const keys = key.split('.');
    keys.reduce((acc, part, index) => {
      if (index === keys.length - 1) {
        acc[part] = data[key];
      } else {
        acc[part] = acc[part] || {};
      }
      return acc[part];
    }, result);
  }
  return result;
}

// ✅ Call MyMemory API
// async function translateText(text, toLang, fromLang = 'en') {
//   const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;
//   const res = await fetch(url);
//   const data = await res.json();
//   return data.responseData?.translatedText || text;
// }

// ✅ MAIN: Auto-translate and save
async function autoTranslate() {
  try {
    const baseRaw = await fs.readFile(EN_JSON_PATH, 'utf8');
    const baseData = flatten(JSON.parse(baseRaw)); // flatten nested keys

    for (const lang of languages) {
      const translated = {};

      for (const key in baseData) {
        const original = baseData[key];
        const translatedText = await translateText(original, lang, baseLang);
        translated[key] = translatedText;
      }

      const outputPath = path.join(basePath, `${lang}.json`);
      await fs.writeFile(outputPath, JSON.stringify(unflatten(translated), null, 2), 'utf8');
      console.log(`✅ Translated: ${lang}.json`);
    }
  } catch (err) {
    console.error('❌ Error during translation:', err.message);
  }
}

autoTranslate();

// import fs from 'fs/promises';
// import fetch from 'node-fetch';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Fix __dirname for ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // 🌍 Supported languages
// const languages = ['fr', 'de', 'hi', 'es', 'ja'];
// const baseLang = 'en';
// const basePath = path.resolve(__dirname, '../src/lib/dictionary');
// const EN_JSON_PATH = path.join(basePath, `${baseLang}.json`);

// // ✅ FLATTEN NESTED OBJECTS: { a: { b: "x" } } → { "a.b": "x" }
// function flatten(obj, prefix = '') {
//   return Object.keys(obj).reduce((acc, key) => {
//     const newKey = prefix ? `${prefix}.${key}` : key;
//     const val = obj[key];
//     if (typeof val === 'object' && val !== null) {
//       Object.assign(acc, flatten(val, newKey));
//     } else {
//       acc[newKey] = val;
//     }
//     return acc;
//   }, {});
// }

// // ✅ UNFLATTEN BACK: { "a.b": "x" } → { a: { b: "x" } }
// function unflatten(data) {
//   const result = {};
//   for (const key in data) {
//     const keys = key.split('.');
//     keys.reduce((acc, part, index) => {
//       if (index === keys.length - 1) {
//         acc[part] = data[key];
//       } else {
//         acc[part] = acc[part] || {};
//       }
//       return acc[part];
//     }, result);
//   }
//   return result;
// }

// // ✅ Translate using MyMemory API
// async function translateText(text, toLang, fromLang = 'en') {
//   const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;
//   const res = await fetch(url);
//   const data = await res.json();
//   return data.responseData?.translatedText || text;
// }

// // ✅ STEP 1: Translate and save files
// async function autoTranslate() {
//   try {
//     const baseRaw = await fs.readFile(EN_JSON_PATH, 'utf8');
//     const baseData = flatten(JSON.parse(baseRaw));

//     for (const lang of languages) {
//       const translated = {};

//       for (const key in baseData) {
//         const original = baseData[key];
//         const translatedText = await translateText(original, lang, baseLang);
//         translated[key] = translatedText;
//       }

//       const outputPath = path.join(basePath, `${lang}.json`);
//       await fs.writeFile(outputPath, JSON.stringify(unflatten(translated), null, 2), 'utf8');
//       console.log(`✅ Translated: ${lang}.json`);
//     }
//   } catch (err) {
//     console.error('❌ Error during translation:', err.message);
//   }
// }

// // ✅ STEP 2: Call API to seed translated data to DB
// async function callSeedAPI() {
//   try {
//     const res = await fetch('http://localhost:3000/api/translations/seed', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     const data = await res.json();
//     if (res.ok) {
//       console.log('✅ Translations seeded to DB:', data.message);
//     } else {
//       console.error('❌ Failed to seed translations to DB:', data.error);
//     }
//   } catch (error) {
//     console.error('❌ Error calling seed API:', error.message);
//   }
// }

// // ✅ MAIN
// (async () => {
//   await autoTranslate();
//   await callSeedAPI();
// })();
