const express = require('express');



const multerModule = require('../middlewares/multer');
const { authentication, authorizePermissions } = require('../middlewares/auth');
const {
  CreateProduct,
  EditProduct,
  DeleteProduct,
  Productlist,
  ProductById,
  uploadSingleImage,
} = require('../controllers/Product');
const router = express.Router();

router.post('/create', authentication, CreateProduct);
router.post(
  '/upload/:id',
  authentication,
  authorizePermissions('admin'),
  multerModule.uploadImg.single('image'),
  uploadSingleImage
);

router.patch('/edit/:id', authentication, EditProduct);
router.get('/list', authentication, Productlist);
router.get('/get/:id', authentication, ProductById);

router.delete(
  '/delete/:id',
  authentication,
  authorizePermissions('admin'),
  DeleteProduct
);

module.exports = router;
