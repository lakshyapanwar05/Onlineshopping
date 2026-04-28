import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

const moreProducts = [
  { id: 21, name: 'Pro Climbing Harness', description: 'Lightweight adjustable climbing harness with gear loops.', price: 89.00, category: 'Accessories', image_url: 'https://images.unsplash.com/photo-1522120691812-dcdfb625f397?w=800&q=80', stock: 10 },
  { id: 22, name: 'Compact Camping Tent 2P', description: '2-person ultralight backpacking tent, 3-season capability.', price: 299.00, category: 'Gear', image_url: 'https://images.unsplash.com/photo-1478147427282-58a87a120780?w=800&q=80', stock: 5 },
  { id: 23, name: 'Thermal Sleeping Bag -10C', description: 'Mummy shape sleeping bag with duck down insulation.', price: 219.00, category: 'Gear', image_url: 'https://images.unsplash.com/photo-1542106603-68e16fd1df4f?w=800&q=80', stock: 12 },
  { id: 24, name: 'Titanium Camp Stove', description: 'Ultralight folding camping stove for backpacking meals.', price: 45.00, category: 'Accessories', image_url: 'https://images.unsplash.com/photo-1601614742795-3bcdd1a2ceeb?w=800&q=80', stock: 30 },
  { id: 25, name: 'Heavy-Duty Carabiner Set', description: 'Pack of 5 locking carabiners, 25kN rating.', price: 35.00, category: 'Accessories', image_url: 'https://images.unsplash.com/photo-1522120691812-dcdfb625f397?w=800&q=80', stock: 50 },
  { id: 26, name: 'Polarized Glacier Glasses', description: 'Category 4 lenses with side shields for high altitude.', price: 110.00, category: 'Accessories', image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', stock: 15 },
  { id: 27, name: 'Insulated Water Flask 32oz', description: 'Double-wall vacuum insulation keeps liquids hot/cold for 24h.', price: 39.00, category: 'Accessories', image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80', stock: 40 },
  { id: 28, name: 'Fleece-Lined Climbing Pants', description: 'Flexible, weather-resistant pants with reinforced knees.', price: 129.00, category: 'Jackets', image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80', stock: 22 },
  { id: 29, name: 'High-Altitude Oxygen Canister', description: 'Portable supplemental oxygen for intense ascents.', price: 18.00, category: 'Gear', image_url: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5b3?w=800&q=80', stock: 100 },
  { id: 30, name: 'Avalanche Rescue Kit', description: 'Beacon, shovel, and probe suite for backcountry skiing.', price: 349.00, category: 'Gear', image_url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80', stock: 8 }
];

async function seed() {
  console.log('Seeding more products...');
  
  // Doing it sequentially or batched to properly handle conflicts without breaking the whole batch
  const { data, error } = await supabase
    .from('products')
    .upsert(moreProducts, { onConflict: 'id', ignoreDuplicates: true });
    
  if (error) {
    console.error('Error inserting products:', error);
  } else {
    console.log('✅ Successfully added 10 more unique camping/hiking products!');
  }
}

seed();
