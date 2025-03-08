const { ApiError } = require("../Utils/ApiError.js");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const { SubCatModel } = require("../Model/SubCategory.model.js");
const { CategoryModel } = require("../Model/Category.model.js");

//Create SubCategory Controller
const CreateSubCatController = async (req, res) => {
  try {
    const { Title, Description, Category } = req.body;
    if (!Title || !Description || !Category) {
      return res
        .status(404)
        .json(
          new ApiError(
            false,
            null,
            500,
            "Title, Description or Category Missing!!"
          )
        );
    }

    // Set Data into Database
    const SubCategoryInstance = await new SubCatModel({
      Title,
      Description,
      Category,
    }).save();

    if (SubCategoryInstance) {
      //Find Category ID and store it in Category Collection
      const FindCategoryID = await CategoryModel.findOneAndUpdate(
        { _id: Category },
        { $push: { SubCategory: SubCategoryInstance._id } },
        { new: true }
      );
      FindCategoryID.save();

      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            SubCategoryInstance,
            200,
            "Sub Category Info Saved Successfully!",
            null
          )
        );
    } else {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `SubCategory could not be set!`));
    }
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `Sub Category Controller Error : ${error}`
        )
      );
  }
};

// Get All SubCategory Controller
const GetAllSubCatController = async (req, res) => {
  try {
    const AllSubCategory = await SubCatModel.find().populate("Category");
    if (AllSubCategory?.length) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            AllSubCategory,
            200,
            "All SubCategory Discovered!",
            null
          )
        );
    } else {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 400, `Couldnt fetch the SubCategories`)
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
          `Get All SubCategory Controller Error : ${error}`
        )
      );
  }
};

// Get Single SubCategory Controller
const GetSingleSubCatController = async (req, res) => {
  try {
    const { id } = req.params;
    const FindSingleSubCategory = await SubCatModel.findById({
      _id: id,
    }).populate("Category");

    if (FindSingleSubCategory) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            FindSingleSubCategory,
            200,
            "Single SubCategory Found!",
            null
          )
        );
    } else {
      return res
        .status(404)
        .json(
          new ApiError(false, null, 400, `Single SubCategory Couldnt be found!`)
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
          `Get Single SubCategory Controller Error : ${error}`
        )
      );
  }
};

// Delete Sub Category
const DeleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const DeletedItem = await SubCatModel.findOneAndDelete({ _id: id });
    if (DeletedItem) {
      const SearchCategory = await CategoryModel.findById(DeletedItem.Category);
      if (SearchCategory) {
        SearchCategory.SubCategory.pull(DeletedItem._id);
        SearchCategory.save();
        return res
          .status(200)
          .json(
            new ApiResponse(
              true,
              DeletedItem,
              200,
              "Sub Category Deleted Successfully!",
              null
            )
          );
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `Delete SubCategory Controller Error : ${error}`
        )
      );
  }
};

module.exports = {
  CreateSubCatController,
  GetAllSubCatController,
  DeleteSubCategory,
  GetSingleSubCatController,
};
