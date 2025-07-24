import { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import FlashSaleItem from "../components/common/components/FlashSaleItem";
// import i18n from "../components/common/components/LangConfig";
import RedButton from "../components/common/components/RedButton";
import WhiteButton from "../components/common/components/WhiteButton";
import Loader from "../components/common/components/Loader";
import { productService, transformProductData } from "../Services/productService";

const AllProducts = () => {
  const PER_PAGE = 25;
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [error, setError] = useState(null);

  const fetchProducts = async (pageToFetch) => {
    if (loading) return; 
    try {
      setLoading(true);
      const response = await productService.getProducts(pageToFetch, PER_PAGE);

      const transformed = response.data.map(product => {
        const p = transformProductData(product);
        return {
          ...p,
          stars: p.stars || 0,
          rates: p.rates || 0,
        };
      });

      setProducts(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newProducts = transformed.filter(p => !existingIds.has(p.id));
        return [...prev, ...newProducts];
      });
      setLastPage(response.meta.last_page);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1); // initial fetch
  }, []);

  useEffect(() => {
    const ids = products.map(p => p.id);
    const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);
    if (duplicates.length > 0) {
      console.warn("Duplicate product IDs:", duplicates);
    }
  }, [products]);


  const handleLoadMore = () => {
    if (!loading && page < lastPage) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };


  if (error) {
    return (
      <div className="mt-40 flex flex-col gap-5">
        <Typography variant="h3" align="center" gutterBottom>
          {"Jelahjahi Berbagai Produk"}
        </Typography>
        <div className="text-center text-red-500">{error}</div>
        <div className="mt-6 flex justify-around items-center md:mx-12">
          <Link to="..">
            <WhiteButton name={"Kembali Ke Beranda"} />
          </Link>
          <Link to="/category">
            <RedButton name={"Jelajahi Berdasarkan Kategori"} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-40 flex flex-col gap-5 px-2 md:px-24">
      <Typography variant="h3" align="center" gutterBottom>
        {"Jelajahi Berbagai Produk"}
      </Typography>
      <div className="mx-auto">
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {products.map((item, index) => (
            <Grid item key={`${item.id}-${index}`} xs={6} sm={4} md={3} lg={3}>
              <FlashSaleItem
                item={item}
                totalItems={products.length}
              />
            </Grid>
          ))}
          {loading &&
            Array.from({ length: PER_PAGE }).map((_, index) => (
              <Grid item key={`loader-${index}`}>
                <Loader />
              </Grid>
            ))}
        </Grid>
      </div>

      {page < lastPage && !loading && (
        <button
          onClick={handleLoadMore}
          type="button"
          className="md:mx-auto text-center rounded-md px-5 py-3 mt-8 shadow hover:shadow-md active:shadow-inner transition
          hover:bg-gray-50 border text-[#696A75] hover:text-[#696A75] border-[#696A75] hover:border-[#696A75]
          hover:scale-105 hover:-translate-y-2 transform duration-300 ease-in-out"
        >
          {"Muat Lebih Banyak.."}
        </button>
      )}

      <div className="mt-6 flex justify-around items-center md:mx-12">
        <Link to="..">
          <WhiteButton name={"Kembali Ke Beranda"} />
        </Link>
        <Link to="/category">
          <RedButton name={"Jelajahi Berdasarkan Kategori"} />
        </Link>
      </div>
    </div>
  );
};

export default AllProducts;
