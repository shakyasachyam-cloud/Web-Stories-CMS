import React from "react";
import { Link } from "react-router-dom";

export default function StoryGrid({ items, type = "story" }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <Link
          key={type === "story" ? item._id : index}
          to={type === "story" ? `/story/${item._id}` : `/category/${item.name}`}
          className="
            group relative rounded-xl overflow-hidden p-[2px]
            bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
            hover:animate-gradient-move transition-all duration-500
          "
        >
          <div className="bg-[#0b0b0b] rounded-xl h-48 flex items-center justify-center
                          group-hover:bg-black/70 transition duration-300">
            {item.preview ? (
              item.preview.endsWith(".mp4") ? (
                <video
                  src={item.preview}
                  className="w-full h-full object-cover rounded-xl opacity-90
                             group-hover:scale-110 transition-transform duration-500"
                  muted
                />
              ) : (
                <img
                  src={item.preview}
                  className="w-full h-full object-cover rounded-xl opacity-90
                             group-hover:scale-110 transition-transform duration-500"
                  alt={type === "story" ? item.title : item.name}
                />
              )
            ) : (
              <span className="text-white font-bold text-2xl px-4 text-center capitalize">
                {type === "story" ? item.title : item.name}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}