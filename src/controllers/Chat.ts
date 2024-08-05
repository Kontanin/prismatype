import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import CustomError from '../errors';
import data from '../MockUpData/data.json'
const prisma = new PrismaClient();

export const getMessagesByUser = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new CustomError.UnauthenticatedError('User not authenticated');
  }

  const userId = req.user.id;

//  res.status(200).json({data:data})


  const messages = await prisma.message.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  if (!messages || messages.length === 0) {
    throw new CustomError.NotFoundError('No messages found for this user');
  }

  res.status(200).json(messages);
};

export const createMessage = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new CustomError.UnauthenticatedError('User not authenticated');
  }

  const { content } = req.body;
  const userId = req.user.id;

  const message = await prisma.message.create({
    data: { content, userId },
  });
// console.log(content,userId);
// res.status(200).json({"msg": "success"});
  res.status(201).json(message);
};

export default {
  getMessagesByUser,
  createMessage,
};
