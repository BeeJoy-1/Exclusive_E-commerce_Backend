const express = require("express");
const { Router } = express;
const _ = Router();
const {
  FlashSaleController,
  GetFlashSaleProducts,
} = require("../../Controller/FlashSale.controller");

//Routes
_.route("/FlashSale").post(FlashSaleController);
_.route("/FlashSale").get(GetFlashSaleProducts);

//Export
module.exports = _;
