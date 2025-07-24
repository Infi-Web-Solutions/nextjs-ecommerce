// models/organization.js
import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
  orgId: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true, // subdomain
  },
  name: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  plan: {
    type: String,
    enum: ['Free', 'Pro', 'Enterprise'], // Adjust based on your plans
    default: 'Free',
  },
  logoUrl: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Organization || mongoose.model("Organization", organizationSchema);
