import express from 'express';
import { authentication, authorizePermissions } from '../middlewares/auth';
import { getFeedbackByUser, createFeedback, deleteFeedback } from '../controllers/Feedback';

const router = express.Router();

router.get('/feedbacks', authentication, getFeedbackByUser);
router.post('/feedbacks', authentication, createFeedback);
router.delete('/feedbacks/:id', authentication, authorizePermissions('admin'), deleteFeedback);

export default router;
