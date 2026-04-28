-- ================================================================
--  TheOutdoors — Supabase SQL Functions
--  Run this in Supabase → SQL Editor → New Query → Run
--  These handle complex operations (upserts + transactions)
--  that should run atomically inside the database.
-- ================================================================

-- ----------------------------------------------------------------
-- 1. add_to_cart  — upsert cart item with quantity increment
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION add_to_cart(
  p_user_id    INTEGER,
  p_product_id INTEGER,
  p_quantity   INTEGER DEFAULT 1
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_stock INTEGER;
BEGIN
  -- Check product stock
  SELECT stock INTO v_stock FROM products WHERE id = p_product_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Product not found.');
  END IF;
  IF v_stock < p_quantity THEN
    RETURN json_build_object('success', false, 'message', 'Insufficient stock.');
  END IF;

  -- Upsert: insert or increment quantity
  INSERT INTO cart (user_id, product_id, quantity)
  VALUES (p_user_id, p_product_id, p_quantity)
  ON CONFLICT (user_id, product_id)
  DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity;

  RETURN json_build_object('success', true, 'message', 'Item added to cart.');
END;
$$;

-- ----------------------------------------------------------------
-- 2. place_order  — full atomic transaction
--    Validates stock → creates order → inserts items →
--    decrements stock → clears cart. Rolls back on any error.
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION place_order(p_user_id INTEGER, p_payment_method VARCHAR DEFAULT 'Credit Card')
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_order_id    INTEGER;
  v_total       NUMERIC(10,2) := 0;
  v_item        RECORD;
  v_item_count  INTEGER := 0;
BEGIN
  -- Validate and sum cart items
  FOR v_item IN
    SELECT c.product_id, c.quantity, p.name, p.price, p.stock
    FROM   cart c
    JOIN   products p ON c.product_id = p.id
    WHERE  c.user_id = p_user_id
    FOR UPDATE
  LOOP
    IF v_item.stock < v_item.quantity THEN
      RAISE EXCEPTION 'Insufficient stock for "%". Available: %, requested: %',
        v_item.name, v_item.stock, v_item.quantity;
    END IF;
    v_total      := v_total + (v_item.price * v_item.quantity);
    v_item_count := v_item_count + 1;
  END LOOP;

  IF v_item_count = 0 THEN
    RAISE EXCEPTION 'Cart is empty.';
  END IF;

  -- Create order
  INSERT INTO orders (user_id, total_amount, status)
  VALUES (p_user_id, v_total, 'processing')
  RETURNING id INTO v_order_id;

  -- Create payment
  INSERT INTO payments (order_id, amount, status, payment_method)
  VALUES (v_order_id, v_total, 'completed', p_payment_method);

  -- Insert order items
  INSERT INTO order_items (order_id, product_id, quantity, price)
  SELECT v_order_id, c.product_id, c.quantity, p.price
  FROM   cart c JOIN products p ON c.product_id = p.id
  WHERE  c.user_id = p_user_id;

  -- Decrement stock
  UPDATE products p
  SET    stock = p.stock - c.quantity
  FROM   cart c
  WHERE  c.product_id = p.id AND c.user_id = p_user_id;

  -- Clear cart
  DELETE FROM cart WHERE user_id = p_user_id;

  RETURN json_build_object(
    'success',      true,
    'order_id',     v_order_id,
    'total_amount', v_total,
    'item_count',   v_item_count
  );

EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$;
