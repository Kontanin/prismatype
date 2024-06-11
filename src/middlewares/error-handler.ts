const { StatusCodes: StatusCodesEH } = require('http-status-codes');
import express, { Request, Response, NextFunction } from 'express';

const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError = {
    statusCode: StatusCodesEH.INTERNAL_SERVER_ERROR,
    msg: 'Something went wrong, please try again later',
  };
  // Handle specific error cases
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item: any) => item.message)
      .join(',');
    customError.statusCode = StatusCodesEH.BAD_REQUEST;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = StatusCodesEH.BAD_REQUEST;
  }

  if (err.name === 'CastError') {
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = StatusCodesEH.NOT_FOUND;
  }
  // return res.status(customError.statusCode).json({ msg: customError.msg });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
