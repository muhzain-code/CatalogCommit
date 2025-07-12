"use client"
import { useState } from "react";
import { ChevronLeft, MapPin, Heart, Share2, Phone, Mail, Globe, Star, StarHalf, ShoppingBag } from "lucide-react";
import ProductCard from "../components/common/components/ProductCard";

const UMKMDetail = () => {
  const [isLiked, setIsLiked] = useState(false);
  
  const data = {
    umkm: {
      id: 9,
      nama_umkm: "Fashion Muslim Zhafira",
      foto_profile: "https://images.pexels.com/photos/4492138/pexels-photo-4492138.jpeg",
      alamat_lengkap: "6098 Muriel Summit, Wehnermouth, NM 56281-3456",
      phone: "089351956795",
      wa_link: "https://wa.me/089351956795",
      deskripsi: "Fashion Muslim Zhafira menyediakan berbagai produk fashion muslimah berkualitas tinggi dengan desain modern dan nyaman dipakai. Kami berkomitmen untuk memberikan pengalaman berbelanja terbaik dengan produk yang memenuhi standar kualitas tertinggi."
    },
    produk: [
      {
        id: 1,
        nama: "Gamis Modern",
        harga: "Rp 250.000",
        diskon: "Rp 200.000",
        foto: "https://images.pexels.com/photos/4492138/pexels-photo-4492138.jpeg",
        rating: 4.5,
        kategori: {
          id: 5,
          nama: "Pilih Lokal"
        }
      },
      {
        id: 2,
        nama: "Kerudung Segi Empat",
        harga: "Rp 120.000",
        diskon: "Rp 95.000",
        foto: "https://images.pexels.com/photos/1030946/pexels-photo-1030946.jpeg",
        rating: 4.2
      },
      {
        id: 3,
        nama: "Tunik Katun",
        harga: "Rp 180.000",
        diskon: "Rp 150.000",
        foto: "https://images.pexels.com/photos/9558699/pexels-photo-9558699.jpeg",
        rating: 3.4
      },
      {
        id: 4,
        nama: "Setelan Muslimah",
        harga: "Rp 350.000",
        diskon: "Rp 299.000",
        foto: "https://images.pexels.com/photos/4050388/pexels-photo-4050388.jpeg",
        rating: 4.8
      }
    ],
    promo: {
      judul: "Diskon 50% untuk Semua Baju Renang dan Pengiriman Cepat Gratis",
      subjudul: "Beli Sekarang",
      kode: "GRATISONGKIR",
      berlaku: "30 Maret 2024"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-32">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-white">
        <button className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar UMKM
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Left Side - UMKM Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg">
              <img 
                src={data.umkm.foto_profile}
                alt={data.umkm.nama_umkm}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                Terverifikasi
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {data.produk.slice(0, 4).map((produk) => (
                <div key={produk.id} className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-lg border-2 border-transparent hover:border-red-500 cursor-pointer transition-all overflow-hidden">
                    <img 
                      src={produk.foto}
                      alt={produk.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - UMKM Details */}
          <div className="space-y-6">
            {/* UMKM Name and Rating */}
            <div>
              <div className="flex items-start justify-between">
                <h1 className="text-3xl font-bold text-gray-900">{data.umkm.nama_umkm}</h1>
                <div className="flex space-x-2">
                  <button 
                    className={`p-2 rounded-full border ${isLiked ? 'bg-red-100 border-red-300' : 'border-gray-300'} hover:bg-gray-100`}
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart 
                      className={`w-5 h-5 ${isLiked ? 'fill-red-600 text-red-600' : 'text-gray-600'}`} 
                    />
                  </button>
                  <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <StarHalf className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                <span className="text-sm text-gray-600">(24 Ulasan)</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start space-x-2 bg-gray-50 p-4 rounded-lg">
              <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-900 font-medium">Alamat:</p>
                <p className="text-gray-600">{data.umkm.alamat_lengkap}</p>
                <button className="mt-2 text-red-600 font-medium text-sm flex items-center">
                  Lihat di peta
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                {data.umkm.deskripsi}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-200">
              {/* <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{data.brand.length}</div>
                <div className="text-sm text-gray-600">Brand</div>
              </div> */}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{data.produk.length}</div>
                <div className="text-sm text-gray-600">Produk</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.5</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="space-y-3">
              <a 
                href={data.umkm.wa_link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors text-center"
              >
                Hubungi via WhatsApp
              </a>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-medium text-gray-900">Informasi Kontak</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{data.umkm.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">contact@fashionzhafira.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">www.fashionzhafira.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Produk Unggulan</h2>
            <button className="text-red-600 font-medium">Lihat Semua Produk</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.produk.map((produk) => (
              <div className="h-full" key={produk.id}>
                <ProductCard produk={produk} />
              </div>
            ))} 
          </div>
        </div>

        {/* Brands Section */}
        {/* <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Brand yang Tersedia</h2>
            <button className="text-red-600 font-medium">Lihat Semua Brand</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.brand.map((brand) => (
              <div
                key={brand.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex items-center"
              >
                <img
                  src={brand.foto}
                  alt={brand.nama_brand}
                  className="w-16 h-16 rounded-lg object-contain mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{brand.nama_brand}</h3>
                  <p className="text-gray-600 text-sm mt-2 mb-4 line-clamp-2">{brand.deskripsi_brand}</p>
                  <button className="text-red-600 font-medium text-sm">
                    Lihat Produk Brand
                  </button>
                </div>
              </div>
            ))}
          </div> */}
        {/* </div> */}
      </div>
    </div>
  )
}

export default UMKMDetail;