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
// app.use('/api/chat', chatRoutes);
// app.use('/api/feedback', feedbackRoutes);
// app.use('/api/promotion', promotionRoutes);
// app.use('/blog', BlogRouter);
// app.use('/user', UserRouter);
// app.use('/orders', OrderRouter);

// import UserRouter from './router/User';
// import OrderRouter from './router/Orders';
// import BlogRouter from './router/Blog';
// import chatRoutes from './router/Chat';
// import feedbackRoutes from './router/Feedback';
// import promotionRoutes from './router/Promotion';