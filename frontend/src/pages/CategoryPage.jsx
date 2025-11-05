import React from "react";
import { useParams } from "react-router-dom";
import useStories from "../hooks/useStories";
import StoryGrid from "../components/StoryGrid";

export default function CategoryPage() {
  const { category } = useParams();
  const { stories, loading, error } = useStories(category);

  if (loading) return <div className="p-6 min-h-screen bg-black text-white">Loading...</div>;
  if (error) return <div className="p-6 min-h-screen bg-black text-white">Error: {error}</div>;

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h1>

      <StoryGrid items={stories} type="story" />
    </div>
  );
}
