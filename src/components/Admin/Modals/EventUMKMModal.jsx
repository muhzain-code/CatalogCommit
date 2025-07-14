"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { closeLoading, showError, showLoading, showSuccess } from "../../../Utils/sweetAlert"

const EventUMKMModal = ({ isOpen, onClose, onSave, data, dataUmkm, dataEvents }) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        umkm_id: "",
        event_id: "",
        is_active: true,
    })

    useEffect(() => {
        if (data) {
            setFormData({
                umkm_id: data.umkm_id.id || "",
                event_id: data.event_id.id || "",
                is_active: data.is_active ?? true,
            })
        } else {
            setFormData({
                umkm_id: "",
                event_id: "",
                is_active: true,
            })
        }
    }, [data])

    // const handleUMKMChange = (umkm, checked) => {
    //     if (checked) {
    //         setFormData({
    //             ...formData,
    //             involvedUMKM: [...formData.involvedUMKM, umkm],
    //         })
    //     } else {
    //         setFormData({
    //             ...formData,
    //             involvedUMKM: formData.involvedUMKM.filter((u) => u !== umkm),
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

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{data ? "Edit Event UMKM" : "Tambah Event UMKM"}</h3>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event *</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.event_id}
                            onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                            disabled={loading}
                        >
                            <option value="">Pilih Event</option>
                            {dataEvents.map((event) => (
                                <option key={event.id} value={event.id}>
                                    {event.name}
                                </option>
                            ))}
                        </select>
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

export default EventUMKMModal
