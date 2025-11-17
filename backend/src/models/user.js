import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic info
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    // ⭐ Profile fields (will fill in profile setup step)
    profile: {
      college: { type: String, default: "" },
      year: { type: String, default: "" },
      targetRole: { type: String, default: "" },
      experience: { type: String, default: "" },
    },

    // ⭐ Whether user completed profile setup
    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

export default mongoose.model("User", userSchema);



