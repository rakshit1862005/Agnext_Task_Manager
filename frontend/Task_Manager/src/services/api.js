const API_BASE = import.meta.env.VITE_BASE_URL;

export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
};
