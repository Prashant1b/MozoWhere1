import React from "react";
import { Heart, Star } from "lucide-react";

export default function ImageCarousel({
  images,
  title,
  tag,
  rating,
  ratingCount,
  activeImg,
  setActiveImg,
}) {
  return (
    <div className="relative">
      {tag && (
        <div className="absolute left-3 top-3 z-10">
          <span className="inline-flex items-center rounded-md bg-white px-3 py-1 text-xs font-extrabold text-gray-900 shadow">
            {tag}
          </span>
        </div>
      )}

      <div className="bg-gray-50">
        <img
          src={images[activeImg]}
          alt={title}
          className="w-full aspect-[3/4] object-cover"
          loading="lazy"
        />
      </div>

      <div className="absolute left-3 bottom-3 flex items-center gap-2">
        <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-extrabold text-gray-900">
            {Number(rating).toFixed(1)}
          </span>
          <span className="text-sm text-gray-600">{ratingCount}</span>
        </div>
      </div>

      <button className="absolute right-3 bottom-3 h-11 w-11 rounded-full bg-white shadow grid place-items-center">
        <Heart className="h-5 w-5 text-gray-600" />
      </button>

      <div className="py-3 flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveImg(i)}
            className={[
              "h-2 w-2 rounded-full transition",
              i === activeImg ? "bg-gray-900" : "bg-gray-300",
            ].join(" ")}
            aria-label={`Image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
