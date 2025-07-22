"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Edit, Trash2, RefreshCw, Filter, Store, AlertCircle } from "lucide-react"
import CategoryModal from "../../components/Admin/Modals/CategoryModal"
import { categoryService } from "../../Services/categoryService"
import { closeLoading, showConfirmation, showError, showLoading, showSuccess } from "../../Utils/sweetAlert"
import LoadingSpinner from "../../components/Admin/LoadingSpinner"
import ErrorNotification from "../../components/Admin/ErrorNotification"
import Pagination from "../../components/Admin/Pagination"
import ImageWithFallback from "../../components/Admin/ImageWithFallback"

const AdminCategories = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    const [filterStatus, setFilterStatus] = useState("")

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [paginationMeta, setPaginationMeta] = useState({})

    const fetchCategories = async (page = 1, perPage = 6, search = "", filters = {}) => {
        try {
            setLoading(true)
            const response = await categoryService.getCategories(page, perPage, search, filters)
            if (response.data) {
                const transformed = response.data.map((u) => ({
                    ...u,
                    status: u.is_active ? "Aktif" : "Nonaktif",
                    createdAt: new Date(u.created_at).toISOString().split("T")[0],
                }))
                setCategories(transformed)
                setPaginationMeta(response.meta)
                setCurrentPage(response.meta.current_page)
                setTotalPages(response.meta.last_page)
                setTotalItems(response.meta.total)
                setItemsPerPage(response.meta.per_page)
            }
        } catch (err) {
            setError(err.message || "Gagal memuat Categories")
            showError("Gagal Memuat Categories", err.message || "Terjadi kesalahan")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories(currentPage, itemsPerPage, searchTerm, { is_active: filterStatus })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, itemsPerPage])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1)
            fetchCategories(1, itemsPerPage, searchTerm, { is_active: filterStatus })
        }, 400)
        return () => clearTimeout(timeoutId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStatus, searchTerm])

    const handleEdit = (category) => {
        setSelectedCategory(category)
        setIsModalOpen(true)
    }

    const handleAdd = () => {
        setSelectedCategory(null)
        setIsModalOpen(true)
    }

    const handleRefresh = () => {
        categoryService.clearCategoriesCache();
        fetchCategories(currentPage, itemsPerPage, searchTerm, { is_active: filterStatus })
    }

    const handleSave = async (categoryData) => {
        try {
            if (selectedCategory) {
                console.log("kategori data", categoryData);

                await categoryService.updateCategories(selectedCategory.id, categoryData)
            } else {
                console.log("product data", categoryData);

                await categoryService.createCategories(categoryData)
            }

            setIsModalOpen(false)
            // Refresh the current page
            categoryService.clearCategoriesCache();
            fetchCategories(currentPage, itemsPerPage, searchTerm, { is_active: filterStatus })
        } catch (err) {
            setError(err.message || "Failed to save kategori. Please try again.")
            const resData = error?.response?.data
            const errorMsg = resData?.message || "Terjadi kesalahan saat menyimpan data Kategori"

            if (resData?.error) {
                // Gabungkan semua pesan error jadi satu string
                const validationMessages = Object.entries(resData.error)
                    .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                    .join("\n")

                showError(errorMsg, validationMessages)
            } else {
                showError("Gagal Menyimpan data Kategori", error.message || errorMsg)
            }
            console.error("Error saving data kategori:", err)
            throw err // Re-throw to let modal handle it
        }
    }

    const handleDelete = async (id, kategoriName) => {
        try {
            const result = await showConfirmation(
                "Hapus Kategori?",
                `Apakah Anda yakin ingin menghapus "${kategoriName}"? Tindakan ini tidak dapat dibatalkan.`,
                "Ya, Hapus!",
            )

            if (result.isConfirmed) {
                showLoading("Menghapus Kategori...")
                await categoryService.deleteCategories(id)
                closeLoading()

                showSuccess("Kategori Berhasil Dihapus!", "Kategori telah dihapus dari sistem")

                // Refresh the current page
                categoryService.clearCategoriesCache();
                fetchCategories(currentPage, itemsPerPage, searchTerm, { is_active: filterStatus })
            }
        } catch (err) {
            closeLoading()
            setError(err.message || "Failed to delete kategori. Please try again.")
            showError("Gagal Menghapus Kategori", err.message || "Terjadi kesalahan saat menghapus Kategori")
            console.error("Error deleting kategori:", err)
        }
    }

    const handlePerPageChange = (newPerPage) => {
        setItemsPerPage(newPerPage)
        setCurrentPage(1) // Reset to first page
    }

    const handleFilterChange = (value) => {
        setCurrentPage(1) // Reset to first page when filtering
        setFilterStatus(value)
    }

    const handlePageChange = (page) => setCurrentPage(page)

    const clearFilters = () => {
        setSearchTerm("")
        // setFilterBrand("")
        // setFilterKategori("")
        // setFilterCategory("")
        setFilterStatus("")
        setCurrentPage(1)
    }

    if (loading && categories.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Manajemen Kategori</h2>
                        <p className="text-gray-600 mt-1">Kelola semua produk Kategori dalam satu tempat</p>
                    </div>
                </div>
                <LoadingSpinner text="Memuat kategori..." />
                <ErrorNotification />
            </div>
        )
    }


    return (
        <div>
            <div className="space-y-6">
                <ErrorNotification />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Manajemen Kategori</h2>
                        <p className="text-gray-600 mt-1">Kelola data Kategori yang terdaftar</p>
                        {paginationMeta.total && (
                            <p className="text-sm text-gray-500 mt-1">
                                Total: {paginationMeta.total} Kategori | Halaman {paginationMeta.current_page} dari{" "}
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
                            Tambah Kategori
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-700">{error}</span>
                        <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
                            ×
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <h3 className="font-semibold text-gray-900">Filter & Pencarian</h3>
                        <button onClick={clearFilters} className="ml-auto text-sm text-blue-600 hover:text-blue-800">
                            Clear Filters
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cari nama Kategori..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
                            value={filterStatus}
                            onChange={(e) => handleFilterChange(e.target.value)}
                        >
                            <option value="">Semua Status</option>
                            <option value="1">Aktif</option>
                            <option value="0">Nonaktif</option>
                        </select>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
                            value={itemsPerPage}
                            onChange={(e) => handlePerPageChange(Number.parseInt(e.target.value))}
                        >
                            <option value={10}>10 per halaman</option>
                            <option value={20}>20 per halaman</option>
                            <option value={25}>25 per halaman</option>
                            <option value={50}>50 per halaman</option>
                        </select>
                    </div>
                </div>

                {/* Categories Grid */}
                {/* <div className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {loading && categories.length > 0 && (
                            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                                <LoadingSpinner size="sm" text="Memuat..." />
                            </div>
                        )}
                        {categories.length === 0 && !loading ? (
                            <div className="w-full text-center py-12 text-gray-500 md:col-span-2 xl:col-span-3">
                                <div className="flex flex-col items-center">
                                    <Search className="w-12 h-12 text-gray-300 mb-4" />
                                    <p className="text-lg font-medium">Tidak ada Kategori ditemukan</p>
                                    <p className="text-sm">Coba ubah filter atau kata kunci pencarian</p>
                                </div>
                            </div>
                        ) : categories.map((category) => (
                            <div key={category.id} className="bg-white rounded-xl shadow-sm p-6 admin-card-hover">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="relative">
                                        <ImageWithFallback
                                            srcs={[category.photo]}
                                            alt={category.name}
                                            className="h-20 w-20 rounded-xl object-cover shadow-sm"
                                            fallbackIcon={Store}
                                            sizeIconFallback={10}
                                        />
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{category.name}</h3>

                                <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">{category.description}</p>

                                <div className="flex justify-center mb-4">
                                    <span
                                        className={`admin-status-badge ${category.status === "Aktif" ? "bg-[#d1fae5] text-[#065f46]" : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {category.status}
                                    </span>
                                </div>

                                <div className="flex justify-center space-x-2">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id, category.name)}
                                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}

                <div className="bg-white rounded-xl shadow-sm overflow-hidden relative">
                    {loading && categories.length > 0 && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                            <LoadingSpinner size="sm" text="Memuat..." />
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="w-12 py-4 pl-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                                    {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th> */}
                                    <th className="w-20 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="w-20 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {categories.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <Search className="w-12 h-12 text-gray-300 mb-4" />
                                                <p className="text-lg font-medium">Tidak ada Kategori ditemukan</p>
                                                <p className="text-sm">Coba ubah filter atau kata kunci pencarian</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category, i) => (
                                        <tr key={category.id} className="admin-table-row">
                                            <td className="py-4 pl-4 whitespace-nowrap text-center">
                                                {(currentPage - 1) * itemsPerPage + i + 1}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                <div className="flex items-start">
                                                    <ImageWithFallback
                                                        srcs={[category.photo]}
                                                        alt={category.name}
                                                        className="h-12 min-w-12 max-w-12 rounded-lg object-cover shadow-sm shrink-0"
                                                        fallbackIcon={Store}
                                                    />
                                                    <div className="ml-4 max-w-xs self-center">
                                                        <div className="text-sm font-medium text-gray-900 break-words">{category.name}</div>
                                                    </div>
                                                </div>
                                                {/* {category.name} */}
                                            </td>
                                            {/* <td className="px-6 py-4 text-sm text-gray-700">
                                                {category.description}
                                            </td> */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`admin-status-badge ${category.status === "Aktif" ? "bg-[#d1fae5] text-[#065f46]" : "bg-red-100 text-red-800"}`}
                                                >
                                                    {category.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(category)}
                                                        className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(category.id, category.name)}
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
            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                category={selectedCategory}
            />
        </div>
    )
}

export default AdminCategories
