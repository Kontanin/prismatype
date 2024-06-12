import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMessagesByUser = async (req: Request, res: Response) => {
  const userId = req?.user.id; // Assuming req.user is populated by auth middleware
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
  const { content } = req.body;
  const userId = req?.user.id; // Assuming req.user is populated by auth middleware
  try {
    const message = await prisma.message.create({
      data: { content, userId },
    });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create message' });
  }
};
