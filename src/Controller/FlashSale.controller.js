const { ApiError } = require("../Utils/ApiError.js");
const { ApiResponse } = require("../Utils/ApiResponse.js");
const { FlashSaleModel } = require("../Model/FlashSale.model.js");

//FlashSale Controller
const FlashSaleController = async (req, res) => {
  try {
    const { ProductID, OfferDate } = req.body;
    if (!ProductID || !OfferDate) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `FlashSale Credential missing!`));
    }

    //Check if product exists
    const FlashSaleProductExist = await FlashSaleModel.findOne({ ProductID });
    if (FlashSaleProductExist) {
      return res
        .status(404)
        .json(new ApiError(false, null, 404, `Product Already Exists!`));
    }

    //Save the Info
    const SaveInfo = await FlashSaleModel.create({ ProductID, OfferDate });
    if (SaveInfo) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            SaveInfo,
            200,
            "FlashSale Info Saved Successfully!",
            null
          )
        );
    }
    return res
      .status(404)
      .json(new ApiError(false, null, 404, `FlashSale Create Failed!`));
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(false, null, 400, `FlashSale Controller Error : ${error}`)
      );
  }
};

//Get ALl FlashSale Products
const GetFlashSaleProducts = async (req, res) => {
  try {
    const AllProducts = await FlashSaleModel.find({})
      .populate({
        //If we dont want to show certain fields we need to populate in this way so that we can use the Select attribute and also for Nested populate
        path: "ProductID",
        populate: "Category",
        select: "-Description -Owner -Store",
      })
      .lean();

    if (AllProducts?.length) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            AllProducts,
            200,
            "All FlashSale Products are shown!",
            null
          )
        );
    }
    return res
      .status(404)
      .json(
        new ApiError(false, null, 400, `Couldnt Get All FlashSale Products`)
      );
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `Get All FlashSale Controller Error : ${error}`
        )
      );
  }
};

//Update FlashSale Products
const UpdateFlashSaleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const UpdateProduct = await FlashSaleModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    if (UpdateProduct) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            UpdateProduct,
            200,
            "Got the Updated Product!",
            null
          )
        );
    }
    return res
      .status(404)
      .json(new ApiError(false, null, 400, `Couldnt Fetch The Products!`));
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `Update FlashSale Product Controller Error : ${error}`
        )
      );
  }
};

//Delete Product
const DeleteFlashSaleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const DeleteProduct = await FlashSaleModel.findByIdAndDelete({ _id: id });
    if (DeleteProduct) {
      return res
        .status(200)
        .json(
          new ApiResponse(true, DeleteProduct, 200, "Product Deleted!", null)
        );
    }
    return res
      .status(404)
      .json(new ApiError(false, null, 400, `Couldnt Fetch The Product!`));
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `Delete Product Controller Error ${error}!`
        )
      );
  }
};

//Single Product
const SingleFlashProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const SingleProduct = await FlashSaleModel.findOne({ _id: id }).populate(
      "ProductID"
    );
    if (SingleProduct) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            SingleProduct,
            200,
            "Got the Single Product",
            null
          )
        );
    }
    return res
      .status(404)
      .json(new ApiError(false, null, 400, `Couldnt Get the single Product!`));
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(
          false,
          null,
          400,
          `SingleFlash Product Controller Error ${error}!`
        )
      );
  }
};

module.exports = {
  FlashSaleController,
  GetFlashSaleProducts,
  UpdateFlashSaleProduct,
  DeleteFlashSaleProduct,
  SingleFlashProduct,
};
