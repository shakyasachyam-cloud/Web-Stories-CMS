import { useState, useEffect } from "react";
import { fetchStories } from "../api/storyAPI";

export default function useStories(category = null) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStories = async () => {
      try {
        setLoading(true);
        const data = await fetchStories(category);
        setStories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, [category]);

  // Group stories by category
  const getStoriesByCategory = () => {
    const grouped = {};
    stories.forEach((story) => {
      if (!grouped[story.category]) {
        grouped[story.category] = [];
      }
      grouped[story.category].push(story);
    });

    return Object.keys(grouped).map((cat) => ({
      name: cat,
      preview: grouped[cat][0]?.preview,
      stories: grouped[cat]
    }));
  };

  return {
    stories,
    loading,
    error,
    getStoriesByCategory
  };
}