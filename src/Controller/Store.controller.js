const { MerchantStore } = require("../Model/Marchent.model.js");
const { UserModel } = require("../Model/User.model.js");
const { ApiError } = require("../Utils/ApiError.js");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const { PhoneNoChecker, EmailChecker } = require("../Utils/Checker.js");

//Create Merchant Store Controller

const MerchantStoreController = async (req, res) => {
  try {
    const { Email, Phone, Name, users } = req.body;
    if (!Email || !EmailChecker(Email)) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 500, "Email_Adress missing or Invalid!!")
        );
    }
    if (!Name || !users) {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 500, " Name or User Missing or Invalid!")
        );
    }
    if (!Phone || !PhoneNoChecker(Phone)) {
      return res
        .status(404)
        .json(new ApiError(false, null, 500, "Phone Number Invalid!"));
    }

    //Check if data already exists
    const ExistUser = await MerchantStore.find({
      $or: [{ Email: Email }, { Phone: Phone }],
    });

    if (ExistUser?.length) {
      return res
        .status(404)
        .json(
          new ApiError(
            false,
            null,
            400,
            `${ExistUser[0]?.Email} Already Exists!`
          )
        );
    }

    //Save info in Database
    const SaveInfo = await new MerchantStore({
      Email,
      Phone,
      Name,
      users,
    }).save();
    if (SaveInfo) {
      return res
        .status(200)
        .json(
          new ApiResponse(true, SaveInfo, 200, "Data Saved in Database!", null)
        );
    }

    //Update User Role
    if (SaveInfo) {
      const UpdateRole = await UserModel.findById(SaveInfo.users);
      UpdateRole.role = "merchant";
      UpdateRole.save();
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            SaveInfo,
            200,
            "Role Changed to Merchant!",
            null
          )
        );
    } else {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `Could't Save Data in Database!`));
    }
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(false, null, 400, `Merchant Controller Error : ${error}`)
      );
  }
};

//Get All Merchant Info Controller
const AllMerchantInfo = async (req, res) => {
  try {
    const GetAllMerchant = await MerchantStore.find();
    if (GetAllMerchant) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            GetAllMerchant,
            200,
            "All Merchant Found!",
            null
          )
        );
    } else {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `Couldnt find any merchants!`));
    }
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `Get All Merchant Controller Error : ${error}`
        )
      );
  }
};

//Get Single Merchant Controller
const GetSingleMerchant = async (req, res) => {
  try {
    const { id } = req.params;
    const FindSingleMerchant = await MerchantStore.findById({ _id: id });

    if (FindSingleMerchant) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            FindSingleMerchant,
            200,
            "Single Merchant Found!",
            null
          )
        );
    } else {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 400, `Single Merchant Couldnt be found!`)
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
          `Get Single Merchant Controller Error : ${error}`
        )
      );
  }
};

//Update Merchant Info
const UpdateMerchantInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { Email, Phone, Name, users } = req.body;
    const FindMerchantID = await MerchantStore.findById({ _id: id });
    if (FindMerchantID) {
      const UpdateMerchant = await MerchantStore.findOneAndUpdate(
        { _id: id },
        {
          ...(Email && { Email }),
          ...(Phone && { Phone }),
          ...(Name && { Name }),
          ...(users && { users }),
        },
        { new: true }
      ).populate("users");
      //
      if (UpdateMerchant) {
        return res
          .status(200)
          .json(
            new ApiResponse(
              true,
              UpdateMerchant,
              200,
              "Merchant Info Updated!",
              null
            )
          );
      } else {
        return res
          .status(404)
          .json(
            new ApiError(false, null, 400, `Merchant Info Couldnt be Updated!`)
          );
      }
    }
    return res
      .status(404)
      .json(new ApiError(false, null, 400, `Couldnt Find the Merchant!`));
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `Update Merchant Controller Error : ${error}`
        )
      );
  }
};

module.exports = {
  MerchantStoreController,
  AllMerchantInfo,
  GetSingleMerchant,
  UpdateMerchantInfo,
};
