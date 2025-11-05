const API_BASE = import.meta.env.VITE_API_URL;

export async function fetchStories(category = null) {
  const url = category
    ? `${API_BASE}/stories?category=${category}`
    : `${API_BASE}/stories`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchStory(id) {
  const res = await fetch(`${API_BASE}/stories/${id}`);
  return res.json();
}

export async function createStory(formData) {
  const res = await fetch(`${API_BASE}/stories`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function updateStory(id, formData) {
  const res = await fetch(`${API_BASE}/stories/${id}`, {
    method: "PUT",
    body: formData,
  });
  return res.json();
}

export async function deleteStory(id) {
  const res = await fetch(`${API_BASE}/stories/${id}`, {
    method: "DELETE",
  });
  return res.json();
}
