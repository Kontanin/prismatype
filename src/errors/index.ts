
// "  "ไม่ผานการยืนยัน"
const UnauthenticatedError = require('./unauthenticated');
const CustomAPIError = require('./custom-api')
const NotFoundError = require('./not-found');
const BadRequestError = require('./bad-request');
// ไม่ผ่านการอำนาจ


const UnauthorizedError = require('./unauthorized');
module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
};
