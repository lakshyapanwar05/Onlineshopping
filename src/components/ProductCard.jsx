import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const BADGE_STYLES = {
  'TRENDING': 'bg-neon text-black',
  'BEST SELLER': 'bg-white text-black',
  'NEW': 'bg-white/10 text-white border border-white/20',
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart(product, product.sizes?.[0] || 'ONE SIZE', product.colors?.[0] || null);
    setTimeout(() => setAdding(false), 1000);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <Link to={`/products/${product.id}`} className="block group">
      <div
        className="product-card relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[3/4] bg-card-bg">
          <img
            src={product.images?.[0] || product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-black/40 flex items-end p-4 transition-opacity duration-300 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {!isOutOfStock ? (
              <button
                onClick={handleAdd}
                className={`w-full py-3 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 rounded-sm transition-all duration-200 ${
                  adding
                    ? 'bg-neon text-black'
                    : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-neon hover:text-black hover:border-neon'
                }`}
              >
                <ShoppingBag size={14} />
                {adding ? 'Added!' : 'Quick Add'}
              </button>
            ) : (
              <div className="w-full py-3 text-xs font-bold tracking-widest uppercase flex items-center justify-center bg-white/5 border border-white/10 text-white/40 rounded-sm">
                Out of Stock
              </div>
            )}
          </div>

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3">
              <span className={`text-[10px] font-bold tracking-widest px-2 py-1 rounded-sm ${BADGE_STYLES[product.badge] || 'bg-white/10 text-white'}`}>
                {product.badge}
              </span>
            </div>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-xs font-bold tracking-widest text-white/50 uppercase border border-white/20 px-3 py-1">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-white font-medium text-sm tracking-wide group-hover:text-neon transition-colors duration-200 truncate">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mt-1">
            <Star size={10} className="text-neon fill-neon" />
            <span className="text-white/50 text-xs">{product.rating}</span>
            <span className="text-white/20 text-xs">({product.reviews})</span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-white font-semibold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-white/30 text-sm line-through">${product.originalPrice}</span>
            )}
            {product.originalPrice && (
              <span className="text-neon text-xs font-bold ml-auto">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
