const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    Name: {
      type: String,
      required: [true, "Name Required"],
      trim: true,
    },
    Description: {
      type: String,
      required: [true, "Descriptioon Required"],
      trim: true,
    },
    Category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category Required"],
    },
    SubCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    Price: {
      type: String,
      required: [true, "Price Required"],
      trim: true,
    },
    Discount: {
      type: String,
      trim: true,
    },
    Rating: {
      type: Number,
      default: 0,
    },
    Review: [
      {
        type: String,
      },
    ],
    Owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner Required!"],
    },
    Store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store ID Required!"],
    },
    Image: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", ProductSchema);
module.exports = { ProductModel };
