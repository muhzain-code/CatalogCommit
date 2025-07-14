import { useEffect, useState } from "react";
// import RelatedItems from "../components/Product/RelatedItems";
import GaleriProduct from "../components/Product/Galeri";
import ActiveLastBreadcrumb from "../components/common/components/Link";
import RedButton from "../components/common/components/RedButton";
import WishlistIcon from "../components/common/components/WishlistIcon";
import i18n from "../components/common/components/LangConfig";
import { Link, useParams } from "react-router-dom";
import { productService } from "../Services/productService";
import NotFound from "./NotFound";

const Product = () => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let { productId } = useParams();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await productService.getProduct(productId);
        setProductData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  // Format harga ke Rupiah
  const formatRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data Produk...</p>
        </div>
      </div>
    )
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

  if (!productData) return <NotFound />;

  return (
    <>
      <div className="flex flex-col mx-4 md:mx-32 mt-48">
        <div className="mx-auto flex flex-col gap-10">
          <ActiveLastBreadcrumb
            path={`${productData.category.name}/${productData.name}`}
          />
          <div className="flex flex-col md:flex-row gap-16">
            {/* Bagian Galeri Produk */}
            <div className="flex flex-col-reverse md:flex-row gap-8">
              <div className="relative w-full rounded md:px-8 md:h-[600px] md:w-[500px]">
                <GaleriProduct gallery={productData.photos} className="w-full h-full" />
              </div>
            </div>

            {/* Bagian Info Produk */}
            <div className="flex gap-5 flex-col">
              <div className="flex gap-4 flex-col">
                <h2 className="text-xl md:text-2xl font-bold ">
                  {productData.name}
                </h2>

                {/* Info UMKM dengan link */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Dijual oleh:</span>
                  <Link
                    to={`/umkm/${productData.umkm.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {productData.umkm.name}
                  </Link>
                </div>

                <div className="flex gap-10 items-center">
                  <p className="text-gray-800 text-xl md:text-2xl font-inter">
                    {formatRupiah(productData.promo?.promo_price ?? productData.price)}
                  </p>

                  <span
                    className={`px-3 py-1 rounded-full text-sm capitalize ${productData.status === 'pre_order'
                        ? 'bg-yellow-100 text-yellow-800'
                        : productData.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {productData.status === 'pre_order'
                      ? 'Pre-Order'
                      : productData.status === 'available'
                        ? 'Tersedia'
                        : 'Stok Kosong'}
                  </span>
                </div>

                <p className="text-gray-800 w-full md:w-[373px] text-xs md:text-sm">
                  {productData.description}
                </p>
              </div>

              <hr className="mx-30 border-gray-300" />

              <span className="font-medium">Dapatkan Harga Spesial Dengan Memesan Melalui WhatsApp</span>
              <div className="font-inter text-xl flex gap-4 items-center">
                <a href={productData.umkm.wa_link} target="_blank" rel="noopener noreferrer">
                  <RedButton name={"Beli Sekarang"} />
                </a>

                <WishlistIcon selectedProduct={productData} />
              </div>
              <hr className="mx-30 border-gray-300" />

              {/* Tombol Marketplace */}
              {productData.marketplaces?.length > 0 && (
                <>
                  <div className="flex flex-col gap-3">
                    <h3 className="font-inter text-lg font-semibold">Tersedia Juga Di:</h3>

                    {productData.marketplaces.map((marketplace) => (
                      <a
                        key={marketplace.id}
                        href={marketplace.marketplace_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 p-3 rounded border border-gray-300"
                      >
                        <span className="font-medium">{marketplace.name}</span>
                        <span className="text-red-600 font-semibold">
                          {formatRupiah(marketplace.price)}
                        </span>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <hr className="mx-30 border-gray-300" />
          {/* <RelatedItems categoryId={productData.category_id} /> */}
        </div>
      </div>
    </>
  );
};

export default Product;