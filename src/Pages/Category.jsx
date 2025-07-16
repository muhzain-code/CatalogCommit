import { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import FlashSaleItem from "../components/common/components/FlashSaleItem";
import i18n from "../components/common/components/LangConfig";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ViewAll from "../components/common/components/ViewAll";
import WhiteButton from "../components/common/components/WhiteButton";
import Loader from "../components/common/components/Loader";
import { productService, transformProductData } from "../Services/productService";
import { categoryService } from "../Services/categoryService";

const PER_PAGE = 25;

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories with caching
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        let kategoriData = [];
        const cachedRaw = sessionStorage.getItem("cachedCategories");
        const expired = !cachedRaw || (JSON.parse(cachedRaw).expiresAt < Date.now());

        if (!expired) {
          const cached = JSON.parse(cachedRaw);
          kategoriData = cached.data;
        } else {
          const response = await categoryService.getCategories();
          kategoriData = response.data.map(({ id, name }) => ({ id, name }));
          sessionStorage.setItem(
            "cachedCategories",
            JSON.stringify({
              data: kategoriData,
              expiresAt: Date.now() + 1000 * 60 * 10, // 10 menit
            })
          );
        }

        setCategories(kategoriData);
        // Set default selected category to first item
        if (kategoriData.length > 0) {
          setSelectedCategory(kategoriData[0]);
        }
        console.log("Fetched categories:", kategoriData);
        
      } catch (error) {
        console.error("Gagal fetch kategori:", error);
        setError("Gagal memuat kategori");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products based on selected category
  useEffect(() => {
    const fetchProducts = async () => {
      if (!filteredCategories) return;

      try {
        // Set loading states
        if (page === 1) {
          setLoadingProducts(true);
          setProducts([]); // Clear previous products immediately
        } else {
          setLoadingMore(true);
        }

        const response = await productService.getProducts(
          page, 
          PER_PAGE, 
          "", 
          { category_id: String(filteredCategories) }
        );

        const transformed = response.data.map((product) => {
          const p = transformProductData(product);
          return {
            ...p,
            stars: p.stars || 0,
            rates: p.rates || 0,
          };
        });

        if (page === 1) {
          setProducts(transformed);
        } else {
          setProducts((prev) => [...prev, ...transformed]);
        }
        setLastPage(response.meta.last_page);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Gagal memuat produk");
      } finally {
        setLoadingProducts(false);
        setLoadingMore(false);
      }
    };

    fetchProducts();
  }, [filteredCategories, page]);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setFilteredCategories(categoryId);
    setPage(1); // Reset to first page
  };

  const handleLoadMore = () => {
    if (page < lastPage) {
      setPage(page + 1);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto mt-40 flex flex-col gap-5">
        <Typography variant="h3" align="center" gutterBottom>
          {i18n.t("allProducts.byCategory")}
        </Typography>
        <div className="text-center text-red-500">{error}</div>
        <div className="mt-6 flex justify-center gap-5 md:gap-20 items-center md:mx-12">
          <Link to="..">
            <WhiteButton name={i18n.t("whiteButtons.backToHomePage")} />
          </Link>
          <ViewAll name={i18n.t("redButtons.viewAllProducts")} />
        </div>
      </div>
    );
  }

  if (loading && !selectedCategory) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto mt-40 flex flex-col gap-5">
      <Typography variant="h3" align="center" gutterBottom>
        {i18n.t("allProducts.byCategory")}
      </Typography>
      
      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* <h3 className="font-semibold text-gray-900">
            {i18n.t("redButtons.chooseByCategory")}
          </h3> */}
          
          {/* Styled Select Input */}
          <div className="relative flex-grow">
            <select
              value={filteredCategories || ""}
              onChange={handleCategoryChange}
              className="appearance-none w-full bg-[rgba(219,68,68,1)] text-white font-bold py-3 px-4 rounded-lg shadow-md cursor-pointer pr-10"
              style={{
                boxShadow: "0 2px 4px rgba(0, 0, 0, .2)",
                textTransform: "capitalize",
              }}
            >
              <option value="" disabled hidden className="bg-white text-gray-900">Pilih Kategori</option>
              {categories.map((category) => (
                <option 
                  key={category.id} 
                  value={category.id}
                  className="bg-white text-gray-900"
                >
                  {category.name}
                </option>
              ))}
            </select>
            <ArrowDropDownIcon 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" 
            />
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="relative mx-2 my-10 flex flex-row gap-2 md:gap-12 transition-transform duration-300 transform">
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {/* Show actual products */}
          {products.map((item) => (
            <Grid item key={item.id}>
              <FlashSaleItem
                item={item}
                stars={item.stars}
                rates={item.rates}
              />
            </Grid>
          ))}
          
          {/* Show skeleton loaders when loading products (category change) */}
          {loadingProducts &&
            Array.from({ length: PER_PAGE }).map((_, index) => (
              <Grid item key={`skeleton-${index}`}>
                <Loader />
              </Grid>
            ))}
          
          {/* Show skeleton loaders when loading more products */}
          {loadingMore &&
            Array.from({ length: PER_PAGE }).map((_, index) => (
              <Grid item key={`loader-more-${index}`}>
                <Loader />
              </Grid>
            ))}
        </Grid>
      </div>

      {page < lastPage && !loadingProducts && !loadingMore && (
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

      <div className="mt-6 flex justify-center gap-5 md:gap-20 items-center md:mx-12">
        <Link to="..">
          <WhiteButton name={i18n.t("whiteButtons.backToHomePage")} />
        </Link>
        <ViewAll name={i18n.t("redButtons.viewAllProducts")} />
      </div>
    </div>
  );
};

export default Category;