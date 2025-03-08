const { ApiError } = require("./ApiError");

const asyncHandeller = (fun = () => {}) => {
  return async (req, res, next) => {
    try {
      await fun(req, res, next);
    } catch (error) {
      new ApiError(false, null, 500, "asyncHandeller error :" + error);
    }
  };
};

module.exports = { asyncHandeller };
