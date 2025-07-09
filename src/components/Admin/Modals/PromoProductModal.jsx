/* eslint-disable react/prop-types */
"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

const PromoProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    productName: "",
    originalPrice: "",
    promoPrice: "",
  })

  const availableProducts = [
    "Kopi Arabica Premium",
    "Batik Tulis Jogja",
    "Keripik Singkong",
    "Tas Rajut Handmade",
    "Sambal Pecel Madiun",
    "Kain Tenun Ikat",
  ]

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || "",
        originalPrice: product.originalPrice?.toString() || "",
        promoPrice: product.promoPrice?.toString() || "",
      })
    } else {
      setFormData({
        productName: "",
        originalPrice: "",
        promoPrice: "",
      })
    }
  }, [product])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      originalPrice: Number.parseFloat(formData.originalPrice),
      promoPrice: Number.parseFloat(formData.promoPrice),
    })
  }

  const calculateDiscount = () => {
    if (formData.originalPrice && formData.promoPrice) {
      const original = Number.parseFloat(formData.originalPrice)
      const promo = Number.parseFloat(formData.promoPrice)
      if (original > 0 && promo > 0) {
        return Math.round(((original - promo) / original) * 100)
      }
    }
    return 0
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{product ? "Edit Produk Promo" : "Tambah Produk Promo"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Produk *</label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            >
              <option value="">Pilih Produk</option>
              {availableProducts.map((productName) => (
                <option key={productName} value={productName}>
                  {productName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga Asli *</label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga Promo *</label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.promoPrice}
              onChange={(e) => setFormData({ ...formData, promoPrice: e.target.value })}
            />
          </div>

          {formData.originalPrice && formData.promoPrice && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">
                Diskon: <span className="font-semibold text-red-600">{calculateDiscount()}%</span>
              </div>
              <div className="text-sm text-gray-600">
                Hemat:{" "}
                <span className="font-semibold">
                  Rp{" "}
                  {(Number.parseFloat(formData.originalPrice) - Number.parseFloat(formData.promoPrice)).toLocaleString(
                    "id-ID",
                  )}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {product ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PromoProductModal
