class ApiResponse {
  constructor(success, data, statusCode, message, error) {
    (this.success = success), (this.data = data);
    (this.statusCode = statusCode), (this.message = message);
    this.error = error;
  }
}

module.exports = { ApiResponse };
