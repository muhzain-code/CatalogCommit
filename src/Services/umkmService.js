import { apiErrorHandler, handleApiResponse } from "./apiErrorHandler";

const API_BASE_URL = "http://localhost:8000/api";

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

export const umkmService = {
  // Get all UMKM
  getUMKMs: async (page = 1, perPage = 100, search = "", filters = {}) => {
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

    return apiCall(`/umkms?${params}`);
  },

  // Get single UMKM
  getUMKM: async (id) => {
    return apiCall(`/umkms/${id}`);
  },

  createUmkm: async (umkmData) => {
    const form = new FormData();

    for (const [key, value] of Object.entries(umkmData)) {
      // Tangani file khusus
      if (key === "photo_profile" && value instanceof File) {
        form.append("photo_profile", value);
      } else {
        form.append(key, value);
      }
    }

    return apiCall("/umkms", {
      method: "POST",
      body: form,
      headers: {
        // Jangan set Content-Type agar otomatis pakai multipart/form-data
      },
    });
  },

  updateUmkm: async (id, umkmData) => {
    console.log("umkm data api", umkmData);
    
    const form = new FormData();
    form.append("_method", "PUT")

    for (const [key, value] of Object.entries(umkmData)) {
      // Tangani file khusus
      if (key === "photo_profile" && value instanceof File) {
        form.append("photo_profile", value);
      } else {
        form.append(key, value);
      }
    }

    return apiCall(`/umkms/${id}`, {
      method: "POST",
      body: form,
      headers: {
        // Jangan set Content-Type agar otomatis pakai multipart/form-data
      },
    });
  },

  deleteUmkm: async (id) => {
    return apiCall(`/umkms/${id}`, {
      method: "DELETE",
    });
  },
};
