const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const FlashSaleSchema = new Schema({
  ProductID: {
    type: Types.ObjectId,
    ref: "Product",
  },
  OfferDate: {
    type: Number,
    required: true,
  },
});

const FlashSaleModel = mongoose.model("FlashSale", FlashSaleSchema);
module.exports = { FlashSaleModel };
