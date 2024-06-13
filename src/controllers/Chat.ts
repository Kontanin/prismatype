import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMessagesByUser = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Unauthorized: User not found' });
  }

  const userId = req.user.id;
  try {
    const messages = await prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Unauthorized: User not found' });
  }

  const { content } = req.body;
  const userId = req.user.id;
  try {
    const message = await prisma.message.create({
      data: { content, userId },
    });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create message' });
  }
};
