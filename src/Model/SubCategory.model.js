const mongoose = require("mongoose");
const { Schema } = mongoose;

const SubCategoryModel = new Schema({
  Title: {
    type: String,
    required: [true, "Category Required"],
    trim: true,
  },
  Description: {
    type: String,
    required: [true, "Descriptioon Required"],
    trim: true,
  },
  Product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  Category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category Required"],
  },
});

const SubCatModel = mongoose.model("SubCategory", SubCategoryModel);
module.exports = { SubCatModel };
