const express = require("express");
const _ = express.Router();
const {
  BestSellingProductsController,
  GetAllBSproducts,
  UpdateProduct,
  DeleteProduct,
} = require("../../Controller/BestSellingProduct.controller");

//Routes
_.route("/BSproducts").post(BestSellingProductsController);
_.route("/AllBSproducts").get(GetAllBSproducts);
_.route("/UpdateBSProduct/:id").patch(UpdateProduct);
_.route("/DeleteBSproduct/:id").delete(DeleteProduct);

//exports
module.exports = _;
