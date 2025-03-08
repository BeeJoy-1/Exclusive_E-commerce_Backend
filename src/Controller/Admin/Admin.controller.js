const { ApiError } = require("../../Utils/ApiError.js");
const { ApiResponse } = require("../../Utils/ApiResponse.js");
const { bcryptPassword } = require("../../Helper/Helper.js");
const { AdminModel } = require("../../Model/Admin/Admin.model.js");

//Admin SignUp Controller
const AdminSignUp = async (req, res) => {
  try {
    const { EmailOrUsername, Password } = req.body;
    if (!EmailOrUsername || !Password) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `Admin Credential Missing!`));
    }

    //Check if Admin Already exists
    const ExistedAdmin = await AdminModel.find({ $or: [{ EmailOrUsername }] });
    if (ExistedAdmin?.length) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            CategoryInstance,
            200,
            `${EmailOrUsername} Already Exists`,
            null
          )
        );
    }

    //Hash Password
    const HashPass = await bcryptPassword(Password);

    //Save Data Into Database
    const SaveData = await AdminModel({
      EmailOrUsername,
      Password: HashPass,
      //   Image: Image && { ...Image },
    }).save();

    if (SaveData) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            SaveData,
            200,
            `Admin Info Saved Successfully!`,
            null
          )
        );
    }
    return res
      .status(404)
      .json(
        new ApiError(false, null, 400, `Couldnt Save Admin Info into Database!`)
      );
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `AdminSignUp Controller Error : ${error}`
        )
      );
  }
};

module.exports = { AdminSignUp };
