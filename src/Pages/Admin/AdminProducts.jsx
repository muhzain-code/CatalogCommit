"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Filter, AlertCircle, RefreshCw, Package } from "lucide-react"
import { productService, transformProductData } from "../../Services/productService"
import LoadingSpinner from "../../components/Admin/LoadingSpinner"
import ErrorNotification from "../../components/Admin/ErrorNotification"
import ImageWithFallback from "../../components/Admin/ImageWithFallback"
import Pagination from "../../components/Admin/Pagination"
import ProductModal from "../../components/Admin/Modals/ProductModal"
import { closeLoading, showConfirmation, showError, showLoading, showSuccess } from "../../Utils/sweetAlert"
import { umkmService } from "../../Services/umkmService"
import { categoryService } from "../../Services/categoryService"

const AdminProducts = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("")
    const [filterBrand, setFilterBrand] = useState("")
    const [filterUMKM, setFilterUMKM] = useState("")
    const [filterCategory, setFilterCategory] = useState("")
    const [filterStatus, setFilterStatus] = useState("")

    // Pagination states from API meta
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [paginationMeta, setPaginationMeta] = useState({})

    // Available filter options
    const [filterOptions, setFilterOptions] = useState({
        // brands: [],
        umkms: [],
        categories: [],
    })

    // Fetch products from API
    const fetchProducts = async (page = 1, perPage = 10, search = "", filters = {}) => {
        try {
            setLoading(true)
            setError(null)

            const response = await productService.getProducts(page, perPage, search, filters)

            if (response.data) {
                const transformedProducts = response.data.map(transformProductData)
                setProducts(transformedProducts)

                // Extract filter options from the data
                // const brands = [...new Set(transformedProducts.map((p) => p.brand).filter(Boolean))]
                // const umkms = [...new Set(transformedProducts.map((p) => p.umkm).filter(Boolean))]
                // const categories = [...new Set(transformedProducts.map((p) => p.category).filter(Boolean))]

                // setFilterOptions({ brands, umkms, categories })

                const [umkmResponse, categoryResponse] = await Promise.all([
                    umkmService.getUMKMs(),
                    categoryService.getCategories(),
                ])
                setFilterOptions({ umkms: umkmResponse.data || [], categories: categoryResponse.data || [] })

                // Handle pagination from API meta
                if (response.meta) {
                    setPaginationMeta(response.meta)
                    setCurrentPage(response.meta.current_page)
                    setTotalPages(response.meta.last_page)
                    setTotalItems(response.meta.total)
                    setItemsPerPage(response.meta.per_page)
                }
            }
        } catch (err) {
            setError(err.message || "Failed to fetch products. Please try again.")
            showError("Gagal Memuat Data", err.message || "Tidak dapat memuat data produk")
            console.error("Error fetching products:", err)
        } finally {
            setLoading(false)
        }
    }

    // Initial load
    useEffect(() => {
        fetchProducts(currentPage, itemsPerPage, searchTerm, {
            brand: filterBrand,
            umkm_id: filterUMKM,
            category_id: filterCategory,
            status: filterStatus,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, itemsPerPage])

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (currentPage === 1) {
                // If already on page 1, fetch directly
                fetchProducts(1, itemsPerPage, searchTerm, {
                    brand: filterBrand,
                    umkm_id: filterUMKM,
                    category_id: filterCategory,
                    status: filterStatus,
                })
            } else {
                // Reset to page 1 when searching/filtering
                setCurrentPage(1)
            }
        }, 400)

        return () => clearTimeout(timeoutId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, filterBrand, filterUMKM, filterCategory, filterStatus])

    const handleEdit = async (product) => {
        try {
            showLoading("Memuat data produk...")
            const response = await productService.getProduct(product.id)
            closeLoading()
            setSelectedProduct(response.data)
            setIsModalOpen(true)
        } catch (err) {
            closeLoading()
            console.error("Error get detail product:", err)
            showError("Gagal Memuat Data", "Tidak dapat memuat detail produk")
        }
    }

    const handleAdd = () => {
        setSelectedProduct(null)
        setIsModalOpen(true)
    }

    const handleDelete = async (id, productName) => {
        try {
            const result = await showConfirmation(
                "Hapus Produk?",
                `Apakah Anda yakin ingin menghapus produk "${productName}"? Tindakan ini tidak dapat dibatalkan.`,
                "Ya, Hapus!",
            )

            if (result.isConfirmed) {
                showLoading("Menghapus produk...")
                await productService.deleteProduct(id)
                closeLoading()

                showSuccess("Produk Berhasil Dihapus!", "Produk telah dihapus dari sistem")

                // Refresh the current page
                fetchProducts(currentPage, itemsPerPage, searchTerm, {
                    brand: filterBrand,
                    umkm_id: filterUMKM,
                    category_id: filterCategory,
                    status: filterStatus,
                })
            }
        } catch (err) {
            closeLoading()
            setError(err.message || "Failed to delete product. Please try again.")
            showError("Gagal Menghapus Produk", err.message || "Terjadi kesalahan saat menghapus produk")
            console.error("Error deleting product:", err)
        }
    }

    const handleSave = async (productData) => {
        try {
            if (selectedProduct) {
                await productService.updateProduct(selectedProduct.id, productData)
            } else {
                console.log("product data", productData);
                
                await productService.createProduct(productData)
            }

            setIsModalOpen(false)
            // Refresh the current page
            fetchProducts(currentPage, itemsPerPage, searchTerm, {
                brand: filterBrand,
                umkm_id: filterUMKM,
                category_id: filterCategory,
                status: filterStatus,
            })
        } catch (err) {
            setError(err.message || "Failed to save product. Please try again.")
            showError("Gagal Menyimpan Produk", err.message || "Terjadi kesalahan saat menyimpan produk")
            console.error("Error saving product:", err)
            throw err // Re-throw to let modal handle it
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handlePerPageChange = (newPerPage) => {
        setItemsPerPage(newPerPage)
        setCurrentPage(1) // Reset to first page
    }

    const handleFilterChange = (filterType, value) => {
        setCurrentPage(1) // Reset to first page when filtering
        switch (filterType) {
            case "brand":
                setFilterBrand(value)
                break
            case "umkm":
                setFilterUMKM(value)
                break
            case "category":
                setFilterCategory(value)
                break
            case "status":
                setFilterStatus(value)
                break
            default:
                break
        }
    }

    const clearFilters = () => {
        setSearchTerm("")
        setFilterBrand("")
        setFilterUMKM("")
        setFilterCategory("")
        setFilterStatus("")
        setCurrentPage(1)
    }

    const handleRefresh = () => {
        fetchProducts(currentPage, itemsPerPage, searchTerm, {
            brand: filterBrand,
            umkm_id: filterUMKM,
            category_id: filterCategory,
            status: filterStatus,
        })
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "Tersedia":
                return "bg-[#d1fae5] text-[#065f46]"
            case "Pre Order":
                return "bg-yellow-100 text-yellow-800"
            case "Nonaktif":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    if (loading && products.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Manajemen Produk</h2>
                        <p className="text-gray-600 mt-1">Kelola semua produk UMKM dalam satu tempat</p>
                    </div>
                </div>
                <LoadingSpinner text="Memuat produk..." />
                <ErrorNotification />
            </div>
        )
    }

    return (
        <div>
            <div className="space-y-6">
                <ErrorNotification />

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Manajemen Produk</h2>
                        <p className="text-gray-600 mt-1">Kelola semua produk UMKM dalam satu tempat</p>
                        {paginationMeta.total && (
                            <p className="text-sm text-gray-500 mt-1">
                                Total: {paginationMeta.total} produk | Halaman {paginationMeta.current_page} dari{" "}
                                {paginationMeta.last_page}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                            Refresh
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

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-700">{error}</span>
                        <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
                            ×
                        </button>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <h3 className="font-semibold text-gray-900">Filter & Pencarian</h3>
                        <button onClick={clearFilters} className="ml-auto text-sm text-blue-600 hover:text-blue-800">
                            Clear Filters
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        {/* <select
              className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
              value={filterBrand}
              onChange={(e) => handleFilterChange("brand", e.target.value)}
            >
              <option value="">Semua Brand</option>
              {filterOptions.brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select> */}
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
                            value={filterUMKM}
                            onChange={(e) => handleFilterChange("umkm", e.target.value)}
                        >
                            <option value="">Semua UMKM</option>
                            {filterOptions.umkms.map((umkm) => (
                                <option key={umkm.id} value={umkm.id}>
                                    {umkm.name}
                                </option>
                            ))}
                        </select>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
                            value={filterCategory}
                            onChange={(e) => handleFilterChange("category", e.target.value)}
                        >
                            <option value="">Semua Kategori</option>
                            {filterOptions.categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
                            value={itemsPerPage}
                            onChange={(e) => handlePerPageChange(Number.parseInt(e.target.value))}
                        >
                            <option value={5}>5 per halaman</option>
                            <option value={10}>10 per halaman</option>
                            <option value={25}>25 per halaman</option>
                            <option value={50}>50 per halaman</option>
                        </select>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden relative">
                    {loading && products.length > 0 && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                            <LoadingSpinner size="sm" text="Memuat..." />
                        </div>
                    )}

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
                                        Ongkir
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <Search className="w-12 h-12 text-gray-300 mb-4" />
                                                <p className="text-lg font-medium">Tidak ada produk ditemukan</p>
                                                <p className="text-sm">Coba ubah filter atau kata kunci pencarian</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product.id} className="admin-table-row">
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex items-start">
                                                    <ImageWithFallback
                                                        src={product.image || "/placeholder.svg"}
                                                        alt={product.name}
                                                        className="h-12 min-w-12 max-w-12 rounded-lg object-cover shadow-sm shrink-0"
                                                        fallbackIcon={Package}
                                                    />
                                                    <div className="ml-4 max-w-xs">
                                                        <div className="text-sm font-medium text-gray-900 break-words">{product.name}</div>
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
                                                <div className="text-sm text-gray-900">
                                                    {product.freeShipping ? (
                                                        <span className="text-green-600 font-medium">Gratis</span>
                                                    ) : product.shippingCost ? (
                                                        `Rp ${product.shippingCost.toLocaleString("id-ID")}`
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    {/* <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </button> */}
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                        />
                    )}
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
