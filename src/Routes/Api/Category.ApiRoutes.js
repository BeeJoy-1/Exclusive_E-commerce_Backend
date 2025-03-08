const express = require("express");
const { Router } = express;
const _ = Router();
const {
  CreateCategoryController,
  GetAllCategory,
  GetSingleCategory,
  ApproveCategory,
} = require("../../Controller/Category.controller");

_.route("/CreateCategory").post(CreateCategoryController);
_.route("/AllCategory").get(GetAllCategory);
_.route("/SingleCategory/:id").get(GetSingleCategory);
_.route("/ApproveCategory").post(ApproveCategory);

module.exports = _;
