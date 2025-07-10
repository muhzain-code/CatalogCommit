import Swal from "sweetalert2"

// Success notification
export const showSuccess = (title, text = "") => {
  return Swal.fire({
    icon: "success",
    title: title,
    text: text,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    toast: true,
    position: "top-end",
  })
}

// Error notification
export const showError = (title, text = "") => {
  return Swal.fire({
    icon: "error",
    title: title,
    text: text,
    showConfirmButton: true,
    confirmButtonColor: "#dc2626",
  })
}

// Warning notification
export const showWarning = (title, text = "") => {
  return Swal.fire({
    icon: "warning",
    title: title,
    text: text,
    showConfirmButton: true,
    confirmButtonColor: "#f59e0b",
  })
}

// Info notification
export const showInfo = (title, text = "") => {
  return Swal.fire({
    icon: "info",
    title: title,
    text: text,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    toast: true,
    position: "top-end",
  })
}

// Confirmation dialog
export const showConfirmation = (title, text = "", confirmButtonText = "Ya, Hapus!") => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: confirmButtonText,
    cancelButtonText: "Batal",
  })
}

// Loading notification
export const showLoading = (title = "Memproses...") => {
  return Swal.fire({
    title: title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })
}

// Close loading
export const closeLoading = () => {
  Swal.close()
}
