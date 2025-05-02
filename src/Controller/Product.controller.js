const { ApiError } = require("../Utils/ApiError.js");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const { ProductModel } = require("../Model/Product.model.js");
const {
  UploadCloudinary,
  DeleteImageCloudinary,
} = require("../Utils/Cloudinary.js");
const NodeCache = require("node-cache");
const { CategoryModel } = require("../Model/Category.model.js");
const myCache = new NodeCache();

//Create Product Controller
const CreateProductController = async (req, res) => {
  try {
    NonRequiredItem = ["Review", "Rating", "Discount", "SubCategory"];

    //Dynamic Validation using loop(New Concept)

    for (let key in req.body) {
      if (NonRequiredItem.includes(key)) {
        continue;
      }
      if (!req.body[key]) {
        return res
          .status(400)
          .json(new ApiResponse(true, null, 200, `${key} Missing!!`, null));
      }
    }

    const Image = req.files?.Image;
    if (!Image) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, ` Image Not Found!`));
    }

    //Find Existed Product
    const ExistedProduct = await ProductModel.find({ Name: req.body.Name });
    if (ExistedProduct?.length) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, ` Product Already Exists!`));
    }

    const ImageInfo = await UploadCloudinary(Image);

    //Save Date in Database
    const SaveData = await new ProductModel({
      ...req.body,
      Image: [...ImageInfo],
    }).save();

    if (SaveData) {
      //Push Product into Category model
      const Category = await CategoryModel.findById(req.body.Category);
      Category.Product.push(SaveData._id);
      await Category.save();
      //Delete Cache Memory
      myCache.del("AllProduct");
      return res
        .status(202)
        .json(
          new ApiResponse(
            true,
            SaveData,
            200,
            "Product Created Successfully",
            null
          )
        );
    }
    return res
      .status(404)
      .json(new ApiError(false, null, 400, ` Product Couldnt be Created!`));
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          ` Create Product Controller Error : ${error}`
        )
      );
  }
};

//Get all Product Controller
const GetAllProduct = async (req, res) => {
  try {
    const value = myCache.get("AllProduct");
    if (value === undefined) {
      const AllProduct = await ProductModel.find({}).populate([
        "Category",
        "SubCategory",
        "Owner",
        "Store",
      ]);
      if (AllProduct) {
        //Cached The Products
        myCache.set("AllProduct", JSON.stringify(AllProduct));
        return res
          .status(202)
          .json(
            new ApiResponse(true, AllProduct, 200, "Got All Products!", null)
          );
      }
    } else {
      return res
        .status(202)
        .json(
          new ApiResponse(
            true,
            JSON.parse(value),
            400,
            `Got All Products but Faster lol!`
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
          ` Get All Product Controller Error : ${error}`
        )
      );
  }
};

//Update Product Controller
const UpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const Image = req.files?.Image;

    if (!Image) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, ` Image Not Found!`));
    }

    let UpdateProduct = await ProductModel.findById(id);
    let UpdateProductObject = {};
    if (Image) {
      await DeleteImageCloudinary(UpdateProduct?.Image);
      const ImageUrl = await UploadCloudinary(Image);
      UpdateProductObject = { ...req.body, Image: ImageUrl };
    } else {
      UpdateProductObject = { ...req.body };
    }
    const ProductUpdate = await ProductModel.findOneAndUpdate(
      { _id: id },
      { ...UpdateProductObject },
      { new: true }
    );

    if (ProductUpdate) {
      return res
        .status(202)
        .json(
          new ApiResponse(
            true,
            ProductUpdate,
            200,
            "Product Updated Successfully!",
            null
          )
        );
    }
    return res
      .status(404)
      .json(new ApiError(false, null, 400, `Updating Product Failed!`));
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          ` Get All Product Controller Error : ${error}`
        )
      );
  }
};

//Get Single Product Controller
const SingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const SingleProduct = await ProductModel.findById(id).populate([
      "Category",
      "SubCategory",
      "Owner",
      "Store",
    ]);
    if (SingleProduct) {
      return res
        .status(202)
        .json(
          new ApiResponse(true, SingleProduct, 200, "Got The Product!", null)
        );
    }
    return res
      .status(404)
      .json(new ApiError(false, null, 400, ` Couldnt Get the Product!`));
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          ` Get Single Product Controller Error : ${error}`
        )
      );
  }
};

//Search Product controller
const SearchProduct = async (req, res) => {
  try {
    const { Name } = req.query;
    const SearchedProduct = await ProductModel.find({ Name: Name });
    if (SearchedProduct?.length) {
      return res
        .status(202)
        .json(
          new ApiResponse(
            true,
            SearchedProduct,
            200,
            "Got The Searched Product!",
            null
          )
        );
    }
    return res
      .status(404)
      .json(
        new ApiError(false, null, 400, ` Couldnt Find The Searched Product!`)
      );
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          ` Search Product Controller Error : ${error}`
        )
      );
  }
};

module.exports = {
  CreateProductController,
  GetAllProduct,
  UpdateProduct,
  SingleProduct,
  SearchProduct,
};
