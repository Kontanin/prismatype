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

ProductRouter.post('/create', ProductAu,ProductAuPer('admin'), CreateProduct);
// ProductRouter.post(
//   '/upload/:id',
//   ProductAu,
//   ProductAu('admin'),
//   upload.single('file')
// );

ProductRouter.patch('/edit/:id', ProductAu  ,ProductAuPer('admin'), EditProduct);
ProductRouter.get('/list', ProductAu, Productlist);
ProductRouter.get('/get/:id', ProductAu, ProductById);

ProductRouter.delete(
  '/delete/:id',
  ProductAu,
  ProductAuPer('admin'),
  DeleteProduct
);

module.exports = ProductRouter;
