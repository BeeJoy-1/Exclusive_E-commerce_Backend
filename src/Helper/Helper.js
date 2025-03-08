const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const bcryptPassword = async (password) => {
  try {
    const HashPassword = await bcrypt.hash(password, 10);
    return HashPassword;
  } catch (error) {
    console.log(error);
  }
};

const DecodePass = async (plainPassword, encryptedPassword) => {
  const passwordResult = await bcrypt.compare(plainPassword, encryptedPassword);
  return passwordResult;
};

const generateToken = async (Email_Adress) => {
  const AccessToken = await jwt.sign(
    {
      Email_Adress,
    },
    process.env.JWT_SECRET_KEY_TOKEN,
    { expiresIn: process.env.JWT_SECRET_KEY_TOKEN_EXPIRE }
  );

  return AccessToken;
};

module.exports = { bcryptPassword, generateToken, DecodePass };
