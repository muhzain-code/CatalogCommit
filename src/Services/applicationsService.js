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

export const applicationsService = {
  // Get all categories
  getApplications: async (page = 1, perPage = 100, search = "", filters = {}) => {
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

    // return apiCall(`/event-umkm?${params}`)
    const url = `/applications?${params.toString()}`;

    // 🔍 Cek apakah sudah ada di sessionStorage
    const cacheKey = `applications:${url}`;
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

  clearApplicationsCache: () => {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("applications:")) {
        sessionStorage.removeItem(key);
      }
    });
  },

  createApplications: async (eventData) => {
    const form = new FormData();

    for (const [key, value] of Object.entries(eventData)) {
      form.append(key, value);
    }

    return apiCall("/applications", {
      method: "POST",
      body: form,
      headers: {
        // Jangan set Content-Type agar otomatis pakai multipart/form-data
      },
    });
  },

  updateApplications: async (id, eventData) => {
    console.log("umkm data api", eventData);

    const form = new FormData();
    form.append("_method", "PUT");

    for (const [key, value] of Object.entries(eventData)) {
      form.append(key, value);
    }

    return apiCall(`/applications/${id}`, {
      method: "POST",
      body: form,
      headers: {
        // Jangan set Content-Type agar otomatis pakai multipart/form-data
      },
    });
  },

  deleteApplications: async (id) => {
    return apiCall(`/applications/${id}`, {
      method: "DELETE",
    });
  },
};
