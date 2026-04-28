import { Router } from 'express';
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// All cart routes require authentication
router.use(protect);

// POST /api/cart/add
router.post('/add', addToCart);

// GET /api/cart/:userId
router.get('/:userId', getCart);

// PATCH /api/cart/update/:id
router.patch('/update/:id', updateCartQuantity);

// DELETE /api/cart/remove/:id
router.delete('/remove/:id', removeFromCart);

export default router;
