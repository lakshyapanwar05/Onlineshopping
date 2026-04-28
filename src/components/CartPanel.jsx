import { useEffect, useRef, useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartPanel() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, cartTotal, cartCount, checkout } = useCart();
  const panelRef = useRef(null);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  const handleCheckout = async () => {
    try {
      await checkout(paymentMethod);
      alert('Checkout successful! Your order has been placed.');
    } catch (err) {
      alert(err.message || 'Checkout failed.');
    }
  };

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setIsOpen]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col transition-transform duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'rgba(10,10,10,0.92)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-neon" />
            <span className="font-display text-xl tracking-widest uppercase text-white">
              Cart
            </span>
            {cartCount > 0 && (
              <span className="px-2 py-0.5 bg-neon text-black text-xs font-bold rounded-full">
                {cartCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-white/40 hover:text-white transition-colors rounded-sm hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                <ShoppingBag size={32} className="text-white/20" />
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">Your cart is empty</p>
                <p className="text-white/30 text-xs">Add some gear to get started</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-primary text-sm px-5 py-2.5"
              >
                Shop Now
              </button>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.key}
                className="flex gap-4 p-4 rounded-sm border border-white/5 bg-white/[0.03] hover:border-white/10 transition-colors"
              >
                {/* Image */}
                <div className="w-20 h-20 rounded-sm overflow-hidden flex-shrink-0 bg-card-bg">
                  <img
                    src={item.images?.[0] || item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{item.name}</p>
                  <div className="flex gap-2 mt-1">
                    {item.selectedSize && (
                      <span className="text-xs text-white/40">Size: {item.selectedSize}</span>
                    )}
                  </div>
                  <p className="text-neon font-semibold mt-1">${item.price}</p>

                  {/* Quantity */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.key, -1)}
                      className="w-7 h-7 border border-white/10 rounded-sm flex items-center justify-center text-white/60 hover:border-neon hover:text-neon transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-white font-medium w-6 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.key, 1)}
                      className="w-7 h-7 border border-white/10 rounded-sm flex items-center justify-center text-white/60 hover:border-neon hover:text-neon transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                    <span className="text-white/30 text-xs ml-auto">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.key)}
                  className="self-start p-1.5 text-white/20 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-white/5 space-y-4">
            {/* Free shipping progress */}
            <div>
              <div className="flex justify-between text-xs text-white/40 mb-2">
                <span>Free shipping on orders over $300</span>
                <span>${Math.max(0, 300 - cartTotal).toFixed(0)} away</span>
              </div>
              <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neon rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (cartTotal / 300) * 100)}%` }}
                />
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm tracking-wider uppercase">Total</span>
              <span className="text-white text-2xl font-bold">${cartTotal.toFixed(2)}</span>
            </div>

            {/* Payment Method */}
            <div className="flex flex-col gap-2 pt-2 pb-2">
              <label className="text-white/60 text-xs tracking-wider uppercase">Payment Method</label>
              <select 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-dark-bg border border-white/10 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-neon/50 transition-colors"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Apple Pay">Apple Pay</option>
              </select>
            </div>

            {/* Checkout */}
            <button
              className="w-full bg-neon text-black font-bold py-4 rounded-sm text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-neon-dim transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] neon-glow"
              onClick={handleCheckout}
            >
              Checkout
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-white/30 text-xs tracking-wider hover:text-white/60 transition-colors py-1"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
