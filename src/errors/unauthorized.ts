const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

if (!global.hasOwnProperty('UnauthorizedError')) {
  class UnauthorizedError extends CustomAPIError {
    constructor(message: string) {
      super(message);
      this.statusCode = StatusCodes.FORBIDDEN;
    }
  }}

module.exports = {UnauthorizedError,CustomAPIError};
