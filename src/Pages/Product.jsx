import { useEffect, useState } from "react";
import RelatedItems from "../components/Product/RelatedItems";
import GaleriProduct from "../components/Product/Galeri";
import ActiveLastBreadcrumb from "../components/common/components/Link";
// import RedButton from "../components/common/components/RedButton";
import WishlistIcon from "../components/common/components/WishlistIcon";
import { Link, useParams } from "react-router-dom";
import { productService } from "../Services/productService";
import FormBuy from "../components/Product/FormBuy";
import NotFound from "./NotFound";
import Loading from "../components/common/components/Loading";

const Product = () => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let { productId } = useParams();

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const response = await productService.getProduct(productId);
        setProductData(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setProductData(null); // biar trigger NotFound
        } else {
          setError(err.message); // misalnya koneksi gagal atau 500 beneran
        }
      } finally {
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
  console.log("photos", productData?.photos);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loading />
        </div>
      </div>
    )
  }
  if (!productId || (!loading && !productData)) {
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
    <>
      <div className="flex flex-col px-4 sm:px-6 md:px-20 lg:px-32 mt-32 sm:mt-40 items-center overflow-x-hidden w-full">
        <div className="mx-auto flex flex-col gap-10 w-full max-w-7xl">
          <ActiveLastBreadcrumb
            path={`${productData.category.name}/${productData.name}`}
          />

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 w-full">
            {/* Galeri Produk */}
            <div className="flex flex-col-reverse lg:flex-row gap-6 w-full">
              <div className="w-full h-auto max-w-full lg:max-w-[500px]">
                <GaleriProduct
                  gallery={productData.photos}
                  key={productData.id}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Info Produk */}
            <div className="flex flex-col gap-6 w-full">
              <div className="flex flex-col gap-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                  {productData.name}
                </h2>

                {/* Info UMKM */}
                <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
                  <span className="text-gray-600">Dijual oleh:</span>
                  <Link
                    to={`/umkm/${productData.umkm.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {productData.umkm.name}
                  </Link>
                </div>

                <div className="flex flex-wrap gap-4 items-center text-base sm:text-lg md:text-xl">
                  <p className="text-gray-800 font-inter">
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

                <p className="text-gray-800 text-xs sm:text-sm w-full max-w-prose">
                  {productData.description}
                </p>
              </div>

              <hr className="border-gray-300" />

              <span className="font-medium text-sm sm:text-base">
                Dapatkan Harga Spesial Dengan Memesan Melalui WhatsApp
              </span>

              <div className="font-inter text-base sm:text-lg flex gap-3 sm:gap-4 items-center flex-wrap">
                <FormBuy productId={productId} applicationId="01" />
                <WishlistIcon selectedProduct={productData} />
              </div>

              <hr className="border-gray-300" />

              {/* Marketplace */}
              {productData.marketplaces?.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="font-inter text-base sm:text-lg font-semibold">
                    Tersedia Juga Di:
                  </h3>

                  {productData.marketplaces.map((marketplace) => (
                    <a
                      key={marketplace.id}
                      href={marketplace.marketplace_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded border border-gray-300"
                    >
                      <span className="font-medium">{marketplace.name}</span>
                      <span className="text-red-600 font-semibold">
                        {formatRupiah(marketplace.price)}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>


        </div>
      </div>
      <br />
      <hr className="border-gray-300" />
      <br />
      <RelatedItems categoryId={productData.category_id} productId={productData.id} />
    </>

  );
};

export default Product;