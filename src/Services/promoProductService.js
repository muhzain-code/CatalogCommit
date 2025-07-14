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

export const promoProductService = {
  // Get all categories
  getPromoProduct: async (
    page = 1,
    perPage = 100,
    search = "",
    filters = {}
  ) => {
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

    // return apiCall(`/product-promos?${params}`);
    const url = `/product-promos?${params.toString()}`;

    // 🔍 Cek apakah sudah ada di sessionStorage
    const cacheKey = `product-promos:${url}`;
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

  clearPromoProductCache: () => {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("product-promos:")) {
        sessionStorage.removeItem(key);
      }
    });
  },

  createPromoProduct: async (promoProductData) => {
    const form = new FormData();

    for (const [key, value] of Object.entries(promoProductData)) {
      if (typeof value === "boolean") {
        form.append(key, value ? 1 : 0);
      } else {
        form.append(key, value);
      }
    }
    return apiCall("/product-promos", {
      method: "POST",
      body: form,
      headers: {
        // Jangan set Content-Type agar otomatis pakai multipart/form-data
      },
    });
  },

  // updatePromoProduct: async (id, promoProductData) => {
  //   const form = new FormData();

  //   for (const [key, value] of Object.entries(promoProductData)) {
  //     if (typeof value === "boolean") {
  //       form.append(key, value ? 1 : 0);
  //     } else {
  //       form.append(key, value);
  //     }
  //   }

  //   return apiCall(`/product-promos/${id}`, {
  //     method: "PUT",
  //     body: form,
  //     headers: {
  //       // Jangan set Content-Type agar otomatis pakai multipart/form-data
  //     },
  //   });
  // },

  updatePromoProduct: async (id, promoProductData) => {
    return apiCall(`/product-promos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(promoProductData),
    });
  },

  deletePromoProduct: async (id) => {
    return apiCall(`/product-promos/${id}`, {
      method: "DELETE",
    });
  },
};

export const fetchAllPromoProduct= async (search = "", filters = {}) => {
    const perPage = 100;
    let currentPage = 1;
    let allData = [];
    let totalPages = 1;
  
    while (currentPage <= totalPages) {
      const response = await promoProductService.getPromoProduct(
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
