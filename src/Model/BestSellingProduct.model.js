const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const BestSellingProductSchema = new Schema({
  Product: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const BSproductsModel = mongoose.model(
  "Best_Selling_Product",
  BestSellingProductSchema
);
module.exports = { BSproductsModel };
