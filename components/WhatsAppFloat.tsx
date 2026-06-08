"use client";

import { useState } from "react";

const WA_HREF =
  "https://wa.me/2349055427487?text=" +
  encodeURIComponent("Hi! I have a question about a product.");

export default function WhatsAppFloat() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip label */}
      <span
        aria-hidden
        className={`bg-bg border border-border text-text text-xs font-semibold
          px-3 py-1.5 rounded-full shadow-card whitespace-nowrap
          transition-all duration-200
          ${hovered
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-2 pointer-events-none"
          }`}
      >
        Quick Support
      </span>

      {/* Button */}
      <a
        href={WA_HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp for quick support"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative w-14 h-14 rounded-full
          bg-[#25D366] hover:bg-[#1da851]
          flex items-center justify-center
          shadow-[0_4px_20px_rgba(37,211,102,0.45)]
          hover:shadow-[0_4px_28px_rgba(37,211,102,0.65)]
          hover:scale-110 transition-all duration-200"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none" />

        {/* WhatsApp icon */}
        <svg
          viewBox="0 0 24 24"
          fill="white"
          className="w-7 h-7 relative z-10"
          aria-hidden
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.109.549 4.09 1.508 5.814L.057 23.25l5.575-1.462A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 01-5.031-1.371l-.361-.214-3.31.869.882-3.23-.235-.373A9.872 9.872 0 012.1 12c0-5.457 4.444-9.9 9.9-9.9 5.457 0 9.9 4.443 9.9 9.9 0 5.458-4.443 9.9-9.9 9.9z" />
        </svg>
      </a>
    </div>
  );
}
