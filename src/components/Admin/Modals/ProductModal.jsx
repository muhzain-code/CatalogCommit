/* eslint-disable react/prop-types */
"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

const ProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    description: "",
    price: "",
    phone: "",
    profileImage: "",
    descriptionImage: "",
    shippingCost: "",
    freeShipping: false,
    status: "Tersedia",
    marketplace: {
      name: "",
      price: "",
      link: "",
    },
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.category || "",
        brand: product.brand || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        phone: product.phone || "",
        profileImage: product.profileImage || "",
        descriptionImage: product.descriptionImage || "",
        shippingCost: product.shippingCost?.toString() || "",
        freeShipping: product.freeShipping || false,
        status: product.status || "Tersedia",
        marketplace: product.marketplace || { name: "", price: "", link: "" },
      })
    } else {
      setFormData({
        name: "",
        category: "",
        brand: "",
        description: "",
        price: "",
        phone: "",
        profileImage: "",
        descriptionImage: "",
        shippingCost: "",
        freeShipping: false,
        status: "Tersedia",
        marketplace: { name: "", price: "", link: "" },
      })
    }
  }, [product])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      price: Number.parseFloat(formData.price),
      shippingCost: formData.shippingCost ? Number.parseFloat(formData.shippingCost) : null,
    })
  }

  const handleShippingChange = (field, value) => {
    if (field === "freeShipping" && value) {
      setFormData({ ...formData, freeShipping: true, shippingCost: "" })
    } else if (field === "shippingCost" && value) {
      setFormData({ ...formData, shippingCost: value, freeShipping: false })
    } else {
      setFormData({ ...formData, [field]: value })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{product ? "Edit Produk" : "Tambah Produk"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk *</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Pilih Kategori</option>
                <option value="Minuman">Minuman</option>
                <option value="Fashion">Fashion</option>
                <option value="Makanan">Makanan</option>
                <option value="Kerajinan">Kerajinan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              >
                <option value="">Pilih Brand</option>
                <option value="Kopi Nusantara">Kopi Nusantara</option>
                <option value="Batik Heritage">Batik Heritage</option>
                <option value="Snack Tradisional">Snack Tradisional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga *</label>
              <input
                type="number"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Pre Order">Pre Order</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Shipping Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga Ongkir</label>
              <input
                type="number"
                disabled={formData.freeShipping}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                value={formData.shippingCost}
                onChange={(e) => handleShippingChange("shippingCost", e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="freeShipping"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.freeShipping}
                onChange={(e) => handleShippingChange("freeShipping", e.target.checked)}
              />
              <label htmlFor="freeShipping" className="ml-2 block text-sm text-gray-900">
                Gratis Ongkir
              </label>
            </div>
          </div>

          {/* Marketplace Section */}
          <div className="border-t pt-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">Marketplace (Opsional)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Marketplace</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.marketplace.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      marketplace: { ...formData.marketplace, name: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga di Marketplace</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.marketplace.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      marketplace: { ...formData.marketplace, price: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Marketplace</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.marketplace.link}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      marketplace: { ...formData.marketplace, link: e.target.value },
                    })
                  }
                />
              </div>
            </div>
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
              {product ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductModal
