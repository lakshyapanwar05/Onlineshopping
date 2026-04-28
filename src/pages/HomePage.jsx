import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import HorizontalScroll from '../components/HorizontalScroll';
import { getTrendingProducts, getBestSellers } from '../data/products';
import { categories } from '../data/categories';

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function AnimatedSection({ children, className = '' }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const trending = getTrendingProducts();
  const bestSellers = getBestSellers();

  return (
    <div className="bg-dark-bg min-h-screen">
      {/* ── HERO ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1800&q=90"
            alt="Hero background"
            className="w-full h-full object-cover scale-105"
            style={{ filter: 'brightness(0.35)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/60 to-transparent" />
        </div>

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6 animate-fadeUp" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <div className="w-8 h-0.5 bg-neon" />
              <span className="text-neon text-xs font-bold tracking-[0.3em] uppercase">
                New Season — SS 2026
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-display text-[clamp(4rem,12vw,9rem)] leading-none tracking-wider text-white uppercase animate-fadeUp"
              style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
            >
              Built For
              <br />
              <span className="text-gradient">The Extreme</span>
            </h1>

            {/* Sub */}
            <p
              className="mt-6 text-white/50 text-lg max-w-md leading-relaxed animate-fadeUp"
              style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
            >
              Technical gear engineered for those who don't stop. Designed for the mountains, made for every terrain.
            </p>

            {/* CTAs */}
            <div
              className="flex items-center gap-4 mt-10 animate-fadeUp"
              style={{ animationDelay: '0.55s', animationFillMode: 'both' }}
            >
              <Link
                to="/products"
                className="btn-primary flex items-center gap-2 text-sm tracking-widest uppercase"
              >
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link
                to="/products?category=Jackets"
                className="btn-secondary flex items-center gap-2 text-sm tracking-widest uppercase"
              >
                Explore Gear
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Scroll</span>
          <ChevronDown size={16} />
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-3 gap-4">
            {[
              { label: 'Products', value: '200+' },
              { label: 'Countries', value: '45' },
              { label: 'Satisfied Athletes', value: '50K+' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl text-neon tracking-wider">{stat.value}</p>
                <p className="text-white/30 text-xs tracking-widest uppercase mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <AnimatedSection>
          <HorizontalScroll title="Trending Now">
            {trending.map(p => (
              <div key={p.id} className="flex-shrink-0 w-64 md:w-72" style={{ scrollSnapAlign: 'start' }}>
                <ProductCard product={p} />
              </div>
            ))}
          </HorizontalScroll>
        </AnimatedSection>
      </section>

      {/* ── FULL-WIDTH BANNER ── */}
      <AnimatedSection>
        <section className="relative h-96 overflow-hidden my-4">
          <img
            src="https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=1800&q=80"
            alt="Banner"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.3)' }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <span className="text-neon text-xs font-bold tracking-[0.3em] uppercase mb-4">Limited Drop</span>
            <h2 className="font-display text-5xl md:text-7xl text-white uppercase tracking-widest">
              Summit Series
            </h2>
            <p className="text-white/40 mt-3 text-sm max-w-md">
              Our most technical collection yet. Zero compromises.
            </p>
            <Link
              to="/products"
              className="mt-8 btn-primary text-sm tracking-widest uppercase flex items-center gap-2"
            >
              View Collection <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </AnimatedSection>

      {/* ── BEST SELLERS ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <AnimatedSection>
          <HorizontalScroll title="Best Sellers">
            {bestSellers.map(p => (
              <div key={p.id} className="flex-shrink-0 w-64 md:w-72" style={{ scrollSnapAlign: 'start' }}>
                <ProductCard product={p} />
              </div>
            ))}
          </HorizontalScroll>
        </AnimatedSection>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-6 py-12 pb-32">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-3xl md:text-4xl tracking-widest uppercase text-white">
              Shop by Category
            </h2>
            <Link to="/products" className="text-neon text-sm tracking-widest uppercase hover:text-white transition-colors flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <AnimatedSection key={cat.id}>
              <Link
                to={`/products?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-sm aspect-video block"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ filter: 'brightness(0.45)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <span className="font-display text-2xl text-white tracking-widest uppercase group-hover:text-neon transition-colors duration-300">
                    {cat.name}
                  </span>
                  <span className="text-white/40 text-xs mt-1">{cat.count} items</span>
                </div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon group-hover:w-full transition-all duration-500" />
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ── FOOTER STRIP ── */}
      <div className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs tracking-widest">© 2026 THEOUTDOORS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Returns', 'Contact'].map(l => (
              <a key={l} href="#" className="text-white/20 text-xs tracking-widest hover:text-neon transition-colors uppercase">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
