import { Router } from 'express';
import {
  placeOrder,
  getUserOrders,
  getOrderById,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// All order routes require authentication
router.use(protect);

// POST /api/orders  — place a new order
router.post('/', placeOrder);

// GET /api/orders/user/:userId  — all orders for a user
router.get('/user/:userId', getUserOrders);

// GET /api/orders/:orderId  — single order detail
router.get('/:orderId', getOrderById);

export default router;
