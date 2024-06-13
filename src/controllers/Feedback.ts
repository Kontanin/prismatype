import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getFeedbackByUser = async (req: Request, res: Response) => {
  const userId = req.user.id; // Assuming req.user is populated by auth middleware
  try {
    const feedbacks = await prisma.feedback.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
};

export const createFeedback = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const userId = req.user.id; // Assuming req.user is populated by auth middleware
  try {
    const feedback = await prisma.feedback.create({
      data: { title, content, userId },
    });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create feedback' });
  }
};

export const deleteFeedback = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.feedback.delete({
      where: { id },
    });
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
};
