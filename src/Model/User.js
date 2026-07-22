import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      validate: {
        validator: (value) => {
          const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
          return emailRegex.test(value);
        },
        message: "Please enter a valid email address",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    role: {
      type: [String],
      enum: ["TOURIST", "GUIDE", "ADMIN"],
      default: ["TOURIST"],
    },
    guideDocument: {
      type: String,
      required: () => {
        return this.role === "GUIDE";
      },
    },
    guideStatus: {
      type: [String],
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: ["PENDING"],
    },
    location: {
      type: String,
      default: "Nepal",
    },

    experience: {
      type: String,
    },

    specializations: {
      type: [String],
      default: [],
    },

    languages: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: null,
    },
    verificationCode: {
      type: Number,
    },
    verificationCodeExpiryTime: {
      type: Date,
      index: {
        expireAfterSeconds: 0,
      },
    },
    resetPasswordCode: {
      type: Number,
    },
    isOTPVerified: {
      type: Boolean,
      default: false,
    },
    resetCodeExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
