import { apiErrorHandler, handleApiResponse } from "./apiErrorHandler"

const API_BASE_URL = "http://localhost:8000/api"

// Generic API call function with centralized error handling
const apiCall = async (endpoint, options = {}) => {
  try {
    const authToken = localStorage.getItem("authToken")
    const headers = {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    })

    return await handleApiResponse(response)
  } catch (error) {
    const errorResult = await apiErrorHandler.handleError(error)
    throw new Error(errorResult.message)
  }
}

export const umkmService = {
  // Get all UMKM
  getUMKMs: async (page = 1, perPage = 100) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })
    return apiCall(`/umkms?${params}`)
  },

  // Get single UMKM
  getUMKM: async (id) => {
    return apiCall(`/umkms/${id}`)
  },
}
