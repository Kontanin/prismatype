import express from 'express';
import { authentication, authorizePermissions } from '../middlewares/auth';
import { getAllPromotions, createPromotion, updatePromotion, deletePromotion } from '../controllers/Promotion';

const router = express.Router();

router.get('/promotions', authentication, getAllPromotions);
router.post('/promotions', authentication, authorizePermissions('admin'), createPromotion);
router.patch('/promotions/:id', authentication, authorizePermissions('admin'), updatePromotion);
router.delete('/promotions/:id', authentication, authorizePermissions('admin'), deletePromotion);

export default router;
