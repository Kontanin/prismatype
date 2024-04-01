const  { authentication:BlogAu, authorizePermissions:BlogAuPer } =require('../middlewares/auth') ;

// const CustomError = require('../errors');
const Blogexpress = require('express');
// const errorHandlerMiddleware = require('../middlewares/error-handler');
const {
  CreateBlog,
  EditBlog,
  DeleteBlog,
  BlogListbyUser,
  Blog,
} = require('../controllers/Blog');
const BlogRouter = Blogexpress.Router();

// router.use(errorHandlerMiddleware);

BlogRouter.post('/create', BlogAu, CreateBlog);

BlogRouter.patch('/edit/:id', BlogAu, EditBlog);
BlogRouter.delete('/delete', BlogAu, DeleteBlog);

BlogRouter.get('/bloglist', BlogAu, BlogListbyUser);
BlogRouter.get('/blog-id/:id', BlogAu, Blog);
module.exports = BlogRouter;
