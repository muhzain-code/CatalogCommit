/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import FlashSaleItem from "../common/components/FlashSaleItem";
import RedTitle from "../common/components/RedTitle";
import ViewAll from "../common/components/ViewAll";
import { Grid } from "@mui/material";
import { productService, transformProductData } from "../../Services/productService";
import Loader from "../common/components/Loader";

const RelatedItems = ({ categoryId, umkmId, onTotal }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      // Kalau dua-duanya kosong, skip
      if (!categoryId && !umkmId) return;

      try {
        setLoading(true);

        const filter = {};
        let limit = 8;

        if (categoryId) {
          filter.category_id = String(categoryId);
        }

        if (umkmId) {
          filter.umkm_id = String(umkmId);
          limit = 1000; // cukup besar untuk ambil semua
        }

        const response = await productService.getProducts(
          1,         // page
          limit,     // limit, tergantung case
          "",        // search query
          filter     // filter dinamis
        );

        const transformed = response.data.map(transformProductData);

        // Untuk category, tetap limit ke 8
        const filtered = categoryId
          ? transformed.filter(p => p.id !== categoryId).slice(0, 8)
          : transformed;

        setRelatedProducts(filtered);
        if (onTotal) {
          onTotal(filtered.length);
        }
      } catch (err) {
        setError("Gagal memuat produk terkait");
        console.error("Error fetching related products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categoryId, umkmId, onTotal]);


  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto md:mx-2 lg:px-9 md:px-0">
        <RedTitle title={"Produk Terkait"} />
        <div className="relative mt-10 flex flex-row gap-2 md:gap-10 transition-transform duration-300 transform lg:px-32 md:px-0">
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            {relatedProducts.map((item, index) => (
              <Grid item key={item.id} xs={6} sm={4} md={3} lg={3}>
                <FlashSaleItem
                  item={item}
                  index={index}
                  totalItems={relatedProducts.length}
                />
              </Grid>
            ))}
            {loading &&
              Array.from({ length: 8 }).map((_, index) => (
                <Grid item key={`loader-${index}`}>
                  <Loader />
                </Grid>
              ))}
          </Grid>
        </div>
      </div>
      {relatedProducts.length > 0 && (
        <div className="mt-8 flex justify-center">
          <ViewAll name={"Liat Semua Produk"} />
        </div>
      )}
    </>
  );
};

export default RelatedItems;
