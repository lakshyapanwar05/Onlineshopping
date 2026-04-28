// ──────────────────────────────────────────────────────────────────────────────
//  NivisGear API Service
//  All frontend ↔ backend communication goes through this file.
//  Swap BASE_URL to your production URL when deploying.
// ──────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Token helpers ─────────────────────────────────────────────────────────────

const getToken = () => localStorage.getItem('ng_token');
const setToken = (t) => localStorage.setItem('ng_token', t);
const clearToken = () => localStorage.removeItem('ng_token');

// ── Core fetch wrapper ────────────────────────────────────────────────────────

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.message || 'API error');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

const get    = (path)         => request(path, { method: 'GET' });
const post   = (path, body)   => request(path, { method: 'POST',   body: JSON.stringify(body) });
const patch  = (path, body)   => request(path, { method: 'PATCH',  body: JSON.stringify(body) });
const del    = (path)         => request(path, { method: 'DELETE' });

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authAPI = {
  register: async (name, email, password) => {
    const data = await post('/auth/register', { name, email, password });
    setToken(data.token);
    return data;
  },
  login: async (email, password) => {
    const data = await post('/auth/login', { email, password });
    setToken(data.token);
    return data;
  },
  getMe:   () => get('/auth/me'),
  logout:  () => { clearToken(); },
};

// ── Products ──────────────────────────────────────────────────────────────────

export const productsAPI = {
  getAll: () => get('/products'),

  getById: (id) => get(`/products/${id}`),

  filter: ({ category, minPrice, maxPrice, sort } = {}) => {
    const params = new URLSearchParams();
    if (category)  params.set('category', category);
    if (minPrice !== undefined) params.set('minPrice', minPrice);
    if (maxPrice !== undefined) params.set('maxPrice', maxPrice);
    if (sort)      params.set('sort', sort);
    return get(`/products/filter?${params.toString()}`);
  },
};

// ── Cart ──────────────────────────────────────────────────────────────────────

export const cartAPI = {
  getCart:   (userId)           => get(`/cart/${userId}`),
  add:       (productId, qty=1) => post('/cart/add', { productId, quantity: qty }),
  update:    (cartId, quantity) => patch(`/cart/update/${cartId}`, { quantity }),
  remove:    (cartId)           => del(`/cart/remove/${cartId}`),
};

// ── Orders ────────────────────────────────────────────────────────────────────

export const ordersAPI = {
  place:        (paymentMethod = 'Credit Card') => post('/orders', { paymentMethod }),
  getUserOrders:(userId)  => get(`/orders/user/${userId}`),
  getById:      (orderId) => get(`/orders/${orderId}`),
};

// ── Health ────────────────────────────────────────────────────────────────────

export const healthCheck = () => get('/health');
