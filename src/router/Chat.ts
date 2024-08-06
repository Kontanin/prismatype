import express from 'express';
import { authentication } from '../middlewares/auth';
import {
  fetchAllMessages,
  createMessage,
  fetchMessages,
} from '../controllers/Chat';

const ChatRouter = express.Router();

ChatRouter.get('/:id', authentication, fetchAllMessages);
ChatRouter.post('/', authentication, createMessage);
ChatRouter.get('/', authentication, fetchMessages);
export default ChatRouter;
