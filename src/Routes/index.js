const express = require("express");
const { Router } = express;
const _ = Router();
const { ApiError } = require("../Utils/ApiError.js");
const AuthRoutes = require("./Api/Auth.apiRoutes.js");
const CategoryRoutes = require("./Api/Category.ApiRoutes.js");
const SubCategoryRoutes = require("./Api/SubCategory.apiRoutes.js");
const StoreRoutes = require("./Api/Store.apiRoutes.js");
const ProductRoutes = require("./Api/Product.apiRoutes.js");
const AdminSignUPRoutes = require("./Api/Admin/Api.apiRoutes.js");

_.use(process.env.BASE_URL, AuthRoutes);
_.use(process.env.BASE_URL, CategoryRoutes);
_.use(process.env.BASE_URL, SubCategoryRoutes);
_.use(process.env.BASE_URL, StoreRoutes);
_.use(process.env.BASE_URL, ProductRoutes);
_.use(process.env.BASE_URL, AdminSignUPRoutes);
_.use(process.env.BASE_URL, (req, res) => {
  res.status(400).json(new ApiError(false, null, 404, "Api Routes Invalid!"));
});

module.exports = _;
