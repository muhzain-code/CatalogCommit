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
    throw errorResult
  }
}

export const eventService = {
  // Get all categories
  getEvent: async (page = 1, perPage = 100, search = "", filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })

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

    return apiCall(`/events?${params}`)
  },
}