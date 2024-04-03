const jwt = require('jsonwebtoken');
const CustomError = require('../errors');
import { Request, Response, NextFunction } from 'express';
const SECRET_KEY = process.env.SECRET_KEY;

declare module 'express-serve-static-core' {
  interface Request {
    user?: string | object | any;
  }
}





export const authentication = (req:Request, res: Response, next: NextFunction) => {
  const token = req.headers && req.headers['authorization'];

  if (!token)
    return res?.status(401).send({ message: 'A token is required for authentication' });

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ message: 'Invalid token' });
  }
};

export const authorizePermissions = (roles:string ) => {
  return (req:Request, res: Response, next: NextFunction) => {
    console.log(roles, 'roles', req.user.role);
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    console.log("in")
    next();
  };
};

module.exports = { 
  authentication, 
  authorizePermissions 
};
