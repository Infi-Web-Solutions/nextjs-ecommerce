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

        roleid:{
             type: Number,
        },
        organizationId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Organization"
                },
        

    },
    {
        timestamps: true,
    }
);

export default mongoose.models.createuser || mongoose.model("createuser", userSchema);