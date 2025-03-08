const { ApiError } = require("../Utils/ApiError.js");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const { asyncHandeller } = require("../Utils/asyncHandeller.js");
const { UserModel } = require("../Model/User.model.js");
const { EmailChecker, PasswordChecker } = require("../Utils/Checker.js");
const {
  bcryptPassword,
  generateToken,
  DecodePass,
} = require("../Helper/Helper.js");
const { SendMail } = require("../Utils/SendMail.js");
const { MakeOtp } = require("../Helper/OTPgenerator.js");

/**
 *todo : createUser controller implement
 * @param {{req.body}} req
 * @param {*} res
 */

const options = {
  httpOnly: true,
  secure: true,
};

const CreateUser = asyncHandeller(async (req, res, next) => {
  //send Data to database
  try {
    const {
      FirstName,
      LastName,
      Email_Adress,
      Mobile,
      Address,
      Password,
      role,
    } = req?.body;
    if (!FirstName) {
      return res
        .status(404)
        .json(new ApiError(false, null, 500, "FirstName Missing!!"));
    }
    if (!LastName) {
      return res
        .status(404)
        .json(new ApiError(false, null, 500, "LastName Missing!!"));
    }
    if (!Email_Adress || !EmailChecker(Email_Adress)) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 500, "Email_Adress missing or Invalid!!")
        );
    }
    if (!Mobile) {
      return res
        .status(404)
        .json(new ApiError(false, null, 500, "Mobile Missing!!"));
    }
    if (!Address) {
      return res
        .status(404)
        .json(new ApiError(false, null, 500, "Address Missing!!"));
    }
    if (!Password || !PasswordChecker(Password)) {
      return res
        .status(404)
        .json(
          new ApiError(
            false,
            null,
            500,
            "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number:"
          )
        );
    }
    if (!role) {
      return res
        .status(404)
        .json(new ApiError(false, null, 500, "role Missing!!"));
    }

    //check if User Already exists or not
    const ExistUser = await UserModel.find({
      $or: [{ FirstName: FirstName }, { Email_Adress: Email_Adress }],
    });

    if (ExistUser?.length) {
      return res
        .status(404)
        .json(
          new ApiError(
            false,
            null,
            400,
            `${ExistUser[0]?.FirstName} Already Exists!`
          )
        );
    }

    //Password encrypt
    const HashPassword = await bcryptPassword(Password);

    // create a new user in database
    const Users = await new UserModel({
      FirstName,
      LastName,
      Email_Adress,
      Mobile,
      Address,
      Password: HashPassword,
      role,
    }).save();

    // OTP generator
    const OTP = await MakeOtp();

    // send mail
    const mailInfo = await SendMail(FirstName, OTP, Email_Adress);

    if (Users || AccessToken || mailInfo) {
      // set token in database
      // await UserModel.findOneAndUpdate(
      //   { _id: Users._id },
      //   { $set: { Token: AccessToken } },
      //   { new: true }
      // );

      //Set OTP in database
      await UserModel.findOneAndUpdate(
        { _id: Users._id },
        { $set: { OTP: OTP } },
        { new: true }
      );

      const RecentCreatedUser = await UserModel.find({
        $or: [{ FirstName: FirstName }, { Email_Adress: Email_Adress }],
      }).select("-Password ");
      return (
        res
          .status(200)
          // .cookie("Token", AccessToken, options)
          .json(
            new ApiResponse(
              true,
              RecentCreatedUser,
              200,
              "Users Created Successfully",
              null
            )
          )
      );
    }
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `Registration controller error : ${error}`
        )
      );
  }
});

//Login Controller
const LoginController = async (req, res) => {
  try {
    const { Email_Adress, Password } = req.body;
    if (!Email_Adress || !EmailChecker(Email_Adress)) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 500, "Email_Adress missing or Invalid!!")
        );
    }
    if (!Password || !PasswordChecker(Password)) {
      return res
        .status(404)
        .json(
          new ApiError(
            false,
            null,
            500,
            "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number:"
          )
        );
    }

    //Find User
    const FindUser = await UserModel.findOne({ Email_Adress: Email_Adress });
    const UserPassValid = DecodePass(Password, FindUser?.Password);

    //Create Access Token
    let AccessToken = await generateToken(Email_Adress);

    if (UserPassValid) {
      return res
        .status(200)
        .cookie("AccessToken", AccessToken, options)
        .json(
          new ApiResponse(
            true,
            {
              FirstName: FindUser?.FirstName,
              LastName: FindUser?.LastName,
              Mobile: FindUser?.Mobile,
              Email_Adress: FindUser?.Email_Adress,
            },
            200,
            "Login Successfull",
            null
          )
        );
    }
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(false, null, 400, `Login controller error : ${error}`)
      );
  }
};

