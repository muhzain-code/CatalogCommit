"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Edit, Trash2, Calendar, Filter, AlertCircle, RefreshCw } from "lucide-react"
import PromoProductModal from "../../components/Admin/Modals/PromoProductModal"
import LoadingSpinner from "../../components/Admin/LoadingSpinner"
import ErrorNotification from "../../components/Admin/ErrorNotification"
import { closeLoading, showConfirmation, showError, showLoading, showSuccess } from "../../Utils/sweetAlert"
import { promoProductService } from "../../Services/promoProductService"
import Pagination from "../../components/Admin/Pagination"
import { productService } from "../../Services/productService"
import { eventService } from "../../Services/eventService"

const AdminPromoProducts = () => {
    const [promoProducts, setPromoProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedPromoProducts, setSelectedPromoProducts] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    const [filterStatus, setFilterStatus] = useState("")
    const [filterProduct, setFilterProduct] = useState("")
    const [filterEvent, setFilterEvent] = useState("")

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [paginationMeta, setPaginationMeta] = useState({})

    const [filterOptions, setFilterOptions] = useState({
        // brands: [],
        products: [],
        events: [],
    })

    const fetchPromoProducts = async (page = 1, perPage = 6, search = "", filters = {}) => {
        try {
            setLoading(true)
            const response = await promoProductService.getPromoProduct(page, perPage, search, filters)
            if (response.data) {
                const transformed = response.data.map((u) => ({
                    ...u,
                    status: u.is_active ? "Aktif" : "Nonaktif",
                    createdAt: new Date(u.created_at).toISOString().split("T")[0],
                }))

                // 1. Ambil total produk
                const initialProductRes = await productService.getProducts(1, 1);
                const totalProducts = initialProductRes.meta?.total || 0;

                // 2. Ambil total event
                const initialEventRes = await eventService.getEvents(1, 1);
                const totalEvents = initialEventRes.meta?.total || 0;

                // 3. Ambil semua data dengan per_page = total
                const [productResponse, eventResponse] = await Promise.all([
                    productService.getProducts(1, totalProducts),
                    eventService.getEvents(1, totalEvents),
                ]);

                // 4. Simpan ke state
                setFilterOptions({
                    products: productResponse.data || [],
                    events: eventResponse.data || [],
                });

                setPromoProducts(transformed)
                setPaginationMeta(response.meta)
                setCurrentPage(response.meta.current_page)
                setTotalPages(response.meta.last_page)
                setTotalItems(response.meta.total)
                setItemsPerPage(response.meta.per_page)
            }
        } catch (err) {
            setError(err.message || "Gagal memuat PromoProduct")
            showError("Gagal Memuat PromoProduct", err.message || "Terjadi kesalahan")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPromoProducts(currentPage, itemsPerPage, searchTerm, {
            product_id: filterProduct,
            event_id: filterEvent,
            is_active: filterStatus
        })
    }, [currentPage, filterEvent, filterProduct, filterStatus, itemsPerPage, searchTerm])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1)
            fetchPromoProducts(1, itemsPerPage, searchTerm, { is_active: filterStatus })
        }, 400)
        return () => clearTimeout(timeoutId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStatus, searchTerm])

    const handleEdit = (category) => {
        setSelectedPromoProducts(category)
        setIsModalOpen(true)
    }

    const handleAdd = () => {
        setSelectedPromoProducts(null)
        setIsModalOpen(true)
    }

    const handleRefresh = () => {
        promoProductService.clearPromoProductCache();
        fetchPromoProducts(currentPage, itemsPerPage, searchTerm, { is_active: filterStatus })
    }

    const handleSave = async (categoryData) => {
        try {
            if (selectedPromoProducts) {
                console.log("kategori data", categoryData);

                await promoProductService.updatePromoProduct(selectedPromoProducts.id, categoryData)
            } else {
                console.log("product data", categoryData);

                await promoProductService.createPromoProduct(categoryData)
            }

            setIsModalOpen(false)
            // Refresh the current page
            promoProductService.clearPromoProductCache();
            fetchPromoProducts(currentPage, itemsPerPage, searchTerm, { is_active: filterStatus })
        } catch (err) {
            setError(err.message || "Failed to save kategori. Please try again.")
            const resData = error?.response?.data
            const errorMsg = resData?.message || "Terjadi kesalahan saat menyimpan data Produk Promo"

            if (resData?.error) {
                // Gabungkan semua pesan error jadi satu string
                const validationMessages = Object.entries(resData.error)
                    .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                    .join("\n")

                showError(errorMsg, validationMessages)
            } else {
                showError("Gagal Menyimpan data Produk Promo", error.message || errorMsg)
            }
            console.error("Error saving data kategori:", err)
            throw err // Re-throw to let modal handle it
        }
    }

    const handleDelete = async (id, productName, promoName) => {
        try {
            const result = await showConfirmation(
                "Hapus Produk Promo?",
                `Apakah Anda yakin ingin menghapus produk "${productName}" dari promo "${promoName}"? Tindakan ini tidak dapat dibatalkan.`,
                "Ya, Hapus!",
            )

            if (result.isConfirmed) {
                showLoading("Menghapus Produk Promo...")
                await promoProductService.deletePromoProduct(id)
                closeLoading()

                showSuccess("Produk Promo Berhasil Dihapus!", "Produk Promo telah dihapus dari sistem")

                // Refresh the current page
                promoProductService.clearPromoProductCache();
                fetchPromoProducts(currentPage, itemsPerPage, searchTerm, { is_active: filterStatus })
            }
        } catch (err) {
            closeLoading()
            setError(err.message || "Failed to delete kategori. Please try again.")
            showError("Gagal Menghapus Produk Promo", err.message || "Terjadi kesalahan saat menghapus Produk Promo")
            console.error("Error deleting kategori:", err)
        }
    }

    const handlePerPageChange = (newPerPage) => {
        setItemsPerPage(newPerPage)
        setCurrentPage(1) // Reset to first page
    }

    const handleFilterChange = (filterType, value) => {
        setCurrentPage(1) // Reset to first page when filtering
        switch (filterType) {
            case "product":
                setFilterProduct(value)
                break
            case "event":
                setFilterEvent(value)
                break
            case "status":
                setFilterStatus(value)
                break
            default:
                break
        }
    }

    const handlePageChange = (page) => setCurrentPage(page)

    const clearFilters = () => {
        setSearchTerm("")
        // setFilterBrand("")
        // setFilterProduk Promo("")
        // setFilterPromoProducts("")
        setFilterStatus("")
        setCurrentPage(1)
    }

    const isPromoActive = (endDate) => {
        return new Date(endDate) >= new Date()
    }

    if (loading && promoProducts.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Manajemen Produk Promo</h2>
                        <p className="text-gray-600 mt-1">Kelola semua produk Produk Promo dalam satu tempat</p>
                    </div>
                </div>
                <LoadingSpinner text="Memuat produk promo..." />
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
                        <h2 className="text-3xl font-bold text-gray-900">Manajemen Produk Promo</h2>
                        <p className="text-gray-600 mt-1">Kelola data Produk Promo yang terdaftar</p>
                        {paginationMeta.total && (
                            <p className="text-sm text-gray-500 mt-1">
                                Total: {paginationMeta.total} Produk Promo | Halaman {paginationMeta.current_page} dari{" "}
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
                            Tambah Promo
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
                        <h3 className="font-semibold text-gray-900">Filter</h3>
                        <button onClick={clearFilters} className="ml-auto text-sm text-blue-600 hover:text-blue-800">
                            Clear Filters
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cari nama Produk Promo..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div> */}
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
                            value={filterProduct}
                            onChange={(e) => handleFilterChange("product", e.target.value)}
                        >
                            <option value="">Semua Produk</option>
                            {filterOptions.products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
                            value={filterEvent}
                            onChange={(e) => handleFilterChange("event", e.target.value)}
                        >
                            <option value="">Semua Event</option>
                            {filterOptions.events.map((event) => (
                                <option key={event.id} value={event.id}>
                                    {event.name}
                                </option>
                            ))}
                        </select>

                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg admin-input-focus"
                            value={filterStatus}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
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

                {/* Promo Products Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden relative">
                    {loading && promoProducts.length > 0 && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                            <LoadingSpinner size="sm" text="Memuat..." />
                        </div>
                    )}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Promo & Produk
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Harga
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Diskon
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Periode
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {promoProducts.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <Search className="w-12 h-12 text-gray-300 mb-4" />
                                                <p className="text-lg font-medium">Tidak ada produk promo ditemukan</p>
                                                <p className="text-sm">Coba ubah filter atau kata kunci pencarian</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (promoProducts.map((promo) => (
                                    <tr key={promo.id} className="admin-table-row">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img
                                                    className="h-12 w-12 rounded-lg object-cover shadow-sm"
                                                    src={promo.event?.photo || "/placeholder.svg"} // pakai foto dari event
                                                    alt={promo.product?.name ?? "Produk"}
                                                />
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{promo.event?.name}</div>
                                                    <div className="text-sm text-gray-500">{promo.product?.name}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                <div className="line-through text-gray-500">
                                                    Rp {Number(promo.product?.price).toLocaleString("id-ID")}
                                                </div>
                                                <div className="font-semibold text-red-600">
                                                    Rp {Number(promo.promo_price).toLocaleString("id-ID")}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="text-sm font-semibold text-red-600">
                                                    {Math.round(
                                                        ((Number(promo.product?.price) - Number(promo.promo_price)) / Number(promo.product?.price)) * 100
                                                    )}%
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    {new Date(promo.event?.start_date).toLocaleDateString("id-ID")}
                                                </div>
                                                <div className="text-gray-500">
                                                    s/d {new Date(promo.event?.end_date).toLocaleDateString("id-ID")}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`admin-status-badge ${isPromoActive(promo.event.end_date) ? "bg-[#d1fae5] text-[#065f46]" : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {isPromoActive(promo.event.end_date) ? "Aktif" : "Berakhir"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(promo)}
                                                    className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(promo.id, promo.product.name, promo.event.name)}
                                                    className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )))}

                            </tbody>
                        </table>
                    </div>
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
            <PromoProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                promo={selectedPromoProducts}
                products={filterOptions.products}
                events={filterOptions.events}
            />
        </div>
    )
}

export default AdminPromoProducts
