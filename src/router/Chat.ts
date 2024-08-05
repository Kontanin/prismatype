import express from 'express';
import { authentication } from '../middlewares/auth';
import { getMessageHistory, createMessage } from '../controllers/Chat';

const ChatRouter = express.Router();

ChatRouter.get('/', authentication, getMessageHistory);
ChatRouter.post('/', authentication, createMessage);
export default ChatRouter;
