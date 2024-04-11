const express = require('express');
const  { authentication:OrderAu, authorizePermissions:OrderAuPer } =require('../middlewares/auth') ;

const {
  CreateOrder,

  UpdateOrder,
  DeleteOrder,
  OrderlistbyUser,
  OrderDetail,
} = require('../controllers/Orders');
const OrderRouter = express.Router();

OrderRouter.post('/create', OrderAu, CreateOrder);
// OrderRouter.delete('/delete/:id', OrderAu, DeleteOrder);
OrderRouter.get('/orderlist/:id',OrderAu,OrderlistbyUser);
// OrderRouter.get('/order-by-id/:id', OrderAu, OrderDetail);
OrderRouter.patch('/update/:OrderId', OrderAu, UpdateOrder)
  
// );

module.exports = OrderRouter;
