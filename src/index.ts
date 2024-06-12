require('express-async-errors');

import { Prisma } from '@prisma/client';
import path from 'path';
import http from 'http';
import express, { Request, Response } from 'express';
import { Server } from 'socket.io';

const dotenv = require('dotenv');
import { PrismaClient } from '@prisma/client';
dotenv.config();

const cors = require('cors');
const app = express();
const prisma = new PrismaClient();

// Initialize Socket.IO
const UserRouter = require('./router/User');
const OrderRouter = require('./router/Orders');
const ProductRouter = require('./router/Product');
const BlogRouter = require('./router/Blog');
import chatRoutes from './routes/Chat';
import feedbackRoutes from './routes/Feedback';
import promotionRoutes from './routes/Promotion';
const bodyParser = require('body-parser');

// const CustomError = require('./errors');
const errorHandlerMiddleware = require('./middlewares/error-handler');

app.use('/uploads', express.static(path.join(__dirname, 'public', 'images')));
app.use(cors());

app.use(bodyParser.json({ limit: '5mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.get('/api-docs', swaggerUi.setup(swaggerDocument));
app.use('/api/chat', chatRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/promotion', promotionRoutes);
app.use('/blog', BlogRouter);
app.use('/user', UserRouter);
app.use('/orders', OrderRouter);
app.use('/product', ProductRouter);

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
