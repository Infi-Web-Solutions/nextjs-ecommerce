// models/Translation.js
import mongoose from "mongoose";

const translationSchema = new mongoose.Schema({
  key: { type: String, required: true }, // e.g., navbar.home
  translations: {
    en: { type: String },
    fr: { type: String },
    de: { type: String },
    // Add more if needed
  },
}, { timestamps: true });

export default mongoose.models.Translation || mongoose.model("Translation", translationSchema);
