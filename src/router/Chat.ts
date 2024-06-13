import express from 'express';
import { authentication, authorizePermissions } from '../middlewares/auth';
import { getMessagesByUser, createMessage } from '../controllers/Chat';

const router = express.Router();

router.get('/messages', authentication, getMessagesByUser);
router.post('/messages', authentication, createMessage);

export default router;
