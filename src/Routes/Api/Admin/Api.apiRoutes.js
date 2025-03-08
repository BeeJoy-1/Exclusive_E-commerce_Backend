const express = require("express");
const _ = express.Router();
const { AdminSignUp } = require("../../../Controller/Admin/Admin.controller");

//Routes
_.route("/Admin").post(AdminSignUp);

//export
module.exports = _;
