import express from 'express';
import {
  authentication ,
  authorizePermissions 
} from '../middlewares/auth';

import upload from '../middlewares/multer';
import {
  CreateBlog,
  EditBlog,
  DeleteBlog,
  BlogListbyUser,
  Blog,
} from '../controllers/Blog';

const BlogRouter = express.Router();

BlogRouter.post('/create', authentication ,authorizePermissions ('admin'),upload.fields([{ name: 'image' }]), CreateBlog);
BlogRouter.patch('/edit/:id', authentication, authorizePermissions ('admin'),upload.fields([{ name: 'image' }]), EditBlog);
BlogRouter.delete('/delete/:id', authentication, authorizePermissions ('admin'), DeleteBlog);
BlogRouter.get('/bloglist', authentication, BlogListbyUser);
BlogRouter.get('/blog-id/:id', authentication, Blog);

export default BlogRouter;
