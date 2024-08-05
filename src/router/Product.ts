import express from 'express';
import upload from '../middlewares/multer';
import { authentication as ProductAu, authorizePermissions as ProductAuPer } from '../middlewares/auth';
import {
  CreateProduct,
  EditProduct,
  DeleteProduct,
  Productlist,
  ProductById,
  Pagination,
  Picture,
} from '../controllers/Product';

const ProductRouter = express.Router();

ProductRouter.post(
  '/create',
  ProductAu,
  ProductAuPer('admin'),
  upload.fields([{ name: 'image' }]),
  CreateProduct
);

ProductRouter.post('/upload/:id', ProductAu);

ProductRouter.patch(
  '/edit/:id',
  ProductAu,
  upload.fields([{ name: 'image' }]),
  EditProduct
);

ProductRouter.get('/list', Productlist);
ProductRouter.get('/get/:id', ProductAu, ProductById);

ProductRouter.delete(
  '/delete/:id',
  ProductAu,
  ProductAuPer('admin'),
  DeleteProduct
);

ProductRouter.post('/page', Pagination);

ProductRouter.get('/image/:id', Picture);

export default ProductRouter;
