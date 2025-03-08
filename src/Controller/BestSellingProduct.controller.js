const { ApiError } = require("../Utils/ApiError.js");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const { BSproductsModel } = require("../Model/BestSellingProduct.model.js");

//BSproduct Controller
const BestSellingProductsController = async (req, res) => {
  try {
    const { Product } = req.body;
    if (!Product) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `Product is Missing!`));
    }

    //Find Existing Product
    const ExistedProduct = await BSproductsModel.find({ Product: Product });
    if (ExistedProduct?.length) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `Product Already Exists!`));
    }

    //Save the Data into Database
    const SaveData = await BSproductsModel.create({
      Product,
    });
    if (SaveData) {
      return res
        .status(200)
        .json(new ApiResponse(true, SaveData, 200, "Product is Saved!", null));
    }
    return res
      .status(404)
      .json(new ApiError(false, null, 400, `Couldnt Save the Product!`));
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(false, null, 400, `Best Selling Controller Error ${error}`)
      );
  }
};

//Get All BSproducts Controller
const GetAllBSproducts = async (req, res) => {
  try {
    const AllProducts = await BSproductsModel.find({}).populate("Product");
    if (AllProducts?.length) {
      return res
        .status(200)
        .json(
          new ApiResponse(true, AllProducts, 200, "Got all Products !", null)
        );
    }
    return res
      .status(404)
      .json(new ApiError(false, null, 400, `Couldnt Get the Products!`));
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `Get All Products Controller Error ${error}`
        )
      );
  }
};

//Update Products
const UpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const UpdateProduct = await BSproductsModel.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );
    if (UpdateProduct) {
      return res
        .status(200)
        .json(
          new ApiResponse(true, UpdateProduct, 200, "Product Updated !", null)
        );
    }
    return res
      .status(404)
      .json(new ApiError(false, null, 400, `Couldn't Update the Product!`));
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `Update Products Controller Error ${error}`
        )
      );
  }
};

//Delete Product
const DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(404)
        .json(new ApiError(false, null, 400, `Couldnt Find the Product!`));
    }
    const DeleteProducts = await BSproductsModel.findByIdAndDelete({
      _id: id,
    });
    if (DeleteProducts) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            DeleteProducts,
            200,
            "Product Deletation Successfull!!",
            null
          )
        );
    }
    return res
      .status(404)
      .json(new ApiError(false, null, 400, `Couldnt Delete the Product!`));
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `Delete Products Controller Error ${error}`
        )
      );
  }
};

module.exports = {
  BestSellingProductsController,
  GetAllBSproducts,
  UpdateProduct,
  DeleteProduct,
};
