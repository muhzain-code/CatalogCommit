import { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import FlashSaleItem from "../components/common/components/FlashSaleItem";
import i18n from "../components/common/components/LangConfig";
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

      setProducts(prev => [...prev, ...transformed]);
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

  const handleLoadMore = () => {
    if (page < lastPage) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  if (error) {
    return (
      <div className="mt-40 flex flex-col gap-5">
        <Typography variant="h3" align="center" gutterBottom>
          {i18n.t("allProducts.title")}
        </Typography>
        <div className="text-center text-red-500">{error}</div>
        <div className="mt-6 flex justify-around items-center md:mx-12">
          <Link to="..">
            <WhiteButton name={i18n.t("whiteButtons.backToHomePage")} />
          </Link>
          <Link to="/category">
            <RedButton name={i18n.t("redButtons.exploreByCategory")} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-40 flex flex-col gap-5">
      <Typography variant="h3" align="center" gutterBottom>
        {i18n.t("allProducts.title")}
      </Typography>
      <div className="mx-auto">
        <Grid container spacing={6} justifyContent="center" alignItems="center">
          {products.map((item, index) => (
            <Grid item key={`${item.id}-${index}`}>
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
          {i18n.t("whiteButtons.loadMore")}
        </button>
      )}

      <div className="mt-6 flex justify-around items-center md:mx-12">
        <Link to="..">
          <WhiteButton name={i18n.t("whiteButtons.backToHomePage")} />
        </Link>
        <Link to="/category">
          <RedButton name={i18n.t("redButtons.exploreByCategory")} />
        </Link>
      </div>
    </div>
  );
};

export default AllProducts;
