const express = require("express");
const { Router } = express;
const _ = Router();
const {
  FlashSaleController,
  GetFlashSaleProducts,
  UpdateFlashSaleProduct,
  DeleteFlashSaleProduct,
  SingleFlashProduct,
} = require("../../Controller/FlashSale.controller");

//Routes
_.route("/FlashSale").post(FlashSaleController);
_.route("/FlashSale").get(GetFlashSaleProducts);
_.route("/FlashSale/:id")
  .put(UpdateFlashSaleProduct)
  .delete(DeleteFlashSaleProduct)
  .get(SingleFlashProduct);

//Export
module.exports = _;
