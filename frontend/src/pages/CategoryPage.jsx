import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function CategoryPage() {
  const { category } = useParams(); // category name from route
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get(
          `https://web-stories-cms-player-mpph.vercel.app/api/stories?category=${category}`
        );
        setStories(res.data);
      } catch (err) {
        console.error("Error fetching stories:", err);
      }
    };
    fetchStories();
  }, [category]);

  return (
    <div className="category-page">
      <h2 className="category-title">{category.toUpperCase()}</h2>
      <div
        className="stories-grid"
        style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}
      >
        {stories.length === 0 ? (
          <p>No stories available in this category.</p>
        ) : (
          stories.map((story) => (
            <div
              key={story._id}
              className="story-card"
              style={{ width: "250px", textAlign: "center" }}
            >
              {story.preview.includes(".mp4") ||
              story.preview.includes(".MOV") ? (
                <video
                  src={story.preview}
                  controls
                  width="100%"
                  style={{ borderRadius: "8px" }}
                />
              ) : (
                <img
                  src={story.preview}
                  alt={story.title}
                  width="100%"
                  style={{ borderRadius: "8px" }}
                />
              )}
              <h3 style={{ marginTop: "10px", fontWeight: "bold" }}>
                {story.title}
              </h3>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
