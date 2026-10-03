import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Clock, MapPin, Play } from "lucide-react";
import type { BNode } from "./types";

// 1. Video Widget
export function VideoWidget({ node }: { node: BNode }) {
  let embedUrl = node.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ";
  if (embedUrl.includes("watch?v=")) {
    embedUrl = embedUrl.replace("watch?v=", "embed/");
  }

  return (
    <div className="w-full h-full min-h-[320px] bg-black rounded-xl overflow-hidden relative shadow-lg">
      <iframe
        src={embedUrl}
        title="Video player"
        className="w-full h-full min-h-[320px] border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

// 2. Carousel / Image Slider Widget
export function CarouselWidget({ node }: { node: BNode }) {
  const images = node.carouselImages && node.carouselImages.length > 0
    ? node.carouselImages
    : [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200",
        "https://images.unsplash.com/photo-1517976487507-5b3b4a45a74c?w=1200",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
      ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-full min-h-[340px] rounded-2xl overflow-hidden group select-none shadow-xl bg-stone-900">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="w-full h-full min-h-[340px] object-cover transition-opacity duration-300"
      />

      {/* Left / Right Controls */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition opacity-80 group-hover:opacity-100"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        type="button"
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition opacity-80 group-hover:opacity-100"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? "w-5 bg-orange-500" : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// 3. Countdown Timer Widget
export function CountdownWidget({ node }: { node: BNode }) {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const target = node.targetDate ? new Date(node.targetDate).getTime() : Date.now() + 7 * 86400000;

    const updateTimer = () => {
      const diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [node.targetDate]);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center gap-2 mb-3 text-xs font-bold text-orange-400 uppercase tracking-widest">
        <Clock size={14} />
        <span>Limited Time Special Offer</span>
      </div>
      <div className="flex items-center justify-center gap-3">
        <div className="flex flex-col items-center bg-black/40 border border-white/10 px-3.5 py-2 rounded-xl min-w-[62px]">
          <span className="text-2xl font-bold font-mono text-white leading-none">{timeLeft.days}</span>
          <span className="text-[10px] uppercase text-stone-400 font-semibold mt-1">Days</span>
        </div>
        <span className="text-xl font-bold text-stone-500">:</span>
        <div className="flex flex-col items-center bg-black/40 border border-white/10 px-3.5 py-2 rounded-xl min-w-[62px]">
          <span className="text-2xl font-bold font-mono text-white leading-none">{timeLeft.hours}</span>
          <span className="text-[10px] uppercase text-stone-400 font-semibold mt-1">Hours</span>
        </div>
        <span className="text-xl font-bold text-stone-500">:</span>
        <div className="flex flex-col items-center bg-black/40 border border-white/10 px-3.5 py-2 rounded-xl min-w-[62px]">
          <span className="text-2xl font-bold font-mono text-white leading-none">{timeLeft.minutes}</span>
          <span className="text-[10px] uppercase text-stone-400 font-semibold mt-1">Mins</span>
        </div>
        <span className="text-xl font-bold text-stone-500">:</span>
        <div className="flex flex-col items-center bg-orange-600/30 border border-orange-500/40 px-3.5 py-2 rounded-xl min-w-[62px]">
          <span className="text-2xl font-bold font-mono text-orange-400 leading-none">{timeLeft.seconds}</span>
          <span className="text-[10px] uppercase text-orange-300 font-semibold mt-1">Secs</span>
        </div>
      </div>
    </div>
  );
}

// 4. Social Proof & Star Testimonial Widget
export function StarsWidget({ node }: { node: BNode }) {
  const rating = node.rating || 5;

  return (
    <div className="flex flex-col items-center text-center p-6 bg-white/5 border border-white/10 rounded-2xl max-w-lg mx-auto">
      {/* 5 Stars */}
      <div className="flex items-center gap-1 text-amber-400 mb-3">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={18}
            className={i < rating ? "fill-amber-400 text-amber-400" : "text-stone-600"}
          />
        ))}
        <span className="text-xs font-bold text-stone-300 ml-1.5 font-mono">{rating}.0 / 5.0</span>
      </div>

      {/* Quote */}
      <p className="text-sm font-medium italic text-stone-200 leading-relaxed mb-4">
        {node.text || "“Canvas transformed our landing page workflow! It saved us over 40 hours of development time and looks stunning.”"}
      </p>

      {/* Author & Avatar */}
      <div className="flex items-center gap-3">
        <img
          src={node.src || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/40"
        />
        <div className="text-left">
          <div className="text-xs font-bold text-stone-100">
            {node.author || "Sarah Jenkins"}
          </div>
          <div className="text-[11px] text-stone-400">Verified Client Review</div>
        </div>
      </div>
    </div>
  );
}

// 5. Interactive Google Map Widget
export function MapWidget({ node }: { node: BNode }) {
  const query = node.mapQuery || "San Francisco, CA";
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden relative shadow-lg bg-stone-900 border border-stone-800">
      <iframe
        src={embedUrl}
        title={`Map of ${query}`}
        className="w-full h-full min-h-[300px] border-0"
        loading="lazy"
      />
      <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-sm text-stone-200 px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 font-medium">
        <MapPin size={13} className="text-orange-400" />
        <span>{query}</span>
      </div>
    </div>
  );
}
