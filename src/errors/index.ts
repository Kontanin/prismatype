import BadRequestError from './bad-request';
import NotFoundError from './not-found';
import UnauthenticatedError from './unauthenticated';
import UnauthorizedError from './unauthorized';
import CustomAPIError from './custom-api';

const CustomError = {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
  CustomAPIError,
};

export default CustomError;
