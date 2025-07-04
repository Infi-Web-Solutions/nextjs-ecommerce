// src/models/User.js or src/lib/models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
           
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
          contact: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
      
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
