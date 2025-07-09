// Custom event for global error notifications
const ERROR_EVENT = "api-error"

// Event emitter for global error notifications
export const errorNotifier = {
  emit: (error) => {
    window.dispatchEvent(new CustomEvent(ERROR_EVENT, { detail: error }))
  },

  subscribe: (callback) => {
    window.addEventListener(ERROR_EVENT, callback)
    return () => window.removeEventListener(ERROR_EVENT, callback)
  },
}

// Centralized API error handler
export const apiErrorHandler = {
  // Handle different types of errors
  handleError: async (error, response = null) => {
    let errorMessage = "Terjadi kesalahan. Silakan coba lagi."
    let errorType = "error"

    if (response) {
      switch (response.status) {
        case 401:
          errorMessage = "Sesi Anda telah berakhir. Silakan login kembali."
          errorType = "unauthorized"
          // Clear auth data
          localStorage.removeItem("authToken")
          localStorage.removeItem("user")
          // Redirect to login after showing error
          setTimeout(() => {
            window.location.href = "/login"
          }, 2000)
          break

        case 403:
          errorMessage = "Anda tidak memiliki akses untuk melakukan aksi ini."
          errorType = "forbidden"
          break

        case 404:
          errorMessage = "Data yang dicari tidak ditemukan."
          errorType = "not_found"
          break

        case 422:
          // Validation errors
          try {
            const errorData = await response.json()
            if (errorData.errors) {
              const validationErrors = Object.values(errorData.errors).flat()
              errorMessage = validationErrors.join(", ")
            } else if (errorData.message) {
              errorMessage = errorData.message
            }
          } catch {
            errorMessage = "Terjadi kesalahan validasi data."
          }
          errorType = "validation"
          break

        case 429:
          errorMessage = "Terlalu banyak permintaan. Silakan coba lagi nanti."
          errorType = "rate_limit"
          break

        case 500:
          errorMessage = "Terjadi kesalahan pada server. Silakan coba lagi nanti."
          errorType = "server_error"
          break

        default:
          if (response.status >= 400 && response.status < 500) {
            errorMessage = "Permintaan tidak valid. Silakan periksa data yang dikirim."
          } else if (response.status >= 500) {
            errorMessage = "Terjadi kesalahan pada server. Silakan coba lagi nanti."
          }
      }
    } else if (error.name === "NetworkError" || error.message.includes("fetch")) {
      errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
      errorType = "network"
    }

    // Emit error for global notification
    errorNotifier.emit({
      message: errorMessage,
      type: errorType,
      timestamp: Date.now(),
    })

    return {
      message: errorMessage,
      type: errorType,
      originalError: error,
    }
  },
}

// Helper function to handle API responses
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`)
    await apiErrorHandler.handleError(error, response)
    throw error
  }

  const data = await response.json()
  return data
}
