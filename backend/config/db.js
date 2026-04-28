import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌  Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

// Service-role client  → used in all backend controllers
// Bypasses Row Level Security (RLS) — safe for server-side only
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

// Verify connection on startup
(async () => {
  const { error } = await supabase.from('products').select('id').limit(1);
  if (error) {
    console.error('❌  Supabase connection failed:', error.message);
    process.exit(1);
  }
  console.log('✅  Supabase connected →', SUPABASE_URL);
})();

export default supabase;
