const { ApiError } = require("../Utils/ApiError");
const jwt = require("jsonwebtoken");

const AuthGuard = async (req, res, next) => {
  try {
    const { cookie, authorization } = req.headers;
    const RemoveBearer = authorization?.split("Bearer")[1];
    const cookiesToken = cookie?.split("=")[1];
    const ExactToken = RemoveBearer?.split("@")[1];

    if (ExactToken) {
      const decoded = jwt.verify(ExactToken, process.env.JWT_SECRET_KEY_TOKEN);
      if (decoded) {
        next();
      }
    } else if (cookiesToken) {
      const decoded = jwt.verify(
        cookiesToken,
        process.env.JWT_SECRET_KEY_TOKEN
      );
      if (decoded) {
        next();
      }
    }
  } catch (error) {
    return res
      .status(404)
      .json(
        new ApiError(false, null, 400, `AuthGuard Middleware error : ${error}`)
      );
  }
};

module.exports = { AuthGuard };
