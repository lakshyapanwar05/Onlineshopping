import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HorizontalScroll({ title, children }) {
  const ref = useRef(null);

  const scroll = (dir) => {
    if (ref.current) {
      ref.current.scrollBy({ left: dir * 380, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-6 md:px-0">
        <h2 className="font-display text-3xl md:text-4xl tracking-widest uppercase text-white">
          {title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="w-10 h-10 border border-white/10 rounded-sm flex items-center justify-center text-white/40 hover:border-neon hover:text-neon transition-all duration-200"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-10 h-10 border border-white/10 rounded-sm flex items-center justify-center text-white/40 hover:border-neon hover:text-neon transition-all duration-200"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Scrollable Row */}
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {children}
      </div>
    </div>
  );
}
