import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPromotions = async (req: Request, res: Response) => {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch promotions' });
  }
};

export const createPromotion = async (req: Request, res: Response) => {
  const { name, type, percentage, startDate, endDate, products } = req.body;
  try {
    const promotion = await prisma.promotion.create({
      data: { 
        name, 
        type, 
        percentage, 
        startDate: new Date(startDate), 
        endDate: new Date(endDate),
        products: {
          connect: products.map((productId: string) => ({ id: productId }))
        }
      },
    });
    res.json(promotion);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create promotion' });
  }
};

export const updatePromotion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, percentage, startDate, endDate, products } = req.body;
  try {
    const promotion = await prisma.promotion.update({
      where: { id },
      data: { 
        name, 
        type, 
        percentage, 
        startDate: new Date(startDate), 
        endDate: new Date(endDate),
        products: {
          set: products.map((productId: string) => ({ id: productId }))
        }
      },
    });
    res.json(promotion);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update promotion' });
  }
};

export const deletePromotion = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.promotion.delete({
      where: { id },
    });
    res.json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete promotion' });
  }
};
