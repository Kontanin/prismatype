import express from 'express';
import { createPromotion, CreatePromotionInput } from '../controllers/Promotion';

const router = express.Router();

router.post('/promotions', async (req, res) => {
  const { name, type, percentage, startDate, endDate, productIds } = req.body;

  const promotionData: CreatePromotionInput = {
    name,
    type,
    percentage,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    productIds,
  };

  try {
    const promotion = await createPromotion(promotionData);
    res.status(201).json(promotion);
  } catch (error) {
    res.status(500).json({ error: 'Could not create promotion'});
  }
});

export default router;
