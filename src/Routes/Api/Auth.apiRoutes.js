const express = require("express");
const { Router } = express;
const _ = Router();
const { ApiResponse } = require("../../Utils/ApiResponse.js");
const {
  CreateUser,
  LoginController,
  OTPmatchController,
  ForgotPassController,
  ResetPassController,
  AllRegisteredUsers,
  ChangeRoleController,
} = require("../../Controller/User.controller.js");
// const { AuthGuard } = require("../../Middleware/Authguard.js");

_.route("/registration").post(CreateUser);
_.route("/Login").post(LoginController);
_.route("/OTP_Verify").post(OTPmatchController);
_.route("/ForgetPassword").post(ForgotPassController);
_.route("/ResetPassword").post(ResetPassController);
_.route("/AllRegisteredUsers").get(AllRegisteredUsers);
_.route("/RoleChanger").post(ChangeRoleController);

module.exports = _;
