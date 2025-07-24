import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },

    contact: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: function () {
        // only required if "credentials" is in the list of providers
        return this.providers?.includes("credentials");
      },
    },

    provider: {
      type: String,
      enum: ["google", "facebook", "github", "credentials"],
      default: "credentials", // last used provider
    },

    providers: {
      type: [String], // list of all connected providers
      enum: ["google", "facebook", "github", "credentials"],
      default: ["credentials"],
    },

    identities: {
      type: [mongoose.Schema.Types.Mixed], // store { provider, providerUserId } objects
      default: [],
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization", // 👈 must match your Organization model name
      required: true
    },
    slug: {
      type: String,
      required: false,
    },


  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
