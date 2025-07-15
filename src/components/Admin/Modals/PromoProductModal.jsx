/* eslint-disable react/prop-types */
"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { closeLoading, showConfirmation, showError, showLoading, showSuccess } from "../../../Utils/sweetAlert"

const PromoProductModal = ({ isOpen, onClose, onSave, promo, products = [], events = [] }) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        product_id: "",
        event_id: "",
        original_price: "",
        promo_price: "",
        is_active: true,
    })

    useEffect(() => {
        if (promo) {
            setFormData({
                product_id: promo.product_id || "",
                event_id: promo.event_id || "",
                original_price: promo.product.price?.toString() || "",
                promo_price: promo.promo_price?.toString() || "",
                is_active: promo.is_active ?? true,
            })
        } else {
            setFormData({
                product_id: "",
                event_id: "",
                original_price: "",
                promo_price: "",
                is_active: true,
            })
        }
    }, [promo, isOpen])

    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //     onSave({
    //         product_id: formData.product_id,
    //         event_id: formData.event_id,
    //         promo_price: Number(formData.promo_price),
    //         is_active: Boolean(formData.is_active),
    //     })
    // }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const result = await showConfirmation(
            promo ? "Update Promo?" : "Simpan Promo?",
            promo
                ? "Apakah Anda yakin ingin memperbarui data promo ini?"
                : "Apakah Anda yakin ingin menyimpan promo baru?",
            promo ? "Ya, Update!" : "Ya, Simpan!"
        );

        if (!result.isConfirmed) return;

        setLoading(true)
        showLoading(promo ? "Mengupdate promo..." : "Menyimpan promo...")

        try {

            await onSave({
                product_id: formData.product_id,
                event_id: formData.event_id,
                promo_price: Number(formData.promo_price),
                is_active: Boolean(formData.is_active),
            })
            closeLoading()
            showSuccess(
                promo ? "Promo Berhasil Diupdate!" : "Promo Berhasil Disimpan!",
                promo ? "Data Promo telah diperbarui" : "Promo baru telah ditambahkan",
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

    const calculateDiscount = () => {
        const original = Number(formData.original_price)
        const promo = Number(formData.promo_price)
        if (original > 0 && promo > 0) {
            return Math.round(((original - promo) / original) * 100)
        }
        return 0
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{promo ? "Edit Produk Promo" : "Tambah Produk Promo"}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Produk *</label>
                        <select
                            required
                            value={formData.product_id}
                            onChange={(e) => {
                                const selectedId = e.target.value
                                const selectedProduct = products.find((p) => p.id.toString() === selectedId)
                                setFormData({
                                    ...formData,
                                    product_id: selectedId,
                                    original_price: selectedProduct?.price?.toString() || "",
                                })
                            }}
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Pilih Produk</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event *</label>
                        <select
                            required
                            value={formData.event_id}
                            onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={loading}
                        >
                            <option value="">Pilih Event</option>
                            {events.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Harga Promo *</label>
                        <input
                            type="number"
                            required
                            min={0}
                            value={formData.promo_price}
                            onChange={(e) => setFormData({ ...formData, promo_price: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={loading}
                        />
                    </div>

                    {formData.promo_price && formData.original_price && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-600">
                                Harga Asli:{" "}
                                <span className="font-semibold text-gray-800">
                                    Rp {Number(formData.original_price).toLocaleString("id-ID")}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600">
                                Diskon: <span className="font-semibold text-red-600">{calculateDiscount()}%</span>
                            </div>
                            <div className="text-sm text-gray-600">
                                Hemat:{" "}
                                <span className="font-semibold">
                                    Rp{" "}
                                    {(Number(formData.original_price) - Number(formData.promo_price)).toLocaleString("id-ID")}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            disabled={loading}
                        />
                        <label htmlFor="is_active" className="text-sm text-gray-700">Aktifkan Promo</label>
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
                            {promo ? "Update" : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PromoProductModal
