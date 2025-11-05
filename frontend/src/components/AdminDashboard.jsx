import React, { useState, useEffect } from "react";
import { fetchStories, deleteStory } from "../api/storyAPI";
import StoryForm from "./StoryForm";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [stories, setStories] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile toggle

  const navigate = useNavigate();

  const loadStories = () => {
    fetchStories().then(setStories);
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleDelete = async () => {
    await deleteStory(confirmDelete);
    setConfirmDelete(null);
    loadStories();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const goToHomepage = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100 flex-col md:flex-row">
      {/* Sidebar for desktop */}
      <aside
        className={`bg-gray-900 text-white flex flex-col p-5 md:w-64 w-full md:flex md:flex-col md:h-full ${
          sidebarOpen ? "block" : "hidden md:block"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-6">CMS Dashboard</h2>

        <button
          onClick={() => {
            setEditing(null);
            setShowUpload(true);
            setSidebarOpen(false);
          }}
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 mb-4 w-full"
        >
          + Add Story
        </button>

        <button
          onClick={goToHomepage}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 mb-4 w-full"
        >
          Homepage
        </button>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 mt-auto w-full"
        >
          Logout
        </button>
      </aside>

      {/* Mobile Header */}
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center md:hidden">
        <h2 className="text-xl font-semibold">CMS Dashboard</h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="px-3 py-2 bg-gray-700 rounded"
        >
          ☰
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Stories</h1>

        {/* Story Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow rounded overflow-hidden min-w-[600px]">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Created</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stories.map((s) => (
                <tr key={s._id} className="border-b">
                  <td className="p-3">{s.title}</td>
                  <td className="p-3">{s.category}</td>
                  <td className="p-3">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-center flex gap-2 justify-center flex-wrap">
                    <button
                      onClick={() => {
                        setEditing(s);
                        setShowUpload(true);
                        setSidebarOpen(false);
                      }}
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDelete(s._id)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Upload / Edit Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl relative">
            <button
              onClick={() => setShowUpload(false)}
              className="absolute top-3 right-3 text-xl"
            >
              ✖
            </button>
            <StoryForm
              editing={editing}
              onSaved={() => {
                setShowUpload(false);
                loadStories();
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md text-center">
            <h2 className="text-xl font-bold mb-4">Confirm Delete?</h2>
            <p className="mb-6">This action cannot be undone.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
