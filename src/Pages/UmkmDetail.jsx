"use client"
import { useState, useEffect } from "react";
import { MapPin, Share2, Phone, Mail, User, Calendar } from "lucide-react"
import { useParams } from "react-router-dom"
import { umkmService } from "../Services/umkmService";
// import ProductCard from "../components/common/components/ProductCard";
import RelatedItems from "../components/Product/RelatedItems";
import NotFound from "./NotFound";

const UMKMDetail = () => {
  let { umkmId } = useParams();
  const [umkmData, setUmkmData] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUmkmData = async () => {
      try {
        const response = await umkmService.getUMKM(umkmId);
        setUmkmData(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setUmkmData(null); // trigger NotFound
        } else {
          setError(err.message); // misalnya koneksi gagal atau 500
        }
      } finally {
        // Set loading to false after fetching data
        setLoading(false);
      }
    };

    fetchUmkmData();
  }, [umkmId]);

  console.log("UMKM Data:", umkmData);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-"; // Invalid date
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getGenderText = (gender) => {
    if (!gender) return "-";
    return gender.toLowerCase() === "l" ? "Laki-laki" : "Perempuan";
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data UMKM...</p>
        </div>
      </div>
    )
  }

  if (!umkmData || (!loading && !umkmData)) {
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


  return (
    <div className="min-h-screen bg-gray-50 mt-32">
      {/* Breadcrumb */}
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-white">
        <button className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar UMKM
        </button>
      </div> */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            {/* Left Side - UMKM Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={umkmData.photo_profile_url || umkmData.photo_profile}
                  alt={umkmData.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold ${umkmData.is_active ? "bg-green-600 text-white" : "bg-gray-600 text-white"
                    }`}
                >
                  {umkmData.is_active ? "Aktif" : "Tidak Aktif"}
                </div>
              </div>

              {/* Additional Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600">Pemilik</p>
                      <p className="font-medium text-gray-900">{umkmData.owner_name}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600">Bergabung</p>
                      <p className="font-medium text-gray-900">{formatDate(umkmData.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - UMKM Details */}
            <div className="space-y-6">
              {/* UMKM Name and Actions */}
              <div>
                <div className="flex items-start justify-between">
                  <h1 className="text-3xl font-bold text-gray-900">{umkmData.name}</h1>
                  <div className="flex space-x-2">
                    {/* <button
                      className={`p-2 rounded-full border ${isLiked ? "bg-red-100 border-red-300" : "border-gray-300"} hover:bg-gray-100`}
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? "fill-red-600 text-red-600" : "text-gray-600"}`} />
                    </button> */}
                    <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* <div className="flex items-center space-x-2 mt-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <StarHalf className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <span className="text-sm text-gray-600">(Belum ada ulasan)</span>
                </div> */}
              </div>

              {/* Description */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Deskripsi</h3>
                <p className="text-gray-700 leading-relaxed">{umkmData.description}</p>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-2 bg-gray-50 p-4 rounded-lg">
                <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-medium">Alamat:</p>
                  <p className="text-gray-600 whitespace-pre-line">{umkmData.address}</p>
                  {/* <button className="mt-2 text-red-600 font-medium text-sm flex items-center">Lihat di peta</button> */}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
                  <div className="text-sm text-gray-600">Produk</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${umkmData.is_active ? "text-green-600" : "text-red-600"}`}>
                    {umkmData.is_active ? "Aktif" : "Nonaktif"}
                  </div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="space-y-3">
                {/* <a
                  href={umkmData.wa_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors text-center"
                >
                  Hubungi via WhatsApp
                </a> */}
                {/* Owner Information */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-900 mb-2">Informasi Pemilik</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-blue-700 font-medium">Nama:</span> {umkmData.owner_name}
                    </p>
                    <p>
                      <span className="text-blue-700 font-medium">Jenis Kelamin:</span> {getGenderText(umkmData.gender)}
                    </p>
                    <p>
                      <span className="text-blue-700 font-medium">NIK:</span> {umkmData.nik}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h3 className="font-medium text-gray-900">Informasi Kontak</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{umkmData.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{umkmData.email}</span>
                    </div>
                    {/* <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Tidak tersedia</span>
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Last Updated */}
              <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded-lg">
                <p>Terakhir diperbarui: {formatDate(umkmData.updated_at)}</p>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          {/* <div className="mt-16">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informasi Tambahan</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h3 className="font-semibold text-gray-900">Status Verifikasi</h3>
                    <p className="text-gray-600">
                      {umkmData.is_active ? "UMKM ini telah terverifikasi dan aktif" : "UMKM ini belum aktif"}
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900">Kontak Darurat</h3>
                    <p className="text-gray-600">Hubungi melalui WhatsApp untuk respon yang lebih cepat</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-gray-900">Jam Operasional</h3>
                    <p className="text-gray-600">Informasi jam operasional belum tersedia</p>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="font-semibold text-gray-900">Metode Pembayaran</h3>
                    <p className="text-gray-600">Hubungi langsung untuk informasi pembayaran</p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        {/* Products Section */}
        <div className="mt-16">
          <RelatedItems umkmId={umkmData.id} onTotal={(total) => setTotalProducts(total)} />
          {/* <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Produk Unggulan</h2>
            <button className="text-red-600 font-medium">Lihat Semua Produk</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.produk.map((produk) => (
              <div className="h-full" key={produk.id}>
                <ProductCard produk={produk} />
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default UMKMDetail;