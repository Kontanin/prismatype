const jwt = require('jsonwebtoken');
const CustomError = require('../errors');
import { Request, Response, NextFunction } from 'express';
const SECRET_KEY = process.env.SECRET_KEY;

declare module 'express-serve-static-core' {
  interface Request {
    user: { id: string; role: string; } | undefined
  }
}





const authentication = (req:Request, res: Response, next: NextFunction) => {
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

const authorizePermissions = (req:Request,res:Response ,roles:string,next:NextFunction) => {
    if (!req.user || roles!==req.user.role) {
      return res?.status(401).send({ message: 'you not get permission' });
    }

    next();
  
};

module.exports = { 
  authentication, 
  authorizePermissions 
};
