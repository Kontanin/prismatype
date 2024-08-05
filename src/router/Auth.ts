import express, { Request, Response } from 'express';
import {
  authentication as UserAu,
  authorizePermissions as UserAuPer,
} from '../middlewares/auth';
import {
login
} from '../controllers/Auth';

const router = express.Router();




router.post('/login', login);

export default router;