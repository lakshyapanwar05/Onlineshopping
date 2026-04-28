import supabase from '../config/db.js';

// ── POST /api/cart/add ────────────────────────────────────────
// Uses Supabase RPC function (handles upsert + quantity increment atomically)
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (!productId)
      return res.status(400).json({ success: false, message: 'productId is required.' });
    if (quantity < 1)
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1.' });

    const { data, error } = await supabase.rpc('add_to_cart', {
      p_user_id:    userId,
      p_product_id: productId,
      p_quantity:   quantity,
    });

    if (error) throw error;
    if (!data.success)
      return res.status(400).json({ success: false, message: data.message });

    res.status(201).json({ success: true, message: 'Item added to cart.' });
  } catch (err) {
    console.error('addToCart error:', err);
    res.status(500).json({ success: false, message: 'Failed to add item to cart.' });
  }
};

// ── GET /api/cart/:userId ─────────────────────────────────────
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.id !== Number(userId))
      return res.status(403).json({ success: false, message: 'Access denied.' });

    // Supabase join syntax: select cart + embedded product
    const { data, error } = await supabase
      .from('cart')
      .select(`
        id,
        quantity,
        added_at,
        products (
          id,
          name,
          description,
          price,
          category,
          image_url,
          stock
        )
      `)
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    if (error) throw error;

    // Flatten and compute totals
    const items = data.map(item => ({
      cart_id:    item.id,
      quantity:   item.quantity,
      added_at:   item.added_at,
      product_id: item.products.id,
      name:       item.products.name,
      description:item.products.description,
      price:      item.products.price,
      category:   item.products.category,
      image_url:  item.products.image_url,
      stock:      item.products.stock,
      line_total: parseFloat((item.products.price * item.quantity).toFixed(2)),
    }));

    const cartTotal = items.reduce((sum, i) => sum + i.line_total, 0);

    res.json({
      success: true,
      count: items.length,
      cartTotal: parseFloat(cartTotal.toFixed(2)),
      data: items,
    });
  } catch (err) {
    console.error('getCart error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch cart.' });
  }
};

// ── DELETE /api/cart/remove/:id ───────────────────────────────
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Ownership check
    const { data: item } = await supabase
      .from('cart')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (!item)
      return res.status(404).json({ success: false, message: 'Cart item not found or access denied.' });

    const { error } = await supabase.from('cart').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'Item removed from cart.' });
  } catch (err) {
    console.error('removeFromCart error:', err);
    res.status(500).json({ success: false, message: 'Failed to remove cart item.' });
  }
};

// ── PATCH /api/cart/update/:id ────────────────────────────────
export const updateCartQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (!quantity || quantity < 1)
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1.' });

    // Ownership + stock check
    const { data: item } = await supabase
      .from('cart')
      .select('id, products(stock)')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (!item)
      return res.status(404).json({ success: false, message: 'Cart item not found or access denied.' });
    if (item.products.stock < quantity)
      return res.status(400).json({ success: false, message: 'Requested quantity exceeds available stock.' });

    const { error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Cart quantity updated.' });
  } catch (err) {
    console.error('updateCartQuantity error:', err);
    res.status(500).json({ success: false, message: 'Failed to update cart quantity.' });
  }
};
