const { StatusCodes:StatusCodesUN } = require('http-status-codes');
const CustomAPIErrorUn = require('./custom-api');

class UnauthenticatedErrorUN extends CustomAPIErrorUn {
  constructor(message:string) {
    super(message);
    this.statusCode = StatusCodesUN.UNAUTHORIZED;
  }
}

module.exports = UnauthenticatedErrorUN;
