import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


interface CreatePromotionInput {
  name: string;
  type: string;
  percentage?: number;
  startDate: Date;
  endDate: Date;
  productIds: string[];
}

async function createPromotion(data: CreatePromotionInput) {
  try {
    const promotion = await prisma.promotion.create({
      data: {
        name: data.name,
        type: data.type,
        percentage: data.percentage,
        startDate: data.startDate,
        endDate: data.endDate,
        products: {
          connect: data.productIds.map(productId => ({ id: productId })),
        },
      },
    });
    return promotion;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating promotion:', error.message);
      throw new Error('Could not create promotion');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
}

export { createPromotion, CreatePromotionInput };
