import React from "react";
import { Link } from "react-router-dom";
import useStories from "../hooks/useStories";
import StoryGrid from "../components/StoryGrid";

export default function HomePage() {
  const { loading, error, getStoriesByCategory } = useStories();
  const categories = getStoriesByCategory();

  if (loading) return <div className="min-h-screen bg-black text-white p-6">Loading...</div>;
  if (error) return <div className="min-h-screen bg-black text-white p-6">Error: {error}</div>;

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

      <StoryGrid items={categories} type="category" />
    </div>
  );
}
