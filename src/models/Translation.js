// models/Translation.js
import mongoose from "mongoose";

const translationSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    translations: {
      type: Map,
      of: String, // Allows any language code: value
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Translation || mongoose.model("Translation", translationSchema);
