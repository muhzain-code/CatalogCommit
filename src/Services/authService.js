// services/AuthService.js
import { API_BASE_URL } from "../config";
import { apiErrorHandler, handleApiResponse } from "./apiErrorHandler";
import Cookies from "js-cookie";

const apiCall = async (endpoint, options = {}) => {
  try {
    const token = Cookies.get("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    if (response.status === 401) {
      // Hapus semua cookies dan redirect ke login
      Cookies.remove("token");
      Cookies.remove("name");
      Cookies.remove("email");
      return; // hentikan eksekusi lebih lanjut
    }

    return await handleApiResponse(response);
  } catch (error) {
    throw await apiErrorHandler.handleError(error);
  }
};

export const AuthService = {
  logout: async () => {
    return apiCall("/admin/logout", {
      method: "POST",
    });
  },

  addUser: async (userData) => {
    return apiCall("/admin/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  updateProfile: async (userData) => {
    return apiCall("/admin/profile", {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  },

  changePassword: async (data) => {
    return apiCall("/admin/password", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};
