import React, { useEffect, useState, useRef } from "react";
import { fetchStory } from "../api/storyAPI";
import { useParams, useNavigate } from "react-router-dom";
import "../components/storyPlayer.css";

export default function StoryPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [index, setIndex] = useState(0);
  const progressRef = useRef(null);

  useEffect(() => {
    fetchStory(id).then((data) => {
      setStory(data);
    });
  }, [id]);

  // Auto-play logic  
  useEffect(() => {
    if (!story) return;

    const slide = story.slides[index];
    if (!slide) return;

    progressRef.current?.classList.remove("animate");
    void progressRef.current?.offsetWidth; // force reflow
    progressRef.current?.classList.add("animate");

    const timer = setTimeout(() => {
      nextSlide();
    }, slide.duration || 3000);

    return () => clearTimeout(timer);
  }, [story, index]);

  const nextSlide = () => {
    if (index < story.slides.length - 1) setIndex(index + 1);
    else navigate(-1); // exit story
  };

  const prevSlide = () => {
    if (index > 0) setIndex(index - 1);
  };

  const handleTap = (e) => {
    const x = e.clientX;
    const width = window.innerWidth;

    if (x < width * 0.33) prevSlide();
    else nextSlide();
  };

  if (!story) return <div>Loading...</div>;

  return (
    <div className="story-container" onClick={handleTap}>
      
      {/* PROGRESS BARS */}
      <div className="story-progress">
        {story.slides.map((_, i) => (
          <div key={i} className="bar">
            <div
              ref={i === index ? progressRef : null}
              className={`inner ${i < index ? "completed" : ""}`}
            ></div>
          </div>
        ))}
      </div>

      {/* CONTENT */}
      <div className="story-content">
        {story.slides[index].type === "video" ? (
          <video
            src={story.slides[index].url}
            autoPlay
            muted
            playsInline
            className="story-media"
          />
        ) : (
          <img
            src={story.slides[index].url}
            alt=""
            className={`story-media ${story.slides[index].animation}`}
          />
        )}
      </div>

      {/* TOP TITLE */}
      <div className="story-title">
        <h3>{story.title}</h3>
        <span className="close-btn" onClick={() => navigate(-1)}>✕</span>
      </div>

      {/* LEFT/RIGHT TAP ZONES */}
      <div className="tap-left" onClick={prevSlide}></div>
      <div className="tap-right" onClick={nextSlide}></div>
    </div>
  );
}
