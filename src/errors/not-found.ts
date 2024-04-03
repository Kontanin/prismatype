const { StatusCodes:StatusCodesNF } = require('http-status-codes');
const CustomAPIErrorNF = require('./custom-api');

class NotFoundErrorNF extends CustomAPIErrorNF {
  constructor(message:string) {
    super(message);
    this.statusCode = StatusCodesNF.NOT_FOUND;
  }
}

module.exports = NotFoundErrorNF;
