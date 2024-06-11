

import Chatexpress from 'express';
import { getChatHistory as Chatreouter } from '../controllers/Chat';
const {
  authentication: ChatAuChat,
  authorizePermissions: ChatAuPerChat,
} = require('../middlewares/auth');


const ChatRouter = Chatexpress.Router();

ChatRouter.get('/history',ChatAuChat, Chatreouter);

module.exports=ChatRouter;