import supabase from '../config/db.js';

// ── POST /api/orders ──────────────────────────────────────────
// Calls the place_order PostgreSQL function (full transaction)
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const { paymentMethod } = req.body;
    const { data, error } = await supabase.rpc('place_order', { p_user_id: userId, p_payment_method: paymentMethod || 'Credit Card' });

    if (error) throw error;
    if (!data.success)
      return res.status(400).json({ success: false, message: data.message });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      data: {
        orderId:     data.order_id,
        totalAmount: data.total_amount,
        itemCount:   data.item_count,
      },
    });
  } catch (err) {
    console.error('placeOrder error:', err);
    res.status(500).json({ success: false, message: 'Order placement failed.' });
  }
};

// ── GET /api/orders/user/:userId ──────────────────────────────
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.id !== Number(userId))
      return res.status(403).json({ success: false, message: 'Access denied.' });

    // Fetch orders with nested order_items + product details
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        total_amount,
        status,
        created_at,
        order_items (
          id,
          quantity,
          price,
          products (
            id,
            name,
            image_url,
            category
          )
        ),
        payments (
          id,
          amount,
          status,
          payment_method,
          created_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Shape the response
    const enriched = orders.map(order => ({
      ...order,
      items: order.order_items.map(item => ({
        item_id:    item.id,
        quantity:   item.quantity,
        unit_price: item.price,
        line_total: parseFloat((item.price * item.quantity).toFixed(2)),
        product_id: item.products.id,
        name:       item.products.name,
        image_url:  item.products.image_url,
        category:   item.products.category,
      })),
      order_items: undefined, // remove raw nested key
    }));

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    console.error('getUserOrders error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
};

// ── GET /api/orders/:orderId ──────────────────────────────────
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        id,
        user_id,
        total_amount,
        status,
        created_at,
        order_items (
          id,
          quantity,
          price,
          products ( id, name, image_url, category )
        ),
        payments (
          id,
          amount,
          status,
          payment_method,
          created_at
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      if (error.code === 'PGRST116')
        return res.status(404).json({ success: false, message: 'Order not found.' });
      throw error;
    }
    if (order.user_id !== userId)
      return res.status(403).json({ success: false, message: 'Access denied.' });

    const items = order.order_items.map(item => ({
      item_id:    item.id,
      quantity:   item.quantity,
      unit_price: item.price,
      line_total: parseFloat((item.price * item.quantity).toFixed(2)),
      product_id: item.products.id,
      name:       item.products.name,
      image_url:  item.products.image_url,
      category:   item.products.category,
    }));

    res.json({ success: true, data: { ...order, items, order_items: undefined } });
  } catch (err) {
    console.error('getOrderById error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch order.' });
  }
};
