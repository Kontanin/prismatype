import { Prisma } from "@prisma/client";

import express, { Request, Response } from "express";
require('express-async-errors');
const dotenv = require('dotenv');

import { PrismaClient } from "@prisma/client";
dotenv.config();

const cors = require('cors');
const app = express();
const prisma= new PrismaClient();



const UserRouter = require('./router/User');
const OrderRouter = require('./router/Orders');
const ProductRouter = require('./router/Product');
const BlogRouter = require('./router/Blog');
const bodyParser = require('body-parser');

// const CustomError = require('./errors');

const errorHandlerMiddleware = require('./middlewares/error-handler');



app.use(express.static('./public'));
app.use(cors());

app.use(bodyParser.json({ limit: '5mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.get('/api-docs', swaggerUi.setup(swaggerDocument));
app.use('/blog', BlogRouter);

app.use('/user', UserRouter);

app.use('/orders', OrderRouter);
app.use('/product', ProductRouter);

app.use(errorHandlerMiddleware);









const port = process.env.port;


app.listen(port, () => {
  console.log(`Start server at port ${port}`);
});
