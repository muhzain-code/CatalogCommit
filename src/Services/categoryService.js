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

export const categoryService = {
  // Get all categories
  getCategories: async (page = 1, perPage = 100, search = "", filters = {}) => {
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

    // return apiCall(`/categories?${params}`)
    const url = `/categories?${params.toString()}`;

    // 🔍 Cek apakah sudah ada di sessionStorage
    const cacheKey = `categories:${url}`;
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

  clearCategoriesCache: () => {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("categories:")) {
        sessionStorage.removeItem(key);
      }
    });
  },

  // Get single category
  getCategory: async (id) => {
    return apiCall(`/categories/${id}`);
  },

  createCategories: async (umkmData) => {
    const form = new FormData();

    for (const [key, value] of Object.entries(umkmData)) {
      // Tangani file khusus
      if (key === "photo" && value instanceof File) {
        form.append("photo", value);
      } else {
        form.append(key, value);
      }
    }

    return apiCall("/categories", {
      method: "POST",
      body: form,
      headers: {
        // Jangan set Content-Type agar otomatis pakai multipart/form-data
      },
    });
  },

  updateCategories: async (id, umkmData) => {
    console.log("kategori data api", umkmData);

    const form = new FormData();
    form.append("_method", "PUT");

    for (const [key, value] of Object.entries(umkmData)) {
      // Tangani file khusus
      if (key === "photo" && value instanceof File) {
        form.append("photo", value);
      } else {
        form.append(key, value);
      }
    }

    return apiCall(`/categories/${id}`, {
      method: "POST",
      body: form,
      headers: {
        // Jangan set Content-Type agar otomatis pakai multipart/form-data
      },
    });
  },

  deleteCategories: async (id) => {
    return apiCall(`/categories/${id}`, {
      method: "DELETE",
    });
  },
};
