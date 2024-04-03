const { StatusCodes:StatusCodesFORBIDDEN } = require('http-status-codes');
const CustomAPIErrorFORBIDDEN = require('./custom-api');


  class UnauthorizedErrorFORBIDDEN extends CustomAPIErrorFORBIDDEN {
    constructor(message: string) {
      super(message);
      this.statusCode = StatusCodesFORBIDDEN.FORBIDDEN;
    }
  }

module.exports = {UnauthorizedErrorFORBIDDEN};
