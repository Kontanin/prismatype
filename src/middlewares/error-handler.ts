const { StatusCodes:StatusCodesEH } = require('http-status-codes');
import express, { Request, Response,NextFunction } from "express";

const errorHandlerMiddleware = ( req:Request, res:Response, next:NextFunction) => {
  let customError = {
    statusCode: StatusCodesEH.INTERNAL_SERVER_ERROR,
    msg: 'Something went wrong, please try again later',
  };
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
