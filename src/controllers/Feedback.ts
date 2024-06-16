import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import CustomError from '../errors';

const prisma = new PrismaClient();

export const getFeedbackByUser = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new CustomError.UnauthenticatedError('User not authenticated');
  }
  const userId = req.user.id;

  const feedbacks = await prisma.feedback.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  if (!feedbacks) {
    throw new CustomError.NotFoundError('No feedback found for this user');
  }

  res.status(200).json(feedbacks);
};

export const createFeedback = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new CustomError.UnauthenticatedError('User not authenticated');
  }
  const { title, content } = req.body;
  const userId = req.user.id;

  const feedback = await prisma.feedback.create({
    data: { title, content, userId, isActive: true },
  });

  res.status(201).json(feedback);
};

export const deleteFeedback = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new CustomError.UnauthenticatedError('User not authenticated');
  }
  const { id } = req.params;

  const feedback = await prisma.feedback.findFirst({ where: { id } });

  if (!feedback) {
    throw new CustomError.NotFoundError('Feedback not found');
  }

  await prisma.feedback.update({
    where: { id },
    data: { isActive: false },
  });

  res.status(200).json({ message: 'Feedback deleted successfully' });
};

export default {
  getFeedbackByUser,
  createFeedback,
  deleteFeedback,
};
