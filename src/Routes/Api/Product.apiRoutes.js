const express = require("express");
const { Router } = express;
const _ = Router();
const { upload } = require("../../Middleware/Multer.middleware");
const {
  CreateProductController,
  GetAllProduct,
  UpdateProduct,
  SingleProduct,
  SearchProduct,
} = require("../../Controller/Product.controller");

//Routes
_.route("/Products").post(
  upload.fields([{ name: "Image", maxCount: 10 }]),
  CreateProductController
);
_.route("/GetAllProduct").get(GetAllProduct);
_.route("/UpdateProduct/:id").patch(
  upload.fields([{ name: "Image", maxCount: 10 }]),
  UpdateProduct
);
_.route("/SingleProduct/:id").get(SingleProduct);
_.route("/SearchProduct").get(SearchProduct);

//export
module.exports = _;
