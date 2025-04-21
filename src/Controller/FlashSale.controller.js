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
        select: "-Description -Review -Owner -Store",
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

module.exports = { FlashSaleController, GetFlashSaleProducts };
