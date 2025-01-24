import express, { Request, Response } from 'express';
import {
  authentication as UserAu,
  authorizePermissions as UserAuPer,
} from '../middlewares/auth';
import {
  Register,

  DeleteUser,
  UpdateUser,
  Information,
  UpdatePass,
  ValidateToken,
  FindUserId,
  logout
} from '../controllers/User';

const router = express.Router();

router.post('/register', Register);
router.post('/logout', logout);
router.delete('/delete/:id', UserAu, UserAuPer('admin'), DeleteUser);
router.patch('/update/:id', UserAu, UpdateUser);
router.patch('/pass/:id', UserAu, UpdatePass);
router.get('/information/:id', Information);
router.get('/user-id/:name', FindUserId);
router.post('/validate-token', ValidateToken);

export default router;
