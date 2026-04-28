import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Zap, Star, ArrowLeft, Shield, Truck, RotateCcw, Check } from 'lucide-react';
import ImageSlideshow from '../components/ImageSlideshow';
import ProductCard from '../components/ProductCard';
import { getProductById, products } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsOpen } = useCart();
  const product = getProductById(id);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center flex-col gap-4">
        <p className="text-white/40 font-display text-3xl uppercase tracking-widest">Product Not Found</p>
        <Link to="/products" className="btn-primary text-sm">Back to Shop</Link>
      </div>
    );
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const isOutOfStock = product.stock === 0;

  const needsSize = product && product.sizes?.[0] !== 'ONE SIZE' && product.sizes?.length > 0;

  const handleAddToCart = () => {
    if (needsSize && !selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2500);
      return;
    }
    setSizeError(false);
    addToCart(product, selectedSize || product.sizes?.[0] || 'ONE SIZE', selectedColor || product.colors?.[0] || null, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (needsSize && !selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2500);
      return;
    }
    setSizeError(false);
    addToCart(product, selectedSize || product.sizes?.[0] || 'ONE SIZE', selectedColor || product.colors?.[0] || null, quantity);
    setIsOpen(true);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="bg-dark-bg min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/30 text-sm hover:text-neon transition-colors group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Left — Slideshow */}
          <div className="animate-fadeIn">
            <ImageSlideshow images={product.images || (product.image_url ? [product.image_url] : [])} name={product.name} />
          </div>

          {/* Right — Product Info */}
          <div className="flex flex-col gap-6 animate-fadeUp" style={{ animationFillMode: 'both' }}>
            {/* Category + Badge */}
            <div className="flex items-center gap-3">
              <span className="text-white/30 text-xs tracking-widest uppercase">{product.category}</span>
              {product.badge && (
                <span className={`text-[10px] font-bold tracking-widest px-2 py-1 rounded-sm ${
                  product.badge === 'TRENDING' ? 'bg-neon text-black' :
                  product.badge === 'BEST SELLER' ? 'bg-white text-black' :
                  'bg-white/10 text-white border border-white/10'
                }`}>
                  {product.badge}
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="font-display text-4xl md:text-5xl text-white uppercase tracking-wider leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.rating) ? 'text-neon fill-neon' : 'text-white/20'}
                  />
                ))}
              </div>
              <span className="text-white/40 text-sm">{product.rating} ({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-white">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-white/30 text-xl line-through">${product.originalPrice}</span>
                  <span className="text-neon text-sm font-bold bg-neon/10 px-2 py-0.5 rounded-sm">
                    -{discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : product.stock < 10 ? 'bg-yellow-400' : 'bg-neon'}`} />
              <span className="text-sm text-white/50">
                {isOutOfStock ? 'Out of stock' : product.stock < 10 ? `Only ${product.stock} left` : 'In stock'}
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/5" />

            {/* Description */}
            <p className="text-white/50 leading-relaxed text-sm">{product.description}</p>

            {/* Color */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-3">Color</p>
                <div className="flex gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-9 h-9 rounded-full transition-all duration-200 ${
                        selectedColor === color
                          ? 'ring-2 ring-neon ring-offset-2 ring-offset-dark-bg scale-110'
                          : 'ring-1 ring-white/10 hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {needsSize && (
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-3">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setSizeError(false); }}
                      className={`min-w-[48px] h-11 px-3 text-sm font-bold border rounded-sm transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-neon bg-neon/10 text-neon'
                          : sizeError
                          ? 'border-red-500/50 text-white/50'
                          : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="text-red-400 text-xs mt-2 animate-fadeUp">Please select a size to continue</p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-3">Quantity</p>
              <div className="inline-flex items-center border border-white/10 rounded-sm">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center text-white/40 hover:text-neon transition-colors text-lg"
                >
                  −
                </button>
                <span className="w-12 text-center font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-12 h-12 flex items-center justify-center text-white/40 hover:text-neon transition-colors text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-4 font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 rounded-sm transition-all duration-200 border ${
                  isOutOfStock
                    ? 'border-white/10 text-white/20 cursor-not-allowed'
                    : added
                    ? 'border-neon bg-neon/10 text-neon'
                    : 'border-white/20 text-white hover:border-neon hover:text-neon'
                }`}
              >
                {added ? <><Check size={16} /> Added!</> : <><ShoppingBag size={16} /> Add to Cart</>}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex-1 py-4 font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 rounded-sm transition-all duration-200 ${
                  isOutOfStock
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-neon text-black hover:bg-neon-dim hover:scale-[1.02] active:scale-[0.98] neon-glow'
                }`}
              >
                <Zap size={16} fill={isOutOfStock ? 'none' : 'black'} /> Buy Now
              </button>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'Orders over $300' },
                { icon: Shield, label: 'Warranty', sub: '2-year coverage' },
                { icon: RotateCcw, label: 'Returns', sub: '30-day window' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1.5 p-3 bg-white/[0.03] rounded-sm border border-white/5">
                  <Icon size={18} className="text-neon" />
                  <span className="text-white text-xs font-medium">{label}</span>
                  <span className="text-white/30 text-[10px]">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-display text-3xl text-white tracking-widest uppercase mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
