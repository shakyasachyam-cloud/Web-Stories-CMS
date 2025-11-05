import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchStories } from "../api/storyAPI";

export default function CategoryPage() {
  const { category } = useParams();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories(category).then(setStories).finally(() => setLoading(false));
  }, [category]);

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <Link
            key={story._id}
            to={`/story/${story._id}`}
            className="
              group relative rounded-xl overflow-hidden p-[2px]
              bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
              hover:animate-gradient-move transition-all duration-500
            "
          >
            <div className="bg-[#0b0b0b] rounded-xl h-48 flex items-center justify-center
                            group-hover:bg-black/70 transition duration-300">
              {story.preview ? (
                story.preview.endsWith(".mp4") || story.preview.includes(".MOV") ? (
                  <video
                    src={story.preview}
                    className="w-full h-full object-cover rounded-xl opacity-90
                               group-hover:scale-110 transition-transform duration-500"
                    muted
                    autoPlay
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={story.preview}
                    alt={story.title}
                    className="w-full h-full object-cover rounded-xl opacity-90
                               group-hover:scale-110 transition-transform duration-500"
                  />
                )
              ) : (
                <span className="text-white font-bold text-2xl px-4 text-center">
                  {story.title}
                </span>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-semibold text-lg">{story.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
