import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const updates = [
  { id: 1, image_url: '/images/jacket.png' },
  { id: 2, image_url: '/images/boots.png' },
  { id: 3, image_url: '/images/fleece.png' },
  { id: 4, image_url: '/images/bag.png' },
  { id: 5, image_url: '/images/baselayer.png' },
  { id: 6, image_url: '/images/accessories.png' },
  { id: 7, image_url: '/images/jacket.png' },
  { id: 8, image_url: '/images/boots.png' },
  { id: 9, image_url: '/images/jacket.png' },
  { id: 10, image_url: '/images/jacket.png' },
  { id: 11, image_url: '/images/boots.png' },
  { id: 12, image_url: '/images/boots.png' },
  { id: 13, image_url: '/images/bag.png' },
  { id: 14, image_url: '/images/bag.png' },
  { id: 15, image_url: '/images/fleece.png' },
  { id: 16, image_url: '/images/baselayer.png' },
  { id: 17, image_url: '/images/accessories.png' },
  { id: 18, image_url: '/images/accessories.png' },
  { id: 19, image_url: '/images/accessories.png' },
  { id: 20, image_url: '/images/accessories.png' }
];

async function updateImages() {
  for (const item of updates) {
    const { data, error } = await supabase
      .from('products')
      .update({ image_url: item.image_url })
      .eq('id', item.id);
    
    if (error) {
      console.error(`Error updating product ${item.id}:`, error);
    } else {
      console.log(`Successfully updated product ${item.id}`);
    }
  }
  console.log('Update complete.');
}

updateImages();
