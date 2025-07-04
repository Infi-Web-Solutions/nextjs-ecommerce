// models/Permission.js
import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  module: { type: String, required: true },            // e.g., "product"
  action: { type: String, required: true },            // e.g., "view"
});

export default mongoose.models.Permission || mongoose.model("Permission", permissionSchema);
