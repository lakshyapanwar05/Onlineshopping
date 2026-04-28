import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables BEFORE importing db (db.js reads process.env)
dotenv.config();

// DB connection (auto-tests on import)
import './config/db.js';

// Route modules
import authRoutes    from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes    from './routes/cart.js';
import orderRoutes   from './routes/orders.js';

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Global Middleware ────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}]  ${req.method}  ${req.originalUrl}`);
    next();
  });
}

// ── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/orders',   orderRoutes);

// Health check
app.get('/api/health', (_req, res) =>
  res.json({ success: true, message: 'TheOutdoors API is running 🚀', timestamp: new Date() })
);

// ── 404 Handler ──────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── Global Error Handler ─────────────────────────────────────────────────────

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

// ── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀  TheOutdoors API listening on http://localhost:${PORT}`);
  console.log(`📦  Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
