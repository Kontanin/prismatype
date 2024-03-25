const express = require('express');
const { authentication, authorizePermissions } = require('../middlewares/auth');
const {
  CreateOrder,
  UpdateOrder,
  DeleteOrder,
  Orderlist,
  OrderDetail,
} = require('../controllers/Orders');
const router = express.Router();

router.post('/create', authentication, CreateOrder);
router.delete('/delete/:id', authentication, DeleteOrder);
router.get(
  '/orderlist',
  authentication,
  authorizePermissions('admin'),
  Orderlist
);
router.get('/order-by-id/:id', authentication, OrderDetail);

router.patch('/update/:id', authentication, UpdateOrder);

module.exports = router;
