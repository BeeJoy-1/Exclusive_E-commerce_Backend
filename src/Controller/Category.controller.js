const { ApiError } = require("../Utils/ApiError.js");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const { CategoryModel } = require("../Model/Category.model.js");
const { UserModel } = require("../Model/User.model.js");
const { EmailChecker } = require("../Utils/Checker.js");

//Create Category Controller
const CreateCategoryController = async (req, res) => {
  try {
    const { Title, Description } = req.body;
    if (!Title || !Description) {
      return res
        .status(404)
        .json(new ApiError(false, null, 500, "Title or Description Missing!!"));
    }

    //Check if Title already exists in Database
    const ExistTitle = await CategoryModel.find({
      $or: [{ Title: Title }, { Description: Description }],
    });

    if (ExistTitle?.length) {
      return res
        .status(404)
        .json(
          new ApiError(
            false,
            null,
            400,
            `${ExistTitle[0]?.Title} Already Exists!`
          )
        );
    }

    //Set Category Info into Database

    const CategoryInstance = await new CategoryModel({
      Title: Title,
      Description: Description,
    }).save();

    if (CategoryInstance) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            CategoryInstance,
            200,
            "Category Info Saved Successfully!",
            null
          )
        );
    }
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(false, null, 400, `Category Controller Error : ${error}`)
      );
  }
};

//Get ALl Category Controller
const GetAllCategory = async (req, res) => {
  try {
    const AllCategory = await CategoryModel.find({});
    if (AllCategory) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            AllCategory,
            200,
            "All Categories Fetched Successfully!",
            null
          )
        );
    } else {
      return res
        .status(404)
        .json(
          new ApiError(
            false,
            null,
            400,
            `Categories Couldnt be found in Database!`
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
          `Get All Category Controller Error : ${error}`
        )
      );
  }
};

//Get Single Category
const GetSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const FindSingleCategory = await CategoryModel.findById({ _id: id });

    if (FindSingleCategory) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            FindSingleCategory,
            200,
            "Single Category Found!",
            null
          )
        );
    } else {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 400, `Single Category Couldnt be found!`)
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
          `Get Single Category Controller Error : ${error}`
        )
      );
  }
};

//Approve Category by Admin
const ApproveCategory = async (req, res) => {
  try {
    const { Email, CategoryID } = req.body;
    if (!Email || !CategoryID) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `Email or CategoryID not Found!`));
    }
    if (!EmailChecker(Email)) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `Email Format Invalid!`));
    }

    //Search the Database and find the Admin's email address

    const AdminUser = await UserModel.findOne({
      Email_Adress: Email,
    });

    if (AdminUser?.role !== "admin") {
      return res
        .status(404)
        .json(
          new ApiError(
            false,
            null,
            400,
            `Admin User can not be found & Only Admin can Approve this!`
          )
        );
    }

    //Check if Category Already Exists

    const ExistCategory = await CategoryModel.findById(CategoryID).select(
      "-Description"
    );
    ExistCategory.isActive = true;
    ExistCategory.save();
    if (ExistCategory) {
      return res
        .status(200)
        .json(
          new ApiResponse(true, ExistCategory, 200, "Category Approved!", null)
        );
    } else {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `Category Not Approved!`));
    }
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `Approve Category by Admin Error : ${error}`
        )
      );
  }
};

module.exports = {
  CreateCategoryController,
  GetAllCategory,
  GetSingleCategory,
  ApproveCategory,
};
