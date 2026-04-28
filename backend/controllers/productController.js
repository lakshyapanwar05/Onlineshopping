import supabase from '../config/db.js';

// ── GET /api/products ─────────────────────────────────────────
export const getAllProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, description, price, category, image_url, stock, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    console.error('getAllProducts error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
};

// ── GET /api/products/filter ──────────────────────────────────
// Query: ?category=Jackets&minPrice=100&maxPrice=300&sort=price_asc
export const filterProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort } = req.query;

    let query = supabase
      .from('products')
      .select('id, name, description, price, category, image_url, stock, created_at');

    if (category)  query = query.eq('category', category);
    if (minPrice !== undefined) query = query.gte('price', Number(minPrice));
    if (maxPrice !== undefined) query = query.lte('price', Number(maxPrice));

    // Sorting
    const sortMap = {
      price_asc:  { column: 'price',      ascending: true  },
      price_desc: { column: 'price',      ascending: false },
      newest:     { column: 'created_at', ascending: false },
    };
    const { column, ascending } = sortMap[sort] || { column: 'created_at', ascending: false };
    query = query.order(column, { ascending });

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    console.error('filterProducts error:', err);
    res.status(500).json({ success: false, message: 'Failed to filter products.' });
  }
};

// ── GET /api/products/:id ─────────────────────────────────────
export const getProductById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, description, price, category, image_url, stock, created_at')
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116')
        return res.status(404).json({ success: false, message: 'Product not found.' });
      throw error;
    }
    res.json({ success: true, data });
  } catch (err) {
    console.error('getProductById error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch product.' });
  }
};
