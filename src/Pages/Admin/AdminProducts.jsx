"use client"

import { useState } from "react"
import { Plus, Search, Edit, Eye, Trash2, Filter, Download } from "lucide-react"
import ProductModal from "../../components/Admin/Modals/ProductModal"

const AdminProducts = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Kopi Arabica Premium",
      brand: "Kopi Nusantara",
      umkm: "CV. Berkah Jaya",
      category: "Minuman",
      status: "Tersedia",
      price: 85000,
      image: "/placeholder.svg?height=60&width=60",
      createdAt: "2024-01-15",
      stock: 150,
      sold: 45,
    },
    {
      id: 2,
      name: "Batik Tulis Jogja",
      brand: "Batik Heritage",
      umkm: "UD. Seni Budaya",
      category: "Fashion",
      status: "Pre Order",
      price: 250000,
      image: "/placeholder.svg?height=60&width=60",
      createdAt: "2024-01-10",
      stock: 25,
      sold: 12,
    },
    {
      id: 3,
      name: "Keripik Singkong Pedas",
      brand: "Snack Tradisional",
      umkm: "UD. Berkah Rasa",
      category: "Makanan",
      status: "Tersedia",
      price: 15000,
      image: "/placeholder.svg?height=60&width=60",
      createdAt: "2024-01-12",
      stock: 200,
      sold: 89,
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBrand, setFilterBrand] = useState("")
  const [filterUMKM, setFilterUMKM] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterBrand === "" || product.brand === filterBrand) &&
      (filterUMKM === "" || product.umkm === filterUMKM) &&
      (filterCategory === "" || product.category === filterCategory) &&
      (filterStatus === "" || product.status === filterStatus)
    )
  })

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  const handleSave = (productData) => {
    if (selectedProduct) {
      setProducts(products.map((p) => (p.id === selectedProduct.id ? { ...p, ...productData } : p)))
    } else {
      const newProduct = {
        id: Math.max(...products.map((p) => p.id)) + 1,
        ...productData,
        createdAt: new Date().toISOString().split("T")[0],
        stock: productData.stock || 0,
        sold: 0,
      }
      setProducts([...products, newProduct])
    }
    setIsModalOpen(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Tersedia":
        return "bg-green-100 text-green-800"
      case "Pre Order":
        return "bg-yellow-100 text-yellow-800"
      case "Nonaktif":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Manajemen Produk</h2>
          <p className="text-gray-600 mt-1">Kelola semua produk UMKM dalam satu tempat</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={handleAdd}
            className="admin-button-primary text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Filter & Pencarian</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari produk..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full admin-input-focus"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
          >
            <option value="">Semua Brand</option>
            <option value="Kopi Nusantara">Kopi Nusantara</option>
            <option value="Batik Heritage">Batik Heritage</option>
            <option value="Snack Tradisional">Snack Tradisional</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
            value={filterUMKM}
            onChange={(e) => setFilterUMKM(e.target.value)}
          >
            <option value="">Semua UMKM</option>
            <option value="CV. Berkah Jaya">CV. Berkah Jaya</option>
            <option value="UD. Seni Budaya">UD. Seni Budaya</option>
            <option value="UD. Berkah Rasa">UD. Berkah Rasa</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            <option value="Minuman">Minuman</option>
            <option value="Fashion">Fashion</option>
            <option value="Makanan">Makanan</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Pre Order">Pre Order</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produk
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand & UMKM
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stok/Terjual
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="admin-table-row">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-12 w-12 rounded-lg object-cover shadow-sm"
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.brand}</div>
                    <div className="text-sm text-gray-500">{product.umkm}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`admin-status-badge ${getStatusColor(product.status)}`}>{product.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    Rp {product.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Stok: {product.stock}</div>
                    <div className="text-sm text-gray-500">Terjual: {product.sold}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        product={selectedProduct}
      />
    </div>
  )
}

export default AdminProducts
