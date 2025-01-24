import express from 'express';
import { authentication } from '../middlewares/auth';
import { createMessage, fetchMessages, chatHistory } from '../controllers/Chat';

const ChatRouter = express.Router();
// เอาไว้ fetch message
// ChatRouter.get('/:id', authentication, fetchAllMessages);

// เอาไว้ให้admin create message
ChatRouter.post('/', authentication, createMessage);

// // คสรมีอันเดียวและส่งid ด้วย:id
ChatRouter.get('/:UserId', authentication, fetchMessages);

ChatRouter.get('/chat-box/adminHistory', authentication, chatHistory);
export default ChatRouter;
