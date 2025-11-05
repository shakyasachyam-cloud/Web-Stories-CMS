import React, { useEffect, useState, useRef } from "react";

export default function Player({ story, onClose }) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  const slide = story.slides[index];

  useEffect(() => {
    autoPlay();
    return () => clearInterval(timerRef.current);
  }, [index]);

  const autoPlay = () => {
    const duration = slide.type === "image" ? slide.duration || 4000 : 0;

    if (slide.type === "video") return;

    let start = Date.now();
    timerRef.current = setInterval(() => {
      const percent = ((Date.now() - start) / duration) * 100;
      setProgress(percent);

      if (percent >= 100) {
        nextSlide();
      }
    }, 80);
  };

  const nextSlide = () => {
    if (index < story.slides.length - 1) setIndex(index + 1);
    else onClose();
  };

  const prevSlide = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <div className="fixed inset-0 bg-black text-white flex items-center justify-center z-50">
      <div className="absolute top-4 left-4 text-xl" onClick={onClose}>✖ Close</div>

      <div
        className="w-full h-full relative"
        onClick={(e) => {
          if (e.clientX < window.innerWidth / 2) prevSlide();
          else nextSlide();
        }}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full flex gap-1 p-2">
          {story.slides.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i === index ? "bg-white" : "bg-gray-500"}`}
              style={i === index ? { width: `${progress}%` } : {}}
            ></div>
          ))}
        </div>

        {/* Slide */}
        {slide.type === "image" ? (
          <img src={slide.url} className="w-full h-full object-contain" />
        ) : (
          <video
            src={slide.url}
            autoPlay
            className="w-full h-full object-contain"
            onEnded={nextSlide}
          />
        )}
      </div>
    </div>
  );
}
