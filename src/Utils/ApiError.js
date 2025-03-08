class ApiError {
  constructor(
    success = false,
    data = null,
    statusCode = 404,
    message = "Error Occured!"
  ) {
    (this.success = success), (this.data = data);
    (this.statusCode = statusCode), (this.message = message);
  }
}

module.exports = { ApiError };
