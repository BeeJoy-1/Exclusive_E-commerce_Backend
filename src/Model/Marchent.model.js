const mongoose = require("mongoose");
const { Schema } = mongoose;

const MerchantSchema = new Schema(
  {
    Email: {
      type: String,
      unique: true,
      required: [true, "Email Required!"],
      trim: true,
    },
    Phone: {
      type: Number,
      required: [true, "Phone No. Required!"],
      trim: true,
    },
    Name: {
      type: String,
      trim: true,
      required: [true, "Name Required!"],
    },
    Address: {
      type: String,
      trim: true,
    },
    users: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    Products: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    Status: {
      type: String,
      enum: ["Pending", "Rejected", "Approved"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const MerchantStore = mongoose.model("Store", MerchantSchema);
module.exports = { MerchantStore };
