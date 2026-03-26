import express from 'express';
import { auth } from '../../middlewares/auth';
import { AuthUser } from '../../../enums';
import { SubscriptionController } from './subscription.controller';

const router = express.Router();

// Doctor routes
router.post('/subscribe', auth(AuthUser.DOCTOR), SubscriptionController.subscribe);
router.get('/my-subscription', auth(AuthUser.DOCTOR), SubscriptionController.getMySubscription);
router.get('/history', auth(AuthUser.DOCTOR), SubscriptionController.getSubscriptionHistory);
router.patch('/cancel', auth(AuthUser.DOCTOR), SubscriptionController.cancelSubscription);

// Admin routes
router.get('/all', auth(AuthUser.ADMIN), SubscriptionController.getAllSubscriptions);
router.get('/revenue', auth(AuthUser.ADMIN), SubscriptionController.getSubscriptionRevenue);

export const SubscriptionRouter = router;
