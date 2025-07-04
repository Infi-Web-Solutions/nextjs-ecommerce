// models/Role.js
import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  userRoleId: { type: Number, required: true, unique: true }, // e.g., 1 = admin, 2 = staff
  name: { type: String, required: true, unique: true },       // "admin", "staff", etc.
  permissionid: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
});

export default mongoose.models.Role || mongoose.model("Role", roleSchema);