//OTP Match Controller
const OTPmatchController = async (req, res) => {
  try {
    const { Email_Adress, OTP } = req.body;
    if (!Email_Adress || !OTP) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `OTP or Email Address Invalid!`));
    }

    const ExistedEmailinDb = await UserModel.findOne({
      $or: [{ Email_Adress: Email_Adress }, { OTP: OTP }],
    });
    if (ExistedEmailinDb) {
      ExistedEmailinDb.OTP = null;
      ExistedEmailinDb.UserIsVerified = true;
      await ExistedEmailinDb.save();
      return res
        .status(200)
        .json(new ApiResponse(true, null, 200, "OTP Verify Successfull", null));
    }
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(false, null, 400, `OPT Match controller error : ${error}`)
      );
  }
};

//Forgot Password Controller
const ForgotPassController = async (req, res) => {
  try {
    const { Email_Adress } = req.body;
    if (!Email_Adress || !EmailChecker(Email_Adress)) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `Email Address Invalid!`));
    }

    // Check if email exists in Database
    const ExistedMailinDb = await UserModel.findOne({
      Email_Adress: Email_Adress,
    }).select("-Password -OTP");
    if (ExistedMailinDb) {
      const OTP = await MakeOtp();
      await SendMail(ExistedMailinDb.FirstName, OTP, Email_Adress);
      ExistedMailinDb.ResetOTP = OTP;
      await ExistedMailinDb.save();
      return (
        res
          .status(200)
          // .cookie("Token", AccessToken, options)
          .json(
            new ApiResponse(
              true,
              ExistedMailinDb,
              200,
              "Please Check your Mail!",
              null
            )
          )
      );
    }
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `ForgotPassword controller error : ${error}`
        )
      );
  }
};

//Reset Password Controller
const ResetPassController = async (req, res) => {
  try {
    const { Email_Adress, OTP, NewPassword } = req.body;
    if (
      !Email_Adress ||
      !EmailChecker(Email_Adress) ||
      !OTP ||
      !NewPassword ||
      !PasswordChecker(NewPassword)
    ) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `Credential Invalid!`));
    }

    const ExistedUserCheck = await UserModel.findOne({
      $or: [{ Email_Adress: Email_Adress }, { ResetOTP: OTP }],
    });

    if (ExistedUserCheck) {
      const NewhashPass = await bcryptPassword(NewPassword);
      ExistedUserCheck.Password = NewhashPass;
      ExistedUserCheck.ResetOTP = null;
      await ExistedUserCheck.save();
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            ExistedUserCheck,
            200,
            "Password Reset Successfull!",
            null
          )
        );
    }

    console.log("AIGHT", ExistedUserCheck);
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `ResetPassword controller error : ${error}`
        )
      );
  }
};

//Get All Registered User
const AllRegisteredUsers = async (req, res) => {
  try {
    const AllUsers = await UserModel.find({});
    if (AllUsers?.length) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            AllUsers,
            200,
            "Found All Users in Database",
            null
          )
        );
    }
  } catch (error) {
    return res
      .status(404)
      .json(new ApiError(false, null, 400, `Users Couldnt be Found!`));
  }
};

//Change User Role Controller
const ChangeRoleController = async (req, res) => {
  try {
    const { Email_Adress, Mobile, role } = req.body;
    if (!Email_Adress || !EmailChecker(Email_Adress) || !Mobile) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 500, "Email_Adress or Mobile Invalid!!")
        );
    }

    //Find Email Address and Mobile in Database
    const ExistUser = await UserModel.findOne({
      $or: [{ Email_Adress: Email_Adress }, { Mobile: Mobile }],
    });

    if (ExistUser) {
      if (ExistUser.role === "user") {
        ExistUser.role = role;
        await ExistUser.save();
        return res
          .status(200)
          .json(
            new ApiResponse(
              true,
              ExistUser,
              200,
              "User Role Changed Successfully!",
              null
            )
          );
      } else {
        return res
          .status(400)
          .json(
            new ApiResponse(
              true,
              ExistUser.FirstName,
              200,
              "You are Already a Marchent!",
              null
            )
          );
      }
    } else {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, "User not found!"));
    }
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(false, null, 400, `User Role Controller Error : ${error}`)
      );
  }
};

module.exports = {
  CreateUser,
  LoginController,
  OTPmatchController,
  ForgotPassController,
  ResetPassController,
  AllRegisteredUsers,
  ChangeRoleController,
};
