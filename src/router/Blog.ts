
const express = require('express');

const { authentication, authorizePermissions } = require('../middlewares/auth');

// const CustomError = require('../errors');

// const errorHandlerMiddleware = require('../middlewares/error-handler');
const {
  CreateBlog,
  EditBlog,
  DeleteBlog,
  BlogListbyUser,
  Blog,
} = require('../controllers/Blog');
const router = express.Router();

// router.use(errorHandlerMiddleware);

router.post('/create', authentication, CreateBlog);

router.patch('/edit/:id', authentication, EditBlog);
router.delete('/delete', authentication, DeleteBlog);

router.get('/bloglist', authentication, BlogListbyUser);
router.get('/blog-id/:id', authentication, Blog);

module.exports = router;
