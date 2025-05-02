const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema({
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
  Product: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  isActive: {
    type: Boolean,
    default: false,
  },
  SubCategory: [
    {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
    },
  ],
});

const CategoryModel = mongoose.model("Category", CategorySchema);
module.exports = { CategoryModel };
