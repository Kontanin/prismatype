const { StatusCodes: StatusCodesBR } = require('http-status-codes');
const CustomAPIErrorBad = require('./custom-api');

class BadRequestErrorBad extends CustomAPIErrorBad {
  constructor(message:string) {
    super(message);
    this.statusCode = StatusCodesBR.BAD_REQUEST;
  }
}

module.exports = BadRequestErrorBad;
