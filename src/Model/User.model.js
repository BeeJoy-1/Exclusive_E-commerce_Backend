const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    FirstName: {
      type: String,
      required: [true, "FirstName Missing!"],
      trim: true,
      max: [25, "Too Long!"],
      min: [5, "Too short"],
    },
    LastName: {
      type: String,
      trim: true,
      max: [10, "Too Long!"],
      min: [5, "Too short"],
    },
    Email_Adress: {
      type: String,
      required: [true, "Email_Adress Missing!"],
      trim: true,
      unique: true,
    },
    Mobile: {
      type: Number,
      required: [true, "Mobile number Missing!"],
      trim: true,
      unique: true,
      // max: [11, "Invalid Phone Number"],
    },
    Address: {
      type: String,
      required: [true, "Address Missing!"],
    },
    Password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "merchant"],
      default: "user",
    },
    OTP: {
      type: Number,
    },
    ResetOTP: {
      type: Number,
    },
    UserIsVerified: {
      type: Boolean,
      default: false,
    },
    Token: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = { UserModel };
