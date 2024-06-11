import { Request } from 'express';
import { File } from 'multer';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        // Add other properties that are part of your user object
      };
      files?: {
        [fieldname: string]: File[];
      };
    }
  }
}
