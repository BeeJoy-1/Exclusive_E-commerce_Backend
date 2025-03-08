const express = require("express");
const {
  MerchantStoreController,
  AllMerchantInfo,
  GetSingleMerchant,
  UpdateMerchantInfo,
} = require("../../Controller/Store.controller");
const _ = express.Router();

//Routes
_.route("/MerchantRole").post(MerchantStoreController);
_.route("/AllMerchantInfo").get(AllMerchantInfo);
_.route("/GetSingleMerchant/:id").get(GetSingleMerchant);
_.route("/UpdateMerchantInfo/:id").put(UpdateMerchantInfo);

module.exports = _;
