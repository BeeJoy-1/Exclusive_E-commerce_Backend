const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const bcryptPassword = async (password) => {
  try {
    const HashPassword = await bcrypt.hash(password, 10);
    return HashPassword;
  } catch (error) {
    console.log("Error hashing password:", error);
    throw error;
  }
};

const DecodePass = async (plainPassword, encryptedPassword) => {
  if (!plainPassword || !encryptedPassword) {
    throw new Error("Both plainPassword and encryptedPassword are required");
  }

  try {
    const passwordResult = await bcrypt.compare(
      plainPassword,
      encryptedPassword
    );
    return passwordResult;
  } catch (error) {
    console.log("Error comparing passwords:", error);
    throw error;
  }
};

const generateToken = async (Email_Adress) => {
  try {
    const AccessToken = await jwt.sign(
      { Email_Adress },
      process.env.JWT_SECRET_KEY_TOKEN,
      { expiresIn: process.env.JWT_SECRET_KEY_TOKEN_EXPIRE }
    );

    return AccessToken;
  } catch (error) {
    console.log("Error generating token:", error);
    throw error;
  }
};

module.exports = { bcryptPassword, generateToken, DecodePass };
