# NivisGear — Backend API

Node.js + Express + MySQL REST API for the NivisGear e-commerce platform.

---

## Quick Start

### 1. Set up MySQL database

```sql
-- Run in MySQL workbench / CLI
source schema.sql
```

### 2. Configure environment

Edit `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_db
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
PORT=5000
```

### 3. Install & run

```bash
cd backend
npm install
npm run dev      # development (auto-restart on changes)
npm start        # production
```

Server starts at **http://localhost:5000**

---

## Project Structure

```
backend/
├── config/
│   └── db.js                  # MySQL connection pool (mysql2/promise)
├── controllers/
│   ├── authController.js      # register, login, getMe
│   ├── productController.js   # getAllProducts, filterProducts, getProductById
│   ├── cartController.js      # addToCart, getCart, updateQty, removeFromCart
│   └── orderController.js     # placeOrder (transaction), getUserOrders, getOrderById
├── middleware/
│   └── auth.js                # JWT protect middleware
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   └── orders.js
├── schema.sql                 # Full DB schema + seed data
├── server.js                  # Express app entry point
└── .env                       # Environment variables
```

---

## API Reference

### Base URL: `http://localhost:5000/api`

### Health Check
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | ❌ | Server status |

---

### Auth — `/api/auth`
| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| POST | `/auth/register` | ❌ | `{ name, email, password }` | Create new account |
| POST | `/auth/login`    | ❌ | `{ email, password }` | Login, returns JWT |
| GET  | `/auth/me`       | ✅ | — | Get current user profile |

**Response (register / login):**
```json
{
  "success": true,
  "token": "eyJ...",
  "user": { "id": 1, "name": "John", "email": "john@example.com" }
}
```

---

### Products — `/api/products`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products` | ❌ | All products |
| GET | `/products/:id` | ❌ | Single product |
| GET | `/products/filter` | ❌ | Filter by query params |

**Filter query params:**
```
?category=Jackets
?minPrice=100&maxPrice=300
?sort=price_asc | price_desc | newest
```

---

### Cart — `/api/cart`  🔒 All require JWT
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/cart/add` | `{ productId, quantity }` | Add item (upserts) |
| GET  | `/cart/:userId` | — | Get cart with JOIN to products |
| PATCH | `/cart/update/:id` | `{ quantity }` | Update quantity |
| DELETE | `/cart/remove/:id` | — | Remove item |

**Cart response includes:**
- `cartTotal` — computed server-side
- `line_total` per item
- Full product fields joined from `products` table

---

### Orders — `/api/orders`  🔒 All require JWT
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Place order (full transaction) |
| GET  | `/orders/user/:userId` | All orders with items |
| GET  | `/orders/:orderId` | Single order detail |

**Place order — what happens inside the transaction:**
1. Reads cart items with `FOR UPDATE` lock
2. Validates stock for every item
3. Inserts into `orders`
4. Inserts into `order_items`
5. Decrements `products.stock`
6. Deletes cart rows
7. Commits — or full rollback on any error

---

## Authentication

All protected routes require a Bearer token in the `Authorization` header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Database Schema

```
users          → id, name, email, password, created_at
products       → id, name, description, price, category, image_url, stock, created_at
cart           → id, user_id (FK), product_id (FK), quantity, added_at
orders         → id, user_id (FK), total_amount, status, created_at
order_items    → id, order_id (FK), product_id (FK), quantity, price
```

---

## Running Both Frontend + Backend

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd ../ && npm run dev
```

Frontend: http://localhost:5173  
Backend:  http://localhost:5000
