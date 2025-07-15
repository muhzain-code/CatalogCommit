import { API_BASE_URL } from "../config";
import { apiErrorHandler, handleApiResponse } from "./apiErrorHandler";

// Generic API call function with centralized error handling
const apiCall = async (endpoint, options = {}) => {
  try {
    const authToken = localStorage.getItem("authToken");
    const headers = {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    return await handleApiResponse(response);
  } catch (error) {
    const errorResult = await apiErrorHandler.handleError(error);
    throw errorResult;
  }
};

export const eventService = {
  // Get all categories
  getEvents: async (page = 1, perPage = 100, search = "", filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    // Add search parameter if provided
    if (search && search.trim()) {
      params.append("search", search.trim());
    }

    // Add filter parameters if provided
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim()) {
        params.append(key, value.trim());
      }
    });

    // return apiCall(`/events?${params}`)
    const url = `/events?${params.toString()}`;

    // 🔍 Cek apakah sudah ada di sessionStorage
    const cacheKey = `events:${url}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      // console.log("✅ From sessionStorage:", url);
      return JSON.parse(cached);
    }

    // 🛰️ Belum ada, ambil dari API
    const response = await apiCall(url);

    // 💾 Simpan ke sessionStorage
    sessionStorage.setItem(cacheKey, JSON.stringify(response));

    return response;
  },

  clearEventsCache: () => {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("events:")) {
        sessionStorage.removeItem(key);
      }
    });
  },

  createEvents: async (eventData) => {
    const form = new FormData();

    for (const [key, value] of Object.entries(eventData)) {
      // Tangani file khusus
      if (key === "photo" && value instanceof File) {
        form.append("photo", value);
      } else {
        form.append(key, value);
      }
    }

    return apiCall("/events", {
      method: "POST",
      body: form,
      headers: {
        // Jangan set Content-Type agar otomatis pakai multipart/form-data
      },
    });
  },

  updateEvents: async (id, eventData) => {
    console.log("umkm data api", eventData);

    const form = new FormData();
    form.append("_method", "PUT");

    for (const [key, value] of Object.entries(eventData)) {
      // Tangani file khusus
      if (key === "photo" && value instanceof File) {
        form.append("photo", value);
      } else {
        form.append(key, value);
      }
    }

    return apiCall(`/events/${id}`, {
      method: "POST",
      body: form,
      headers: {
        // Jangan set Content-Type agar otomatis pakai multipart/form-data
      },
    });
  },

  deleteEvents: async (id) => {
    return apiCall(`/events/${id}`, {
      method: "DELETE",
    });
  },
};
