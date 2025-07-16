import { useEffect, useState } from "react";
import FlashSaleItem from "../common/components/FlashSaleItem";
// import PropTypes from "prop-types";
import RedTitle from "../common/components/RedTitle";
import ViewAll from "../common/components/ViewAll";
import i18n from "../common/components/LangConfig";
import { Grid } from "@mui/material";
import { productService } from "../../Services/productService";
import { transformProductData } from "../../Services/productService";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Mengambil data produk dari API
        const response = await productService.getProducts(1, 8);
        
        // Transformasi data API ke format yang diharapkan FlashSaleItem
        const transformedProducts = response.data.map(product => 
          transformProductData(product)
        );
        
        setProducts(transformedProducts);
      } catch (err) {
        setError("Gagal memuat data produk");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  console.log("AllProducts:", products);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Memuat produk...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mx-2 xl:mx-0 my-12">
        <RedTitle title={"Produk"} />
        <div className="flex justify-between items-center md:mr-6 md:mb-4">
          <h2 className="text-xl md:text-3xl font-semibold">
            Jelajahi Produk Dari Berbagai UMKM
          </h2>
        </div>
        <div className="relative mt-10 flex flex-row gap-2 md:gap-12 transition-transform duration-300 transform">
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            {Array.isArray(products) && products.map((item, index) => (
              <Grid item key={item.id}>
                <FlashSaleItem
                  item={item}
                  index={index}
                  totalItems={products.length}
                />
              </Grid>
            ))}

          </Grid>
        </div>
      </div>
      <div className="flex justify-center">
        <ViewAll name={i18n.t("redButtons.viewAllProducts")} />
      </div>
    </>
  );
};

export default AllProducts;