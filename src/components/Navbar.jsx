import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Zap, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cartCount, setIsOpen } = useCart();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'Shop', to: '/products' },
    { label: 'Jackets', to: '/products?category=Jackets' },
    { label: 'Footwear', to: '/products?category=Footwear' },
    { label: 'Gear', to: '/products?category=Bags' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-dark-bg/95 backdrop-blur-xl border-b border-white/5 shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-neon rounded-sm flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
              <Zap size={18} className="text-black" fill="black" />
            </div>
            <span className="font-display text-2xl tracking-widest text-white uppercase">
              The<span className="text-neon">Outdoors</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium tracking-widest uppercase text-white/60 hover:text-neon transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link
              to={user ? "/profile" : "/login"}
              className="hidden md:flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 tracking-wider uppercase"
            >
              {user ? <User size={16} /> : null}
              {user ? "Profile" : "Account"}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-white/80 hover:text-neon transition-colors duration-200 group"
              aria-label="Open cart"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon text-black text-xs font-bold rounded-full flex items-center justify-center animate-scaleIn">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="md:hidden p-2 text-white/80 hover:text-neon transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute top-16 left-0 right-0 bg-dark-surface border-t border-white/5 p-6 transition-all duration-300 ${
            menuOpen ? 'translate-y-0' : '-translate-y-4'
          }`}
        >
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="block py-4 text-lg font-display tracking-widest uppercase text-white/70 hover:text-neon border-b border-white/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to={user ? "/profile" : "/login"}
            className="block py-4 text-lg font-display tracking-widest uppercase text-white/70 hover:text-neon transition-colors"
          >
            {user ? "Profile" : "Account"}
          </Link>
        </div>
      </div>
    </>
  );
}
