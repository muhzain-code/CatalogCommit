"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { closeLoading, showConfirmation, showError, showLoading, showSuccess } from "../../../Utils/sweetAlert"

const CategoryModal = ({ isOpen, onClose, onSave, category }) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        is_active: true,
        photo: null,
    })

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || "",
                is_active: category.is_active ?? true,
                photo: null,
            })
        } else {
            setFormData({
                name: "",
                is_active: true,
                photo: null,
            })
        }
    }, [category])

    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //     onSave(formData)
    // }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const result = await showConfirmation(
            category ? "Update Kategori?" : "Simpan Kategori?",
            category
                ? "Apakah Anda yakin ingin memperbarui kategori ini?"
                : "Apakah Anda yakin ingin menyimpan kategori baru?",
            category ? "Ya, Update!" : "Ya, Simpan!"
        );

        if (!result.isConfirmed) return;

        setLoading(true)
        showLoading(category ? "Mengupdate kategori..." : "Menyimpan kategori...")

        try {
            const payload = {
                ...formData,
                is_active: formData.is_active ? 1 : 0, // Convert boolean to 1/0
            }
            if (!(formData.photo instanceof File)) {
                delete payload.photo
            }
            await onSave(payload)
            closeLoading()
            showSuccess(
                category ? "Kategori Berhasil Diupdate!" : "Kategori Berhasil Disimpan!",
                category ? "Data Kategori telah diperbarui" : "Kategori baru telah ditambahkan",
            )
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
        }
        finally {
            setLoading(false)
        }
    }

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo: e.target.files[0] })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{category ? "Edit Kategori" : "Tambah Kategori"}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori *</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={loading}
                        />
                    </div>

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL Foto</label>
                        <input
                            type="url"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                    </div> */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Foto Profile (max 2MB)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border file:rounded-lg file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            disabled={loading}
                        />
                    </div>

                    {/* Aktif */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-4 h-4"
                            disabled={loading}
                        />
                        <label htmlFor="is_active" className="text-sm text-gray-700">Aktif</label>
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
                            {category ? "Update" : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CategoryModal
