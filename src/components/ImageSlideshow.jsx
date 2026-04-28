import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageSlideshow({ images, name }) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrent(i => (i + 1) % images.length);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-[4/5] bg-card-bg rounded-sm overflow-hidden group">
        <img
          key={current}
          src={images[current]}
          alt={`${name} - view ${current + 1}`}
          className="w-full h-full object-cover animate-fadeIn"
        />

        {/* Nav Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:border-neon hover:text-neon"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:border-neon hover:text-neon"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-1.5 bg-neon' : 'w-1.5 h-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`flex-1 aspect-square rounded-sm overflow-hidden border-2 transition-all duration-200 ${
                i === current
                  ? 'border-neon opacity-100'
                  : 'border-white/10 opacity-50 hover:opacity-80 hover:border-white/30'
              }`}
            >
              <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
