import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { products } from '../data/products';

const SORT_OPTIONS = [
  { label: 'New Arrivals', value: 'new' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Best Sellers', value: 'bestseller' },
  { label: 'Top Rated', value: 'rating' },
];

const ALL_CATEGORIES = [...new Set(products.map(p => p.category))];

export default function ProductListingPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [filters, setFilters] = useState({
    category: initialCategory,
    sizes: [],
    colors: [],
    priceMin: 0,
    priceMax: 500,
  });
  const [sort, setSort] = useState('new');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (filters.category) list = list.filter(p => p.category === filters.category);
    list = list.filter(p => p.price >= filters.priceMin && p.price <= filters.priceMax);
    if (filters.sizes.length) list = list.filter(p => filters.sizes.some(s => p.sizes.includes(s)));
    if (filters.colors.length) list = list.filter(p => filters.colors.some(c => p.colors.includes(c)));

    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'bestseller') list = list.filter(p => p.badge === 'BEST SELLER').concat(list.filter(p => p.badge !== 'BEST SELLER'));

    return list;
  }, [filters, sort, search]);

  return (
    <div className="bg-dark-bg min-h-screen">
      {/* Page Header */}
      <div className="relative pt-28 pb-12 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <span className="text-neon text-xs font-bold tracking-[0.3em] uppercase mb-3 block">All Products</span>
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-widest uppercase">
            The Collection
          </h1>
          <p className="text-white/30 mt-3 text-sm max-w-md">
            Technical gear for every terrain. Built to perform, designed to last.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search gear..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-sm pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-neon/50 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Result count */}
            <span className="text-white/30 text-sm hidden md:block">
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            </span>

            {/* Sort */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon/50 transition-colors cursor-pointer"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value} className="bg-dark-surface">{o.label}</option>
              ))}
            </select>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setSidebarOpen(v => !v)}
              className="lg:hidden flex items-center gap-2 text-sm text-white/60 hover:text-neon border border-white/10 px-3 py-2.5 rounded-sm transition-colors"
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Sidebar ─ desktop */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <FilterSidebar filters={filters} onChange={setFilters} categories={ALL_CATEGORIES} />
          </div>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
              <div className="absolute left-0 top-0 h-full w-72 bg-dark-surface p-6 overflow-y-auto border-r border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-bold text-white tracking-widest uppercase text-sm">Filters</span>
                  <button onClick={() => setSidebarOpen(false)} className="text-white/40 hover:text-white">
                    <X size={18} />
                  </button>
                </div>
                <FilterSidebar filters={filters} onChange={setFilters} categories={ALL_CATEGORIES} />
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Search size={24} className="text-white/20" />
                </div>
                <p className="text-white/40 font-medium">No products found</p>
                <p className="text-white/20 text-sm mt-1">Try adjusting your filters</p>
                <button
                  onClick={() => { setFilters({ category: '', sizes: [], colors: [], priceMin: 0, priceMax: 500 }); setSearch(''); }}
                  className="mt-6 btn-primary text-xs px-4 py-2"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((product, i) => (
                  <div
                    key={product.id}
                    className="animate-fadeUp"
                    style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
