import express, { Request, Response } from 'express';
import {
  authentication as UserAu,
  authorizePermissions as UserAuPer,
} from '../middlewares/auth';
import {
  Register,
  Login,
  DeleteUser,
  UpdateUser,
  Information,
  UpdatePass,
  ValidateToken,
} from '../controllers/User';

const router = express.Router();

router.post('/register', Register);
router.post('/login', Login);

router.delete('/delete/:id', UserAu, UserAuPer('admin'), DeleteUser);

router.patch('/update/:id', UserAu, UpdateUser);

router.patch('/pass/:id', UserAu, UpdatePass);

router.get('/information/:id', Information);

router.post('/validate-token', ValidateToken);

export default router;
