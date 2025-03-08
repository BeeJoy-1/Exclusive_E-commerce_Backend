const fs = require("fs");
const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//Upload Image
const UploadCloudinary = async (localfilePath = "public\\temp\\black.jpg") => {
  try {
    let SecureLink = [];
    // Upload an image
    for (let imagePath of localfilePath) {
      const uploadResult = await cloudinary.uploader.upload(
        imagePath?.path ||
          "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg"
      );

      //Delete a Temp Image
      fs.unlinkSync(`${imagePath?.path}`, (err) => {
        if (err) {
          console.log("Image Unlinksync error", err);
        }
      });
      SecureLink.push(uploadResult?.secure_url);
    }
    return SecureLink;
  } catch (error) {
    console.log("From Cloudinary Uploader error: ", error);
  }
};

//Delete Image from Cloudinary
const DeleteImageCloudinary = async (imagePath) => {
  try {
    for (let CloudName of imagePath) {
      const allArr = CloudName.split("/");
      const CloudImageName = allArr[allArr?.length - 1].split(".")[0];
      const DeletedItem = await cloudinary.api.delete_resources(
        CloudImageName || "fn0tk9zvvts8llelkoiu",
        {
          type: "upload",
          resource_type: "image",
        }
      );
      // console.log("Deleted items : ", DeletedItem);
    }
  } catch (error) {
    console.log("From Cloudinary Delete error: ", error);
  }
};

module.exports = { UploadCloudinary, DeleteImageCloudinary };
