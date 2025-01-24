import express from 'express';
import { authentication, authorizePermissions } from '../middlewares/auth';
import { getFeedbackByUser, createFeedback, deleteFeedback } from '../controllers/Feedback';

const router = express.Router();

router.get('/', authentication, getFeedbackByUser);
router.post('/', authentication, createFeedback);
router.delete('/:id', authentication, authorizePermissions('admin'), deleteFeedback);

export default router;
