import { Heart } from "lucide-react";

const ProductCard = ({ produk }) => {
  if (!produk) return null;

  const { nama, foto, harga, diskon, kategori } = produk;
  const showDiscount = diskon && diskon < harga;

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={foto}
          alt={nama || "Gambar produk"}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {kategori?.nama && (
          <div className="absolute bottom-2 left-2 bg-red-600 text-white px-2 py-[2px] rounded text-[10px] font-semibold uppercase shadow-md">
            {kategori.nama}
          </div>
        )}

        {showDiscount && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
            -{Math.round(((harga - diskon) / harga) * 100)}%
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col justify-between flex-grow">
        <h3
          className="font-semibold text-gray-900 text-sm line-clamp-2 mb-3"
          title={nama}
        >
          {nama}
        </h3>

        <div className="flex items-end justify-between mt-auto">
          <div>
            {showDiscount ? (
              <>
                <span className="text-red-600 font-bold text-base">{diskon}</span>
                <span className="text-gray-500 text-sm line-through ml-2">
                  {harga}
                </span>
              </>
            ) : (
              <span className="text-gray-900 font-bold text-base">{harga}</span>
            )}
          </div>

          <button
            className="bg-gray-100 hover:bg-gray-200 text-red-500 rounded-full p-2"
            aria-label="Tambah ke favorit"
          >
            <Heart className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
