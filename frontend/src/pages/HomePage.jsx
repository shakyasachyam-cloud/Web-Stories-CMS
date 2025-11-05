import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        "https://web-stories-cms-player-mpph.vercel.app/api/stories"
      );

      const grouped = {};

      res.data.forEach((story) => {
        if (!grouped[story.category]) {
          grouped[story.category] = [];
        }
        grouped[story.category].push(story);
      });

      const finalData = Object.keys(grouped).map((cat) => {
        const firstStory = grouped[cat][0];
        return {
          name: cat,
          preview: firstStory.preview || null,
        };
      });

      setCategories(finalData);
    } catch (err) {
      console.error("Error fetching categories:", err.message);
      setError("Failed to load categories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-white">Loading categories...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

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
            className="group relative rounded-xl overflow-hidden p-[2px] transition-all duration-500 hover:animate-gradient-move bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
          >
            <div
              className="group-hover:bg-black/70 transition duration-300 bg-black rounded-xl h-40 flex items-center justify-center"
              style={{
                backgroundImage: cat.preview ? `url(${cat.preview})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!cat.preview && (
                <span className="text-white font-bold text-2xl capitalize tracking-wide">
                  {cat.name}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
