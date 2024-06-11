const Productexpress = require('express');


import upload from '../middlewares/multer';
const {
  authentication: ProductAu,
  authorizePermissions: ProductAuPer,
} = require('../middlewares/auth');

const {
  CreateProduct,
  EditProduct,
  DeleteProduct,
  Productlist,
  ProductById,
  Pagination,
  Picture,
} = require('../controllers/Product');

const ProductRouter = Productexpress.Router();

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

module.exports = ProductRouter;
