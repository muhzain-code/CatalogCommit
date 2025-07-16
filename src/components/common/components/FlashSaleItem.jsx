/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import WishlistIcon from "./WishlistIcon";
// import RatingComp from "./Rating";

const FlashSaleItem = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Hitung diskon jika ada promo
  const originalPrice = parseFloat(item.price);
  const promoPrice = item.promo ? parseFloat(item.promo.promo_price) : null;
  const discountPercentage = promoPrice
    ? Math.round(((originalPrice - promoPrice) / originalPrice) * 100)
    : null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number.parseFloat(price))
  }
  // Format harga
  const formattedOriginalPrice = formatPrice(originalPrice);
  const formattedPromoPrice = promoPrice ? formatPrice(promoPrice) : null;

  // Render badge status
  const renderStatusBadge = () => {
    if (item.status === "pre_order") {
      return (
        <div className="absolute top-10 left-0 bg-blue-500 text-white py-1 px-3 m-2 rounded">
          Pre-order
        </div>
      );
    }
    if (item.status === "inactive") {
      return (
        <div className="absolute top-10 left-0 bg-gray-500 text-white py-1 px-3 m-2 rounded">
          Stok Kosong
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative mx-2">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative rounded flex items-center justify-center bg-zinc-100 w-[270px] h-80 md:h-60 transform transition-transform duration-300 hover:scale-105 focus:outline-none hover:-translate-y-2 overflow-hidden"
      >
        {discountPercentage && (
          <div className="absolute top-0 left-0 bg-red-500 text-white py-1 px-3 m-2 rounded">
            -{discountPercentage}%
          </div>
        )}

        {renderStatusBadge()}

        <Link to={`/allProducts/${item.id}`}>
          <img
            loading="lazy"
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300"
          />
        </Link>

        <WishlistIcon selectedProduct={item} style="absolute top-3 right-3" />
      </div>
      <div className="flex md:items-start items-center flex-col">
        <h3 className="text-lg font-base mt-4 text-center line-clamp-2 h-8">
          {item.name}
        </h3>
        <p className="text-white bg-red-400 px-2 py-1 rounded-md text-xs font-semibold mt-2">
          {item.category}
        </p>
        <h2 className="text-red-500 text-md font-bold">
          {promoPrice ? `${formattedPromoPrice}` : `${formattedOriginalPrice}`}
          {promoPrice && (
            <span className="ml-2 text-gray-500 text-sm font-semibold line-through">
              {formattedOriginalPrice}
            </span>
          )}
        </h2>
      </div>
    </div>
  );
};

FlashSaleItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    photo: PropTypes.shape({
      file_path: PropTypes.string.isRequired,
    }).isRequired,
    umkm: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    promo: PropTypes.shape({
      promo_price: PropTypes.string,
    }),
  }).isRequired,
};

export default FlashSaleItem;