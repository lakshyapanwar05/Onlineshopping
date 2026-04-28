import { useState, useCallback } from 'react';
import { Sliders, ChevronDown, ChevronUp, X } from 'lucide-react';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = [
  { label: 'Black', value: '#1a1a1a' },
  { label: 'Forest', value: '#2d4a3e' },
  { label: 'Earth', value: '#4a3728' },
  { label: 'Navy', value: '#1e3a5f' },
  { label: 'Neon', value: '#C6FF00' },
  { label: 'White', value: '#f5f5f0' },
];

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/5 py-5">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-xs font-bold tracking-widest uppercase text-white/60">{title}</span>
        {open ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default function FilterSidebar({ filters, onChange, categories }) {
  const toggleCategory = (cat) => {
    const next = filters.category === cat ? '' : cat;
    onChange({ ...filters, category: next });
  };

  const toggleSize = (size) => {
    const sizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    onChange({ ...filters, sizes });
  };

  const toggleColor = (color) => {
    const colors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    onChange({ ...filters, colors });
  };

  const hasFilters = filters.category || filters.sizes.length || filters.colors.length
    || filters.priceMin > 0 || filters.priceMax < 500;

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-neon" />
          <span className="text-sm font-bold tracking-widest uppercase text-white">Filters</span>
        </div>
        {hasFilters && (
          <button
            onClick={() => onChange({ category: '', sizes: [], colors: [], priceMin: 0, priceMax: 500 })}
            className="text-xs text-neon hover:text-white transition-colors flex items-center gap-1"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* Category */}
      <Section title="Category">
        <div className="space-y-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`flex items-center justify-between w-full text-sm py-1.5 px-3 rounded-sm transition-all duration-200 ${
                filters.category === cat
                  ? 'bg-neon/10 text-neon border border-neon/30'
                  : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{cat}</span>
              {filters.category === cat && <X size={12} />}
            </button>
          ))}
        </div>
      </Section>

      {/* Price Range */}
      <Section title="Price Range">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-white font-medium">${filters.priceMin}</span>
            <span className="text-white font-medium">${filters.priceMax}</span>
          </div>
          <div className="relative h-1 bg-white/10 rounded-full">
            <div
              className="absolute h-full bg-neon rounded-full"
              style={{
                left: `${(filters.priceMin / 500) * 100}%`,
                right: `${100 - (filters.priceMax / 500) * 100}%`,
              }}
            />
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Min Price</label>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={filters.priceMin}
                onChange={e => onChange({ ...filters, priceMin: Math.min(Number(e.target.value), filters.priceMax - 10) })}
                className="w-full accent-[#C6FF00] cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Max Price</label>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={filters.priceMax}
                onChange={e => onChange({ ...filters, priceMax: Math.max(Number(e.target.value), filters.priceMin + 10) })}
                className="w-full accent-[#C6FF00] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Size */}
      <Section title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map(size => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`w-12 h-10 text-xs font-bold border rounded-sm transition-all duration-200 ${
                filters.sizes.includes(size)
                  ? 'border-neon bg-neon/10 text-neon'
                  : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </Section>

      {/* Color */}
      <Section title="Color">
        <div className="flex flex-wrap gap-3">
          {COLORS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => toggleColor(value)}
              title={label}
              className={`w-8 h-8 rounded-full transition-all duration-200 ${
                filters.colors.includes(value)
                  ? 'ring-2 ring-neon ring-offset-2 ring-offset-dark-bg scale-110'
                  : 'ring-1 ring-white/10 hover:ring-white/30 hover:scale-110'
              }`}
              style={{ backgroundColor: value }}
            />
          ))}
        </div>
      </Section>
    </aside>
  );
}
