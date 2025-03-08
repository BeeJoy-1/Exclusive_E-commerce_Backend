const express = require("express");
const { Router } = express;
const _ = Router();
const {
  CreateSubCatController,
  GetAllSubCatController,
  DeleteSubCategory,
  GetSingleSubCatController,
} = require("../../Controller/SubCategory.controller");

//Routes

_.route("/SubCategory").post(CreateSubCatController);
_.route("/AllSubCategory").get(GetAllSubCatController);
_.route("/DeleteSubCategory/:id").delete(DeleteSubCategory);
_.route("/SingleSubCategory/:id").get(GetSingleSubCatController);

module.exports = _;
