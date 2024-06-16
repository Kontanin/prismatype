import 'express-async-errors';
import path from 'path';
import http from 'http';
import express, { Request, Response } from 'express';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import UserRouter from './router/User';
import OrderRouter from './router/Orders';
import BlogRouter from './router/Blog';
import chatRoutes from './router/Chat';
import feedbackRoutes from './router/Feedback';
import promotionRouter from './router/Promotion';

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.get('/api-docs', swaggerUi.setup(swaggerDocument));

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.get('/api-docs', swaggerUi.setup(swaggerDocument));

import ProductRouter from './router/Product';
import errorHandlerMiddleware from './middlewares/error-handler';
import notFoundMiddleware from './middlewares/not-found';
dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use('/uploads', express.static(path.join(__dirname, 'public', 'images')));
app.use(cors());

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use('/api/chat', chatRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/promotion', promotionRouter);
app.use('/blog', BlogRouter);
app.use('/user', UserRouter);
app.use('/orders', OrderRouter);
app.use('/product', ProductRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

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

// Socket.IO events
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('sent-message', (data) => {
    console.log('Message from client:', data);
    io.emit('new-message', data); // Broadcast message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

export default server;
