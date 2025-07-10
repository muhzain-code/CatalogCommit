import { apiErrorHandler, handleApiResponse } from "./apiErrorHandler";

const API_BASE_URL = "http://localhost:8000/api";

// Generic API call function with centralized error handling
const apiCall = async (endpoint, options = {}) => {
  try {
    // Add auth token if available
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
    // Let the error handler deal with it
    const errorResult = await apiErrorHandler.handleError(error);
    throw new Error(errorResult.message);
  }
};

// Product API functions
export const productService = {
  // Fetch products with pagination and search
  getProducts: async (page = 1, perPage = 10, search = "", filters = {}) => {
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

    return apiCall(`/products?${params}`);
  },

  // Get single product
  getProduct: async (id) => {
    return apiCall(`/products/${id}`);
  },

  // Create product
  createProduct: async (productData) => {
    const apiData = transformProductToApi(productData);

    // Deteksi apakah ada file di dalam photos
    const hasFile = apiData.photos?.some((p) => p.file instanceof File);

    if (hasFile) {
      const form = new FormData();

      // Tambahkan field biasa ke form
      for (const [key, value] of Object.entries(apiData)) {
        if (key !== "photos") {
          // Tangani boolean (free_shipping) sebagai angka 1/0
          if (typeof value === "boolean") {
            form.append(key, value ? 1 : 0);
          } else {
            form.append(key, value !== null ? value : "");
          }
        }
      }

      // Tambahkan photos
      apiData.photos.forEach((photo, index) => {
        if (photo.file instanceof File) {
          form.append(`photos[${index}][file]`, photo.file);
        }
        form.append(`photos[${index}][caption]`, photo.caption || "");
        form.append(`photos[${index}][file_path]`, photo.file_path || "");
        form.append(`photos[${index}][is_active]`, photo.is_active ?? 1);
      });

      return apiCall("/products", {
        method: "POST",
        body: form,
        headers: {
          // Jangan set Content-Type agar browser otomatis mengatur multipart boundary
        },
      });
    } else {
      // Jika tidak ada file, kirim JSON biasa
      return apiCall("/products", {
        method: "POST",
        body: JSON.stringify(apiData),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    console.log("api product data", productData);

    const apiData = transformProductToApi(productData);
    console.log("api data", apiData);
    return apiCall(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(apiData),
    });
  },

  // Delete product
  deleteProduct: async (id) => {
    return apiCall(`/products/${id}`, {
      method: "DELETE",
    });
  },
};

// Helper function to transform API data to component format
export const transformProductData = (apiProduct) => {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    brand: apiProduct.umkm?.name || "Unknown Brand",
    umkm: apiProduct.umkm?.name || "Unknown UMKM",
    umkmId: apiProduct.umkm_id,
    category: apiProduct.category?.name || "Unknown Category",
    categoryId: apiProduct.category_id,
    status: transformStatus(apiProduct.status),
    price: Number.parseFloat(apiProduct.price) || 0,
    image: apiProduct.photo?.file_path || "",
    createdAt: apiProduct.date || new Date().toISOString().split("T")[0],
    stock: 0, // Not provided by API
    sold: 0, // Not provided by API
    description: apiProduct.description || "",
    phone: apiProduct.umkm?.phone || "",
    waLink: apiProduct.umkm?.wa_link || "",
    address: apiProduct.umkm?.address || "",
    profileImage: apiProduct.umkm?.photo_profile || "",
    descriptionImage: apiProduct.photo?.file_path || "",
    shippingCost: apiProduct.shipping_price
      ? Number.parseFloat(apiProduct.shipping_price)
      : null,
    freeShipping: apiProduct.free_shipping || false,
    marketplace: {
      name: "",
      price: "",
      link: "",
    },
    // Raw API data for reference
    rawData: apiProduct,
  };
};

// Transform status from API format to display format
const transformStatus = (apiStatus) => {
  const statusMap = {
    available: "Tersedia",
    pre_order: "Pre Order",
    inactive: "Nonaktif",
  };
  return statusMap[apiStatus] || "Tersedia";
};

// Transform status from display format to API format
export const transformStatusToApi = (displayStatus) => {
  const statusMap = {
    Tersedia: "available",
    "Pre Order": "pre_order",
    Nonaktif: "inactive",
  };
  return statusMap[displayStatus] || "available";
};

// Transform product data from component format to API format
export const transformProductToApi = (componentProduct) => {
  return {
    name: componentProduct.name,
    description: componentProduct.description,
    price: componentProduct.price.toString(),
    shipping_price: componentProduct.shipping_price
      ? componentProduct.shipping_price.toString()
      : null,
    free_shipping: componentProduct.free_shipping,
    status: componentProduct.status,
    umkm_id: componentProduct.umkm_id,
    category_id: componentProduct.category_id,
    date: componentProduct.date,
    photos:
      componentProduct.photos?.map((photo) => ({
        caption: photo.caption || null,
        file_path: photo.file_path || null,
        is_active: photo.is_active ?? 1,
        ...(photo.file && { file: photo.file }),
      })) || [],
  };
};
