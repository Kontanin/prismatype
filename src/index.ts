import 'express-async-errors';
import path from 'path';
import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import bodyParser from 'body-parser';

import UserRouter from './router/User';
import OrderRouter from './router/Orders';
import BlogRouter from './router/Blog';
import ChatRouter from './router/Chat';
import feedbackRoutes from './router/Feedback';
import promotionRouter from './router/Promotion';
import AuthRoter from './router/Auth';

import ProductRouter from './router/Product';
import errorHandlerMiddleware from './middlewares/error-handler';
import notFoundMiddleware from './middlewares/not-found';
import { initializeSocket } from './controllers/Socket'; // Import the socket events

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'public', 'images')));
app.use(cors());

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use('/api/auth', AuthRoter);

app.use('/api/feedback', feedbackRoutes);
app.use('/promotion', promotionRouter);
app.use('/blog', BlogRouter);
app.use('/user', UserRouter);
app.use('/orders', OrderRouter);
app.use('/product', ProductRouter);
app.use('/chat', ChatRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
export const SECRET_KEY = process.env.SECRET_KEY as string;
export const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY as string;
// Create HTTP server
const server = http.createServer(app);

server.listen(port, () => {
  console.log('Running on port http://localhost:' + port);
});

// Initialize Socket.IO with the HTTP server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Initialize the socket events
initializeSocket(io);

export default server;
