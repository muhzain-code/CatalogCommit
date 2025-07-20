import { useState, useEffect, useRef } from "react";
import { styled, alpha } from "@mui/material/styles";
// import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import i18n from "../common/components/LangConfig";
import { productService, transformProductData } from "../../Services/productService";
import { umkmService } from "../../Services/umkmService";
// import { CiSearch } from "react-icons/ci";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: alpha(theme.palette.grey[300], 0.3),
  "&:hover": {
    backgroundColor: alpha(theme.palette.grey[300], 0.6),
  },
  flex: 1,
  maxWidth: "400px",
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  alignItems: "center",
  "& .MuiAutocomplete-root": {
    flex: 1,
    "& .MuiInputBase-root": {
      borderRadius: "10",
      backgroundColor: "transparent",
      "& .MuiInputBase-input": {
        borderRadius: "10",
        fontSize: "0.9rem",
        [theme.breakpoints.down("sm")]: {
          fontSize: "0.8rem",
        },
      },
    },
  },
  "& .MuiIconButton-root": {
    "&:hover": {
      backgroundColor: "rgba(219, 68, 68, .9)",
      color: "white",
    },
  },
}));

const SearchAppBar = () => {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState({ umkms: [], products: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Handle klik di luar dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Pencarian saat query berubah
  useEffect(() => {
    if (searchText.trim() === '') {
      setResults({ umkms: [], products: [] });
      setShowDropdown(false);
      return;
    }

    setLoading(true);

    const fetchSearchResults = async () => {
      try {
        // Cari UMKM dan Produk secara paralel
        const [umkmResponse, productResponse] = await Promise.all([
          umkmService.getUMKMs(1, 5, searchText),
          productService.getProducts(1, 5, searchText)
        ]);

        setResults({
          umkms: umkmResponse.data || [],
          products: productResponse.data || []
        });
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults({ umkms: [], products: [] });
      } finally {
        setLoading(false);
      }
    };

    // Debounce pencarian
    const timer = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Render hasil pencarian
  const renderResults = () => {
    if (loading) {
      return <div className="p-4 text-center">Mencari...</div>;
    }

    const allEmpty =
      results.umkms.length === 0 &&
      results.products.length === 0;

    if (allEmpty) {
      return <div className="p-4 text-gray-500">Tidak ditemukan</div>;
    }

    return (
      <>
        {results.umkms.length > 0 && (
          <div className="mb-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">UMKM</div>
            {results.umkms.map(umkm => (
              <Link
                key={`umkm-${umkm.id}`}
                to={`/umkm/${umkm.id}`}
                className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer no-underline text-inherit"
                onClick={() => setShowDropdown(false)}
              >
                {/* <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" /> */}
                <div className="ml-3">
                  <div className="font-medium">{umkm.name}</div>
                  <div className="text-xs text-gray-500">{umkm.description}</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {results.products.length > 0 && (
          <div>
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">PRODUK</div>
            {results.products.map(product => {
              const transformed = transformProductData(product);
              return (
                <Link
                  key={`prod-${product.id}`}
                  to={`/allproducts/${product.id}`}
                  className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer no-underline text-inherit"
                  onClick={() => setShowDropdown(false)}
                >
                  {/* <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" /> */}
                  <div className="ml-3">
                    <div className="font-medium">{transformed.name}</div>
                    <div className="text-xs text-gray-500">{transformed.brand}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Search className="flex items-center justify-center w-48 min-[425px]:w-64 sm:max-[1200px]:w-96 min-[1200px]:w-60 min-[1450px]:w-96 ">
        <Autocomplete
          freeSolo
          disableClearable
          disableListWrap
          openOnFocus
          options={[]}
          value={searchText}
          onChange={(event, newValue) => setSearchText(newValue)}
          onInputChange={(event, newValue) => setSearchText(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={i18n.t("search")}
              InputProps={{
                ...params.InputProps,
                type: 'search',
              }}
            />
          )}
        />
        {/* <IconButton
          aria-label="search"
          color="inherit"
          component={Link}
          to={`/search?q=${encodeURIComponent(searchText.trim())}`}
        >
          <CiSearch className="w-5 h-auto md:w-8 md:h-8" />
        </IconButton> */}
      </Search>

      {showDropdown && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
          {renderResults()}
        </div>
      )}
    </div>
  );
};

export default SearchAppBar;