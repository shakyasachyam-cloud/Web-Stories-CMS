import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await axios.get("`${process.env.REACT_APP_API_URL}/api/stories/api/stories");

    const grouped = {};

    res.data.forEach((story) => {
      if (!grouped[story.category]) {
        grouped[story.category] = [];
      }
      grouped[story.category].push(story);
    });

    // ✅ Convert to array with preview image
    const finalData = Object.keys(grouped).map((cat) => {
      const firstStory = grouped[cat][0];
      const preview = firstStory.preview;
      return {
        name: cat,
        preview,
      };
    });

    setCategories(finalData);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Discover Categories</h1>
      <div className="flex justify-end mb-4">
        <Link
          to="/admin"
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold text-white hover:opacity-90 transition"
        >
          Admin Panel
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((cat, index) => (
          <Link
            key={index}
            to={`/category/${cat.name}`}
            className="
            bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
            group relative rounded-xl overflow-hidden p-[2px]
            transition-all duration-500
            hover:animate-gradient-move
  "
          >
            {/* Inner black card */}
            <div
              className="
              group-hover:bg-black/70 transition duration-300
              bg-black rounded-xl h-40 flex items-center justify-center
              "
            >
              <span className="text-white font-bold text-2xl capitalize tracking-wide">
                {cat.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
