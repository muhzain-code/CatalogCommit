"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { closeLoading, showConfirmation, showError, showLoading, showSuccess } from "../../../Utils/sweetAlert"

const ChangePasswordModal = ({ isOpen, onClose, onSave }) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    })

    useEffect(() => {
        if (isOpen) {
            setFormData({
                current_password: "",
                new_password: "",
                new_password_confirmation: "",
            })
        }
    }, [isOpen])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await showConfirmation(
            "Ganti Password?",
            "Apakah Anda yakin ingin mengganti password akun ini? Tindakan ini akan segera diterapkan.",
            "Ya, Ganti!"
        )

        if (!result.isConfirmed) return
        setLoading(true)
        showLoading("Menyimpan data...")

        try {
            await onSave(formData)
            closeLoading()
            showSuccess("Data telah disimpan", "Password telah diperbarui")
            // onClose()
        } catch (error) {
            closeLoading()
            console.log("DETAIL ERROR:", error)
            const validationErrors = error?.originalError?.responseData?.error
            if (validationErrors) {
                const messages = Object.values(validationErrors).flat().join("\n")
                showError("Validasi Gagal", messages)
            } else {
                showError("Gagal Menyimpan", error.message || "Terjadi kesalahan.")
            }
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Ganti Password</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
                        <input
                            type="text"
                            required
                            maxLength={255}
                            value={formData.name}
                            disabled={loading}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Masukkan nama"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            disabled={loading}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="contoh@email.com"
                        />
                    </div> */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password lama *</label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={formData.current_password}
                            disabled={loading}
                            onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Minimal 8 karakter"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={formData.new_password}
                            disabled={loading}
                            onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Minimal 8 karakter"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password *</label>
                        <input
                            type="password"
                            required
                            value={formData.new_password_confirmation}
                            disabled={loading}
                            onChange={(e) => setFormData({ ...formData, new_password_confirmation: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ulangi password"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            Batal
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangePasswordModal
