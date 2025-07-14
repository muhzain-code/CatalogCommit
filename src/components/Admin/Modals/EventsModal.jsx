"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { closeLoading, showError, showLoading, showSuccess } from "../../../Utils/sweetAlert"

const EventsModal = ({ isOpen, onClose, onSave, data, dataUmkm }) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        umkm_id: "",
        name: "",
        description: "",
        photo: null,
        start_date: "",
        end_date: "",
        is_active: true
    })

    // const availableProducts = ["Kopi Arabica Premium", "Batik Tulis Jogja", "Keripik Singkong", "Tas Rajut Handmade"]

    useEffect(() => {
        if (data) {
            setFormData({
                umkm_id: data.umkm_id || "",
                name: data.name || "",
                description: data.description || "",
                photo: null,
                start_date: data.start_date ? data.start_date.split("T")[0] : "",
                end_date: data.end_date ? data.end_date.split("T")[0] : "",
                is_active: data.is_active ?? true,
            })
        } else {
            setFormData({
                umkm_id: "",
                name: "",
                description: "",
                photo: null,
                start_date: "",
                end_date: "",
                is_active: true,
            })
        }
    }, [data])

    // useEffect(() => {
    //     console.log(formData);

    // }, [formData])

    // const handleProductChange = (product, checked) => {
    //     if (checked) {
    //         setFormData({
    //             ...formData,
    //             events: [...formData.events, product],
    //         })
    //     } else {
    //         setFormData({
    //             ...formData,
    //             events: formData.events.filter((p) => p !== product),
    //         })
    //     }
    // }

    const handleSubmit = async (e) => {
        e.preventDefault()


        setLoading(true)
        showLoading(data ? "Mengupdate event..." : "Menyimpan event...")

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
                data ? "Event Berhasil Diupdate!" : "Event Berhasil Disimpan!",
                data ? "Data Event telah diperbarui" : "Event baru telah ditambahkan",
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
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{data ? "Edit Berita Promo" : "Tambah Berita Promo"}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">UMKM *</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.umkm_id}
                            onChange={(e) => setFormData({ ...formData, umkm_id: e.target.value })}
                            disabled={loading}
                        >
                            <option value="">Pilih UMKM</option>
                            {dataUmkm.map((umkm) => (
                                <option key={umkm.id} value={umkm.id}>
                                    {umkm.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Event *</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi *</label>
                        <textarea
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            disabled={loading}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai *</label>
                            <input
                                type="date"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai *</label>
                            <input
                                type="date"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Foto (max 2MB)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border file:rounded-lg file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            disabled={loading}
                        />
                    </div>

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
                            {data ? "Update" : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EventsModal
