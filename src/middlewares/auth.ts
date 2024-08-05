const jwt = require('jsonwebtoken');
const CustomError = require('../errors');
import { Request, Response, NextFunction } from 'express';
import { SECRET_KEY } from '../index';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string; role: string };
  }
}

const authentication = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res
      .status(401)
      .send({ message: 'A token is required for authentication' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY) as {
      id: string;
      role: string;
      iat: number;
    };
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error, 'error');
    return res.status(401).send({ message: 'Invalid token' });
  }
};

const authorizePermissions = (roles: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || roles !== req.user.role) {
      return res
        .status(403)
        .send({ message: 'You do not have permission to perform this action' });
    }
    next();
  };
};

export { authentication, authorizePermissions };
