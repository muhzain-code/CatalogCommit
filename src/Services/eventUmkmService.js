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

export const eventUmkmService = {
  // Get all categories
  getEventUmkm: async (page = 1, perPage = 100, search = "", filters = {}) => {
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
    const url = `/event-umkm?${params.toString()}`;

    // 🔍 Cek apakah sudah ada di sessionStorage
    const cacheKey = `event-umkm:${url}`;
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

  clearEventUmkmCache: () => {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("event-umkm:")) {
        sessionStorage.removeItem(key);
      }
    });
  },

  createEventUmkm: async (eventData) => {
    const form = new FormData();

    for (const [key, value] of Object.entries(eventData)) {
      form.append(key, value);
    }

    return apiCall("/event-umkm", {
      method: "POST",
      body: form,
      headers: {
        // Jangan set Content-Type agar otomatis pakai multipart/form-data
      },
    });
  },

  updateEventUmkm: async (id, eventData) => {
    console.log("umkm data api", eventData);

    const form = new FormData();
    form.append("_method", "PUT");

    for (const [key, value] of Object.entries(eventData)) {
      form.append(key, value);
    }

    return apiCall(`/event-umkm/${id}`, {
      method: "POST",
      body: form,
      headers: {
        // Jangan set Content-Type agar otomatis pakai multipart/form-data
      },
    });
  },

  deleteEventUmkm: async (id) => {
    return apiCall(`/event-umkm/${id}`, {
      method: "DELETE",
    });
  },
};

export const fetchAllEventUmkm = async (search = "", filters = {}) => {
  const perPage = 100;
  let currentPage = 1;
  let allData = [];
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const response = await eventUmkmService.getEventUmkm(
      currentPage,
      perPage,
      search,
      filters
    );

    const data = response?.data || [];
    const meta = response?.meta || {};

    allData.push(...data);

    totalPages = meta?.last_page || 1;
    currentPage++;
  }

  return allData;
};
