// src/middlewares/error-handler.ts
import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../errors';

interface CustomError {
  statusCode: number;
  msg: string;
}

const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError: CustomError = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    msg: 'Something went wrong, please try again later',
  };

  if (
    err instanceof CustomError.BadRequestError ||
    err instanceof CustomError.NotFoundError ||
    err instanceof CustomError.UnauthenticatedError ||
    err instanceof CustomError.UnauthorizedError ||
    err instanceof CustomError.CustomAPIError
  ) {
    customError.msg = err.message;
    customError.statusCode = err.statusCode;
  } else if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item: any) => item.message)
      .join(',');
    customError.statusCode = StatusCodes.BAD_REQUEST;
  } else if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  } else if (err.name === 'CastError') {
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  console.error('Error:', err);
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;
