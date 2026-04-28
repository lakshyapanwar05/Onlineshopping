import { Router } from 'express';
import {
  getAllProducts,
  filterProducts,
  getProductById,
} from '../controllers/productController.js';

const router = Router();

// NOTE: /filter must be declared BEFORE /:id so Express doesn't
//       treat the literal string "filter" as a dynamic :id param.

// GET /api/products/filter?category=Jackets&minPrice=100&maxPrice=300&sort=price_asc
router.get('/filter', filterProducts);

// GET /api/products
router.get('/', getAllProducts);

// GET /api/products/:id
router.get('/:id', getProductById);

export default router;
