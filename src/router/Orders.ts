import express from 'express';
import {
  authentication as OrderAu,
  authorizePermissions as OrderAuPer,
} from '../middlewares/auth';
import {
  CreateOrder,
  UpdateOrder,
  DeleteOrder,
  OrderlistbyUser,
} from '../controllers/Orders';

const OrderRouter = express.Router();

OrderRouter.post('/create', OrderAu, CreateOrder);
OrderRouter.delete('/delete/:id', DeleteOrder);
OrderRouter.get('/orderlist/:id', OrderAu, OrderlistbyUser);
OrderRouter.patch('/update/:OrderId', OrderAu, UpdateOrder);

export default OrderRouter;
