
import multer, { FileFilterCallback } from 'multer'
import express, { Request, Response } from "express";


type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void
export const fileStorage = multer.diskStorage({
  destination: (
      request: Request,
      file: Express.Multer.File,
      callback: DestinationCallback
  ): void => {
      // ...Do your stuff here.
  },

  filename: (
      req: Request, 
      file: Express.Multer.File, 
      callback: FileNameCallback
  ): void => {
      // ...Do your stuff here.
  }
})
// const storage = multer.diskStorage({
//   destination: function (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) {
//     callback(null, 'src/public/uploads');
//   },
//   filename: function (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
//     callback(null, file.originalname);
//   },
// });

// const uploadImg = multer({
//   storage: storage,
// });

// exports.uploadImg = uploadImg;
