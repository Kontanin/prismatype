const jwt = require('jsonwebtoken');

import { Request, Response, NextFunction } from 'express';
const SECRET_KEY = process.env.SECRET_KEY;

declare global {
  namespace Express {
    export interface Request {
      user?: any;
    }
  }
}





const authentication = (req:Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];

  if (!token)
    return res
      .status(403)
      .send({ message: 'A token is required for authentication' });

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ message: 'Invalid token' });
  }
};
const authorizePermissions = (roles:string ) => {
  return (req:Request, res: Response, next: NextFunction) => {
    console.log(roles, 'roles', req.user.role);
    if (!roles.includes(req.user.role)) {
      // throw new CustomError.UnauthorizedError(
      //   'Unauthorized to access this route'
      // );
    }
    console.log("in")
    next();
  };
};
module.exports = { authentication, 
  
  authorizePermissions 

};
