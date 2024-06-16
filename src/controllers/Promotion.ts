import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import CustomAPIError from '../errors';

const prisma = new PrismaClient();

export const getAllPromotions = async (req: Request, res: Response) => {
  const promotions = await prisma.promotion.findMany({
    orderBy: { createdAt: 'desc' },
  });

  if (!promotions) {
    throw new CustomAPIError.NotFoundError('No promotions found');
  }

  res.status(200).json(promotions);
};

export const createPromotion = async (req: Request, res: Response) => {
  const { name, type, percentage, startDate, endDate, products } = req.body;

  if (!name || !type || !startDate || !endDate || !products) {
    throw new CustomAPIError.BadRequestError(
      'Missing required promotion details'
    );
  }

  const promotion = await prisma.promotion.create({
    data: {
      name,
      type,
      percentage,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      products: {
        connect: products.map((productId: string) => ({ id: productId })),
      },
    },
  });

  res.status(201).json(promotion);
};

export const updatePromotion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, percentage, startDate, endDate, products } = req.body;

  const promotion = await prisma.promotion.update({
    where: { id },
    data: {
      name,
      type,
      percentage,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      products: {
        set: products.map((productId: string) => ({ id: productId })),
      },
    },
  });

  if (!promotion) {
    throw new CustomAPIError.NotFoundError('Promotion not found');
  }

  res.status(200).json(promotion);
};

export const deletePromotion = async (req: Request, res: Response) => {
  const { id } = req.params;

  const promotion = await prisma.promotion.delete({
    where: { id },
  });

  if (!promotion) {
    throw new CustomAPIError.NotFoundError('Promotion not found');
  }

  res.status(200).json({ message: 'Promotion deleted successfully' });
};

export default {
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
};
