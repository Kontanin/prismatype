const Productexpress = require('express');
import multer, { FileFilterCallback } from 'multer'
import express, { Request, Response } from "express";
const storage = multer.diskStorage({
  destination: function (req: Request, file, cb) {
      cb(null, 'uploads/'); // Define destination directory
  },
  filename: function (req: Request, file, cb) {
      cb(null, file.originalname); // Keep original filename
  }
});
const upload = multer({ storage: storage });
const {fileStorage} = require('../middlewares/multer');
const { authentication:ProductAu, authorizePermissions:ProductAuPer } = require('../middlewares/auth');
const {
  CreateProduct,
  EditProduct,
  DeleteProduct,
  Productlist,
  ProductById,
  uploadSingleImage,
} = require('../controllers/Product');
const ProductRouter = Productexpress.Router();

ProductRouter.post('/create',ProductAu, CreateProduct);
ProductRouter.post('/upload/:id',ProductAu,upload.single('file'));

ProductRouter.patch('/edit/:id', ProductAu  ,EditProduct);
ProductRouter.get('/list', ProductAu, Productlist);
ProductRouter.get('/get/:id', ProductAu, ProductById);

ProductRouter.delete('/delete/:id',ProductAu,DeleteProduct);

module.exports = ProductRouter;
