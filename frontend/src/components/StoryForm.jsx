import React, { useEffect, useState } from "react";
import { createStory, updateStory } from "../api/storyAPI";

export default function StoryForm({ editing, onSaved }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState([]);
  const [existingSlides, setExistingSlides] = useState([]);

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || "");
      setCategory(editing.category || "");

      // ✅ SAFE: slides may be undefined → fallback to []
      setExistingSlides(editing.slides || []);

      setFiles([]);
    } else {
      setTitle("");
      setCategory("");
      setFiles([]);
      setExistingSlides([]);
    }
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", title);
    fd.append("category", category);

    // New files
    files.forEach((file) => fd.append("files", file));

    // ✅ Always safe JSON
    fd.append("existingSlides", JSON.stringify(existingSlides || []));

    // No animations for now
    fd.append("slidesMeta", JSON.stringify([]));

    if (editing) await updateStory(editing._id, fd);
    else await createStory(fd);

    onSaved();
  };

  return (
    <form className="bg-white p-5 shadow rounded" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-3">
        {editing ? "✏️ Edit Story" : "➕ Add New Story"}
      </h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Story Title"
        value={title}
        required
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Category"
        value={category}
        required
        onChange={(e) => setCategory(e.target.value)}
      />

      <label className="font-bold">Add New Slides:</label>
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        className="mb-4"
        onChange={(e) => {
          const newFiles = Array.from(e.target.files);
          setFiles((prev) => [...prev, ...newFiles]); // ✅ append
        }}
      />

      {/* ✅ Preview NEW uploads */}
      {files.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {files.map((file, i) => (
            <div
              key={i}
              className="relative w-24 h-24 border rounded overflow-hidden"
            >
              {file.type.startsWith("video") ? (
                <video
                  src={URL.createObjectURL(file)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={URL.createObjectURL(file)}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Remove slide button */}
              <button
                type="button"
                onClick={() =>
                  setFiles((prev) => prev.filter((_, index) => index !== i))
                }
                className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1.5 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Existing slides (only in edit mode, safe check) */}
      {editing && (existingSlides?.length || 0) > 0 && (
        <>
          <h4 className="mt-4 font-bold">Existing Slides:</h4>
          <div className="flex gap-2 flex-wrap">
            {existingSlides.map((s, i) => (
              <div key={i} className="w-24 h-24 relative border">
                {s.type === "video" ? (
                  <video src={s.url} className="w-full h-full object-cover" />
                ) : (
                  <img src={s.url} className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <button className="px-4 py-2 bg-green-600 text-white rounded mt-5">
        {editing ? "Update" : "Create"}
      </button>
    </form>
  );
}
