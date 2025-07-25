import { useState, useEffect } from "react";
import { Calendar, Clock, Users, Tag, Sparkles } from "lucide-react";
import { eventService } from "../Services/eventService";
// import { fetchAllEventUmkm } from "../Services/eventUmkmService";
import { fetchAllPromoProduct } from "../Services/promoProductService";
import { Link, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import Loading from "../components/common/components/Loading";

const EventDetail = () => {
    const [eventData, setEventData] = useState(null);
    // const [eventUmkms, setEventUmkms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [eventPromos, setEventPromos] = useState([]);
    let { eventId } = useParams();


    useEffect(() => {
        const fetchEventData = async () => {
            try {
                // await new Promise((resolve) => setTimeout(resolve, 1000))
                const response = await eventService.getEvent(eventId)
                // const allEventUmkms = await fetchAllEventUmkm();
                // console.log("All Event UMKMs:", allEventUmkms);
                const allPromoProduct = await fetchAllPromoProduct();
                console.log("All Promo Products:", allPromoProduct);

                setEventData(response.data)

                // Filter UMKMs for this specific event
                // const filteredUmkms = allEventUmkms.filter((item) => item.event_id.id === Number(eventId))
                // setEventUmkms(filteredUmkms)
                // Update the fetchEventData function to include product promos
                // In the fetchEventData function, after filtering UMKMs, add:

                // Filter product promos for this specific event if it's a promo event
                if (response.data) {
                    const filteredPromos = allPromoProduct.filter(
                        (item) => item.event.id === Number(eventId),
                    )
                    setEventPromos(filteredPromos)
                }
            } catch (err) {
                if (err.response?.status === 404) {
                    setEventData(null); // <- ini kunci
                } else {
                    setError(err.message || "An error occurred");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchEventData()
    }, [eventId])
    console.log("Event Data:", eventData)
    // console.log("Event UMKMs:", eventUmkms)
    // console,log("alleventUmkms", allEventUmkms)
    console.log("Event Promos:", eventPromos)

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    //logic untuk event badge
    const getEventStatus = () => {
        if (!eventData) return "Unknown"

        const now = new Date()
        const startDate = new Date(eventData.start_date)
        const endDate = new Date(eventData.end_date)

        if (now < startDate) return "Akan Datang"
        if (now >= startDate && now <= endDate) return "Sedang Berlangsung"
        return "Selesai"
    }

    const getEventDuration = () => {
        if (!eventData) return "0 hari"

        const startDate = new Date(eventData.start_date)
        const endDate = new Date(eventData.end_date)
        const diffTime = Math.abs(endDate - startDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

        return `${diffDays} hari`
    }

    // Add these helper functions after getEventDuration function:

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Number.parseFloat(price))
    }

    const calculateDiscount = (originalPrice, promoPrice) => {
        const original = Number.parseFloat(originalPrice)
        const promo = Number.parseFloat(promoPrice)
        const discount = ((original - promo) / original) * 100
        return Math.round(discount)
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            available: { text: "Tersedia", color: "bg-green-100 text-green-800" },
            pre_order: { text: "Pre Order", color: "bg-yellow-100 text-yellow-800" },
            inactive: { text: "Tidak Aktif", color: "bg-red-100 text-red-800" },
        }
        return statusConfig[status] || { text: "Unknown", color: "bg-gray-100 text-gray-800" }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    {/* <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div> */}
                    <Loading />
                    {/* <p className="mt-4 text-gray-600">Memuat data event...</p> */}
                </div>
            </div>
        )
    }

    if (!eventId || (!loading && !eventData)) {
        return <NotFound />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg">Error: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        )
    }

    const eventStatus = getEventStatus()
    const eventDuration = getEventDuration()

    return (
        <div className="min-h-screen bg-white mt-32">
            {/* Breadcrumb */}
            {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-white">
                <button className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Kembali ke Beranda
                </button>
            </div> */}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                    {/* Left Side - Event Image */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative w-full max-w-full rounded-xl overflow-hidden shadow-lg h-60 sm:h-72 md:h-80 lg:h-96">
                            <img
                                src={eventData.photo || "/placeholder.svg"}
                                alt={eventData.name}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                            <div
                                className={`absolute top-2 right-2 sm:top-4 sm:right-4 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold 
                                            ${eventStatus === "Sedang Berlangsung"
                                        ? "bg-green-600 text-white"
                                        : eventStatus === "Akan Datang"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-600 text-white"
                                    }`}
                            >
                                {eventStatus}
                            </div>
                        </div>


                        {/* Event Type Cards */}
                        {/* <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm border">
                                <div className="flex items-center space-x-2">
                                    <Tag className="w-5 h-5 text-red-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Jenis Event</p>
                                        <p className="font-medium text-gray-900">
                                            {eventData.is_promo_event ? "Event Promo" : "Event Reguler"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border">
                                <div className="flex items-center space-x-2">
                                    <Building2 className="w-5 h-5 text-red-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Kategori</p>
                                        <p className="font-medium text-gray-900">{eventData.is_umkm_event ? "Event UMKM" : "Event Umum"}</p>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>

                    {/* Right Side - Event Details */}
                    <div className="space-y-6">
                        {/* Event Name and Actions */}
                        <div>
                            <div className="flex items-start justify-between">
                                <h1 className="text-3xl font-bold text-gray-900">{eventData.name}</h1>
                                <div className="flex space-x-2">
                                    {/* <button
                    className={`p-2 rounded-full border ${isLiked ? "bg-red-100 border-red-300" : "border-gray-300"} hover:bg-gray-100`}
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-red-600 text-red-600" : "text-gray-600"}`} />
                  </button> */}
                                    {/* <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
                                        <Share2 className="w-5 h-5 text-gray-600" />
                                    </button> */}
                                </div>
                            </div>

                            {/* <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(Event Populer)</span>
              </div> */}
                        </div>

                        {/* Description */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-2">Deskripsi Event</h3>
                            <p className="text-gray-700 leading-relaxed">{eventData.description}</p>
                        </div>

                        {/* Event Schedule */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h3 className="font-medium text-blue-900 mb-3">Jadwal Event</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    <span className="text-blue-700 font-medium">Mulai:</span>
                                    <span className="text-blue-900">{formatDateTime(eventData.start_date)}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    <span className="text-blue-700 font-medium">Selesai:</span>
                                    <span className="text-blue-900">{formatDateTime(eventData.end_date)}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    <span className="text-blue-700 font-medium">Durasi:</span>
                                    <span className="text-blue-900">{eventDuration}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{eventPromos.length}</div>
                                <div className="text-sm text-gray-600">Produk</div>
                            </div>
                            {/* <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{eventUmkms.length}</div>
                                <div className="text-sm text-gray-600">UMKM Peserta</div>
                            </div> */}
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${eventData.is_active ? "text-green-600" : "text-red-600"}`}>
                                    {eventData.is_active ? "Aktif" : "Nonaktif"}
                                </div>
                                <div className="text-sm text-gray-600">Status</div>
                            </div>
                        </div>

                        {/* Event Information */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <h3 className="font-medium text-gray-900">Informasi Event</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Dibuat:</span>
                                    <span className="text-gray-900">{formatDate(eventData.created_at)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Diperbarui:</span>
                                    <span className="text-gray-900">{formatDate(eventData.updated_at)}</span>
                                </div>
                                {/* <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Event UMKM:</span>
                                    <span className={`font-medium ${eventData.is_umkm_event ? "text-green-600" : "text-gray-600"}`}>
                                        {eventData.is_umkm_event ? "Ya" : "Tidak"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Event Promo:</span>
                                    <span className={`font-medium ${eventData.is_promo_event ? "text-green-600" : "text-gray-600"}`}>
                                        {eventData.is_promo_event ? "Ya" : "Tidak"}
                                    </span>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Participating UMKMs Section */}
                {/* <div className="mt-16"> */}
                    {/* <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">UMKM</h2>
                        <div className="flex items-center space-x-2">
                            <Users className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-600">{eventUmkms.length} UMKM terdaftar</span>
                        </div>
                    </div> */}

                    {/* {eventUmkms.length > 0 ? ( */}
                        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> */}
                            {/* {eventUmkms.map((item) => ( */}
                                {/* <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-red-200 transition-all duration-300 group/card cursor-pointer transform hover:-translate-y-1"> */}
                                    {/* Image Container */}
                                    {/* <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"> */}
                                        {/* <img
                                            loading="lazy"
                                            src={item.umkm_id.photo_profile_url}
                                            alt={item.umkm_id.name}
                                            className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.src = "/placeholder.svg?height=200&width=300"
                                            }}
                                        /> */}

                                        {/* Overlay Gradient */}
                                        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                                    </div> */}

                                    {/* Content */}
                                    {/* <div className="p-6">
                                        {/* UMKM Name */}
                                        {/* <h3 className="font-bold text-gray-900 text-lg mb-4 group-hover/card:text-red-600 transition-colors duration-200 line-clamp-1">
                                            {item.umkm_id.name}
                                        </h3> */}

                                        {/* Status & Registration Date */}
                                        {/* <div className="space-y-3 text-gray-600 mb-5">
                                            <div className="flex justify-between text-sm">
                                                <span>Status:</span>
                                                <span className={`font-medium ${item.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                                    {item.is_active ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Terdaftar:</span>
                                                <span>{formatDate(item.created_at)}</span>
                                            </div>
                                        </div> */}

                                        {/* Action Button */}
                                        {/* <Link to={`/umkm/${item.umkm_id.id}`}>
                                            <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                                                Lihat Detail
                                            </button>
                                        </Link>
                                    </div> */}

                                    {/* Hover Effect Sparkles */}
                                    {/* <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                                        <Sparkles className="absolute top-4 left-4 w-4 h-4 text-yellow-400 animate-pulse" />
                                        <Sparkles className="absolute top-8 right-8 w-3 h-3 text-blue-400 animate-pulse delay-100" />
                                        <Sparkles className="absolute bottom-8 left-8 w-3 h-3 text-purple-400 animate-pulse delay-200" />
                                    </div>
                                </div> */}
                            {/* ))} */}
                        {/* </div> */}
                    {/* ) : ( */}
                        {/* <div className="text-center py-12 bg-white rounded-lg border">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada UMKM Peserta</h3>
                            <p className="text-gray-600">Event ini belum memiliki UMKM yang terdaftar sebagai peserta.</p>
                        </div>
                    )}
                </div> */}

                {/* Product Promos Section - Only show for promo events */}
                {eventData && (
                    <div className="mt-16">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Produk Promo</h2>
                            <div className="flex items-center space-x-2">
                                <Tag className="w-5 h-5 text-gray-500" />
                                <span className="text-gray-600">{eventPromos.length} produk dalam promo</span>
                            </div>
                        </div>

                        {eventPromos.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {eventPromos.map((promo) => {
                                    const discount = calculateDiscount(promo.product.price, promo.promo_price)
                                    const statusBadge = getStatusBadge(promo.product.status)

                                    return (
                                        <div
                                            key={promo.id}
                                            className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden"
                                        >
                                            {/* Product Image Placeholder */}
                                            <div className="relative bg-gradient-to-br from-red-100 to-red-200 aspect-video">
                                                <img
                                                    loading="lazy"
                                                    src={promo.product.active_photos[0]?.file_path || `/placeholder.svg?height=200&width=300`}
                                                    alt={promo.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                {/* Discount Badge */}
                                                <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                    -{discount}%
                                                </div>
                                                {/* Status Badge */}
                                                <div
                                                    className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}
                                                >
                                                    {statusBadge.text}
                                                </div>
                                            </div>

                                            <div className="p-4">
                                                {/* Product Name */}
                                                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{promo.product.name}</h3>

                                                {/* Product Description */}
                                                <p className="text-xs truncate text-gray-600 mb-3 line-clamp-2">{promo.product.description}</p>

                                                {/* Price Section */}
                                                <div className="mb-4">
                                                    {/* Original Price (crossed out) */}
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className="text-sm text-gray-500 line-through">
                                                            {formatPrice(promo.product.price)}
                                                        </span>
                                                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                                                            Hemat {discount}%
                                                        </span>
                                                    </div>

                                                    {/* Promo Price (highlighted) */}
                                                    <div className="text-lg font-bold text-red-600">{formatPrice(promo.promo_price)}</div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="space-y-2">
                                                    <h3
                                                        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors text-center ${promo.product.status == "available"
                                                            ? " text-red-700"
                                                            : promo.product.status == "pre_order"
                                                                ? "text-yellow-700"
                                                                : " text-gray-600"
                                                            }`}
                                                    >
                                                        {promo.product.status == "available"
                                                            ? "Tersedia"
                                                            : promo.product.status == "pre_order"
                                                                ? "Pre Order"
                                                                : "Tidak Tersedia"}
                                                    </h3>
                                                    <Link to={`/product/${promo.product.id}`}>
                                                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                                                            Lihat Detail
                                                        </button>
                                                    </Link>
                                                </div>

                                                {/* Promo Status */}
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-gray-500">Status Promo:</span>
                                                        <span className={`font-medium ${promo.is_active ? "text-green-600" : "text-red-600"}`}>
                                                            {promo.is_active ? "Aktif" : "Nonaktif"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg border">
                                <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Produk Promo</h3>
                                <p className="text-gray-600">Event promo ini belum memiliki produk yang terdaftar.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div >
    )
}

export default EventDetail
